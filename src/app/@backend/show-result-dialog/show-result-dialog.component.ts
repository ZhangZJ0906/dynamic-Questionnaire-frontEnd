import { Component, Inject, inject } from '@angular/core';
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
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { HttpClientService } from '../../@services/httpClient.service';
import { SidebarComponent } from "../sidebar/sidebar.component";
@Component({
  selector: 'app-show-result-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatIconModule,
    MatDividerModule,
    MatDatepickerModule,
    SidebarComponent
],
  templateUrl: './show-result-dialog.component.html',
  styleUrl: './show-result-dialog.component.scss',
})
export class ShowResultDialogComponent {
  readOnlyAnswer: any;
  constructor(
    private http: HttpClientService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.readOnlyAnswer = this.data;
    console.log(this.readOnlyAnswer);
  }
  readonly dialogRef = inject(MatDialogRef<ShowResultDialogComponent>);

  onNoClick(): void {
    this.dialogRef.close();
  }
}
