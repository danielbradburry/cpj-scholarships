import { Component, OnInit, ComponentFactoryResolver, ViewChild, AfterViewInit } from '@angular/core';
import { ScholarshipService } from '../../app.service';
import { ViewRefDirective } from '../../shared/directives/view-ref.directive';
import { ChangePasswordComponent } from './password/password.component';
import { MyScholarshipsComponent } from './my-scholarships/my-scholarships.component';
import { UpdateApplicantComponent } from './update-applicant/update-applicant.component';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit, AfterViewInit {
  program: any;
  applicant: any;
  state: string;
  currentComponent: any;
  reloading: boolean;
  scholarshipKeyQueryParam: string;
  private unsubscribe: Subject<void> = new Subject();
  @ViewChild(ViewRefDirective) vref: any;
  tabs: any[] = [{
    label: 'My Scholarship Applications',
    component: MyScholarshipsComponent
  }, {
    label: 'Update My Information',
    component: UpdateApplicantComponent
  }, {
    label: 'Change Password',
    component: ChangePasswordComponent
  }];

  constructor(
    private route: ActivatedRoute,
    private scholarshipService: ScholarshipService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngOnInit(): void {
    this.state = 'login';

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

    this.route.data
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response: any) => {
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
      });

    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.scholarshipKeyQueryParam = params.scholarshipKey;
      });
  }

  ngAfterViewInit() {
    this.scholarshipService.currentApplicant
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((applicant) => {
        this.applicant = applicant;
        if (applicant && !this.currentComponent) {
          setTimeout(() => {
            this.changeComponent(this.tabs[0]);
          }, 0)
        }
        if (!applicant) {
          this.currentComponent = null;
        }
      });
  }

  changeComponent(tab) {
    this.tabs.map((tab) => {
      tab.active = false;
    });
    tab.active = true;
    this.vref.viewContainerRef.clear();
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(tab.component);
    let componentRef = this.vref.viewContainerRef.createComponent(componentFactory);
    componentRef.instance.applicant = this.applicant;
    componentRef.instance.reloading = this.reloading;
    componentRef.instance.scholarships = this.program.scholarships.filter((scholarship) => {
      return scholarship.status !== 'not-started';
    });
    componentRef.instance.submitted
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.changeComponent(this.tabs[0]);
      });
  }

  changeToLogIn() {
    this.state = 'login';
  }

  changeToSignIn() {
    this.state = 'signin';
  }

  requestLoginReload() {
    this.reloading = true;
    const scholarshipProgramKey = this.getScholarshipKey();
      
    this.scholarshipService.getScholarshipProgramForView(scholarshipProgramKey)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response: any) => {
        setTimeout(() => {
          if (response.program) {
            this.scholarshipService.setProgram(response.program);
          } 
          if (response.applicant) {
            this.scholarshipService.setApplicant(response.applicant);
          }
        }, 0);
      }, () => {
      })
      .add(() => {
        this.reloading = false;
      });
  }

  getScholarshipKey() {
    if (environment.production) {
      const parts = window.location.hostname.split('.');
      if (parts.length === 4 && window.location.hostname.includes('.scholarships.cpjam.com')) {
        return parts[0];
      }
    } else {
      return this.scholarshipKeyQueryParam || false;
    }
  }

  redirectToMainSite() {
    window.location.href = 'https://cpjam.com';
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
