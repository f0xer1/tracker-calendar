import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from "@angular/material/card";
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatDialogRef} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";

@Component({
  selector: 'app-absence-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    MatIcon
  ],
  templateUrl: './absence-form.component.html',
  styleUrls: ['./absence-form.component.css']
})
export class AbsenceFormComponent {

  absenceForm: FormGroup;

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<AbsenceFormComponent>) {
    this.absenceForm = this.fb.group({
      absenceType: ['', Validators.required],
      dateFrom: ['', Validators.required],
      dateTo: ['', Validators.required],
      comment: ['']
    });
  }

  onSubmit(): void {
    if (this.absenceForm.valid) {
      //TODO: Implement the weekend management logic, after implementing the basic logic
      this.dialogRef.close(this.absenceForm.value);
    }
  }

  onCancel(): void {
    this.absenceForm.reset();
  }

  onClose(): void {
    this.dialogRef.close()
  }
}
