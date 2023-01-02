import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ScholarshipService } from '../../app.service';
import { ConfirmService } from '../../shared/components/confirm/confirm.service';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { FormsService } from './application-form/forms.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {
  scholarship: any;
  program: any;
  currentStep: any;
  currentStepIndex: number = 0;
  fileUploads: any[] = [];
  progressAdjustment: string;
  applicant: any;
  application: any;
  submitting: boolean;
  removing: boolean;
  math: any = Math;
  private unsubscribe: Subject<void> = new Subject();
  constructor(
    private scholarshipService: ScholarshipService,
    private toastr: ToastrService,
    private formsService: FormsService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmService: ConfirmService,
    private sanitized: DomSanitizer
  ) {}

  ngOnInit() {
    this.scholarshipService.currentApplicant
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        this.applicant = data;
      });

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

    this.route.data.pipe(takeUntil(this.unsubscribe)).subscribe(
      (response: any) => {
        if (response.data.program && response.data.scholarship) {
          this.scholarshipService.setProgram(response.data.program);
          this.scholarshipService.setScholarship(response.data.scholarship);
          this.scholarshipService.setApplication(response.data.application);
          if (
            !response.data?.application?.applicationID ||
            !this.scholarship.isOpen
          ) {
            this.router.navigate([`/${this.scholarship.url}`], {
              queryParamsHandling: 'preserve'
            });
          }
          this.scholarship.steps.forEach((step) => {
            if (step.form) {
              step.formGroup = this.formsService.createFormGroup(
                step.form.applicationFormQuestions
              );
            }
          });
          this.scholarship.requirements =
            this.sanitized.bypassSecurityTrustHtml(
              this.scholarship.requirements
            );
          this.scholarship.steps.push({
            name: 'Review & Submit'
          });
          this.currentStep = this.scholarship.steps[this.currentStepIndex];
          this.calculateVisualStatus();
        } else {
          this.redirectToMainSite();
        }

        if (response.data.applicant) {
          this.scholarshipService.setApplicant(response.data.applicant);
        }
      },
      () => {
        this.redirectToMainSite();
      }
    );
  }

  goLeft() {
    this.goLeftFn();
  }

  goLeftFn() {
    if (this.currentStepIndex === 0) {
      return;
    }
    this.changeCurrentStep(this.currentStepIndex - 1);
  }

  goRight() {
    if (this.currentStep.form) {
      const continueButton = document.querySelector(
        '#applicationFormSubmit'
      ) as HTMLElement;
      continueButton.click();
    } else {
      this.goRightFn();
    }

    const goRightButton = document.querySelector(
      '#go-right'
    ) as HTMLElement;
    goRightButton.blur();
  }

  goRightFn() {
    if (this.currentStepIndex === this.scholarship.steps.length - 1) {
      return;
    }
    this.changeCurrentStep(this.currentStepIndex + 1);
  }

  saveForLater() {
    this.submitting = true;
    if (this.currentStep.form) {
      const finishLaterButton = document.querySelector(
        '#applicationFormFinishLater'
      ) as HTMLButtonElement;
      finishLaterButton.disabled = false;
      finishLaterButton.click();
    } else {
      this.router.navigate(['/'], { queryParamsHandling: 'preserve' });
    }
  }

  goToStep(event) {
    this.changeCurrentStep(event);
  }

  changeCurrentStep(index) {
    this.currentStepIndex = index;
    this.currentStep = this.scholarship.steps[index];
    this.calculateVisualStatus();
  }

  calculateVisualStatus() {
    if (this.currentStepIndex === 0) {
      this.progressAdjustment = 'calc(100% - 20px)';
      return;
    }
    if (this.currentStepIndex === this.scholarship.steps.length - 1) {
      this.progressAdjustment = '0';
      return;
    }
    this.progressAdjustment = `calc(${
      100 -
      Math.round(
        (this.currentStepIndex / (this.scholarship.steps.length - 1)) * 100
      ) +
      '%'
    } - 10px)`;
  }

  uploadFile(file) {
    const selectedFile = <File>file,
      formData = new FormData(),
      fileUpload = {
        name: null,
        uploadProgress: {}
      };

    formData.append('file', selectedFile);
    formData.append('fileUploadName', selectedFile.name);

    this.fileUploads.push(fileUpload);

    this.submitting = true;
    this.scholarshipService
      .uploadFile(
        this.program.url,
        this.scholarship.url,
        this.application.applicationID,
        this.currentStep.folder.documentFolderID,
        formData
      )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            fileUpload.uploadProgress = event;
          } else if (event.type === HttpEventType.Response) {
            fileUpload.uploadProgress = null;
            if (event.body.error) {
              this.toastr.error(event.body.error, 'Error!');
            } else {
              if (event.ok && event.body.applicationUpload) {
                if (event.body.applicationUpload.error) {
                  this.toastr.error(
                    event.body.applicationUpload.error,
                    'Error!'
                  );
                  return;
                }

                this.currentStep.folder.applicationUploads.push(
                  event.body.applicationUpload
                );
              } else {
                this.toastr.error('File failed to upload', 'Error!');
              }
            }
          }
        },
        (error: HttpErrorResponse) => {
          this.toastr.error(error.message, 'Error!');
        }
      )
      .add(() => {
        this.submitting = false;
        this.fileUploads.splice(this.fileUploads.indexOf(fileUpload), 1);
        const input = document.querySelector('#upload') as HTMLButtonElement;
        input.value = null;
      });
  }

  removeFile(file) {
    this.submitting = true;
    file.removing = true;
    this.scholarshipService
      .removeFile(
        this.program.url,
        this.scholarship.url,
        this.application.applicationID,
        this.currentStep.folder.documentFolderID,
        file
      )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (event: any) => {
          this.currentStep.folder.applicationUploads.splice(
            this.currentStep.folder.applicationUploads.indexOf(file),
            1
          );
          this.toastr.success('File removed', 'Success!');
        },
        (error: HttpErrorResponse) => {
          this.toastr.error(error.message, 'Error!');
        }
      )
      .add(() => {
        this.submitting = false;
        file.removing = false;
      });
  }

  submitForm(form) {
    this.submitting = true;

    for (let property in form.value) {
      this.currentStep.form.applicationFormQuestions.filter((question) => {
        return question.name === property;
      })[0].value = form.value[property];
    }

    this.scholarshipService
      .updateFormResponse(
        this.program.url,
        this.scholarship.url,
        this.application.applicationID,
        this.currentStep.form.applicationFormID,
        {
          applicationForm: form.value,
          questions: this.currentStep.form.applicationFormQuestions
        }
      )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (response: any) => {
          if (response.valid) {
            this.goRightFn();
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

  finishLater(form) {
    this.submitting = true;

    for (let property in form.value) {
      this.currentStep.form.applicationFormQuestions.filter((question) => {
        return question.name === property;
      })[0].value = form.value[property];
    }

    this.scholarshipService
      .updateFormResponse(
        this.program.url,
        this.scholarship.url,
        this.application.applicationID,
        this.currentStep.form.applicationFormID,
        {
          applicationForm: form.value,
          questions: this.currentStep.form.applicationFormQuestions
        }
      )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (response: any) => {
          if (response.valid) {
            this.router.navigate(['/'], { queryParamsHandling: 'preserve' });
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

  finalSubmit() {
    this.confirmService.confirm(
      'Warning: Submitting your application is final and the information cannot be altered after this is done. Are you sure?',
      () => {
        this.submitting = true;

        this.scholarshipService
          .submitApplication(this.program.url, this.scholarship.url, this.application.applicationID)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(
            (response: any) => {
              if (response.valid) {
                this.router.navigate(['/'], {
                  queryParamsHandling: 'preserve'
                });
                this.toastr.success(
                  'Your application has been submitted.',
                  'Success!'
                );
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
    );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  redirectToMainSite() {
    window.location.href = 'https://cpjam.com';
  }
}
