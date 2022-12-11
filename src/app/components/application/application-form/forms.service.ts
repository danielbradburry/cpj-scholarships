import { Injectable } from '@angular/core';
import { ConstantsService } from '../../../shared/services/constants.service';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators
} from '@angular/forms';
import * as moment from 'moment';

@Injectable()
export class FormsService {
  constructor(
    private constants: ConstantsService,
    private ngbDateParserFormatter: NgbDateParserFormatter
  ) {}

  public createFormGroup(source) {
    var self = this,
      construct = {};

    source.forEach(function (property) {
      construct[property.name] = createControl(property);
    });

    return new UntypedFormGroup(construct);

    function createControl(source) {
      var construct,
        types = {
          heading: function () {
            return [];
          },
          paragraph: function () {
            return [];
          },
          hidden: function () {
            return [];
          },
          text: function () {
            return [];
          },
          number: function () {
            return [];
          },
          textarea: function () {
            return [];
          },
          select: function () {
            return [];
          },
          checkbox: function () {
            return [];
          },
          date: function () {
            return [];
          },
          email: function () {
            return [Validators.pattern(self.constants.emailRegExp)];
          },
          password: function () {
            return [Validators.pattern(self.constants.passwordRegExp)];
          },
          'password-any': function () {
            return [];
          },
          website: function () {
            return [Validators.pattern(self.constants.httpRegExp)];
          },
          phone: function () {
            return [Validators.pattern(self.constants.phoneRegExp)];
          },
          ssn: function () {
            return [Validators.pattern(self.constants.ssnRegExp)];
          }
        };

      construct = types[source.type]();
      if (source.required) {
        construct.push(Validators.required);
      }

      if (source.type === 'date') {
        source.value = moment(source.value, 'YYYY-MM-DD').format('MM-DD-YYYY');
        source.value = self.ngbDateParserFormatter.parse(source.value);
      }

      return new UntypedFormControl(source.value, {
        validators: construct
      });
    }
  }

  prepareFormGroupValues(formGroup) {
    for (let property in formGroup.value) {
      if (
        typeof formGroup.value[property] === 'object' &&
        formGroup.value[property]
      ) {
        let keys = Object.keys(property);

        if (
          keys.indexOf('month') !== 1 &&
          keys.indexOf('day') !== 1 &&
          keys.indexOf('year') !== 1
        ) {
          formGroup.value[property] = this.convertValueToDate(
            formGroup.value[property]
          );
        }
      }
      if (typeof formGroup.value[property] === 'number') {
        formGroup.value[property] = formGroup.value[property].toString();
      }

      formGroup.value[property] =
        formGroup.value[property] !== null ? formGroup.value[property] : '';
    }

    return formGroup;
  }

  private convertValueToDate(value) {
    value = this.ngbDateParserFormatter.format(value);
    return moment(value, 'MM-DD-YYYY').format('YYYY-MM-DD');
  }
}
