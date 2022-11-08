import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { WorkstationProgramService } from 'app/services/dto-services/product-tree/worksation-program.service';
import { WorkstationService } from 'app/services/dto-services/workstation/workstation.service';

@Component({
  selector: 'workstation-program-edit',
  templateUrl: './edit.component.html',
})

export class WorkstationProgramEditComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();
  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  plantId: number = null;

  @Input('plantId') set plant(plantId) {
    this.plantId = plantId;
  }

  dataModel: any;

  constructor(private _router: Router,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private mCategoryService: WorkstationProgramService,
    private _workStationService: WorkstationService) {

  }

  ngOnInit() {
    this.initialize(this.id);

  }

  private initialize(id) {

    this.loaderService.showLoader();
    this.mCategoryService.getDetail(this.id)
      .then(result => {
        this.loaderService.hideLoader();
        if (result) {
          this.dataModel = result;
        }

      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  save() {
    if(this.dataModel.plcValue){
      this.dataModel.plcValue = parseInt(this.dataModel.plcValue);
    }
    this.loaderService.showLoader();
    this.mCategoryService.save(this.dataModel)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.dataModel = null;
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  cancel() {
    this.dataModel = null;
    this.saveAction.emit('close');
  }

  setSelectedWorkStation(event) {
    console.log('eventId', event)
    this.dataModel.workStationId = event.workStationId;
  }

}
