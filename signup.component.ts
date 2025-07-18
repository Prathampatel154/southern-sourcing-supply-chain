import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from 'src/services/auth/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  signupForm: FormGroup;
  showPassword: boolean = false;
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;

  private destroy$ = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    this.signupForm = this.fb.group({
      role: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
      confirmPassword: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],      
      agreeTerms: [false, Validators.requiredTrue],
      isActive: [false],
      isApproved: [false],
    });
  }

  ngOnInit(): void {
    try {} catch (ex) {
      console.log("Error in ngOnInit : " + ex);
    }
  }

  async onSubmit() {
    if (this.signupForm.valid) {
      console.log(this.signupForm.value);
      this.signupForm.value.email = this.signupForm.value.email.toLowerCase();
      this.signupForm.value.email = await this.authService.encryptText(this.signupForm.value.email);
      this.signupForm.value.username = this.signupForm.value.username;
      this.signupForm.value.password = await this.authService.encryptText( this.signupForm.value.password);
      this.signupForm.value.confirmPassword = await this.authService.encryptText( this.signupForm.value.confirmPassword);
      const formData = { ...this.signupForm.value };

      if (formData.password !== formData.confirmPassword) {
        Swal.fire({
          icon: 'error',
          title: 'Password Mismatch',
          text: 'Passwords do not match!',
        });
        return;
      }

      delete formData.confirmPassword;
      if (formData.role === 'SuperAdmin') {
        formData.isActive = true;
        formData.isApproved = true;
      }
      this.authService.signup(formData).pipe(takeUntil(this.destroy$)).subscribe(
        (response: any) => {
          console.log('Response:', response);
          Swal.fire({
            icon: 'success',
            title: 'Signup Successful!',
            html: `<br>Your account has been created successfully.<br> You can login once you are approved.<br><br><b>Thank you!</b>`,
            showConfirmButton: true,
          }).then(() => {
            this.router.navigate(['/aboutus']);
          });
        },
        (error: any) => {
          console.error('Signup Error:', error);
          let errorMessage = 'Signup failed! Please try again.';
          if (error.error?.error) {
            errorMessage = error.error.error;
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (
            error.status === 400 &&
            typeof error.error === 'object'
          ) {
            errorMessage = Object.values(error.error).join(' ');
          }
          Swal.fire({
            icon: 'error',
            title: 'Signup Failed',
            text: errorMessage,
          });
        }
      );
    }
  }

  restrictInput(event: KeyboardEvent, field: string) {
    const alphabetRegex = /^[a-zA-Z]*$/;
    const numberRegex = /^[0-9]*$/;

    if (field === 'firstName' || field === 'lastName') {
      if (!alphabetRegex.test(event.key)) {
        event.preventDefault();
      }
    } else if (field === 'phone' || field === 'password') {
      if (!numberRegex.test(event.key)) {
        event.preventDefault();
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
