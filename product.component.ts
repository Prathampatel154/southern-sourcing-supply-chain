import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProductsService } from 'src/services/products/products.service';
import { AuthService } from 'src/services/auth/auth.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  isHovered: boolean = false;
  isInputFocused: boolean = false;
  searchText: string = '';
  product = {
    details: {
      name: '',
      description: '',
      price: null,
      category: '',
      manufacturer: '',
    },
    addedOn: new Date().toISOString(),
    addedBy: 'pranali@g.com',
    images: [] as string[],
  };

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  submitted: boolean = false;
  errorMessage: string = '';
  showForm: boolean = false;
  displayedColumns: string[] = ['image', 'name', 'price', 'category', 'manufacturer', 'addedBy', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  filterValues: any = {};
  userRole: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private productService: ProductsService,private cookieService: CookieService) {}

  ngOnInit() {
    const userData = this.cookieService.get('user'); // Get the user data from cookie
      if (userData) {
        const user = JSON.parse(userData);
        this.userRole = user.role;
        console.log('User Role:', this.userRole);
    }
    if (this.userRole !== 'SuperAdmin') {
      this.displayedColumns = this.displayedColumns.filter(column => column !== 'actions');
      this.fetchApprovedProducts();
      this.fetchPendingProducts();
    }
    else{
      this.fetchApprovedProducts();
    }
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return (
        data.details.name.toLowerCase().includes(filter) ||
        data.details.price.toString().includes(filter) ||
        data.details.category.toLowerCase().includes(filter) ||
        data.details.manufacturer.toLowerCase().includes(filter) ||
        data.addedBy.toLowerCase().includes(filter)
      );
    };
  }

  fetchApprovedProducts() {
    this.productService.getApprovedProducts().subscribe(
      (data) => {
        console.log('Approved Products:', data);
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        console.error('Error fetching approved products:', error);
        if (error === 400) {
          console.warn("Already approved");
        }
        if (error === 404) {
          console.warn("No approved products found (404).");
        } else {
          console.error("Unexpected error fetching approved products:", error);
        }
      }
    );
  }

  // fetchProductsByRole() {
  //   const userRole = this.authService.getUserRole(); // Assuming you have a method to get the role
  //   let fetchObservable;
  
  //   if (userRole === 'SuperAdmin') {
  //     fetchObservable = this.productService.getSuperAdminProductList(); // Fetch products for SuperAdmin
  //   } else if (userRole === 'Distributor') {
  //     fetchObservable = this.productService.getDistributorProductList(); // Fetch products for Distributor
  //   } else if (userRole === 'Vendor') {
  //     fetchObservable = this.productService.getVendorProductList(); // Fetch products for Vendor
  //   } else {
  //     // Handle unknown role, if necessary
  //     console.error("Unknown role");
  //     return;
  //   }
  
  //   fetchObservable.pipe(
  //     catchError((error) => {
  //       if (error.status === 404) {
  //         console.warn("No products found.");
  //       } else {
  //         console.error("Error fetching products:", error);
  //       }
  //       return of([]);
  //     })
  //   ).subscribe((data) => {
  //     this.dataSource.data = data;
  //     this.dataSource.paginator = this.paginator;
  //   });
  // }  

  fetchPendingProducts() {
    this.productService.getPendingProducts().pipe(
      catchError((error) => {
        if (error.status === 404) {
          console.warn("No pending products found (404).");
        } else {
          console.error("Error fetching pending products:", error);
        }
        return of([]);
      })
    ).subscribe((data) => {
      this.dataSource.data = data;
      console.log("Pending Products:", data);
      this.dataSource.paginator = this.paginator;
    });
  }

  approveProduct(entityKey: string) {
    this.productService.approveProduct(entityKey).subscribe(
      (response) => {
        console.log('Product approval response:', response);
        Swal.fire({
          icon: 'success',
          title: 'Product approved successfully!',
          text: 'The product has been approved.',
          timer: 2000,
          showConfirmButton: false,
        });
      },
      (error) => {
        console.error('Error approving product:', error);
        if (error.status === 400 && error.error?.error === 'This product is already approved') {
          Swal.fire({
            icon: 'error',
            title: 'Product already approved',
            text: error.error.error,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Approval failed',
            text: 'An error occurred while approving the product.',
          });
        }
      }
    );
  }  

  declineProduct(entityKey: string) {
    this.productService.declineProduct(entityKey).subscribe(() => {
      this.fetchPendingProducts();
    });
  }

  createFilter() {
    return (data: any, filter: string): boolean => {
      const searchTerms = JSON.parse(filter);
      return Object.keys(searchTerms).every(key => {
        return data.details[key] && data.details[key].toString().toLowerCase().includes(searchTerms[key]);
      });
    };
  }

  submitProduct(form: any) {
    this.submitted = true;

    this.errorMessage = '';

    if (form.invalid || !this.selectedFile) {
      // Set error message to display on the form
      this.errorMessage = 'Please fill all the information and upload an image';
      return;
    }

    const formData = new FormData();

    // Append product details
    formData.append('details', JSON.stringify(this.product.details));
    formData.append('addedOn', this.product.addedOn);
    formData.append('addedBy', this.product.addedBy);

    // Append images correctly (assuming multiple files are possible)
    if (this.selectedFile) {
      console.log('Selected file:', this.selectedFile);
      formData.append('images', this.selectedFile, this.selectedFile.name);
    }

    // Log FormData for debugging
    for (let [key, value] of (formData as any).entries()) {
      console.log(key, value);
    }

    // Submit the product
    this.productService.createProduct(formData).subscribe((response) => {
      alert('Product is created');
      console.log('Product submitted', response);
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Push the file name into the images array (if backend expects names)
      this.product.images.push(file.name); // Or push the whole file if needed

      // Generate a preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);

      console.log('Images array:', this.product.images);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  onMouseEnter() {
    try {
      this.isHovered = true;
    }
    catch (ex) {
      console.log('Exception in onMouseEnter', ex);
    }
  }

  onMouseLeave() {
    try {
      this.isHovered = false;
    }
    catch (ex) {
      console.log('Exception in onMouseLeave', ex);
    }
  }

  onInputFocus() {
    try {
      this.isInputFocused = true;
    }
    catch (ex) {
      console.log('Exception in onInputFocus', ex);
    }
  }

  onInputBlur() {
    try {
      this.isInputFocused = false;
    }
    catch (ex) {
      console.log('Exception in onInputBlur', ex);
    }
  }

}