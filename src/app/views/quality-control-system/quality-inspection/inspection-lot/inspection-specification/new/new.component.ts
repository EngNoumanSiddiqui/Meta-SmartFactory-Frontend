import {Component, EventEmitter, Input, Output} from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { InspectionLotService } from 'app/services/dto-services/quality-inspection/inspection-lot.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'new-inspection-specification',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewInspectionSpecification {
  @Input() fromAutoComplete = false;
  @Input() plantId: number = null;
  @Output() saveAction = new EventEmitter<any>();
  @Input('inspectionLotId') inspectionLotId;

  inspectionSpecification = {
    active: false,
    inspectionSpecificationId: null,
    inspectionPlan: null,
    group: null,
    groupCounter: null,
    usage: null,
    sampleSize: null,
    keyDate: new Date(),
  };
  modal = {
    active: false
  }

  usageList = [
    'Usage 1',
    'Usage 2'
  ];


  constructor(
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _inspectionLotService: InspectionLotService) {
  }
  reset() {
    this.inspectionSpecification = {
      "active": true,
      inspectionSpecificationId: null,
      inspectionPlan: null,
      group: null,
      groupCounter: null,
      usage: null,
      sampleSize: null,
      keyDate: new Date(),
    };
  }

  save() {
    this.loaderService.showLoader();
    this.inspectionSpecification['plantId'] = this.plantId;
    this._inspectionLotService.saveInspSpec(this.inspectionLotId, this.inspectionSpecification).subscribe(
      result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.reset();
          this.saveAction.emit('close');
        }, environment.DELAY);
      },
      error => { 
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }
  setSelectedInspcSpec(inspPlan) {
    console.log('checkSelectedMOdal', inspPlan);
    
    if (inspPlan) {
      this.inspectionSpecification.inspectionPlan = inspPlan.inspectionPlanCode
      this.inspectionSpecification.group = inspPlan.group
      this.inspectionSpecification.groupCounter = inspPlan.groupCounter
      this.inspectionSpecification.usage = inspPlan.usage
      this.inspectionSpecification.sampleSize = inspPlan.sampleSize
      this.inspectionSpecification.keyDate = inspPlan.keyDate

    } else {
      this.inspectionSpecification.inspectionSpecificationId = null;
    }
  }
}
