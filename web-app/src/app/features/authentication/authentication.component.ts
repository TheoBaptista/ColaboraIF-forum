import { Component, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthorizationService } from '../../core/services/authorization.service';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css',
})
export class AuthenticationComponent implements OnInit {
  errorMessage: string | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private router: Router, 
    private ngZone: NgZone,
    private authService: AuthorizationService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      (window as any)['loginGoogle'] = this.handleGoogleLogin.bind(this);
      console.log('Função loginGoogle registrada.');
    }
  }

  handleGoogleLogin(response: any) {
    const idToken = response.credential;

    this.authService.login(idToken).subscribe({
      next: (data: any) => {
        this.authService.saveToken(data.token);
        this.authService.saveUserInfo(data.user);
        this.ngZone.run(() => {
          this.router.navigate(['/list']);
        });
      },
      error: (err) => {
        console.error('Erro no login:', err);
        
        this.ngZone.run(() => {
          if (err.status === 403) {
            this.errorMessage = 'Somente e-mails do domínio @ifrs.edu.br são permitidos.';
          } else {
            this.errorMessage = 'Erro ao fazer login. Por favor, tente novamente.';
          }
        });
      },
    });
  }
}
