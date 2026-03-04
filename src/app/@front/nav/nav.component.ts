import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../@services/auth.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  menuOpen = false; // 控制手機下拉
  constructor(private auth: AuthService) {}
  //TODO 登出
  logout() {
    Swal.fire({
      title: '確定要登出？',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '確定',
      cancelButtonText: '取消',
    }).then((result) => {
      if (result.isConfirmed) {
        this.auth.logout();
      }
    });
  }
}
