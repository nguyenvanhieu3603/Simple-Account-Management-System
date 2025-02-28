import { Component, ViewChild, ElementRef, inject, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',                             
  standalone: true,                                      
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, FormsModule], 
  templateUrl: './dashboard.component.html',             
  styleUrls: ['./dashboard.component.css']               
})

export class DashboardComponent implements AfterViewChecked {
  @ViewChild('editSection', { static: false }) editSection!: ElementRef;
  users: any[] = [];                 
  editForm: FormGroup;               
  addUserForm: FormGroup;            
  showAddUserForm: boolean = false;   
  selectedUser: any = null;          

  currentPage: number = 1;           
  totalPages: number = 1;            
  pageSize: number = 10;             

  searchQuery: string = '';          

  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private scrollToEdit = false;

  constructor() {
    this.editForm = this.fb.group({
      username: ['', Validators.required],
      role: ['', Validators.required]      
    });

    this.addUserForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['user', Validators.required]   
    });

    this.loadUsers(); 
  }

  ngAfterViewChecked() {
    if (this.scrollToEdit && this.editSection) {
      this.editSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.scrollToEdit = false;
    }
  }

  loadUsers() {
    this.userService.getUsers(this.currentPage, this.pageSize, this.searchQuery).subscribe({
      next: (data: any) => {
        this.users = data.users;
        this.totalPages = data.totalPages;
      },
      error: (err: any) => {
        console.error('Error:', err);
      }
    });
  }

  onSearchChange() {
    this.currentPage = 1;
    this.loadUsers();
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.loadUsers();
    }
  }

  editUser(user: any) {
    this.selectedUser = user;
    this.editForm.setValue({
      username: user.username,
      role: user.role
    });
    this.scrollToEdit = true;
  }

  updateUser() {
    if (!this.selectedUser) return;

    const updatedData = this.editForm.value;
    this.userService.updateUser(this.selectedUser._id, updatedData).subscribe({
      next: () => {
        alert('Cập nhật thành công!');
        this.selectedUser = null;
        this.loadUsers();
      },
      error: (err: any) => {
        console.error('Lỗi cập nhật:', err);
        alert('Cập nhật thất bại!');
      }
    });
  }

  deleteUser(userId: string) {
    if (confirm('Bạn có chắc chắn muốn xóa user này?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          alert('Xóa thành công!');
          this.loadUsers();
        },
        error: (err: any) => {
          console.error('Lỗi xóa:', err);
          alert('Xóa thất bại!');
        }
      });
    }
  }

  addUser() {
    if (this.addUserForm.invalid) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    this.userService.addUser(this.addUserForm.value).subscribe({
      next: () => {
        alert('Thêm người dùng thành công!');
        this.addUserForm.reset();
        this.showAddUserForm = false;
        this.loadUsers();
      },
      error: (err: any) => {
        console.error('Lỗi thêm user:', err);
        alert('Thêm user thất bại!');
      }
    });
  }
}
