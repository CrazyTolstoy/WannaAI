import { Component, ElementRef, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { DynamicLoaderService } from '../../dynamic-loader-service.service';
import { DashboardComponent } from '../../components/dashboard/dashboard.component';
import { AuthService } from '../../services/auth.service';
import { UnosComponent } from '../../components/unos/unos.component';
import { NarudzbeComponent } from '../../components/narudzbe/narudzbe.component';
import { ReklamacijeComponent } from '../../components/reklamacije/reklamacije.component';

@Component({
 selector: 'app-sidebar',
 templateUrl: './sidebar.component.html',
 styleUrls: ['./sidebar.component.scss'],
 animations: [
  trigger('sidebarAnimation', [
   state('open', style({
    transform: 'translateX(-100%)',
   })),
   state('closed', style({
    transform: 'translateX(0)',
   })),
   transition('open <=> closed', animate('0.3s ease-in-out')),
  ]),
 ],
})
export class SidebarComponent implements OnInit {

  // Property to track the currently active item
  activeItem: string = 'pocetna';

 constructor(private dynamicLoaderService: DynamicLoaderService, 
       private el: ElementRef,
       private authService: AuthService) {}

 ngOnInit() {
  this.loadDashboard()
 }

  // New method to set the active item
  setActive(item: string): void {
    this.activeItem = item;
  }

 loadDashboard() {
    this.setActive('pocetna'); // Set 'pocetna' as active when dashboard is loaded
    const container = this.el.nativeElement.querySelector('#main');
  this.dynamicLoaderService.loadComponent(DashboardComponent, container);
    this.toggleSidebar(); // Close the sidebar after loading the component
 }

 loadUnos(){
    this.setActive('unos'); // Set 'unos' as active when this method is called
    const container = this.el.nativeElement.querySelector('#main');
    this.dynamicLoaderService.loadComponent(UnosComponent, container);
    this.toggleSidebar(); // Close the sidebar after loading the component
 }

 
 loadNarudzba(){
    this.setActive('narudzbe'); // Set 'unos' as active when this method is called
    const container = this.el.nativeElement.querySelector('#main');
    this.dynamicLoaderService.loadComponent(NarudzbeComponent, container);
    this.toggleSidebar(); // Close the sidebar after loading the component
 }

 
 loadReklamacije(){
    this.setActive('reklamacije'); // Set 'unos' as active when this method is called
    const container = this.el.nativeElement.querySelector('#main');
    this.dynamicLoaderService.loadComponent(ReklamacijeComponent, container);
    this.toggleSidebar(); // Close the sidebar after loading the component
 }

 logout(): void {
    this.setActive('odjava'); // Set 'odjava' as active on click
  this.authService.logout(); // remove token + redirect to /login
 }


 isSidebarOpen: boolean = true;

 toggleSidebar(): void {
  this.isSidebarOpen = !this.isSidebarOpen;
 }
}