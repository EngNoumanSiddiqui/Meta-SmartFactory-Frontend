import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { DialogObjectDto, DialogTypeEnum } from './dialog-types.enum';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private emitloaderStateChangeSrc = new BehaviorSubject<boolean>(false);
  private emitloaderStateChangeMessage = new BehaviorSubject<string>('');
  private _isLoading = false;
  loadingMessage?: string = '';
  private emitDialogSrc = new Subject<DialogObjectDto>();
  private emitDialogHide = new Subject<DialogTypeEnum>();
  subscriberDialog$ = this.emitDialogSrc.asObservable();
  subscriberDialogHide$ = this.emitDialogHide.asObservable();
  subscriber$ = this.emitloaderStateChangeSrc.asObservable();
  subscriberMessage$ = this.emitloaderStateChangeMessage.asObservable();
  constructor() {
  }

  public showLoader(message?: string) {
    this._isLoading = true;
    this.loadingMessage = message;
    this.emitloaderStateChangeMessage.next(message);
    this.emitloaderStateChangeSrc.next(true);
  }

  public hideLoader() {
    this._isLoading = false;
    this.emitloaderStateChangeSrc.next(false);
  }

  public isLoading() {
    return this._isLoading;
  }

  public showDetailDialog(dialogType: DialogTypeEnum, uniqueId, extraProps?: any) {
    const data: DialogObjectDto = { dialogType: dialogType, uniqueId: uniqueId, extraProps: extraProps };
    this.emitDialogSrc.next(data);
  }

  public hideDetailDialog(dialogType: DialogTypeEnum) {
    this.emitDialogHide.next(dialogType);
  }

}
