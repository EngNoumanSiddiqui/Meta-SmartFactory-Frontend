import {Component, EventEmitter, Input, Output} from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { InspectionSpecificationService } from 'app/services/dto-services/quality-inspection/inspection-specification.service'
import { environment } from 'environments/environment';

@Component({
  selector: 'new-inspection-spec',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewInspectionSpec {
  @Input() plantId = null;
  @Input() fromAutoComplete = false;
  @Output() saveAction = new EventEmitter<any>();

  inspectionSpecification = {
    inspectionSpecificationId: null,
    inspectionPlan: null,
    group: null,
    groupCounter: null,
    usage: null,
    sampleSize: null,
    keyDate: new Date(),
  };

  usageList = [
    'Usage 1',
    'Usage 2'
  ];


  constructor(
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _inspectionSpecificationService: InspectionSpecificationService) {
  }
  reset() {
    this.inspectionSpecification = {
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
    this._inspectionSpecificationService.save(this.inspectionSpecification).subscribe(
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
}
