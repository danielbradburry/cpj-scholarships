import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ScholarshipService } from '../../../../app.service';
import { ConfirmService } from '../../../../shared/components/confirm/confirm.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'third-party',
  templateUrl: './third-party.component.html',
  styleUrls: ['./third-party.component.scss']
})
export class ThirdPartyComponent implements OnInit {
  scholarship: any;
  program: any;
  application: any;
  formConfiguration: any;
  submitting: boolean;
  email: string = '';
  @Input() folder: any;
  @Input() applicationID: string;
  @Output() updatedRequests: EventEmitter<any> = new EventEmitter();
  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private confirmService: ConfirmService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private scholarshipService: ScholarshipService
  ) {}

  ngOnInit() {
    this.scholarshipService.currentApplication
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        this.application = data;
      });

    this.scholarshipService.currentProgram
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        this.program = data;
      });

    this.scholarshipService.currentScholarship
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        this.scholarship = data;
      });

    this.formConfiguration = {
      formElements: {
        rows: [
          {
            elements: [
              {
                class: 'form-group col-sm-12',
                label: 'Send Upload Submission Request To:',
                name: 'email',
                type: 'email',
                required: true,
                value: this.email,
                requiredErrorLabel: 'Email required',
                patternErrorLabel: 'Valid email required'
              }
            ]
          }
        ]
      },
      submitCTA: 'Send'
    };
  }

  createRequest(form) {
    this.submitting = true;

    this.scholarshipService
      .createThirdPartySubmissionRequest(this.program.url, this.scholarship.url, this.application.applicationID, this.folder.documentFolderID, form.value)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (response: any) => {
          if (response.valid) {
            this.toastr.success('Request for online submission sent.', 'Success!');
            this.folder.thirdPartySubmissionRequests.push(response.request);
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
        form.reset();
        this.email = '';
      });
  }

  removeRequest(request) {
    this.confirmService.confirm('Remove this online submission request? This action will also delete any files uploaded by the requestee and is irreversible.', () => {
      const index = this.folder.thirdPartySubmissionRequests.findIndex((submissionRequest) => {
        return request.requestID = submissionRequest.requestID;
      });

      this.scholarshipService
      .removeThirdPartySubmissionRequest(this.program.url, this.scholarship.url, this.application.applicationID, this.folder.documentFolderID, request.requestID)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (response: any) => {
          if (response.valid) {
            this.toastr.success('Changes saved', 'Success!');
            this.folder.thirdPartySubmissionRequests.splice(index, 1);
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
    });
  }

  copyLink(request) {
    navigator.clipboard.writeText(request.url).then(() => {
      this.toastr.success(
        'The link URL has been copied to your clipboard.',
        'Link Copied!'
      );
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
