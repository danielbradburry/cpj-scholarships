import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  action: any;
  fallback: any;
  statement: string;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {}

  executeAction() {
    if (typeof this.action === 'function') {
      this.action();
    }
  }

  fallbackAction() {
    if (typeof this.fallback === 'function') {
      this.fallback();
    }
  }
}
