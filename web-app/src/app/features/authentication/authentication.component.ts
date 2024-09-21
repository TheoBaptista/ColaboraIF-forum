import { Component, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css',
})
export class AuthenticationComponent implements OnInit {
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private router: Router, 
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      (window as any)['loginGoogle'] = this.handleGoogleLogin.bind(this);
      console.log('Função loginGoogle registrada.');
    }
  }

  handleGoogleLogin(response: any) {
    console.log(response);
    console.log('Login bem-sucedido, token:', response.credential);
    this.ngZone.run(() => {
      this.router.navigate(['/list']);
    });
  }
}
