import {Component, EventEmitter, Input, OnInit, Output, AfterViewInit} from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
import { QualityTaskTypeService } from 'app/services/dto-services/quality-task-type/quality.task.type.service';

@Component({
  selector: 'edit-quality-task',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditQualityTask implements OnInit {

  qualitTask = {
    createDate: null,
    qualityTaskTypeCode: null,
    qualityTaskTypeDescription: null,
    qualityTaskTypeId: null,
    qualityTaskTypeName: null,
    updateDate: null
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

  @Input('data') set setdata (data) {
    if (data) {
      this.qualitTask = {
        createDate: data.createDate,
        qualityTaskTypeCode: data.qualityTaskTypeCode,
        qualityTaskTypeDescription: data.qualityTaskTypeDescription,
        qualityTaskTypeId: data.qualityTaskTypeId,
        qualityTaskTypeName: data.qualityTaskTypeName,
        updateDate: data.updateDate
      };
      // this.getDetail(data.qualityTaskTypeId)
    }
  }
  @Input() plantId = null;
  @Output() saveAction = new EventEmitter<any>();
  lastAccountNos;
  defectRecordList = [];

  constructor(
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _qualityTaskTypeSvc: QualityTaskTypeService) {
  }

  ngOnInit() { }

  getDetail(id){
    this._qualityTaskTypeSvc.get(id).then((res:any) => {
      this.qualitTask = {
        createDate: res.createDate,
        qualityTaskTypeCode: res.qualityTaskTypeCode,
        qualityTaskTypeDescription: res.qualityTaskTypeDescription,
        qualityTaskTypeId: res.qualityTaskTypeId,
        qualityTaskTypeName: res.qualityTaskTypeName,
        updateDate: res.updateDate
      };
    })
  }

  reset(){
    
  }
  
  save() {
    this.loaderService.showLoader();
    this.qualitTask['plantId'] = this.plantId;
    this._qualityTaskTypeSvc.save(this.qualitTask).then(
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
