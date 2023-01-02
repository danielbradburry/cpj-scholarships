import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ScholarshipService } from '../../../app.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  submitting: boolean;
  formConfiguration: any;
  error: string;
  complete: boolean;
  program: any;
  private unsubscribe: Subject<void> = new Subject();

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private scholarshipService: ScholarshipService
  ) {}

  ngOnInit() {
    this.scholarshipService.currentProgram
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        this.program = data;
      });

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
                value: ''
              }
            ]
          }
        ]
      },
      submitCTA: 'Send'
    };
  }

  submit(form) {
    this.submitting = true;

    this.scholarshipService
      .resetPassword(this.program.url, form.value)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (response: any) => {
          if (response.valid) {
          } else {
            if (response.error) {
              this.error = response.error;
            }
          }
          this.complete = true;
          setTimeout(() => {
            this.activeModal.close();
          }, 2000);
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
