import {Component, Input, OnInit} from '@angular/core';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {LoaderService} from '../../../../../services/shared/loader.service';
import { EquipmentPlannerGroupService } from 'app/services/dto-services/maintenance-equipment/planner-group.service';
/**
 * Created by reis on 31.07.2019.
 */


@Component({
  selector: 'equipment-planner-group-detail',
  templateUrl: './detail.component.html'
})
export class EquipmentPlannerGroupDetailComponent implements OnInit {

  showLoader = false;

  @Input('data') data: any;

  id;
  
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  constructor(private utilities: UtilitiesService,
    private equipmentPlannerGroupService: EquipmentPlannerGroupService,
              private loaderService: LoaderService) {
  }

  ngOnInit() {
  }

  private initialize(id) {

    this.loaderService.showLoader();
    this.equipmentPlannerGroupService.getDetail(this.id)
      .then(result => {
        this.loaderService.hideLoader();
        if (result) {
          this.data = result;
          // this.dataModel.plannerGroupId = myResult.plannerGroupId;
          // this.dataModel.plannerGroup = myResult.plannerGroup;
          // this.dataModel.mail = myResult.mail;
          // this.dataModel.telephone = myResult.telephone;
          // this.dataModel.definition = myResult.definition;
          // if (myResult.maintanencePlanningPlant) {
          //   this.dataModel.plantId = myResult.maintanencePlanningPlant.plantId;
          //   this.initialPlant = myResult.maintanencePlanningPlant;
          // }
        }

      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }
  isLoading() {
    return this.loaderService.isLoading();
  }


}
