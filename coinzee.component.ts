import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { CoinzeeService } from 'src/services/coinzee/coinzee.service';
 
declare var bootstrap: any;

@Component({
  selector: 'app-coinzee',
  templateUrl: './coinzee.component.html',
  styleUrls: ['./coinzee.component.scss']
})
export class CoinzeeComponent {
  videos = [
    { title: 'Video 1', thumbnail: '/assets/images/video.mp4' },
    { title: 'Video 2', thumbnail: '/assets/images/video1.mp4' },
    { title: 'Video 3', thumbnail: '/assets/images/video2.mp4' },
    { title: 'Video 2', thumbnail: '/assets/images/video1.mp4' },
    { title: 'Video 3', thumbnail: '/assets/images/video2.mp4' },
    { title: 'Video 2', thumbnail: '/assets/images/video1.mp4' },
    { title: 'Video 3', thumbnail: '/assets/images/video2.mp4' }
  ];
 
  products = [
    { title: 'Product 1', image: '/assets/images/product1.png' },
    { title: 'Product 2', image: '/assets/images/product2.png' },
    { title: 'Product 3', image: '/assets/images/product3.png' },
    { title: 'Product 1', image: '/assets/images/product1.png' },
    { title: 'Product 2', image: '/assets/images/product2.png' },
    { title: 'Product 3', image: '/assets/images/product3.png' },
    { title: 'Product 2', image: '/assets/images/product2.png' },
    { title: 'Product 3', image: '/assets/images/product3.png' }

  ];

  uploadedImage: string | null = null;
  overlayLogo: string = '/assets/images/coinzee.png'; 
  showOverlay: boolean = false;
  overlayPosition = { x: 0, y: 0 };
  is3DImageAdded = false;
  fileInput: any;
  enquiryForm: FormGroup;
  selectedFile: File | null = null;

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private http: HttpClient, private coinzeeService: CoinzeeService) {
    this.enquiryForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contact: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      first_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      last_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      country: ['', Validators.required],
      address: ['', [Validators.required, Validators.minLength(10)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    try {
        this.coinzeeService.listEnquiries().subscribe((data) => {
          console.log('Enquiries:', data);
        });

    } catch (ex) {
      console.log("Error in ngOnInit : " + ex);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
  
      // Validate file type (optional)
      const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedFileTypes.includes(file.type)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File!',
          text: 'Please upload a valid image file (JPG, JPEG, PNG).',
          confirmButtonColor: '#d33',
        });
        return;
      }
  
      // Validate file size (optional, max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'File Too Large!',
          text: 'Please upload an image smaller than 2MB.',
          confirmButtonColor: '#d33',
        });
        return;
      }
  
      this.selectedFile = file;
  
      // Generate a preview
      const reader = new FileReader();
      reader.onload = () => {
        this.uploadedImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  addOverlay() {
    this.is3DImageAdded = true;
    this.showOverlay = true;
  }

  // Remove Image and 3D effect
  resetPreview() {
    this.uploadedImage = null;
    this.showOverlay = false;
    this.is3DImageAdded = false;
  }

  // Handle 3D effect (only if enabled)
  onMouseMove(event: MouseEvent) {
    if (!this.is3DImageAdded) return;
    const imageContainer = event.currentTarget as HTMLElement;
    const rect = imageContainer.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    imageContainer.style.transform = `rotateY(${x * 30}deg) rotateX(${y * -30}deg)`;
  }

  reset3D() {
    if (!this.is3DImageAdded) return;

    const imageContainer = document.querySelector('.image-container') as HTMLElement;
    if (imageContainer) {
      imageContainer.style.transform = 'rotateY(0deg) rotateX(0deg)';
    }
  }

  submitEnquiry() {
    if (this.enquiryForm.invalid) {
      this.enquiryForm.markAllAsTouched(); // Mark all fields as touched to show validation errors
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Form!',
        text: 'Please fill all required fields correctly.',
        confirmButtonColor: '#f8c471',
      });
      return;
    }
  
    const formData = new FormData();
  
    Object.entries(this.enquiryForm.value).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });
  
    if (this.selectedFile) {
      // Validate file type (e.g., only images) and size (e.g., max 2MB)
      const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedFileTypes.includes(this.selectedFile.type)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File!',
          text: 'Please upload a valid image file (JPG, JPEG, PNG).',
          confirmButtonColor: '#d33',
        });
        return;
      }
      
      if (this.selectedFile.size > 2 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'File Too Large!',
          text: 'Please upload an image smaller than 2MB.',
          confirmButtonColor: '#d33',
        });
        return;
      }
  
      formData.append('image', this.selectedFile);
    }
  
    this.coinzeeService.sendEnquiry(formData).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Enquiry Submitted!',
          text: 'Your enquiry has been submitted successfully.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.closeModal();
        });
        this.enquiryForm.reset();
        this.selectedFile = null;
        this.uploadedImage = null;
        const fileInput = document.querySelector('.file-upload') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      },
      error: (error) => {
        console.error('Error submitting enquiry:', error);
  
        let errorMessage = 'Failed to submit enquiry. Please try again later.';
        if (error?.error?.errors?.email) {
          errorMessage = error.error.errors.email[0];
        }
        Swal.fire({
          icon: 'error',
          title: 'Submission Failed!',
          text: errorMessage,
          confirmButtonColor: '#d33',
        }).then(() => {
          this.closeModal();
          this.enquiryForm.reset();
          this.selectedFile = null;
          this.uploadedImage = null;
          const fileInput = document.querySelector('.file-upload') as HTMLInputElement;
          if (fileInput) {
            fileInput.value = '';
          }
        });
        this.closeModal();
        this.enquiryForm.reset();
        this.selectedFile = null;
        this.uploadedImage = null;
        const fileInput = document.querySelector('.file-upload') as HTMLInputElement;
          if (fileInput) {
            fileInput.value = '';
          }
        }
    });
  }  
  
  private closeModal() {
    const modalElement = document.getElementById('enquiryModal');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide();
    }
  }

  resetFileInput() {
    const fileInput = document.querySelector('.file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
