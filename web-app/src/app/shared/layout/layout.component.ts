import {
  Component,
  ViewChild,
  Inject,
  HostListener,
  NgZone,
} from '@angular/core';
import {
  MatDrawer,
  MatDrawerMode,
  MatSidenavModule,
} from '@angular/material/sidenav';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthorizationService } from '../../core/services/authorization.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    RouterModule,
    MatToolbarModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  title = 'ColaboraIF';
  mode: MatDrawerMode = 'side';
  hasBackdrop = false;
  toolbarColor = '#e0f2e9';
  sidenavColor = '#f5f5f5';
  canGoBack = false;

  @ViewChild('drawer') drawer!: MatDrawer;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private authorizationService: AuthorizationService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.ngZone.run(() => { 
          this.adjustForMobile();
          this.updateNavigationState();
          if (this.mode === 'over') {
            this.drawer.close();
          }
        });
      }
    });
  }

  ngOnInit() {
    this.adjustForMobile();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.ngZone.run(() => {
      this.adjustForMobile();
    });
  }

  adjustForMobile() {
    if (isPlatformBrowser(this.platformId)) {
      if (window.innerWidth < 768) {
        this.mode = 'over';
        this.hasBackdrop = true;
      } else {
        this.mode = 'side';
        this.hasBackdrop = true;
      }
    }
  }

  goBack() {
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.run(() => {
        window.history.back();
      });
    }
  }

  getUserInfo() {
    const user = this.authorizationService.getUserInfo();
    
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    return user.name;
  }

  updateNavigationState() {
    if (isPlatformBrowser(this.platformId)) {
      this.canGoBack = this.router.url !== '/list';
    }
  }

  closeDrawer() {
    if (this.drawer.mode === 'over' || this.drawer.opened) {
      this.drawer.close();
    }
  }
}
