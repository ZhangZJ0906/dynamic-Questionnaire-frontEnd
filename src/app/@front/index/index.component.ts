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
  form = new FormGroup({
    registerAccount: new FormControl('', [Validators.required]),
    registerEmail: new FormControl('', [Validators.required, Validators.email]),
    registerPassword: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{8,}$/),
    ]),
    registertitle: new FormControl('', [Validators.required]),
    account: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{8,}$/),
    ]),
  });
  test: boolean = false; //判斷是否為登入或註冊
  constructor(
    private router: Router,
    private auth: AuthService,
  ) {}

  //註冊
  signUp() {
    const registerPassword = this.form.get('registerPassword')?.value;
    const registerEmail = this.form.get('registerEmail')?.value;
    const registerAccount = this.form.get('registerAccount')?.value;
    const registerTitle = this.form.get('registertitle')?.value;
    console.log(
      registerAccount,
      registerEmail,
      registerPassword,
      registerTitle,
    );

    if (
      registerAccount == '' ||
      registerEmail == '' ||
      registerPassword == '' ||
      registerTitle == ''
    ) {
      Swal.fire({
        title: '填寫資料',
        text: '填寫資料',
        icon: 'error',
      });
    } else {
      this.form.reset();
      alert('註冊成功');

      this.test = !this.test;
    }
  }
  //登入
  check() {
    const password = this.form.get('password')?.value;
    const account = this.form.get('account')?.value;
    console.log(account, password);

    if (account == '123' && password == '12345678') {
      // 呼叫 API (此處模擬成功)
      const mockToken = 'abc-123-token';
      this.auth.login(mockToken);

      Swal.fire('登入成功', '歡迎回來', 'success');
      // this.router.navigate(['/showAll']);
    } else {
      alert('錯');
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // console.log(this.password);
  }
}
