import {Component, EventEmitter, Input, OnInit, Output, AfterViewInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
 
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import {QualityReportTypeService} from 'app/services/dto-services/quality-report-type/quality-report-type.service'
import { environment } from 'environments/environment';

@Component({ 
  selector: 'edit-quality-report-type',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'] 
})
export class EditQualityReportType implements OnInit {

  @Input() plantId = null;
  qualityReportType = { 
    createDate: null,
    qualityNotificationReportTypeCode: null,
    qualityNotificationReportTypeId: null,
    qualityNotificationReportTypeShortText: null,
    updateDate: null,
  };


  @Input('data') set z(data) {
    if (data) {
      this.qualityReportType = { 
        createDate: data.createDate,
        qualityNotificationReportTypeCode: data.qualityNotificationReportTypeCode,
        qualityNotificationReportTypeId: data.qualityNotificationReportTypeId,
        qualityNotificationReportTypeShortText: data.qualityNotificationReportTypeShortText,
        updateDate: data.updateDate,
      };
    }
  };

  myModal;

  params = {
    cityDisabled: true,
    dialog: {
      title: '',
      inputText: '',
      inputValue: ''
    },
    displayDialog: false,
  };

  @Output() saveAction = new EventEmitter<any>();
  lastAccountNos;

  constructor(
              private _route: ActivatedRoute,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _qualityReportTypeService: QualityReportTypeService) {
  }

  ngOnInit() {
    
  }


  reset() {
    
  }

  save() {
    this.loaderService.showLoader();
    this.qualityReportType['plantId'] = this.plantId;
    this._qualityReportTypeService.save(this.qualityReportType).then(
      result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  cancel() {
    this.saveAction.emit('close');
  }


}
