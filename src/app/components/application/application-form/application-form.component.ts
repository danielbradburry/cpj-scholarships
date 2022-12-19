import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import { FormsService } from './forms.service';
import { UntypedFormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

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
  @Output() formSubmit: EventEmitter<any> = new EventEmitter();
  @Output() finishLater: EventEmitter<any> = new EventEmitter();
  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private formsService: FormsService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.form.applicationFormQuestions.forEach((question) => {
      if (question.type === 'select') {
        this.formGroup.controls[question.name].setValue(
          this.formGroup.value[question.name] || question.options[0].data
        );
      }
    });

    this.cdRef.detectChanges();
  }

  submit() {
    this.formGroup = this.formsService.prepareFormGroupValues(this.formGroup);
    this.formSubmit.emit(this.formGroup);
  }

  submitFinishLater() {
    this.formGroup = this.formsService.prepareFormGroupValues(this.formGroup);
    this.finishLater.emit(this.formGroup);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
