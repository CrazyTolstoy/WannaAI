import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';

import { BrowserAnimationsModule } from "@angular/platform-browser/animations"; 
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarComponent } from './elementi/sidebar/sidebar.component';
import { ButtonModule } from "primeng/button"; 
import { SidebarModule } from "primeng/sidebar"; 
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HighchartsChartModule } from 'highcharts-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { YesnoComponent } from './elementi/yesno/yesno.component';
import { CustomDateParserFormatter } from './CustomDateParserFormatter';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { UnosComponent } from './components/unos/unos.component';
import { NarudzbeComponent } from './components/narudzbe/narudzbe.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    YesnoComponent,
    DashboardComponent,
    LoginComponent,
    UnosComponent,
    NarudzbeComponent
  ],
  providers: [{ provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    NgbModule,
    FormsModule,
    DropdownModule,
    HttpClientModule,
    HighchartsChartModule,
    BrowserAnimationsModule,
    ButtonModule,
    SidebarModule,
    AppRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatExpansionModule,
    MatButtonModule
  ]
})
export class AppModule { }
