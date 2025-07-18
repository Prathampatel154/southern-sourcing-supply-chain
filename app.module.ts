import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { ToastrModule } from 'ngx-toastr'; 
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { HeaderComponent } from 'src/header/header.component';
import { FooterComponent } from 'src/footer/footer.component';
import { SidebarComponent } from 'src/sidebar/sidebar.component';
import { LoginComponent } from 'src/login/login.component';
import { SignupComponent } from 'src/signup/signup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from 'src/dashboard/dashboard.component';
import { ContactComponent } from '../contact/contact.component';
import { SupportComponent } from '../support/support.component';
import { ServicesComponent } from '../ourservices/services.component';
import { ProductComponent } from 'src/product/product.component';
import { UsersComponent } from '../users/users.component';
import { AboutusComponent } from '../aboutus/aboutus.component';
import { AnalyticsComponent } from '../analytics/analytics.component';
import { CommonModule } from '@angular/common';
import { CoinzeeComponent } from 'src/coinzee/coinzee.component';
import { EnquiryComponent } from 'src/enquiry/enquiry.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    ContactComponent,
    SupportComponent,
    ServicesComponent,
    ProductComponent,
    UsersComponent,
    AboutusComponent,
    AnalyticsComponent,
    CoinzeeComponent,
    EnquiryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    HttpClientModule,
    ReactiveFormsModule ,
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
