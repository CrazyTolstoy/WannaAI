import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidebarComponent } from './elementi/sidebar/sidebar.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './components/login/login.component';


const routes: Routes = [

  {path: '', component: LoginComponent},
  { path: 'home', component: SidebarComponent ,canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }