import {Component, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {EmployeeService} from '../../../services/dto-services/employee/employee.service';
import {PasswordUpdateDto} from './password-update.dto';
import {Message} from 'primeng/api';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {UtilitiesService} from '../../../services/utilities.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent {
  msgs: Message[] = [];
   pwd: PasswordUpdateDto = new PasswordUpdateDto();
  rePassword;
  displayDialog = false;
  @ViewChild('myModal') public myModal: ModalDirective;

  constructor(private _empSvc: EmployeeService,
              private utilities: UtilitiesService,
              private _translateSvc: TranslateService) {

  }


  showDialog() {
    this.myModal.show();
  }

  private close() {
    this.myModal.hide();
  }

   save() {
    this._empSvc.changePassword(this.pwd)
      .then(() => this.utilities.showSuccessToast('PASSWORD_CHANGED'))
      .catch(err => this.utilities.showErrorToast(err));

  }

   cancel() {
    this.close();
    this.pwd = new PasswordUpdateDto();
  }

  /************************* TOASTR & PRIME NG Messages  *************************/
  // Prime NG Growl in other ways Toaster
  showMessage(severity: string, summary: string, detail: string) {
    this.cancel();
    this.msgs.push({
      severity: severity,
      summary: this._translateSvc.instant(summary),
      detail: this._translateSvc.instant(detail)
    });
    setTimeout(() => {
      this.clearMessage();

    }, 4000);
  }

  clearMessage() {
    this.msgs = [];
  }

  showError(error) {
    let mess = '';
    if (error.toString().indexOf('fieldErrors') > 0) {
      error = JSON.parse(error);
    }
    if (error['fieldErrors'] && error['fieldErrors'].length > 0) {
      for (const msg of error['fieldErrors']) {
        mess += this.msgs + '<strong>' + msg['field'].toString() + '</strong> :' + msg['message'].toString() + '</br>';
      }
      this.showMessage('error', 'error', mess);
    } else if (error['errorCode']) {
      this.showMessage('error', 'error', error['errorCode']);
    } else {
      this.showMessage('error', 'error', error);
    }
  }

}
