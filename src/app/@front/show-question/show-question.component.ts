import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
  signal,
} from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ShowPreviewComponent } from '../show-preview/show-preview.component';

export interface questions {}
@Component({
  selector: 'app-show-question',
  imports: [
    MatCardModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    MatIcon,
    MatRadioModule,
    MatDividerModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NavComponent,
  ],
  templateUrl: './show-question.component.html',
  styleUrl: './show-question.component.scss',
})
export class ShowQuestionComponent {
  constructor(private matdialog: MatDialog) {}

  //TODO 秀出答案 
  preview(/*data:any*/) {
    this.matdialog.open(ShowPreviewComponent, {
      width: '560px',
      height:'560px'
      //data:data
    });
  }
}
