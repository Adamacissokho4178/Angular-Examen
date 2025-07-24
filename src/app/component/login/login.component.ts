import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
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

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.access_token);
          const role = res.user.role;
          if (role === 'admin') {
            this.router.navigate(['/dashboard-admin']);
          } else if (role === 'enseignant') {
            this.router.navigate(['/dashboard-enseignant']);
          } else if (role === 'eleve_parent') {
            this.router.navigate(['/dashboard-eleve-parent']);
          }
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Erreur lors de la connexion';
        }
      });
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
} 