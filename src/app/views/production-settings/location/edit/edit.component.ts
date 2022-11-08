import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from '../../../../../environments/environment';
import { WorkstationTypeService } from 'app/services/dto-services/workstation-type/workstation-type.service';
import { LocationService } from 'app/services/dto-services/location/location.service';

@Component({
  selector: 'location-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
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

  @Input('data') set z(data) {
    if (data) {
      this.payLoadObject = {
        plantId: this.plantId,
        locationType: data['locationType'],
        locationDescription: data['locationDescription'],
        locationId: data['locationId'],
        locationName: data['locationName'],
        locationNo: data['locationNo'],
      };
    }
  };

  constructor( private locationService: LocationService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService, ) {

  }

  ngOnInit() {
    this.payLoadObject.plantId = this.plantId;
  }

  save() {
    this.loaderService.showLoader();
    this.payLoadObject.plantId = this.plantId;
    this.locationService.save(this.payLoadObject)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('updated-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });

  }
  reset() {}

}
