import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users'; // API user

  constructor(private http: HttpClient) {}

  // Lấy danh sách user
  getUsers(page: number = 1, limit: number = 10, searchQuery: string = ''): Observable<any> {
    let url = `${this.apiUrl}?page=${page}&limit=${limit}`;
    
    if (searchQuery.trim() !== '') {
      url += `&search=${encodeURIComponent(searchQuery)}`;
    }
  
    return this.http.get(url, this.getHeaders());
  }

  // Thêm user mới
  addUser(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user, this.getHeaders());
  }

  // Cập nhật user
  updateUser(id: string, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, user, this.getHeaders());
  }

  // Xóa user
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getHeaders());
  }

  // Hàm lấy headers có token
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }
}
