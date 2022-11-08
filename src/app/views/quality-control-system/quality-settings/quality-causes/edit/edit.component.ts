import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
 
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
import { QualityCauseTypeService } from 'app/services/dto-services/quality-cause-type/quality.cause.type.service';

@Component({ 
  selector: 'edit-quality-causes',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditQualityCauses implements OnInit {

  @Input() plantId = false;
  qualityCausesType = { 
    createDate: null,
    qualityCauseTypeCode: null,
    qualityCauseTypeDescription: null,
    qualityCauseTypeId: null,
    qualityCauseTypeName: null,
    updateDate: null
  };
  defectRecordList = [];

  @Input('data') set z(data) {
    if (data) {
      this.qualityCausesType = {
        createDate: data.createDate,
        qualityCauseTypeCode: data.qualityCauseTypeCode,
        qualityCauseTypeDescription: data.qualityCauseTypeDescription,
        qualityCauseTypeId: data.qualityCauseTypeId,
        qualityCauseTypeName: data.qualityCauseTypeName,
        updateDate: data.updateDate
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
    private _qualityCauseTypeSvc: QualityCauseTypeService) {
  }

  ngOnInit() { }


  save() {
    this.loaderService.showLoader();
    this.qualityCausesType['plantId'] = this.plantId;
    this._qualityCauseTypeSvc.save(this.qualityCausesType).then(
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
  reset(){
    
  }
  cancel() {
    this.saveAction.emit('close');
  }


}
