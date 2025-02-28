import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',               // Tên thẻ HTML của component.
  standalone: true,                    // Đánh dấu đây là component độc lập (Standalone Component).
  templateUrl: './login.component.html', // Liên kết file giao diện HTML.
  styleUrls: ['./login.component.css'],  // Liên kết file CSS cho component.
  imports: [ReactiveFormsModule, CommonModule] // Import các module cần thiết.
})
export class LoginComponent {
  loginForm: FormGroup; // Biến lưu form đăng nhập.
  errorMessage: string = ''; // Biến lưu thông báo lỗi.

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required], // Trường username (Bắt buộc nhập)
      password: ['', Validators.required]  // Trường password (Bắt buộc nhập)
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Vui lòng nhập đầy đủ thông tin!';
      return;
    }
  
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);  // Lưu token vào LocalStorage.
        localStorage.setItem('role', response.role); // Lưu vai trò user.
        this.router.navigate(['/dashboard']);        // Chuyển hướng đến trang Dashboard.
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
