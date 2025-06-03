// src/app/pages/login/login.component.ts
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    console.log('Натиснуто Увійти', this.loginForm.value, this.loginForm.valid);

    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.auth.login(email, password).subscribe({
        next: (res) => {
          console.log('Відповідь від сервера:', res);
          const token = res.token;

          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const role = payload.role?.trim();
            const userId = payload.userId;
            localStorage.setItem('user_id', userId.toString());

            console.log('Роль з токена:', role);

            if (
              role === 'GlobalAdmin' ||
              role === 'BusinessLogicAdmin' ||
              role === 'ServiceAdmin' ||
              role === 'InfrastructureAdmin'
            ) {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/refrigerators']);
            }
          } catch (e) {
            console.error('Помилка декодування токена:', e);
            this.router.navigate(['/refrigerators']);
          }
        },
        error: err => alert('Помилка входу: ' + (err.error?.message || 'Невірні дані'))
      });
    }
  }

  goTo(){
    this.router.navigate(['/register']);
  }
}
