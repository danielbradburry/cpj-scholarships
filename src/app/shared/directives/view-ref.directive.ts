import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[view-ref]'
})
export class ViewRefDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
