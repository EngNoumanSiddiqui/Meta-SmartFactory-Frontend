import {Component, Input, OnInit} from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
@Component({
  selector: 'job-order-equipment-detail',
  templateUrl: './detail.component.html'
})
export class DetailJobOrderEquipmentComponent implements OnInit {


  dataModel;

  @Input('data') set x(data) {
    if (data) {
      data.equipmentId = data.equipment.equipmentId;
      this.dataModel = data;
    }
  };

  constructor(private loaderService: LoaderService,
              private utilities: UtilitiesService) {

  }

  ngOnInit() {

  }


}
