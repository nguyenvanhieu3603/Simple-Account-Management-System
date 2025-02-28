import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required], // Username bắt buộc.
      password: ['', [Validators.required, Validators.minLength(6)]], // Mật khẩu yêu cầu tối thiểu 6 ký tự.
      role: ['user'] // Mặc định tất cả người dùng đăng ký sẽ là "user".
    });
  }

  register() {
    if (this.registerForm.valid) { // Kiểm tra form có hợp lệ không.
      this.authService.register(this.registerForm.value).subscribe({
        next: (res) => {
          alert('Đăng ký thành công!');
          this.router.navigate(['/login']); // Chuyển hướng về trang login.
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Lỗi khi đăng ký!';
        }
      });
    }
  }
}
