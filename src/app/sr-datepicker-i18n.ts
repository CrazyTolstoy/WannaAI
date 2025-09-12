import { Injectable } from '@angular/core';
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

// Week starts on Monday
const WEEKDAYS_SHORT = ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned'];
const MONTHS_SHORT = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'avg', 'sep', 'okt', 'nov', 'dec'];
const MONTHS_FULL  = ['januar','februar','mart','april','maj','jun','jul','avgust','septembar','oktobar','novembar','decembar'];

@Injectable()
export class SrDatepickerI18n extends NgbDatepickerI18n {
  // ng-bootstrap >= v16
  override getWeekdayLabel(weekday: number): string { return WEEKDAYS_SHORT[weekday - 1]; }
  // If you're on ng-bootstrap <= v15, use:
  // override getWeekdayShortName(weekday: number): string { return WEEKDAYS_SHORT[weekday - 1]; }

  override getMonthShortName(month: number): string { return MONTHS_SHORT[month - 1]; }
  override getMonthFullName(month: number): string { return MONTHS_FULL[month - 1]; }

  override getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}.${date.month}.${date.year}.`;
  }
}
