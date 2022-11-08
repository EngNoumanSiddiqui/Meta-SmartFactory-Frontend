import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { WorkstationProgramService } from 'app/services/dto-services/product-tree/worksation-program.service';
import { WorkstationService } from 'app/services/dto-services/workstation/workstation.service';

@Component({
  selector: 'workstation-program-new',
  templateUrl: './new.component.html',
})

export class WorkstationProgramNewComponent implements OnInit {

  plantId: number = null;
  @Output() saveAction = new EventEmitter<any>();
  @Input('plantId') set p(plant){
    this.plantId = plant;
  }
  dataModel = {
    code: null,
    description: null,
    plcCode: null,
    plcValue: null,
    workStationId: null,
    unit: null
  };

  constructor(private _router: Router,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private mCategoryService: WorkstationProgramService,
              private _workStationService: WorkstationService) {

  }

  ngOnInit() {
  }

  save() {
    this.loaderService.showLoader();
    if(this.dataModel.plcValue){
      this.dataModel.plcValue = parseInt(this.dataModel.plcValue);
    }
    this.mCategoryService.save(this.dataModel)
      .then(result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.reset();
          this.saveAction.emit(result);
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  reset() {

    this.dataModel = {
      code: null,
      description: null,
      plcCode: null,
      plcValue: null,
      workStationId: null,
      unit: null
    }
  }

  setSelectedWorkStation(event){
    this.dataModel.workStationId = event.workStationId;
  }

}
