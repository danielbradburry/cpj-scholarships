import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ScholarshipService } from '../../../app.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

@Component({
  selector: 'application-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  scholarship: any;
  loading: boolean;
  @Input() scholarshipURL: string;
  @Input() scholarshipProgramURL: string;
  private unsubscribe: Subject<void> = new Subject();

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private scholarshipService: ScholarshipService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.scholarshipService
      .getScholarshipApplication(
        this.scholarshipProgramURL,
        this.scholarshipURL
      )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (response: any) => {
          if (response.error) {
            this.toastr.error(response.error, 'Error!');
            return;
          }
          if (response.valid) {
            this.scholarship = response.scholarship;
          }
        },
        (error: HttpErrorResponse) => {
          this.toastr.error(error.message, 'Error!');
        }
      )
      .add(() => {
        this.loading = false;
      });
  }

  castToDate(value) {
    return moment(value, 'YYYY-MM-DD').format('MM-DD-YYYY');
  }
}
