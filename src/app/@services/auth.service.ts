import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}

  isLoggedIn = signal<boolean>(localStorage.getItem('token') !== null);
  // 用來存儲使用者資訊的 Signal，方便各組件訂閱
  currentUser = signal<any>(JSON.parse(localStorage.getItem('user') || '{}'));

  login(token: string, userData: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData)); // 存入使用者資訊

    this.isLoggedIn.set(true);
    this.currentUser.set(userData); // 更新 Signal

    this.router.navigate(['/showAll']);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // 登出時一併刪除

    this.isLoggedIn.set(false);
    this.currentUser.set({}); // 清空 Signal

    this.router.navigate(['']);
  }
}
