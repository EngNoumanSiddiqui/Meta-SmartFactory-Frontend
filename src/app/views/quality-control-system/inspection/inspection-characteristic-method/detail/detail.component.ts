import {Component, Input, OnInit} from '@angular/core';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {ProductTreeEquipmentService} from '../../../../../services/dto-services/product-tree/prouduct-tree-equipment.service';
@Component({
  selector: 'quality-inspection-characteristic-method-detail',
  templateUrl: './detail.component.html'
})
export class DetailQualityInspectionCharacteristicMethodComponent implements OnInit {


  dataModel;

  @Input('data') set x(data) {
    if (data) {
      // data.equipmentId = data.equipment.equipmentId;
      this.dataModel = data;
    }
  };

  constructor(private loaderService: LoaderService,
              private _compSvc: ProductTreeEquipmentService,
              private utilities: UtilitiesService) {

  }

  ngOnInit() {

  }


}
