import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ConstantsService } from '../../../shared/services/constants.service';
import { ScholarshipService } from '../../../app.service';
import { Router } from '@angular/router';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  applicant: any;
  error: string;
  success: boolean;
  submitting: boolean;
  formConfiguration: any;
  private unsubscribe: Subject<void> = new Subject();
  @Output() changeToSignIn: EventEmitter<any> = new EventEmitter();
  @Output() requestLoginReload: EventEmitter<any> = new EventEmitter();
  @Output() submitted: EventEmitter<any> = new EventEmitter();

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private toastr: ToastrService,
    private scholarshipService: ScholarshipService,
    private constants: ConstantsService
  ) {}

  ngOnInit(): void {
    this.formConfiguration = {
      formElements: {
        rows: [
          {
            elements: [
              {
                class: 'form-group col-sm-12',
                label: 'Email',
                name: 'email',
                type: 'text',
                required: true,
                value: '',
                autoComplete: 'email',
                requiredErrorLabel: 'Email required'
              }
            ]
          },
          {
            elements: [
              {
                class: 'form-group col-sm-12',
                label: 'Password',
                name: 'password',
                type: 'password-any',
                required: true,
                value: '',
                autoComplete: 'off',
                requiredErrorLabel: 'Password required'
              }
            ]
          }
        ]
      },
      submitCTA: 'Sign In'
    };
  }

  clear() {
    this.error = undefined;
  }

  submit(form) {
    this.submitting = true;
    this.scholarshipService
      .login(form.value)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (response: any) => {
          if (response.token) {
            window.localStorage.setItem(this.constants.storageKey, response.token);
            this.success = true;
            const intendedScholarship = window.sessionStorage.getItem(this.constants.intendedScholarshipKey);
            if (intendedScholarship) {
              this.router.navigate([`/${intendedScholarship}/application`], { queryParamsHandling: 'preserve' }).then(() => {
                this.scholarshipService.setApplicant(response.applicant);
              });
              window.sessionStorage.removeItem(this.constants.intendedScholarshipKey);
            } else {
              this.requestLoginReload.emit(true);
              this.scholarshipService.setApplicant(response.applicant);
              this.submitting = false;
            }
          } else {
            this.applicant = false;
            if (response.error) {
              this.error = response.error;
              this.submitting = false;
              this.toastr.error(response.error, 'Error!');
            }
          }
        },
        (error: HttpErrorResponse) => {
          this.error = error.message;
        }
      );
  }

  setToSignIn(event) {
    event.preventDefault();
    this.changeToSignIn.emit(true);
  }

  forgotPassword(event) {
    event.preventDefault();
    this.modalService.open(ForgotPasswordComponent);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
