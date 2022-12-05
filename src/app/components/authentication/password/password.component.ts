import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ScholarshipService } from '../../../app.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'change-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  private unsubscribe: Subject<void> = new Subject();
  formConfiguration: any;
  applicant: any;
  submitting: boolean;
  @Input() reloading: boolean;
  @Output() submitted: EventEmitter<any> = new EventEmitter();

  constructor(
    private toastr: ToastrService,
    private scholarshipService: ScholarshipService
  ) { }

  ngOnInit() {
    this.formConfiguration = {
      formElements: {
        rows: [{
          elements: [{
            class: 'form-group col-sm-6',
            label: 'New Password',
            name: 'newPassword',
            type: 'password',
            required: true,
            value: '',
            requiredErrorLabel: 'Password required',
            patternErrorLabel: 'Minimum 7 characters, requires upper, lower and numeric.'
          }, {
            class: 'form-group col-sm-6',
            label: 'Confirm Password',
            name: 'confirm',
            type: 'password',
            required: true,
            value: '',
            mustMatch: 'newPassword',
            mustMatchErrorLabel: 'Passwords must match.'
          }]
        }]
      },
      submitCTA: 'Change'
    };
  }

  submit(form) {
    this.submitting = true;

    this.scholarshipService.changePassword(form.value)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response: any) => {
        if (response.error) {
          this.toastr.error(response.error, 'Error!');
          return;
        }
        if (response.valid) {
          this.toastr.success('Changes saved', 'Success!');
          this.submitted.emit(true);
        } 
      },
      (error: HttpErrorResponse) => {
        this.toastr.error(error.message, 'Error!');
      })
      .add(() => {
        this.submitting = false;
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
