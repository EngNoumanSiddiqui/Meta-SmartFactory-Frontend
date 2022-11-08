import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import domtoimage from 'dom-to-image';
import {LoaderService} from './shared/loader.service';
import {IToastButton} from '../shared/custom-toast-component/custom-toast.component';
import { AppStateService } from './dto-services/app-state.service';


@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  private UTC;

  // Last request json, for user to copy/save
  lastErrorRequest = null;

  constructor(private appState: AppStateService, private translateService: TranslateService, private toastService: ToastrService, private loaderService: LoaderService) {
    const date = new Date();
    this.UTC = (date.getTimezoneOffset() / 60) * (-1);

  }

  exportAsPng(printSectionId: string, filename = 'my-image-name.jpeg', message = 'export-as-png-success') {
    this.loaderService.showLoader();
    const node = document.getElementById(printSectionId);
    const me = this;
    domtoimage.toJpeg(node, {quality: 1})
      .then(function (dataUrl) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        me.showSuccessToast(message);
        link.click();
        this.loaderService.hideLoader();
      }).catch(err => {
        console.log('@error', err)
      // me.showErrorToast('something-went-wrong');
      this.loaderService.hideLoader();
    });
  }
  exportAsPdf(printSectionId: string) {
    let popupWinindow;
    const innerContents = document.getElementById(printSectionId).innerHTML;
    popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
    popupWinindow.document.open();
    popupWinindow.document.write('<html><head> <link rel="stylesheet" href="styles.css"></head><body onload="window.print()">' + innerContents + '</html>');
    popupWinindow.document.close();
  }
  changeLocaleStartDate(date) {
    const newDate = new Date(date);
    newDate.setHours(0);
    newDate.setMinutes(0);
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);
    return newDate;
  }
  showSuccessToast(message) {
    this.translateService.get(message).subscribe(translate => {
      this.toastService.success(translate);
    });
  }
  showErrorToast(error, title?) {


    // If there is last request json, show action buttons
    if ( this.lastErrorRequest ) {
      const actionButtons: IToastButton[] = [
        {
          id: 'copy',
          title: 'copy',
          action: () => {
            this.appState.copyToClipBoard(this.lastErrorRequest);
            this.showSuccessToast('Copied to clip board');
          }
        },
        {
          id: 'save',
          title: 'save',
          action: () => {
            const file = prompt('Enter File name');
            this.appState.saveTextAsFile( this.lastErrorRequest, file);
          }
        },
      ];

      this.showActionErrorToast( error, actionButtons );
      return;
    }

    let mess = '';
    if (error.toString().indexOf('fieldErrors') > 0) {
      error = JSON.parse(error);
    }
    if (error['fieldErrors'] && error['fieldErrors'].length > 0) {
      for (const msg of error['fieldErrors']) {
        mess += msg['field'].toString() + ':' + msg['message'].toString() + ',\n';
      }
    } else if (error['errorCode']) {
      mess = error['errorCode'];
    } else {
      mess = error;
    }
    if (!mess.length) {
      mess = 'error';
    }
    this.translateService.get(mess).subscribe(translate => {
      if (title) {
        this.toastService.error(translate, title);
      } else {
        this.toastService.error(translate);
      }
    });
  }

  showActionErrorToast(error, actionButtons: IToastButton[] ) {
    let mess = '';
    if (error.toString().indexOf('fieldErrors') > 0) {
      error = JSON.parse(error);
    }
    if (error['fieldErrors'] && error['fieldErrors'].length > 0) {
      for (const msg of error['fieldErrors']) {
        mess += msg['field'].toString() + ':' + msg['message'].toString() + ',\n';
      }
    } else if (error['errorCode']) {
      mess = error['errorCode'];
    } else {
      mess = error;
    }
    if (!mess.length) {
      mess = 'error';
    }
    const timeout = 5000;
    this.translateService.get(mess).subscribe(translate => {
        this.toastService.error(translate, null, {
          buttons: actionButtons,
          timeOut: timeout,
        } as any ).onHidden.subscribe({
          next: () => {
            // Clear last error request json object
            this.clearError();
          }
        })
    });
  }

  showWarningToast(message, title?) {
    this.translateService.get(message).subscribe(translate => {
      if (title) {
        this.translateService.get(title).toPromise().then(newtitle => {
          this.toastService.warning(translate, newtitle);
        });
      } else {
        this.toastService.warning(translate);
      }
    });
  }
  showInfoToast(message, title?) {
    this.translateService.get(message).subscribe(translate => {
      if (title) {
        this.toastService.info(translate, title);
      } else {
        this.toastService.info(translate);
      }
    });
  }

  clearError(): void {
    this.lastErrorRequest = null;
  }

}
