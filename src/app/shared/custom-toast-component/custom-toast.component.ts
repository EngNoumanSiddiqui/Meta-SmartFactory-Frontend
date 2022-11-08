import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { Component } from '@angular/core';

import { Toast, ToastrService, ToastPackage, IndividualConfig} from 'ngx-toastr';

export interface IToastButton {
  id: string;
  title: string;
  action: () => void;
};

@Component({
  selector: '[custom-toast-component]',
  styleUrls: [`./custom-toast.component.scss`],
  templateUrl: `./custom-toast.component.html`,
  animations: [
    trigger('flyInOut', [
      state('inactive', style({
        opacity: 0,
      })),
      transition('inactive => active', animate('400ms ease-out', keyframes([
        style({
          opacity: 0,
        }),
        style({
          opacity: 1,
        }),
      ]))),
      transition('active => removed', animate('400ms ease-out', keyframes([
        style({
          opacity: 1,
        }),
        style({
          opacity: 0,
        }),
      ]))),
    ]),
  ],
  preserveWhitespaces: false,
})
export class CustomToastComponent extends Toast {
  // used for demo purposes
  undoString = 'undo';

  // constructor is only necessary when not using AoT
  constructor(
    protected toastrService: ToastrService,
    public toastPackage: ToastPackage,
  ) {
    super(toastrService, toastPackage);
    console.log( toastPackage.toastType )
  }

  get buttons(): any[] {
    return (this.options as any).buttons;
  }

  action(btn: IToastButton) {
    event.stopPropagation();
    this.toastPackage.triggerAction(btn);
    this.toastrService.clear();
    return false;
  }
}
