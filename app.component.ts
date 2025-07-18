import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth/auth.service';
import { SidebarService } from '../services/sidebar/sidebar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Southern Sourcing Supply';
  isLoggedIn: boolean = false;
  username: string = '';
  imageWidth: number = 50;
  isSmallScreen: boolean = false;
  isExpanded: boolean = true; // Removed @Input()

  isClicked = false;
  buttonSize = 70;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService,
    private sidebarService: SidebarService
  ) {
    this.checkScreenSize();
  }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;

      if (this.isLoggedIn) {
        const userCookie = this.cookieService.get('user');
        if (userCookie) {
          const user = JSON.parse(userCookie);
          this.username = user.username;
        }
      }
    });
    this.onResize();
  }

  toggleSidebar() {
    this.isClicked = !this.isClicked;
    this.buttonSize = this.isClicked ? 50 : 70;
    this.sidebarService.toggleSidebar();
    this.isExpanded = !this.isExpanded;
  }

  closeSidebarOnSmallScreen() {
    if (this.isSmallScreen) {
      this.isExpanded = false;
    }
  }

  logout() {
    this.authService.logout();
    this.cookieService.delete('user', '/');
    this.router.navigate(['/login']);
  }

  @HostListener('window:resize', ['$event'])
  checkScreenSize(): void {
    this.isSmallScreen = window.innerWidth <= 768;
    if (this.isSmallScreen) {
      this.isExpanded = false;
    }
  }

  onResize(event?: Event) {
    this.isSmallScreen = window.innerWidth <= 578;
    if (this.isSmallScreen && this.isExpanded) {
      this.isExpanded = false;
    }
  }
}
