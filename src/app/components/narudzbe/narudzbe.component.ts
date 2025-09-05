import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { WooCommerceService } from '../../services/woocommerce.service';
import { mapLocalOrderToWoo } from '../../services/woocommerce.mapper';
import { Order } from '../../models/order';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

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

  constructor(private fb: FormBuilder, private woo: WooCommerceService) {
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
    // Mock data – replace with real data source
    this.orders = [
      {
        id: 'N-1001',
        customerName: 'Petar Petrović',
        customerEmail: 'petar@example.com',
        customerPhone: '+38760000000',
        createdAt: new Date().toISOString(),
        status: 'novo',
        items: [
          { sku: 'SKU-123', name: 'Majica', quantity: 2, price: 19.9 },
          { sku: 'SKU-777', name: 'Kačket', quantity: 1, price: 12.5 }
        ],
        note: 'Isporuka posle 17h',
        sentToWoo: false
      },
      {
        id: 'N-1002',
        customerName: 'Jelena Janković',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        status: 'u_toku',
        items: [{ sku: 'SKU-999', name: 'Duks', quantity: 1, price: 35 }],
        sentToWoo: true
      },
      {
        id: 'N-1003',
        customerName: 'Marko Marković',
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        status: 'zavrseno',
        items: [{ sku: 'SKU-222', name: 'Jakna', quantity: 1, price: 89.9 }],
        sentToWoo: false
      }
    ];

    this.applyFilters();
    this.subs.add(this.filterForm.valueChanges.subscribe(() => this.applyFilters()));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
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
  onDocClick() {
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
      return isNaN(t) ? NaN : t;
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

    const fromTime = isNaN(fromTimeRaw) ? -Infinity : fromTimeRaw;
    const toTime   = isNaN(toTimeRaw) ? Infinity : (toTimeRaw + 24 * 60 * 60 * 1000 - 1); // include full "to" day
    const selected = Array.isArray(statuses) ? statuses : [];

    this.filtered = this.orders.filter(o => {
      const matchText =
        !s ||
        o.id.toLowerCase().includes(s) ||
        o.customerName.toLowerCase().includes(s) ||
        o.items.some(i => i.name.toLowerCase().includes(s) || i.sku.toLowerCase().includes(s));

      const matchStatus = selected.length === 0 || selected.includes(o.status);

      const t = new Date(o.createdAt).getTime();
      const matchDate = t >= fromTime && t <= toTime;

      return matchText && matchStatus && matchDate;
    });
  }

  // ---------- WooCommerce push ----------
  potvrdi(order: Order): void {
    if (order.sentToWoo) return;
    this.loadingId = order.id;

    const payload = mapLocalOrderToWoo(order);
    this.subs.add(
      this.woo.createOrder(payload).subscribe({
        next: _ => {
          order.sentToWoo = true;
          this.loadingId = null;
        },
        error: err => {
          console.error('WooCommerce error', err);
          alert('Greška pri slanju u WooCommerce. Detalji u konzoli.');
          this.loadingId = null;
        }
      })
    );
  }
}
