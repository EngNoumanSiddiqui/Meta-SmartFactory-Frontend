import { OperationService } from './../../../../services/dto-services/operation/operation.service';
import { Component, OnInit, Input } from '@angular/core';
import { PlantService } from 'app/services/dto-services/plant/plant.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { WorkstationService } from 'app/services/dto-services/workstation/workstation.service';

@Component({
  selector: 'workstation-category-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class WorkStationCategoryDetailComponent implements OnInit {
  payLoadObject = {
    'wsCatCode': null,
    'wsCatDescription': null,
    'wsCatId': 0,
    'wsCatName': null
  };
  data;
  @Input('data') set z(data) {
    this.data = data;
    if (this.data) {
      this.payLoadObject = {
        'wsCatId': this.data.wsCatId,
        'wsCatCode': this.data.wsCatCode,
        'wsCatDescription': this.data.wsCatDescription,
        'wsCatName': this.data.wsCatName
      };
    }
  };

  constructor(private _workStationSvc: WorkstationService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService, ) {
  }

  ngOnInit() {
  }
  

}
