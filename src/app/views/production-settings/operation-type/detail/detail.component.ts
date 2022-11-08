import { OperationService } from './../../../../services/dto-services/operation/operation.service';
import { Component, OnInit, Input } from '@angular/core';
import { PlantService } from 'app/services/dto-services/plant/plant.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';

@Component({
  selector: 'operation-type-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class OperationTypeDetailComponent implements OnInit {

  workcenters: any[];
  detailResult;
  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(id);
    }
  };

  @Input('data') set zdata(data) {
    if (data) {
      this.detailResult = {
        'operationTypeDescription': data.operationTypeDescription,
        'operationTypeId': data.operationTypeId,
        'operationTypeName': data.operationTypeName,
        'plant': data.plant
      };
    }
  };

  constructor(private _operationTypeService: OperationService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService, ) {
  }

  ngOnInit() {
    // this.filter();
  }
  initialize(id) {
    this.loaderService.showLoader();
    this._operationTypeService.getDetail(id).then((data: any) => {
      this.loaderService.hideLoader();
      if (data) {
        this.detailResult = {
          'operationTypeDescription': data.operationTypeDescription,
          'operationTypeId': data.operationTypeId,
          'operationTypeName': data.operationTypeName,
          'plant': data.plant
        };
      }
    })
  }
  

}
