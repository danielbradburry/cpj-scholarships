import { Pipe } from '@angular/core';

@Pipe({
  name: 'ssn',
  pure: false
})

export class SSNPipe {
  transform(value) {
    if (typeof value === 'undefined' || value === null) {
      return '';
    }
    if (typeof value !== 'string') {
      return value;
    }

    let indices = [{
      character: '-',
      placement: 6
    }, {
      character: '&bull;',
      placement: 5
    }, {
      character: '&bull;',
      placement: 4
    }, {
      character: '-',
      placement: 3
    }, {
      character: '&bull;',
      placement: 2
    }, {
      character: '&bull;',
      placement: 1
    }, {
      character: '&bull;',
      placement: 0
    }];
    
    value = value.trim().replace(/^\+/, '').replace(/[^0-9]/g, '').slice(0, 9);

    if (value.length === 0) {
      return value;
    }

    for (let i = 0; i < indices.length; i++) {
      value = this.insertCharacter(indices[i].character, value, indices[i].placement);
    }
    
    return value;
  }

  insertCharacter(char, str, index) {
    if (str.length < index) {
      return str;
    }

    return str.slice(0, index) + char + str.slice(index, str.length);
  }
}

