import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { ScholarshipService } from '../../../app.service';
import { ConfirmService } from '../../../shared/components/confirm/confirm.service';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-third-party-upload',
  templateUrl: './third-party-upload.component.html',
  styleUrls: ['./third-party-upload.component.scss']
})
export class ThirdPartyUploadComponent implements OnInit {

  program: any;
  request: any;
  accepts: string;
  fileTypeRestriction: string;
  fileUploads: any[] = [];
  submitting: boolean;
  applicationID: string;
  miniProfileConfig: any = {
    includeEmail: true,
    includePhone: true,
    includeAppellations: true,
    imageSize: 'medium',
    activeLinks: true
  };
  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private confirmService: ConfirmService,
    private scholarshipService: ScholarshipService
  ) { }

  ngOnInit(): void {
    this.route.data.pipe(takeUntil(this.unsubscribe)).subscribe(
      (response: any) => {
        if (response.data.program && response.data.request) {
          this.program = response.data.program;
          this.request = response.data.request;

          switch (this.request.fileTypeRestriction) {
            case 'image-pdf':
              this.accepts = 'Images (JPG/PNG) & PDFs only';
              this.fileTypeRestriction = 'image/jpeg,image/png,application/pdf';
              break;
            case 'images':
              this.accepts = 'Images only (JPG/PNG)';
              this.fileTypeRestriction = 'image/jpeg,image/png';
              break;
            case 'pdf':
              this.accepts = 'PDFs only';
              this.fileTypeRestriction = 'application/pdf';
              break;
            default:
              this.accepts = 'Any file type';
              this.fileTypeRestriction = '';
          }
        } else {
          this.redirectToMainSite();
        }
      }, () => {
        this.redirectToMainSite();
      }
    );

    this.route.params.pipe(takeUntil(this.unsubscribe)).subscribe((params) => {
      this.applicationID = params['applicationID'];
    });
  }

  async uploadFile(upload: any) {
    await this.processUpload(upload.target.files[0]);
  }

  processUpload(file) {
    return new Promise((resolve) => {
      const selectedFile = <File>file,
        formData = new FormData(),
        fileUpload = {
          name: selectedFile.name,
          uploadProgress: {}
        };

      formData.append('file', selectedFile);
      formData.append('fileUploadName', selectedFile.name);

      this.fileUploads.push(fileUpload);
      this.submitting = true;
      this.scholarshipService
        .uploadFileByThirdParty(
          this.program.url,
          this.program.scholarshipURL,
          this.applicationID,
          this.request.requestID,
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
                if (event.ok && event.body.thirdPartyUpload) {
                  if (event.body.thirdPartyUpload.error) {
                    this.toastr.error(event.body.thirdPartyUpload.error, 'Error!');
                    return;
                  }

                  this.request.thirdPartyUploads.push(event.body.thirdPartyUpload);

                  this.toastr.success('File has been attached to the application. Continue to upload or you may close this window.', 'Success!', {
                    positionClass: 'toast-top-right',
                    timeOut: 10000
                 });
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
          this.fileUploads.splice(this.fileUploads.indexOf(fileUpload), 1);
          this.submitting = false;
          const input = document.querySelector('#upload') as HTMLButtonElement;
          input.value = null;
          resolve(null);
        });
    });
  }

  removeFile(file) {
    this.confirmService.confirm('Remove this file?', () => {
      this.submitting = true;
      file.removing = true;
      this.scholarshipService
        .removeFileByThirdParty(
          this.program.url,
          this.program.scholarshipURL,
          this.applicationID,
          this.request.requestID,
          file
        )
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          (event: any) => {
            this.request.thirdPartyUploads.splice(
              this.request.thirdPartyUploads.indexOf(file),
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
    });
  }

  redirectToMainSite() {
    window.location.href = 'https://cpjam.com';
  }
}
