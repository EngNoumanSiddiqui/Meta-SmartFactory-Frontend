import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { DefectLocationsService } from 'app/services/dto-services/defect-location/defect-locations.service'
@Component({
  selector: 'new-defect-location',  
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewDefectLocation {

  @Input() plantId = null;
  @Input() fromAutoComplete = false;
  @Output() saveAction = new EventEmitter<any>();

  defectLocationType = { 
    defectLocationId: null,
    defectLocationCode: null,
    text: null,
  };

  constructor(
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _defectLocationsService: DefectLocationsService
  ) {}
  
  reset() {
    this.defectLocationType.defectLocationCode= '',
    this.defectLocationType.text=''
  }
 

  save() {
    this.loaderService.showLoader();
    this.defectLocationType['plantId']= this.plantId;
    this._defectLocationsService.save(this.defectLocationType).then(
      result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      }).catch(error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
      });
  }

}
