import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Vui lòng nhập đầy đủ thông tin!';
      return;
    }
  
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        localStorage.setItem('role', response.role);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        if (err.error.message === 'Tài khoản không tồn tại') {
          this.errorMessage = 'Tài khoản không tồn tại. Vui lòng kiểm tra lại!';
        } else if (err.error.message === 'Mật khẩu không đúng') {
          this.errorMessage = 'Mật khẩu không đúng. Vui lòng nhập lại!';
        } else {
          this.errorMessage = 'Đăng nhập thất bại!';
        }
      }
    });
  }
  
}
