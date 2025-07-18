import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/services/auth/auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  // isExpanded = false;
  isLoggedIn = false;
  username: string = '';
  userRole: string = '';
  isSmallScreen = false;
  @Input() isExpanded: boolean = false;
  constructor(
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
      const user = this.authService.getUserInfo();
      if (user) {
        this.username = user?.username || '';
        this.userRole = user?.role || '';
      }
    });

    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall])
      .subscribe(result => {
        this.isSmallScreen = result.matches;
      });
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }

  closeSidebar() {
    if (this.isSmallScreen) {
      this.isExpanded = false;
    }
  }

  logout() {
    this.authService.logout();
    location.reload(); // Optional: Refresh to update sidebar
  }
}
