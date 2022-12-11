import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ScholarshipService } from '../../app.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ApplicantResetPasswordComponent implements OnInit {
  applicant: any;
  program: any;
  formConfiguration: any;
  changeRequest: any = {};
  authKey: string;
  submitting: boolean;
  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private toastr: ToastrService,
    private scholarshipService: ScholarshipService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.scholarshipService.currentApplicant
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        this.applicant = data;
      });

    this.scholarshipService.currentProgram
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        this.program = data;
      });

    this.route.params.pipe(takeUntil(this.unsubscribe)).subscribe((params) => {
      this.authKey = params['authKey'];
      if (this.authKey) {
        this.formConfiguration = {
          formElements: {
            rows: [
              {
                elements: [
                  {
                    class: 'form-group col-sm-12',
                    label: 'New Password',
                    name: 'password',
                    type: 'password',
                    value: '',
                    required: true,
                    requiredErrorLabel: 'Password required',
                    patternErrorLabel:
                      'Minimum 7 characters, requires upper, lower and numeric.'
                  }
                ]
              },
              {
                elements: [
                  {
                    class: 'form-group col-sm-12',
                    label: 'Confirm Password',
                    name: 'confirm',
                    type: 'password',
                    value: '',
                    required: true,
                    mustMatch: 'password',
                    mustMatchErrorLabel: 'Passwords must match.'
                  }
                ]
              }
            ]
          },
          submitCTA: 'Change'
        };
      }
    });

    this.route.data
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response: any) => {
        if (response.data.changeRequest) {
          this.changeRequest = response.data.changeRequest;
          this.scholarshipService.setProgram(response.data.program);
        } else {
          this.changeRequest = false;
          if (response.data.error) {
            this.toastr.error(response.error, 'Error!');
          }
        }
      });
  }

  submit(form) {
    this.submitting = true;

    form.value.passwordKeyID = this.authKey;
    form.value.email = this.changeRequest.email;
    this.scholarshipService
      .changePasswordByEmail(form.value)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (response: any) => {
          if (response.valid) {
            this.toastr.success('Password changed', 'Success!');
            this.router.navigate(['/']);
          } else {
            if (response.error) {
              this.toastr.error(response.error, 'Error!');
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
