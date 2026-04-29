import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../@services/auth.service';

export interface link {
  id: number;
  name: string;
  route?: string;
  icon: string;
  function?: string;
}
@Component({
  selector: 'app-sidebar',
  imports: [MatSidenavModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  linkArr: link[] = [
    {
      id: 1,
      name: '後台首頁',
      route: '/admin',
      icon: 'home',
    },
    {
      id: 2,
      name: '前台首頁',
      route: '/showAll',
      icon: 'visibility',
    },
  ];

  constructor(
    private router: Router,
    private auth: AuthService,
  ) {}

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
