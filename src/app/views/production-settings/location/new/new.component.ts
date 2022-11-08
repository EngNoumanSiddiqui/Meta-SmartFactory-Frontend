import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';

import { environment } from 'environments/environment';
import { WorkstationTypeService } from 'app/services/dto-services/workstation-type/workstation-type.service';
import { LocationService } from 'app/services/dto-services/location/location.service';

@Component({
  selector: 'location-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  payLoadObject = {
    plantId: null,
    locationDescription: null,
    locationType: null,
    locationId: null,
    locationName: null,
    locationNo: null,
  }

  @Input() plantId = null;
  constructor( private locationService: LocationService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService, ) {

  }


  ngOnInit() {

    this.payLoadObject.plantId = this.plantId;
  }


  reset() {
    this.payLoadObject = {
      plantId: this.payLoadObject.plantId,
      locationDescription: null,
      locationType: null,
      locationId: null,
      locationName: null,
      locationNo: null,
    }
  }

  save() {
    this.loaderService.showLoader();
    this.locationService.save(this.payLoadObject)
      .then(result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          // this.reset();
          this.saveAction.emit(result);
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

}
