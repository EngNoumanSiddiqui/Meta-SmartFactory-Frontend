import { Component, OnInit, Input } from '@angular/core';
import { ScrapService } from 'app/services/dto-services/scrap.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { ForkLiftService } from 'app/services/dto-services/forklift.service';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'ForkLift-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class ForkLiftDetailComponent implements OnInit {

  id;
  selectedPlant: any;
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };
  forkLift: any = {};
  constructor(
    private forkLiftService: ForkLiftService,
    private utilities: UtilitiesService,
    private loaderService: LoaderService,
    private userService: UsersService
  ) {
    const plantjson = this.userService.getPlant();
      let plant ;
      if (plantjson) {
        plant = JSON.parse(plantjson);
      }
      if (plant) {
        this.forkLift.plantId = plant.plantId;
        this.selectedPlant = plant;
      }
   }

  ngOnInit() {
  }
  private initialize(id: string) {
    this.loaderService.showLoader();
    this.forkLiftService.getUpdateDetail(id)
      .then(result => {
        this.loaderService.hideLoader();
        this.forkLift = result;
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  showPlantDetailModal(plant){
    if(plant) this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, plant.plantId);
  }
  showWarehouseDetailModal(warehouse){
    if(warehouse) this.loaderService.showDetailDialog(DialogTypeEnum.WAREHOUSE, warehouse.wareHouseId);
  }

  
}
