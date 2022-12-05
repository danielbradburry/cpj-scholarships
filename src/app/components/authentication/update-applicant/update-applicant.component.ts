import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ScholarshipService } from '../../../app.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'update-applicant',
  templateUrl: './update-applicant.component.html',
  styleUrls: ['./update-applicant.component.scss']
})
export class UpdateApplicantComponent implements OnInit {

  @Input() applicant: any;
  @Input() reloading: boolean;
  submitting: boolean;
  formConfiguration: any;
  private unsubscribe: Subject<void> = new Subject();
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
            label: 'First Name',
            name: 'firstName',
            type: 'text',
            value: this.applicant.firstName,
            autoComplete: 'given-name',
            required: true,
            requiredErrorLabel: 'First name required'
          },{
            class: 'form-group col-sm-6',
            label: 'Last Name',
            name: 'lastName',
            type: 'text',
            value: this.applicant.lastName,
            autoComplete: 'family-name',
            required: true,
            requiredErrorLabel: 'Last name required'
          }]
        }, {
          elements: [{
            class: 'form-group col-sm-6',
            label: 'Email',
            name: 'email',
            type: 'email',
            value: this.applicant.email,
            autoComplete: 'email',
            required: true,
            requiredErrorLabel: 'Email required',
            patternErrorLabel: 'Valid email required'
          }, {
            class: 'form-group col-sm-6',
            label: 'Phone',
            name: 'phone',
            type: 'phone',
            value: this.applicant.phone,
            autoComplete: 'tel',
            patternErrorLabel: 'Valid phone number required'
          }]
        }]
      },
      submitCTA: 'Save'
    }  
  }

  submit(form) {
    this.submitting = true;

    this.scholarshipService.updateApplicant(form.value)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response: any) => {
        if (response.valid) {
          this.submitted.emit(true);
          this.toastr.success('Changes saved', 'Success!');
          this.scholarshipService.setApplicant(response.applicant);
        } else {
          if (response.error) {
            this.toastr.error(response.error, 'Error!');
          }
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
