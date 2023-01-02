import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ScholarshipService } from '../../app.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  program: any;
  private unsubscribe: Subject<void> = new Subject();
  constructor(
    private scholarshipService: ScholarshipService,
    private route: ActivatedRoute,
    private sanitized: DomSanitizer
  ) {
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

    this.scholarshipService.currentProgram
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        this.program = data;
        if (this.program.enableHomePageContent) {
          this.program.homePageContent = this.sanitized.bypassSecurityTrustHtml(
            this.program.homePageContent
          );
        }
      });
  }

  ngOnInit() {}

  redirectToMainSite() {
    window.location.href = 'https://cpjam.com';
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
