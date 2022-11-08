import {ConfirmationService} from 'primeng/api';
import {Component, OnInit} from '@angular/core';
import {AlertMessageMailList, AlertSubjectList} from '../../../dto/alert/alert.dtos';
import {AlertService} from '../../../services/dto-services/alert-services/alert.services';
import {UtilitiesService} from '../../../services/utilities.service';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { Subscription } from 'rxjs';

/**
 * Created by reis on 30.10.2018.
 */
@Component({
  selector: 'alert-message-settings',
  templateUrl: './alert-message-settings.component.html',
  styles: [],
  providers: [ConfirmationService]
})
export class AlertMessageSettingsComponent implements OnInit {


  display: boolean;
  alertSubjectList: AlertSubjectList[] = [];
  alertSubjectId;
  alertSubjectTitle = '';
  emailList: AlertMessageMailList[];
  updateEmailList: AlertMessageMailList[] = [];
  selectedPlant: any;
  sub: Subscription;

  constructor(private alertService: AlertService, private appStateService: AppStateService, private utilities: UtilitiesService) {
  }

  ngOnInit() {
    this.getAlertSubjectList();

    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if(res) {
        this.selectedPlant = res;
      }
    });
  }

  


  getAlertSubjectList() {
    this.alertService.getAlertMessageSubjectList().then(res => {
      this.alertSubjectList = res as AlertSubjectList[];

    }).catch(e => {
      this.utilities.showErrorToast(e);
    });
  }

  getAlertEmployeeList(id) {
    this.emailList = [];
    this.alertService.getAlertEmailList(id).then(res => {
      this.emailList = res as AlertMessageMailList[];
      if (this.emailList.length !== 0) {
      }

    }).catch(e => {
      this.utilities.showErrorToast(e);
    });
  }

  showMailSettings(id, title) {
    this.emailList = [];
    this.display = true;
    this.alertSubjectId = id;
    this.alertSubjectTitle = title;
    this.getAlertEmployeeList(id);
  }

  setActive(id) {
    const data = [{
      active: this.alertSubjectList[id].active,
      alertMessageSubjectId: this.alertSubjectList[id].alertMessageSubjectId,
      plantId: this.selectedPlant?.plantId
    }];
    this.alertService.updateAlertMessageSubject(data).then(r => {
      this.utilities.showSuccessToast('activation-change-success');
    }).catch(e => {
      this.utilities.showErrorToast(e);
    });
  }

  saveEmailList() {
    this.updateEmailList = [];
    console.log(this.emailList);
    this.emailList.forEach((item) => {
      if (item.eMail) {
        this.updateEmailList.push({
          'alertEmployeeId': null,
          'eMail': item.eMail,
          'alertMessageSubjectId': this.alertSubjectId
        });
      }
    });


    console.log(this.updateEmailList);
    this.alertService.saveAlertSettings(this.updateEmailList).then(r => {
      this.utilities.showSuccessToast('alert-message-mail-list-saved-success');
      this.display = false;

    }).catch(e => {
      this.utilities.showErrorToast(e);
      this.display = false;
    });
  }

  addColumn() {
    this.emailList.push(new AlertMessageMailList());
  }

  delete(index) {
    this.emailList.splice(index, 1);
  }

}
