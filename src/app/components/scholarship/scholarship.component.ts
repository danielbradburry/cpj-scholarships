import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ReviewComponent } from '../../components/scholarship/review/review.component';
import { ScholarshipService } from '../../app.service';
import { ConstantsService } from '../../shared/services/constants.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-scholarship',
  templateUrl: './scholarship.component.html',
  styleUrls: ['./scholarship.component.scss']
})
export class ScholarshipComponent implements OnInit {
  scholarship: any;
  program: any;
  applicant: any;
  application: any;
  submitting: boolean;
  private unsubscribe: Subject<void> = new Subject();
  constructor(
    private scholarshipService: ScholarshipService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private constants: ConstantsService,
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

    this.route.data
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response: any) => {
        if (response.data.program && response.data.scholarship) {
          this.scholarshipService.setProgram(response.data.program);
          this.scholarshipService.setScholarship(response.data.scholarship);
          this.scholarship.requirements = this.scholarship.requirements ? this.sanitized.bypassSecurityTrustHtml(this.scholarship.requirements) : null;
        } else {
          this.redirectToMainSite();
        }

        if (response.data.applicant) {
          this.scholarshipService.setApplicant(response.data.applicant);
        }

        if (response.data.application) {
          this.scholarshipService.setApplication(response.data.application);
        }
      },
      () => {
        this.redirectToMainSite();
      });
  }

  register() {
    this.submitting = true;
    if (this.applicant) {
      if (this.application?.applicationID) {
        this.redirectToApplication();
      } else {
        this.scholarshipService.createApplication(this.program.url, this.scholarship.url)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe((response: any) => {
            if (response.valid) {
              this.redirectToApplication();
            } else {
              if (response.error) {
                this.toastr.error(response.error, 'Error!');
                this.submitting = false;
              }
            }
          },
          (error: HttpErrorResponse) => {
            this.toastr.error(error.message, 'Error!');
            this.submitting = false;
          });
        }
    } else {
      window.sessionStorage.setItem(this.constants.intendedScholarshipKey, this.scholarship.url);
      this.redirectToAccount();
    }
  }

  redirectToAccount() {
    this.router.navigate([`/account`], { queryParamsHandling: 'preserve' });
  }

  redirectToApplication() {
    this.router.navigate([`/${this.scholarship.url}/application`], { queryParamsHandling: 'preserve' });
  }

  redirectToMainSite() {
    window.location.href = 'https://cpjam.com';
  }

  viewApplication() {
    const ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false
    },
    modalRef = this.modalService.open(ReviewComponent, ngbModalOptions);
    modalRef.componentInstance.scholarshipURL = this.scholarship.url;
    modalRef.componentInstance.scholarshipProgramURL = this.program.url;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
