import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import { WorkstationService } from 'app/services/dto-services/workstation/workstation.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { WorkstationProgramService } from 'app/services/dto-services/product-tree/worksation-program.service';
import { environment } from 'environments/environment';
@Component({
  selector: 'workstation-program-new',
  templateUrl: './new.component.html'
})
export class NewWorkstationProgramComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();
  dataModel = {
    code: null,
    description: null,
    plcCode: null,
    plcValue: null,
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
      unit: null
    }
  }
}
