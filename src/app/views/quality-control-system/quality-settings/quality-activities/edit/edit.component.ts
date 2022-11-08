import {Component, EventEmitter, Input, OnInit, Output, AfterViewInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { QualityActivityService } from 'app/services/dto-services/quality-activity/quality-activity.service';
import { environment } from 'environments/environment';
import { QualityDefectRecordingService } from 'app/services/dto-services/quality-defect-recording/quality-defect-recording.service';
import { QualityActivityTypeService } from 'app/services/dto-services/quality-activity-type/quality.activity.type.service';

@Component({
  selector: 'edit-quality-activity',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditQualityActivity implements OnInit {
  qualityActivity = {
    qualityActivityTypeCode: null,
    qualityActivityTypeId: null,
    qualityActivityTypeName: null,
    qualityActivityTypeShortText: null,
  };
  defectRecordList = [];

  myModal;
  @Input() plantId = null;
  @Input('data') set setData (data) {
    if (data) {
      // this.getDetail(data.qualityActivityTypeId);
      this.qualityActivity = {
        qualityActivityTypeCode: data.qualityActivityTypeCode,
        qualityActivityTypeId: data.qualityActivityTypeId,
        qualityActivityTypeName: data.qualityActivityTypeName,
        qualityActivityTypeShortText: data.qualityActivityTypeShortText
      };
    }
  }

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

  constructor(
    private _route: ActivatedRoute,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _qualityActivityTypeSvc: QualityActivityTypeService) {
  }

  ngOnInit() {}

  getDetail(id){
    this._qualityActivityTypeSvc.get(id).then((res:any)=> this.qualityActivity = res );
  }
  reset(){
    
  }
  save() {
    this.loaderService.showLoader();
    this.qualityActivity['plantId'] = this.plantId;
    this._qualityActivityTypeSvc.save(this.qualityActivity).then(
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
