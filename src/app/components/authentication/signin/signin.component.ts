import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsService } from '../../application/application-form/forms.service';
import { ConstantsService } from '../../../shared/services/constants.service';
import { Router } from '@angular/router';
import { UntypedFormGroup } from '@angular/forms';
import { ScholarshipService } from '../../../app.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  formConfiguration: any;
  submitting: boolean;
  form: UntypedFormGroup = this.formsService.createFormGroup([
    {
      name: 'email',
      type: 'text',
      value: '',
      required: true
    },
    {
      name: 'password',
      type: 'text',
      value: '',
      required: true
    }
  ]);
  private unsubscribe: Subject<void> = new Subject();
  @Output() changeToLogIn: EventEmitter<any> = new EventEmitter();
  @Output() submitted: EventEmitter<any> = new EventEmitter();

  constructor(
    private scholarshipService: ScholarshipService,
    private formsService: FormsService,
    private toastr: ToastrService,
    private router: Router,
    private constants: ConstantsService
  ) {}

  ngOnInit(): void {
    this.formConfiguration = {
      formElements: {
        rows: [
          {
            elements: [
              {
                class: 'form-group col-sm-6',
                label: 'First Name',
                name: 'firstName',
                type: 'text',
                value: '',
                autoComplete: 'given-name',
                required: true,
                requiredErrorLabel: 'First name required'
              },
              {
                class: 'form-group col-sm-6',
                label: 'Last Name',
                name: 'lastName',
                type: 'text',
                value: '',
                autoComplete: 'family-name',
                required: true,
                requiredErrorLabel: 'Last name required'
              }
            ]
          },
          {
            elements: [
              {
                class: 'form-group col-sm-6',
                label: 'Email',
                name: 'email',
                type: 'email',
                required: true,
                value: '',
                autoComplete: 'email',
                requiredErrorLabel: 'Email required',
                patternErrorLabel: 'Valid email required'
              },
              {
                class: 'form-group col-sm-6',
                label: 'Phone',
                name: 'phone',
                type: 'phone',
                value: '',
                autoComplete: 'tel',
                patternErrorLabel: 'Valid phone number required'
              }
            ]
          },
          {
            elements: [
              {
                class: 'form-group col-sm-6',
                label: 'Password',
                name: 'password',
                type: 'password',
                required: true,
                value: '',
                requiredErrorLabel: 'Password required',
                patternErrorLabel: 'Minimum 7 characters, requires upper, lower and numeric'
              },
              {
                class: 'form-group col-sm-6',
                label: 'Confirm Password',
                name: 'confirm',
                type: 'password',
                required: true,
                value: '',
                mustMatch: 'password',
                mustMatchErrorLabel: 'Passwords must match.'
              }
            ]
          }
        ]
      },
      submitCTA: 'Create Account'
    };
  }

  setToLogIn(event) {
    event.preventDefault();
    this.changeToLogIn.emit(true);
  }

  submit(form) {
    this.submitting = true;
    this.scholarshipService
      .createApplicant(form.value)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (response: any) => {
          if (response.applicant && response.token) {
            window.localStorage.setItem(this.constants.storageKey, response.token);
            this.toastr.success('Logging you in...', 'Account created!');
            this.scholarshipService.setApplicant(response.applicant);
            const intendedScholarship = window.sessionStorage.getItem(this.constants.intendedScholarshipKey);
            if (intendedScholarship) {
              this.router.navigate([`/${intendedScholarship}/application`], { queryParamsHandling: 'preserve' });
              window.sessionStorage.removeItem(this.constants.intendedScholarshipKey);
            }
          } else {
            if (response.error) {
              this.toastr.error(response.error, 'Error!');
            }
            if (response.duplicate) {
              this.toastr.error('Another account with this email address already exists.', 'Duplicate User Found!');
            }
          }
        },
        (error: HttpErrorResponse) => {
          this.toastr.error(error.message, 'Error!');
        }
      )
      .add(() => {
        this.submitting = false;
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
