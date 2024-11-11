import { Component, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthorizationService } from '../../core/services/authorization.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

declare var google: any;
@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css',
})
export class AuthenticationComponent implements OnInit {
  errorMessage: string | null = null;
  loginForm: FormGroup;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private router: Router,
    private ngZone: NgZone,
    private authService: AuthorizationService,
    private formBuilder: FormBuilder
  ) {

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    console.log('Componente de autenticação iniciado.');

    if (isPlatformBrowser(this.platformId)) {
      console.log(
        'Autenticação iniciada no browser. Registrando escopo global...'
      );
      this.registerGoogleLoginCallback();
      this.initializeGoogleLogin();
    }
    console.log('Autenticação iniciada.');
  }

  registerGoogleLoginCallback(): void {
    window.loginGoogle = (response: any) => this.handleGoogleLogin(response);
    console.log('Função loginGoogle registrada no escopo global.');
  }

  initializeGoogleLogin() {
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.initialize({
        client_id:
          '189141512089-jq89njth6sr21ujno31c3eom0u0ejb8a.apps.googleusercontent.com',
        callback: this.handleGoogleLogin.bind(this),
      });

      google.accounts.id.renderButton(
        document.getElementById('google-login-button'),
        { theme: 'outline', size: 'large' }
      );
    }
  }

  handleGoogleLogin(response: any) {
    const idToken = response.credential;

    this.authService.login(idToken).subscribe({
      next: (data: any) => {
        this.authService.saveToken(data.token);

        const user = {
          id: data.id,
          email: data.email,
          name: data.name,
        };

        this.authService.saveUserInfo(user);
        this.ngZone.run(() => {
          this.router.navigate(['/list']);
        });
      },
      error: (err) => {
        console.error('Erro no login:', err);
        this.ngZone.run(() => {
          if (err.status === 422) {
            this.errorMessage =
              'Somente e-mails do domínio ifrs.edu.br são permitidos.';
          }else if (err.status === 400) {
            this.errorMessage =
              'Credenciais inválidas. Por favor, tente novamente.';
          }
           else {
            this.errorMessage =
              'Erro ao fazer login. Por favor, tente novamente mais tarde.';
          }
        });
      },
    });
  }

  loginWithCredentials(): void {
    if (this.loginForm.valid) {

      const { username, password } = this.loginForm.value;

      this.authService
        .loginWithCredentials(username, password)
        .subscribe({
          next: (data) => {
            this.authService.saveToken(data.token);

            const user = {
              id: data.id,
              email: data.email,
              name: data.name,
            };

            this.authService.saveUserInfo(user);
            this.ngZone.run(() => {
              this.router.navigate(['/list']);
            });
          },
          error: (err) => {
            console.error('Erro no login:', err);
            this.ngZone.run(() => {
              if (err.status === 400) {
                this.errorMessage =
                  'Senha ou usuario inválidos. Por favor, tente novamente.';
              } else {
                this.errorMessage =
                  'Erro ao fazer login. Por favor, tente novamente.';
              }
            });
          },
        });
    }
  }
}
