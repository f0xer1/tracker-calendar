import {AsyncPipe, NgIf} from "@angular/common";
import {Component, DestroyRef, Inject} from '@angular/core';
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
import {BehaviorSubject} from "rxjs";

import {AppState} from "../../../app.state";
import {
  Absence,
  AbsenceFormData,
  BusyDatesAbsenceInterface,
  CountsAbsenceInterface
} from "../../../models/absence.model";
import {AbsenceFormService} from "../../../services/absence-form.service";
import {CalendarService} from "../../../services/calendar.service";
import {selectAllAbsenceByYear, selectSickAndVacationCountByYear} from "../../../store/absence.selectors";
import {busyDateValidator, dateValidator, sickAndVacationCountValidator} from "../../../utils/filter/absence.filters";
import {YearRangePipe} from "../../../utils/pipe/year-range.pipe";


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
    NgIf,
    YearRangePipe
  ],
  templateUrl: './absence-form.component.html',
  styleUrls: ['./absence-form.component.css']
})
export class AbsenceFormComponent {
  form: FormGroup;
  isEditMode: boolean;
  currentDate = new BehaviorSubject(moment());

  private busyDates: BusyDatesAbsenceInterface[] = [];
  private counts: CountsAbsenceInterface = {
    sickCount: 0,
    vacationCount: 0
  };

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AbsenceFormComponent>,
    private store: Store<AppState>,
    private absenceService: AbsenceFormService,
    private calendarService: CalendarService,
    private destroyRef: DestroyRef,
    @Inject(MAT_DIALOG_DATA) public previousData: {
      transferData: AbsenceFormData;
    }
  ) {
    const transferData = previousData?.transferData;
    this.isEditMode = transferData?.update || false;
    const absence: Absence | null = transferData ? transferData.absence : null;
    this.currentDate = this.calendarService.getCurrentDate();
    this.form = this.fb.group({
      absenceType: [absence?.type || '', Validators.required],
      dateFrom: [absence ? moment(absence.start).toDate() : '', Validators.required],
      dateTo: [absence ? moment(absence.end).toDate() : '', Validators.required],
      comment: [absence?.comment || '']
    }, {
      validators: this.createCountValidator()
    });

    this.store.pipe(select(selectAllAbsenceByYear(this.currentDate.value.year())), takeUntilDestroyed(this.destroyRef)).subscribe(
      (absences: Absence[]) => {
        this.busyDates.push(...absences.map(a => ({start: a.start, end: a.end})));
      }
    );

    this.store.pipe(select(selectSickAndVacationCountByYear(this.currentDate.value.year())), takeUntilDestroyed(this.destroyRef)).subscribe(
      (counts: CountsAbsenceInterface) => {
        this.counts = counts;
      }
    );
  }

  onSubmit(): void {
    if (this.form.valid) {
      const absence: Absence = {
        id: this.isEditMode ? this.previousData.transferData.absence.id : this.absenceService.generateId(),
        start: moment(this.form.value.dateFrom),
        end: moment(this.form.value.dateTo),
        type: this.form.value.absenceType,
        comment: this.form.value.comment,
      };
      if (this.isEditMode) {
        this.absenceService.updateExistingAbsence(absence, this.previousData.transferData.absence);
      } else {
        this.absenceService.createNewAbsence(absence);
      }
      this.dialogRef.close(this.form.value);
    }
  }

  onDelete(): void {
    if (this.isEditMode && this.previousData.transferData.absence.id) {
      this.absenceService.deleteAbsence(this.previousData.transferData.absence);
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
        ? this.absenceService.toCountDaysRequested(this.previousData.transferData.absence.start,
          this.previousData.transferData.absence.end)
        : 0;
      const typeBefore = this.isEditMode ? this.previousData.transferData.absence.type : "";

      const
        validators = [
          dateValidator(group),
          sickAndVacationCountValidator(this.counts, daysBefore, typeBefore)(group)
        ];

      if (!this.isEditMode) {
        validators.push(busyDateValidator(this.busyDates)(group));
      }

      return validators.reduce((error, validator) => ({...error, ...validator}), {});
    };
  }
}
