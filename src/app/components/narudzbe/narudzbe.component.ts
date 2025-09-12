import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { Order } from '../../models/order';
import { OrdersService, BackendOrder } from '../../services/orders.service';
import { mapOrderFromBE } from '../../services/order.mapper';

@Component({
  selector: 'app-narudzbe',
  templateUrl: './narudzbe.component.html',
  styleUrls: ['./narudzbe.component.scss']
})
export class NarudzbeComponent implements OnInit, OnDestroy {
  filterForm: FormGroup;
  orders: Order[] = [];
  filtered: Order[] = [];
  loadingId: string | null = null;
  isLoading = true;

  // Status dropdown state
  statusOpen = false;

  // Available statuses
  statuses = [
    { value: 'novo',     label: 'Novo' },
    { value: 'u_toku',   label: 'U toku' },
    { value: 'zavrseno', label: 'Završeno' },
    { value: 'otkazano', label: 'Otkazano' },
  ];

  private subs = new Subscription();

  constructor(private fb: FormBuilder, private ordersApi: OrdersService) {
    this.filterForm = this.fb.group({
      search: [''],
      statuses: [[] as string[]],
      from: [null as NgbDateStruct | null],
      to:   [null as NgbDateStruct | null]
    });

    // Prefill date range to current month (first → last)
    const { from, to } = this.getDefaultMonthRange();
    this.filterForm.patchValue({ from, to }, { emitEvent: false });
  }

  ngOnInit(): void {
    this.loadOrders();
    this.subs.add(this.filterForm.valueChanges.subscribe(() => this.applyFilters()));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // ---------- Data loading ----------
private loadOrders(): void {
  this.isLoading = true;

  const s = this.ordersApi.getAll().pipe(
    finalize(() => { this.isLoading = false; })
  ).subscribe({
    next: (list: BackendOrder[]) => {
      this.orders = list.map(mapOrderFromBE);
      this.applyFilters();
    },
    error: (err: unknown) => {
      console.error('Greška pri učitavanju narudžbi', err);
      alert('Greška pri učitavanju narudžbi.');
    }
  });

  this.subs.add(s);
}

  // ---------- Status helpers ----------
  get selectedStatuses(): string[] {
    return this.filterForm.value.statuses ?? [];
  }

  isChecked(v: string): boolean {
    return this.selectedStatuses.includes(v);
  }

  toggleStatusValue(v: string, checked: boolean): void {
    const current = new Set(this.selectedStatuses);
    checked ? current.add(v) : current.delete(v);
    this.filterForm.patchValue({ statuses: Array.from(current) }, { emitEvent: true });
  }

  clearStatuses(): void {
    this.filterForm.patchValue({ statuses: [] }, { emitEvent: true });
  }

  toggleStatus(): void {
    this.statusOpen = !this.statusOpen;
  }

  @HostListener('document:click')
  onDocClick(): void {
    if (this.statusOpen) this.statusOpen = false;
  }

  onStatusKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape' && this.statusOpen) {
      e.preventDefault();
      this.statusOpen = false;
    }
    if ((e.key === 'Enter' || e.key === ' ') && !this.statusOpen) {
      e.preventDefault();
      this.toggleStatus();
    }
  }

  onStatusCheckboxChange(e: Event, value: string): void {
    const target = e.target as HTMLInputElement | null;
    const checked = !!target?.checked;
    this.toggleStatusValue(value, checked);
  }

  // ---------- Totals ----------
  total(order: Order): number {
    return order.items.reduce((s, i) => s + i.price * i.quantity, 0);
  }

  // ---------- Date helpers ----------
  private toStruct(d: Date): NgbDateStruct {
    return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
  }

  private getDefaultMonthRange(): { from: NgbDateStruct; to: NgbDateStruct } {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const last  = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { from: this.toStruct(first), to: this.toStruct(last) };
  }

  /** Convert NgbDateStruct|string to timestamp (local midnight). */
  private structToTime(s: NgbDateStruct | null | string): number {
    if (!s) return NaN;
    if (typeof s === 'string') {
      const t = new Date(s).getTime();
      return Number.isNaN(t) ? NaN : t;
    }
    const d = new Date(s.year, (s.month ?? 1) - 1, s.day ?? 1, 0, 0, 0, 0);
    return d.getTime();
  }

  // ---------- Filtering ----------
  applyFilters(): void {
    const { search, statuses, from, to } = this.filterForm.value as {
      search: string;
      statuses: string[];
      from: NgbDateStruct | null | string;
      to: NgbDateStruct | null | string;
    };

    const s = (search ?? '').toLowerCase();
    const fromTimeRaw = this.structToTime(from);
    const toTimeRaw   = this.structToTime(to);

    const fromTime = Number.isNaN(fromTimeRaw) ? -Infinity : fromTimeRaw;
    const toTime   = Number.isNaN(toTimeRaw) ? Infinity : (toTimeRaw + 24 * 60 * 60 * 1000 - 1); // include full "to" day
    const selected = Array.isArray(statuses) ? statuses : [];

    this.filtered = this.orders.filter(o => {
      const matchText =
        !s ||
        o.id.toLowerCase().includes(s) ||
        o.customerName.toLowerCase().includes(s) ||
        (o.addresses?.toLowerCase().includes(s) ?? false) || 
        o.items.some(i => i.name.toLowerCase().includes(s) || i.sku.toLowerCase().includes(s));

      const matchStatus = selected.length === 0 || selected.includes(o.status);

      const t = new Date(o.createdAt).getTime();
      const matchDate = t >= fromTime && t <= toTime;

      return matchText && matchStatus && matchDate;
    });
  }

  // ---------- WooCommerce push via BE ----------
  potvrdi(order: Order): void {
    if (order.sentToWoo) return;
    this.loadingId = order.id;

    const idNum = Number(order.id);
    if (Number.isNaN(idNum)) {
      alert('Nevalidan ID narudžbe.');
      this.loadingId = null;
      return;
    }

    const sub = this.ordersApi.sendToWoo(idNum).subscribe({
      next: (updated: BackendOrder) => {
        const mapped = mapOrderFromBE(updated);
        const idx = this.orders.findIndex(o => o.id === order.id);
        if (idx >= 0) this.orders[idx] = mapped;
        this.applyFilters();
        this.loadingId = null;
      },
      error: (err: unknown) => {
        console.error('WooCommerce error', err);
        alert('Greška pri slanju u WooCommerce. Detalji u konzoli.');
        this.loadingId = null;
      }
    });

    this.subs.add(sub);
  }
}
