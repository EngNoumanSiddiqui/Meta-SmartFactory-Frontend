import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
@Component({
  selector: 'job-order-equipment-new',
  templateUrl: './new.component.html'
})
export class NewJobOrderEquipmentComponent implements OnInit {


  @Output() saveAction = new EventEmitter<any>();

  @Input() productTreeDetailId;

  plantId: number;


  dataModel = {
    count: null,
    equipmentId: null,
    equipmentName: null,
    equipment: null,
    productTreeDetailId: 1,
    productTreeDetailEquipmentId: null
  };

  @Input('data') set x(data) {
    if (data) {
      this.dataModel = data;
    }
  };

  constructor(private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private appStateService: AppStateService) {
    this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.plantId = null;
      } else {
        this.plantId = res.plantId;
      }
    });

  }

  ngOnInit() {

  }

  save() {

    if (!this.dataModel.equipmentId) {

      this.utilities.showWarningToast('equipment-must-be-selected');
      return;
    }

    this.loaderService.showLoader();

    this.saveAction.emit(this.dataModel);
    this.loaderService.hideLoader();
    this.utilities.showSuccessToast('saved-success');


  }

  setSelectedStock(equipment) {
    if (equipment) {
      this.dataModel.equipmentId = equipment.equipmentId;
      this.dataModel.equipmentName = equipment.equipmentName;
      this.dataModel.equipment = equipment;
    } else {
      this.dataModel.equipmentId = null;
      this.dataModel.equipmentName = null;
      this.dataModel.equipment = null;
    }
  }

}
