import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { environment } from 'environments/environment';
import { UsersService } from 'app/services/users/users.service';
import { ForkLiftService } from 'app/services/dto-services/forklift.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';

@Component({
  selector: 'ForkLift-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class ForkLiftNewComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  forkliftReqDto = {
    active: null,
    createDate: null,
    forkliftDescription: null,
    forkliftId: null,
    forkliftName: null,
    forkliftNo: null,
    forkliftStatus: null,
    plantId: null,
    vehicleType: null,
    updateDate: null,
    wareHouseId: null,
  };
  forkliftTypeList = []
  selectedPlant: any;
  vehicleTypeList = [];
  constructor(
    private forkLiftService: ForkLiftService,
    private utilities: UtilitiesService,
    private enumService: EnumService,
    private loaderService: LoaderService,
    private userService: UsersService
  ) {
      const plantjson = this.userService.getPlant();
      let plant ;
      if (plantjson) {
        plant = JSON.parse(plantjson);
      }
      if (plant) {
        this.forkliftReqDto.plantId = plant.plantId;
        this.selectedPlant = plant;
      }
   }

  ngOnInit() {
    this.enumService.getForkLiftStatusEnum().then((res: any) => this.forkliftTypeList = res).catch(err => console.error(err))
    this.enumService.getVehicleTypeEnum().then((res: any) => this.vehicleTypeList = res).catch(err => console.error(err))
  }

  setSelectedPlant(selectedPlantEvent) {
    if (selectedPlantEvent) {
      this.forkliftReqDto.plantId = selectedPlantEvent.plantId;
    } else {
      this.forkliftReqDto.plantId = null;
    }
  }

  setSelectedWarehouse(event) {
      if (event && event.hasOwnProperty('wareHouseId')) {
        this.forkliftReqDto.wareHouseId = event.wareHouseId;
      } else {
        this.forkliftReqDto.wareHouseId = null;
      }
  }
  
  reset() {
    this.forkliftReqDto = {
      active: null,
      createDate: null,
      vehicleType: null,
      forkliftDescription: null,
      forkliftId: null,
      forkliftName: null,
      forkliftNo: null,
      forkliftStatus: null,
      plantId: this.forkliftReqDto.plantId,
      updateDate: null,
      wareHouseId: null,
    };
  }
  save() {
    this.loaderService.showLoader();
    this.forkLiftService.save(this.forkliftReqDto)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.reset();
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

}
