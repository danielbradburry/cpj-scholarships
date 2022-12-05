import { Input, Output, Component, OnInit, EventEmitter } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'textarea-restrict',
  templateUrl: './textarea-restrict.component.html',
  styleUrls: ['./textarea-restrict.component.scss']
})
export class TextareaRestrictComponent implements OnInit {

  @Input() element: any;
  @Input() group: UntypedFormGroup;
  @Output() valueChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  words: number;
  value: string;
  overLimit: boolean;
  control: any;

  constructor() { }

  ngOnInit() {
    this.element.value = this.element.value || '';
    this.control = this.group.get(this.element.name);
    this.calculateLimits();
  }

  reportChange() {
    this.calculateLimits();
    this.valueChanged.emit(true);
  }

  calculateLimits() {
    if (this.element.maxWords) {
      this.words = this.control.value ? this.control.value.split(/[\s]+/).filter((e) => {
        return e.trim() !== "" && /[A-Za-z0-9]/.test(e);
      }).length : 0;
      this.overLimit = this.words > this.element.maxWords;

      let errors = this.control.errors || {};
      if (this.overLimit) {
        errors.overLimit = true;
      } else {
        delete errors.overLimit;
      }
      errors = (errors && Object.keys(errors).length === 0) ? null : errors;

      this.control.setErrors(errors);
    }
  }
}
