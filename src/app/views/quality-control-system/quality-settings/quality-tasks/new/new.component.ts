import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { QualityTaskTypeService } from 'app/services/dto-services/quality-task-type/quality.task.type.service';
@Component({
  selector: 'new-quality-task',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewQualityTask implements OnInit{

  @Input() fromAutoComplete = false;
  @Input() plantId = null;
  @Output() saveAction = new EventEmitter<any>();

  qualitTask = {
    createDate: null,
    qualityTaskTypeCode: null,
    qualityTaskTypeDescription: null,
    qualityTaskTypeId: null,
    qualityTaskTypeName: null,
    updateDate: null
  };

  defectRecordList = [];

  constructor(
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _qualityTaskTypeSvc: QualityTaskTypeService
    
  ) {}

  ngOnInit() {}
  
  reset() {
    this.qualitTask = {
      createDate: null,
      qualityTaskTypeCode: null,
      qualityTaskTypeDescription: null,
      qualityTaskTypeId: null,
      qualityTaskTypeName: null,
      updateDate: null
    };
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
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
      }
    );
  }

}
