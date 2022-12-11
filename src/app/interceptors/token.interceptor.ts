import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { ConstantsService } from '../shared/services/constants.service';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public constants: ConstantsService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      headers: new HttpHeaders().set('X-Authorization', 'Bearer ' + window.localStorage.getItem(this.constants.storageKey))
    });

    return next.handle(request);
  }
}
