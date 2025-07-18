import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword: boolean = false; 
  private destroy$ = new Subject<void>();
  private AES_SECRET_KEY = "ThisIsA32ByteLongSecretKey1234!!"; // Same key as used in Python

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
  async onLogin() {
    if (this.loginForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter a valid email and password (min 6 characters)',
      });
      return;
    }
  
    // const loginData = this.loginForm.value;

    const loginData = {
      email: await this.authService.encryptText(this.loginForm.value.email),
      password: await this.authService.encryptText(this.loginForm.value.password),
    };
    console.log(loginData.email);
        console.log(loginData.password);
    this.authService.login(loginData.email, loginData.password).subscribe(
      (response: any) => {
        console.log('Login Response:', response);
        const user = response.user;
        this.cookieService.set('user', JSON.stringify(user), { expires: 7, path: '/' });
  
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'Redirecting...',
          timer: 2000,
          showConfirmButton: false
        });
  
        if (user.role === 'SuperAdmin') {
          this.router.navigate(['/dashboard/users']);
        } else {
          this.router.navigate(['/dashboard/product']);
        }
      },
      (error) => {
        console.log("login data console: ",loginData);
        let errorMessage = 'Login failed. Please try again.';
        if (error.error?.error) {
          errorMessage = error.error.error;
        }
  
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: errorMessage,
        }).then(() => {
          this.router.navigate(['/aboutus']);
        });
      }
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
