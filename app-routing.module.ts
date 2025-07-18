import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoinzeeComponent } from 'src/coinzee/coinzee.component';
import { DashboardComponent } from 'src/dashboard/dashboard.component';
import { LoginComponent } from 'src/login/login.component';
import { OrderComponent } from 'src/order/order.component';
import { ProductComponent } from 'src/product/product.component';
import { SidebarComponent } from 'src/sidebar/sidebar.component';
import { SignupComponent } from 'src/signup/signup.component';
import { ContactComponent } from '../contact/contact.component';
import { SupportComponent } from '../support/support.component';
import { ServicesComponent } from '../ourservices/services.component';
import { UsersComponent } from '../users/users.component';
import { AboutusComponent } from '../aboutus/aboutus.component';
import { AnalyticsComponent } from '../analytics/analytics.component';
import { EnquiryComponent } from 'src/enquiry/enquiry.component';

const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, children: [
    { path: '', component: AnalyticsComponent, pathMatch: 'full' },
    { path: 'users', component: UsersComponent },
    { path: 'enquiry', component: EnquiryComponent },
    { path: 'product', component: ProductComponent }
  ]},

  // Main pages
  { path: 'aboutus', component: AboutusComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'support', component: SupportComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'coinzee', component: CoinzeeComponent },
  
  { path: '', redirectTo: '/aboutus', pathMatch: 'full' }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
