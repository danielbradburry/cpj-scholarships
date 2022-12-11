import { Injectable } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from './confirm.component';

@Injectable()
export class ConfirmService {
  constructor(private modalService: NgbModal) {}

  public confirm(statement, action, fallback?) {
    const ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false,
        centered: true
      },
      modalRef = this.modalService.open(ConfirmComponent, ngbModalOptions);

    modalRef.componentInstance.statement = statement;
    modalRef.componentInstance.action = action;
    modalRef.componentInstance.fallback = fallback;
  }
}
