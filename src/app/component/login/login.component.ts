import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, AuthResponse } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: (response: AuthResponse) => {
          this.isLoading = false;
          if (response.success) {
            // Sauvegarder le token
            this.authService.setToken(response.token);
            // Sauvegarder l'utilisateur
            this.authService.setCurrentUser(response.user);
            
            this.successMessage = 'Connexion réussie !';
            
            // Rediriger selon le rôle
            const role = response.user.role;
            setTimeout(() => {
              if (role === 'admin') {
                this.router.navigate(['/dashboard-admin']);
              } else if (role === 'enseignant') {
                this.router.navigate(['/dashboard']);
              } else if (role === 'eleve' || role === 'parent') {
                this.router.navigate(['/dashboard-eleve-parent']);
              }
            }, 1000);
          } else {
            this.errorMessage = response.message || 'Erreur lors de la connexion';
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Erreur de connexion:', error);
          this.errorMessage = error.error?.message || 'Erreur lors de la connexion. Vérifiez vos identifiants.';
        }
      });
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
} 