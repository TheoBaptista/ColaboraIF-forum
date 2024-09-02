import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDrawer, MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, HostListener, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
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
    MatToolbarModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'ColaboraIF';
  showDrawer = true;
  mode: MatDrawerMode = 'side';
  hasBackdrop = false;
  toolbarColor = '#e0f2e9';
  sidenavColor = '#f5f5f5';
  canGoBack = false;

  @ViewChild('drawer') drawer!: MatDrawer;
  
  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showDrawer = this.router.url !== '/login';
        this.adjustForMobile();
        this.updateNavigationState();

        if (this.mode === 'over') {
          this.drawer.close();
        }
      }
    });
  }

  ngOnInit() {
    this.adjustForMobile();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.adjustForMobile();
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
      window.history.back(); 
  }
}

  updateNavigationState() {
    if (isPlatformBrowser(this.platformId)) {
      this.canGoBack = this.router.url !== '/list';
      console.log('canGoBack:', this.canGoBack);
  }
}

closeDrawer() {
  if (this.drawer.mode === 'over' || this.drawer.opened) {
    this.drawer.close();
  }
}
}
