import Swal from 'sweetalert2';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  model,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { HttpClientService } from '../../@services/httpClient.service';

@Component({
  selector: 'app-show-preview',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatCardModule,
    MatDividerModule,
  ],
  templateUrl: './show-preview.component.html',
  styleUrl: './show-preview.component.scss',
})
export class ShowPreviewComponent {
  readonly dialogRef = inject(MatDialogRef<ShowPreviewComponent>);

  constructor(
    private matdialog: MatDialog,
    private router: Router,
    private http: HttpClientService,
    @Inject(MAT_DIALOG_DATA) public data: { question: any[]; answer: any },
  ) {

  }

  onCancel() {
    this.dialogRef.close();
  }
  // 輔助方法：將陣列轉為逗號分隔字串
  formatAnswer(val: any): string {
    if (Array.isArray(val)) {
      return val.join(', ');
    }
    return val || '（尚未填寫）';
  }
  sendData(postData:any){

  }
  submit() {
    //TODO call API 送資料

    Swal.fire({
      title: '確定要送出？',
      text: '確定不再檢查一次嗎？', // 修正這裡：context -> text
      icon: 'question',
      showCancelButton: true, // 顯示取消按鈕
      confirmButtonText: '確定送出',
      cancelButtonText: '我再想想',
      // Material 3 风格通常使用更圆润的按钮
      confirmButtonColor: 'var(--mat-sys-primary)',
      cancelButtonColor: 'var(--mat-sys-error)',
    }).then((result) => {
      
      if (!result.isConfirmed) {
        return;
      }

    });
  }
}
