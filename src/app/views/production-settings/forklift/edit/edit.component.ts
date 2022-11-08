import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { environment } from 'environments/environment';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UsersService } from 'app/services/users/users.service';
import { ForkLiftService } from 'app/services/dto-services/forklift.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';

@Component({
  selector: 'ForkLift-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class ForkLiftEditComponent implements OnInit {

  id: number;
  @Output() saveAction = new EventEmitter<any>();
  vehicleTypeList = [];
  

  @Input('id') set setid(id) {
    this.id = id;
    if (this.id) {
      this.initialize(this.id);
    }
  }
  forkliftReqDto = {
    active: null,
    createDate: null,
    forkliftDescription: null,
    forkliftId: null,
    forkliftName: null,
    forkliftNo: null,
    vehicleType: null,
    forkliftStatus: null,
    plantId: null,
    updateDate: null,
    wareHouseId: null,
  };
  forkliftTypeList = []
  selectedPlant: any;
  constructor(
    private forkLiftService: ForkLiftService,
    private utilities: UtilitiesService,
    private loaderService: LoaderService,
    private enumService: EnumService,
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

  private initialize(id) {
    this.loaderService.showLoader();
    this.forkLiftService.getUpdateDetail(this.id).then(result => {
      this.forkliftReqDto = {
        active: result['active'],
        createDate: result['createDate'],
        forkliftDescription: result['forkliftDescription'],
        forkliftId: result['forkliftId'],
        forkliftName: result['forkliftName'],
        vehicleType: result['vehicleType'],
        forkliftNo: result['forkliftNo'],
        forkliftStatus: result['forkliftStatus'],
        plantId: this.selectedPlant.plantId,
        updateDate: result['updateDate'],
        wareHouseId: result['wareHouse'] ? result['wareHouse'].wareHouseId: null
      };
      
      this.loaderService.hideLoader();
    }).catch(error => {
      this.loaderService.hideLoader();
      console.log(error)
    });
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
      forkliftDescription: null,
      forkliftId: this.id,
      vehicleType: null,
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
