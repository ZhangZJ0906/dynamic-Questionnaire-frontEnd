import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SwalService } from '../shared/SwalService';
@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  constructor() {}
}

//後台
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // 從 localStorage 取得儲存的 user 資訊 (假設你存的是 JSON 字串)
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  const userEmail = user?.email || localStorage.getItem('email'); // 兼容直接存 email 的情況

  // 指定的唯一 Admin 帳號
  const ADMIN_EMAIL = 'cklgy88@gmail.com'; // 根據你上傳的資料參考
  // 2. 先判斷是否登入
  if (!userEmail) {
    SwalService.warning('請先登入', '您必須登入後才能存取此頁面');
    router.navigate(['/login']); // 導向你的登入頁面
    return false;
  }
  if (userEmail === ADMIN_EMAIL) {
    return true; // 是管理員，允許通過
  } else {
    // 權限不足，跳出警告並導回首頁
    SwalService.warning('權限不足', '您沒有進入管理後台的權限');

    router.navigate(['/showAll']);
    return false;
  }
};

// 前台
export const userAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // 取得使用者資訊
  const userJson = localStorage.getItem('user');
  const userEmail = userJson
    ? JSON.parse(userJson).email
    : localStorage.getItem('email');

  // 只要有 email，就代表已登入，允許進入前台功能
  if (userEmail) {
    return true;
  } else {
    // 未登入，提示並導向登入頁
    SwalService.warning('請先登入', '填寫問卷或查看紀錄前，請先登入帳號');

    // 可以順便記錄使用者原本想去的網址，登入後跳轉回來
    router.navigate(['/']);
    return false;
  }
};


// 前台 以登入不能返回登入頁面
export const loginAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // 取得使用者資訊
  const userJson = localStorage.getItem('user');
  const userEmail = userJson
    ? JSON.parse(userJson).email
    : localStorage.getItem('email');

  // 如果已經有 email (已登入)
  if (userEmail) {
    // 攔截他，不讓他去登入頁，直接送他去首頁或列表頁
    router.navigate(['/showAll']);
    return false; // 注意：這裡要回傳 false，因為我們要「阻止」他進入登入頁
  }

  // 沒有 email (未登入)，允許進入登入頁面
  return true;
};;