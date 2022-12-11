import { Component, OnInit } from '@angular/core';
import { ScholarshipService } from '../../app.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  program: any;
  applicant: any;
  miniProfileConfig: any = {
    includeEmail: true,
    includePhone: true,
    includeAppellations: true,
    imageSize: 'medium',
    activeLinks: true
  };
  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private scholarshipService: ScholarshipService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.scholarshipService.currentProgram
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        this.program = data;
      });

    this.scholarshipService.currentApplicant
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        this.applicant = data;
      });

    this.route.data.pipe(takeUntil(this.unsubscribe)).subscribe(
      (response: any) => {
        if (response.data.program) {
          this.scholarshipService.setProgram(response.data.program);
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

  redirectToMainSite() {
    window.location.href = 'https://cpjam.com';
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
