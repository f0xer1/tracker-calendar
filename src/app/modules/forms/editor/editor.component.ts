import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {MatOption} from "@angular/material/core";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatDialogRef} from "@angular/material/dialog";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatSelect} from "@angular/material/select";

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatSuffix,
    ReactiveFormsModule,
    MatIcon,
    MatIconButton
  ],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent {
  absenceForm: FormGroup;

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<EditorComponent>) {
    this.absenceForm = this.fb.group({
      absenceType: ['', Validators.required],
      dateFrom: ['', Validators.required],
      dateTo: ['', Validators.required],
      comment: ['']
    });
  }

  onSubmit() {
    if (this.absenceForm.valid) {
      //TODO: Implement the weekend management logic, after implementing the basic logic
      console.log('Form submitted:', this.absenceForm.value);
      this.dialogRef.close(this.absenceForm.value);
    }
  }

  onCancel() {
    this.absenceForm.reset();
  }

  onClose() {
    this.dialogRef.close()
  }
}
