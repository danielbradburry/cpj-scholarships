import { Component, OnInit, Input } from '@angular/core';
import { ScholarshipService } from '../../app.service';
import { ConstantsService } from '../../shared/services/constants.service';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'scholarship-heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.scss']
})
export class ScholarshipHeadingComponent implements OnInit {
  @Input() program: any;
  @Input() active: number;
  user: any;
  applicant: any;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private constants: ConstantsService,
    private scholarshipService: ScholarshipService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.scholarshipService.currentApplicant.pipe(takeUntil(this.unsubscribe)).subscribe((applicant) => {
      this.applicant = applicant;
    });
  }

  logout(event) {
    event.preventDefault();

    const token = window.localStorage.getItem(this.constants.storageKey);
    if (token) {
      this.scholarshipService.logout({ token }).subscribe(
        (response: any) => {
          this.uiLoginProcess();
        },
        (error: HttpErrorResponse) => {
          this.toastr.error(error.message, 'Error!');
        }
      );
    } else {
      this.uiLoginProcess();
    }
  }

  uiLoginProcess() {
    window.localStorage.removeItem(this.constants.storageKey);
    this.router.navigate(['/'], { queryParamsHandling: 'preserve' }).then(() => {
      this.scholarshipService.setApplicant(null);
    });
    this.toastr.success('You have been logged out of the system', 'Success!');
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
