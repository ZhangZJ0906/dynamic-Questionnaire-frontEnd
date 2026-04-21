import { Component } from '@angular/core';
import Swal from 'sweetalert2';

import { NavComponent } from '../nav/nav.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import {
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { AuthService } from '../../@services/auth.service';
import { HttpClientService } from '../../@services/httpClient.service';

@Component({
  selector: 'app-index',
  imports: [
    NavComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
})
export class IndexComponent {
  registerForm = new FormGroup({
    registerPhone: new FormControl('', [Validators.required]),
    registerEmail: new FormControl('', [Validators.required, Validators.email]),
    registerAge: new FormControl('', [Validators.required]),
    registertitle: new FormControl('', [Validators.required]),
  });

  loginForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  test: boolean = false; //判斷是否為登入或註冊
  // basic_URL = 'http://localhost:8080/user/';

  constructor(
    private router: Router,
    private auth: AuthService,
    private http: HttpClientService,
  ) {}
  //註冊
  signUp() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched(); // 讓沒填的欄位變紅
      Swal.fire({
        title: '請填寫正確資料',
        icon: 'warning',
      });
      return; // 直接中斷，不發送 API
    }
    const postData = {
      email: this.registerForm.get('registerEmail')?.value,
      name: this.registerForm.get('registertitle')?.value, // 假設 Account 對應 Name
      phone: this.registerForm.get('registerPhone')?.value, // 假設 Title 欄位存的是 Phone
      age: this.registerForm.get('registerAge')?.value,
    };

    this.http.postApi(this.http.basicUrl + 'user/register', postData).subscribe({
      next: (res:any) => {
        // --- 關鍵修改：檢查後端定義的自定義狀態碼 ---
        if (res.code !== 200) {
          Swal.fire({
            title: '註冊失敗',
            text: res.message || '帳號或密碼錯誤',
            icon: 'error',
          });
          return; // 擋掉，不執行後續登入邏輯
        }
        Swal.fire({
          title: '註冊成功',
          icon: 'success',
        });
        this.registerForm.reset();
      },
      error: (err) => {
        Swal.fire({
          title: '註冊失敗',
          text: err.error?.message || '伺服器連線異常',
          icon: 'error',
        });
      },
    });
    this.test = !this.test;
  }

  //登入
  check() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // 讓沒填的欄位變紅
      Swal.fire({
        title: '請填寫正確資料',
        icon: 'warning',
      });
      return; // 直接中斷，不發送 API
    }



    this.http
      .getApi(this.http.basicUrl + `user/login?email=${this.loginForm.get('email')?.value}`)
      .subscribe({
        next: (res:any) => {
          // --- 關鍵修改：檢查後端定義的自定義狀態碼 ---
          if (res.code !== 200) {
            Swal.fire({
              title: '登入失敗',
              text: res.message || '帳號或密碼錯誤',
              icon: 'error',
            });
            return; // 擋掉，不執行後續登入邏輯
          }
          Swal.fire({
            title: '登入成功',
            icon: 'success',
          });
          const mockToken = 'session_' + Math.random().toString(36).substr(2);

          this.auth.login(mockToken);
        },
        error: (err) => {
          Swal.fire({
            title: '登入失敗',
            text: err.error?.message || '伺服器連線異常',
            icon: 'error',
          });

          this.router.navigate(['/']);
        },
      });
  }


}
