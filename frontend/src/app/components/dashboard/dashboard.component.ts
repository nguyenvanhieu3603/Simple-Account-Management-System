import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule], 
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  users: any[] = [];
  editForm: FormGroup;
  selectedUser: any = null; // 

  private userService = inject(UserService);
  private fb = inject(FormBuilder);

  constructor() {
    this.editForm = this.fb.group({
      username: ['', Validators.required],
      role: ['', Validators.required]
    });

    this.loadUsers();
  }

  // Load danh sách tài khoản
  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data: any) => { this.users = data; },
      error: (err: any) => { console.error('Error:', err); }
    });
  }

  // Chọn user để chỉnh sửa
  editUser(user: any) {
    this.selectedUser = user;
    this.editForm.setValue({
      username: user.username,
      role: user.role
    });
  }

  // Cập nhật user
  updateUser() {
    if (!this.selectedUser) return;

    const updatedData = this.editForm.value;
    this.userService.updateUser(this.selectedUser._id, updatedData).subscribe({
      next: () => {
        alert('Cập nhật thành công!');
        this.selectedUser = null;
        this.loadUsers(); // Reload danh sách user
      },
      error: (err: any) => {
        console.error('Lỗi cập nhật:', err);
        alert('Cập nhật thất bại!');
      }
    });
  }

  // Xóa user
  deleteUser(userId: string) {
    if (confirm('Bạn có chắc chắn muốn xóa user này?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          alert('Xóa thành công!');
          this.loadUsers(); // Reload danh sách user sau khi xóa
        },
        error: (err: any) => {
          console.error('Lỗi xóa:', err);
          alert('Xóa thất bại!');
        }
      });
    }
  }
}
