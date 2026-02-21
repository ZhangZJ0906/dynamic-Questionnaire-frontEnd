import { Component } from '@angular/core';
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
    account: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{8,}$/),
    ]),
  });
  test: boolean = false; //判斷是否為登入或註冊
  constructor(private router: Router) {}

  //註冊
  signUp() {
    const registerPassword = this.form.get('registerPassword')?.value;
    const registerEmail = this.form.get('registerEmail')?.value;

    const registerAccount = this.form.get('registerAccount')?.value;
    console.log(registerAccount, registerEmail, registerPassword);
    // this.router.navigate(['/']);
    alert('註冊成功');

    this.test = !this.test;
  }
  //登入
  check() {
    const password = this.form.get('password')?.value;
    const account = this.form.get('account')?.value;
    console.log(account, password);

    if (account == '123' && password == '12345678') {
      // console.log(this.account, this.password);
      // alert('對');
      this.router.navigate(['/showAll']);
    } else {
      // console.log(this.account, this.password);

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
