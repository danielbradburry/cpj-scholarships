import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormsService } from './forms.service';
import { UntypedFormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.scss']
})
export class ApplicationFormComponent implements OnInit {

  @Input() form: any;
  @Input() configuration: any;
  @Input() formGroup: UntypedFormGroup;
  @Input() submitting: boolean;
  @Output() updatedForm: EventEmitter<any> = new EventEmitter();
  @Output() formIsChanged: EventEmitter<any> = new EventEmitter();
  @Output() formSubmit: EventEmitter<any> = new EventEmitter();
  @Output() finishLater: EventEmitter<any> = new EventEmitter();
  private unsubscribe: Subject<void> = new Subject();
  
  constructor(
    private formsService: FormsService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.formGroup.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => {
        this.updatedForm.emit(value);
      });

    this.form.applicationFormQuestions.forEach((question) => {
      if (question.type === 'select') {
        this.formGroup.controls[question.name].setValue(this.formGroup.value[question.name] || question.options[0].data);
      }
    });

    this.cdRef.detectChanges();
  }

  formChanged() {
    this.formIsChanged.emit(true);
  }

  submit() {
    this.formGroup = this.formsService.prepareFormGroupValues(this.formGroup);
    this.formIsChanged.emit(false);
    this.formSubmit.emit(this.formGroup);
  }

  submitFinishLater() {
    this.formGroup = this.formsService.prepareFormGroupValues(this.formGroup);
    this.formIsChanged.emit(false);
    this.finishLater.emit(this.formGroup);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
