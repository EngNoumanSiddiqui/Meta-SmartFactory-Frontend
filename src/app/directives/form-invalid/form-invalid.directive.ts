import { Directive, HostListener, ElementRef } from '@angular/core';
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[focusInvalidInput]'
})
export class CustomFormDirective {

  constructor(private el: ElementRef) { }

  @HostListener('submit')
  onFormSubmit() {
    const invalidControl = this.el.nativeElement.querySelector('.ng-invalid');

    if (invalidControl) {
      invalidControl.focus();  
    }
  }
}
