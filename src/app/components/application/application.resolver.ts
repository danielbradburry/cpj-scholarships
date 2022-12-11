import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { ScholarshipService } from '../../app.service';
import { environment } from '../../../environments/environment';
import { of, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ApplicationResolver implements Resolve<any> {
  private unsubscribe: Subject<void> = new Subject();
  constructor(private scholarshipService: ScholarshipService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const scholarshipProgramKey = this.getScholarshipKey(route);

    return this.scholarshipService.getScholarshipApplication(scholarshipProgramKey, route.params['scholarshipURL']).pipe(
      catchError((error) => {
        if (error.status === 404) {
          window.location.href = 'https://cpjam.com';
        } else {
          return of(null);
        }
      })
    );
  }

  getScholarshipKey(route) {
    if (environment.production) {
      const parts = window.location.hostname.split('.');
      if (parts.length === 4 && window.location.hostname.includes('.scholarships.cpjam.com')) {
        return parts[0];
      }
    } else {
      return route.queryParams['scholarshipKey'] || false;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
