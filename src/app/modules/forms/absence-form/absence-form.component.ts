import {AsyncPipe, NgIf} from "@angular/common";
import {Component, DestroyRef, Inject, inject} from '@angular/core';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from "@angular/material/card";
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {select, Store} from "@ngrx/store";
import moment from "moment";

import {AppState} from "../../../app.state";
import {busyDateValidator, dateValidator, sickAndVacationCountValidator} from "../../../filter/absence.filters";
import {Absence} from "../../../models/absence.model";
import {AbsenceService} from "../../../services/absence.service";
import {addAbsence, deleteAbsence, updateAbsence} from "../../../store/absence.action";
import {allAbsenceSelector, sickAndVacationCountSelector} from "../../../store/absence.selectors";

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
    MatIcon,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './absence-form.component.html',
  styleUrls: ['./absence-form.component.css']
})
export class AbsenceFormComponent {
  form: FormGroup;
  isEditMode: boolean;
  private destroyRef = inject(DestroyRef);
  private busyDates: { start: moment.Moment, end: moment.Moment }[] = [];
  private counts: { sickCount: number, vacationCount: number } = {
    sickCount: 0,
    vacationCount: 0
  };

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AbsenceFormComponent>,
    private store: Store<AppState>,
    private absenceService: AbsenceService,
    @Inject(MAT_DIALOG_DATA) public previousData: { absence: Absence }
  ) {
    const absence = previousData?.absence;
    this.isEditMode = !!absence;

    this.form = this.fb.group({
      absenceType: [absence?.type || '', Validators.required],
      dateFrom: [absence ? moment(absence.start).toDate() : '', Validators.required],
      dateTo: [absence ? moment(absence.end).toDate() : '', Validators.required],
      comment: [absence?.comment || '']
    }, {
      validators: this.createCountValidator()
    });

    this.store.pipe(select(allAbsenceSelector), takeUntilDestroyed(this.destroyRef)).subscribe(
      (absences: Absence[]) => {
        this.busyDates.push(...absences.map(a => ({start: a.start, end: a.end})));
      }
    );

    this.store.pipe(select(sickAndVacationCountSelector), takeUntilDestroyed(this.destroyRef)).subscribe(
      (counts: { sickCount: number, vacationCount: number }) => {
        this.counts = counts;
      }
    );
  }

  onSubmit(): void {
    if (this.form.valid) {
      const absence: Absence = {
        id: this.isEditMode ? this.previousData.absence.id : this.absenceService.generateId(),
        start: moment(this.form.value.dateFrom),
        end: moment(this.form.value.dateTo),
        type: this.form.value.absenceType,
        comment: this.form.value.comment,
      };

      if (this.isEditMode) {
        this.store.dispatch(updateAbsence({
          id: absence.id,
          changes: absence,
          daysBefore: this.absenceService.toCountDaysRequested(this.previousData.absence.start, this.previousData.absence.end),
          daysAfter: this.absenceService.toCountDaysRequested(absence.start, absence.end),
          from: this.previousData.absence.type,
          to: absence.type
        }));
      } else {
        this.store.dispatch(addAbsence({
          absence,
          daysRequested: this.absenceService.toCountDaysRequested(absence.start, absence.end),
          absenceType: absence.type
        }));
      }
      this.dialogRef.close(this.form.value);
    }
  }

  onDelete(): void {
    if (this.isEditMode && this.previousData.absence.id) {
      this.store.dispatch(deleteAbsence({
        id: this.previousData.absence.id,
        daysRequested: this.absenceService.toCountDaysRequested(this.previousData.absence.start, this.previousData.absence.end),
        absenceType: this.previousData.absence.type
      }));
      this.dialogRef.close('deleted');
    }
  }

  onCancel(): void {
    this.form.reset();
  }

  onClose(): void {
    this.dialogRef.close();
  }

  private createCountValidator() {
    return (group: FormGroup) => {
      const daysBefore = this.isEditMode
        ? this.absenceService.toCountDaysRequested(this.previousData.absence.start, this.previousData.absence.end)
        : 0;

      const validators = [
        dateValidator(group),
        sickAndVacationCountValidator(this.counts, daysBefore)(group)
      ];

      if (!this.isEditMode) {
        validators.push(busyDateValidator(this.busyDates)(group));
      }

      return validators.reduce((error, validator) => ({...error, ...validator}), {});
    };
  }
}
