import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ApplicationReviewComponent implements OnInit {
  steps: any[];
  @Input() scholarship: any;
  @Input() submitting: boolean;
  @Output() stepChanged: EventEmitter<any> = new EventEmitter();
  @Output() submit: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    this.steps = this.scholarship.steps.slice(0, (this.scholarship.steps.length - 1));
  }

  goToStep(index) {
    this.stepChanged.emit(index);
  }

  submitFn() {
    this.submit.emit(true);
  }
}
