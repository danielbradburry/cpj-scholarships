import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'my-scholarships',
  templateUrl: './my-scholarships.component.html',
  styleUrls: ['./my-scholarships.component.scss']
})
export class MyScholarshipsComponent implements OnInit {

  applicant: any;
  private unsubscribe: Subject<void> = new Subject();
  @Input() scholarships: any[];
  @Input() reloading: boolean;
  @Output() formSubmit: EventEmitter<any> = new EventEmitter();
  @Output() submitted: EventEmitter<any> = new EventEmitter();

  constructor(
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
