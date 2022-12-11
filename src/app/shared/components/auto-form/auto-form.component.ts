import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FormsService } from '../../../components/application/application-form/forms.service';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmService } from '../../../shared/components/confirm/confirm.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'lodash';

@Component({
  selector: 'auto-form',
  templateUrl: './auto-form.component.html',
  styleUrls: ['./auto-form.component.scss']
})
export class AutoFormComponent implements OnInit {
  formGroup: UntypedFormGroup;
  formElements: any[];
  checkboxHandlers: any[] = [];
  selectHandlers: any[] = [];
  private intTypes: string[] = ['number', 'phone'];
  private unsubscribe: Subject<void> = new Subject();

  constructor(private formsService: FormsService, private ngbDateParserFormatter: NgbDateParserFormatter, private confirmService: ConfirmService) {}

  @Input() submitting: boolean;
  @Input() configuration: any;
  @Input() optionalDisable?: any;
  @Output() notifyParent: EventEmitter<any> = new EventEmitter();
  @Output() formSubmit: EventEmitter<any> = new EventEmitter();
  @Output() formCancel: EventEmitter<any> = new EventEmitter();
  @Output() formRemove: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    this.formElements = this.iterateElements(this.configuration.formElements);
    this.formGroup = this.formsService.createFormGroup(this.formElements);
    this.bindCheckboxHandlers();
    this.bindSelectHandlers();
  }

  iterateElements(obj) {
    if (obj && obj.hasOwnProperty('rows') && obj.rows) {
      let array = [];

      for (let i = 0; i < obj.rows.length; i++) {
        for (let j = 0; j < obj.rows[i].elements.length; j++) {
          array.push(obj.rows[i].elements[j]);
          if (this.intTypes.indexOf(obj.rows[i].elements[j].type) !== -1) {
            obj.rows[i].elements[j].value =
              !obj.rows[i].elements[j].value || obj.rows[i].elements[j].value.trim() === '' ? '' : parseInt(obj.rows[i].elements[j].value);
          }
          if (obj.rows[i].elements[j].type === 'checkbox') {
            this.checkboxHandlers.push(obj.rows[i].elements[j]);
          }
          if (obj.rows[i].elements[j].type === 'select') {
            this.selectHandlers.push(obj.rows[i].elements[j]);
          }
        }
      }

      return array;
    } else {
      return [];
    }
  }

  bindCheckboxHandlers() {
    for (let i = 0; i < this.checkboxHandlers.length; i++) {
      let handler = this.checkboxHandlers[i],
        handlerElement = this.formGroup.get(handler.name);

      if (handler.hide && handler.hide.length) {
        handlerElement.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((val) => {
          this.checkHide(val, handler.hide);
        });
        if (handlerElement.value) {
          this.checkHide(true, handler.hide);
        }
      }
      if (handler.disable && handler.disable.length) {
        handlerElement.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((val) => {
          this.checkDisable(val, handler.disable);
        });
        if (handlerElement.value) {
          this.checkDisable(true, handler.disable);
        }
      }
    }
  }

  bindSelectHandlers() {
    for (let i = 0; i < this.selectHandlers.length; i++) {
      let handler = this.selectHandlers[i],
        handlerElement = this.formGroup.get(handler.name);

      if (handler.hide && handler.hide.if && handler.hide.if.length) {
        handlerElement.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((val) => {
          this.checkHide(handler.hide.if.indexOf(val) !== -1, handler.hide.elements);
        });
        if (handler.hide.if.indexOf(handlerElement.value) !== -1) {
          this.checkHide(true, handler.hide.elements);
        }
      }
      if (handler.disable && handler.disable.if && handler.disable.if.length) {
        handlerElement.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((val) => {
          this.checkDisable(handler.disable.if.indexOf(val) !== -1, handler.disable.elements);
        });
        if (handler.disable.indexOf(handlerElement.value) !== -1) {
          this.checkDisable(true, handler.disable.elements);
        }
      }
    }
  }

  checkDisable(value, targetElements) {
    for (let i = 0; i < targetElements.length; i++) {
      let targetElement = targetElements[i] === null ? 'null' : targetElements[i],
        control = this.formGroup.get(targetElement);

      if (control) {
        value ? control.disable() : control.enable();
      }
    }
  }

  checkHide(value, targetElements) {
    for (let i = 0; i < targetElements.length; i++) {
      let targetElement = targetElements[i] === null ? 'null' : targetElements[i],
        control = this.formGroup.get(targetElement);

      if (control) {
        if (value) {
          this.formElements.filter((formElement) => {
            return formElement.name === targetElement;
          })[0].hidden = true;
          control.disable();
        } else {
          this.formElements.filter((formElement) => {
            return formElement.name === targetElement;
          })[0].hidden = undefined;
          control.enable();
        }
      }
    }
  }

  isInput(type) {
    return ['text', 'url-fragment', 'category-label', 'zipcode'].indexOf(type) !== -1;
  }

  submit() {
    this.formGroup = this.formsService.prepareFormGroupValues(this.formGroup);
    this.formSubmit.emit(this.formGroup);
    if (this.formGroup.value.password) {
      delay(() => {
        this.formGroup.controls.password.setValue('');
        this.formGroup.controls.password.reset();
      }, 500);
    }
  }

  cancel(event) {
    this.formCancel.emit(event);
  }

  remove(event, dialog) {
    this.confirmService.confirm(
      dialog,
      () => {
        this.formRemove.emit(event);
      },
      null
    );
  }

  notify(element) {
    if (element.requiresNotice) {
      this.notifyParent.emit({
        element: element,
        form: this.formGroup.value
      });
    }
  }

  convertValueToTimeStamp(value) {
    return new Date(this.ngbDateParserFormatter.format(value)).getTime();
  }

  convertDateAndTimeToTimeStamp(date, time) {
    return new Date(date + ' ' + time).getTime();
  }

  validateDateRanges(element) {
    if (element && element.fileUploadRange) {
      let minimumElement, maximumElement, maximumControl;

      if (element.fileUploadRange.minimum) {
        minimumElement = this.formGroup.get(element.fileUploadRange.minimum);
      }
      if (element.fileUploadRange.maximum) {
        maximumElement = this.formGroup.get(element.fileUploadRange.maximum);
        maximumControl = this.formGroup.controls[element.fileUploadRange.maximum];
      }

      let maximumControlErrors = maximumControl.errors || {};

      if (minimumElement !== null && maximumElement !== null) {
        let minValue = parseInt(minimumElement.value),
          maxValue = parseInt(maximumElement.value);

        if (!isNaN(minValue) && !isNaN(maxValue) && minValue > maxValue) {
          maximumControlErrors.lessThan = true;
        } else {
          delete maximumControlErrors.lessThan;
        }
      }

      maximumControlErrors = maximumControlErrors && Object.keys(maximumControlErrors).length === 0 ? null : maximumControlErrors;
      maximumControl.setErrors(maximumControlErrors);
    }
    if (element && element.dateElements) {
      let startDateElement, endDateElement, startDateControl, endDateControl, startTimeElement, endTimeElement;

      if (element.dateElements.startDate) {
        startDateElement = this.formGroup.get(element.dateElements.startDate);
        startDateControl = this.formGroup.controls[element.dateElements.startDate];
      }
      if (element.dateElements.endDate) {
        endDateElement = this.formGroup.get(element.dateElements.endDate);
        endDateControl = this.formGroup.controls[element.dateElements.endDate];
      }
      if (element.dateElements.startTime) {
        startTimeElement = this.formGroup.get(element.dateElements.startTime);
      }
      if (element.dateElements.endTime) {
        endTimeElement = this.formGroup.get(element.dateElements.endTime);
      }

      if (startDateElement !== null && endDateElement !== null) {
        let startTimestamp = startTimeElement
            ? this.convertDateAndTimeToTimeStamp(this.ngbDateParserFormatter.format(startDateElement.value), startTimeElement.value)
            : this.convertValueToTimeStamp(startDateElement.value),
          endTimestamp = endTimeElement
            ? this.convertDateAndTimeToTimeStamp(this.ngbDateParserFormatter.format(endDateElement.value), endTimeElement.value)
            : this.convertValueToTimeStamp(endDateElement.value),
          endControlErrors = endDateControl.errors || {};

        if (isNaN(startTimestamp) || isNaN(endTimestamp)) {
          return;
        }

        if (startTimestamp > endTimestamp) {
          endControlErrors.lessThan = true;
        } else {
          delete endControlErrors.lessThan;
        }

        if (element.dateElements.conflictsWith && !endControlErrors.lessThan) {
          let overlapConflict = element.dateElements.conflictsWith.some((timeframe) => {
              let compareStart = this.convertDateAndTimeToTimeStamp(timeframe.startDate, timeframe.startTime),
                compareEnd = this.convertDateAndTimeToTimeStamp(timeframe.endDate, timeframe.endTime);

              return (
                (startTimestamp > compareStart && startTimestamp < compareEnd) ||
                (endTimestamp > compareStart && endTimestamp < compareEnd) ||
                (compareStart > startTimestamp && compareStart < endTimestamp) ||
                (compareEnd > startTimestamp && compareEnd < endTimestamp)
              );
            }),
            startControlErrors = startDateControl.errors || {};

          if (overlapConflict) {
            startControlErrors.overlap = true;
            startDateControl.force = true;
          } else {
            delete startControlErrors.overlap;
          }

          startControlErrors = startControlErrors && Object.keys(startControlErrors).length === 0 ? null : startControlErrors;
          startDateControl.setErrors(startControlErrors);
        }

        endControlErrors = endControlErrors && Object.keys(endControlErrors).length === 0 ? null : endControlErrors;
        endDateControl.setErrors(endControlErrors);
      }
    }
  }

  validatePasswordsMatch(element) {
    let password, confirm, matchRequired, errors;

    if (element.mustMatch) {
      password = this.formGroup.get(element.name);
      confirm = this.formGroup.get(element.mustMatch);
      matchRequired = password !== null && confirm !== null;
    }
    if (matchRequired) {
      errors = this.formGroup.controls[element.name].errors || {};
      if (password.value !== confirm.value) {
        errors.mustMatch = true;
      } else {
        delete errors.mustMatch;
      }
      errors = errors && Object.keys(errors).length === 0 ? null : errors;

      this.formGroup.controls[element.name].setErrors(errors);
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
