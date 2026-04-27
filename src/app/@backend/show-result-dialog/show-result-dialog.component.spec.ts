import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowResultDialogComponent } from './show-result-dialog.component';

describe('ShowResultDialogComponent', () => {
  let component: ShowResultDialogComponent;
  let fixture: ComponentFixture<ShowResultDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowResultDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowResultDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
