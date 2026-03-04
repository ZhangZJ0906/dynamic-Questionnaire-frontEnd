import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}

  isLoggedIn = signal<boolean>(localStorage.getItem('token') !== null);
  login(token: string) {
    localStorage.setItem('token', token);
    this.isLoggedIn.set(true);
    this.router.navigate(['/showAll']);
  }
  logout() {
    localStorage.removeItem('token');
    this.isLoggedIn.set(false);
    this.router.navigate(['']);
  }
}
