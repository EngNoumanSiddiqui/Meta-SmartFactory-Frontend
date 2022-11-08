import {Component, Input, OnInit} from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { ProductTreeOperationService } from 'app/services/dto-services/product-tree/prouduct-tree-operation.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { ConvertUtil } from 'app/util/convert-util';
@Component({
  selector: 'prod-tree-operation-detail',
  templateUrl: './detail.component.html'
})
export class DetailProductTreeOperationComponent implements OnInit {


  @Input() productTreeDetailId;
  auxMaterialList: any;
  componentList: any;
  materialList: any;

  @Input('data') set x(dt) {
    if (dt) {
      const data = JSON.parse(JSON.stringify(dt));

      if (data.operation) {
        data.operationId = data.operation.operationId;
      }

      data.ssingleSetupDuration = ConvertUtil.longDuration2DHHMMSSsssTime(data.singleSetupDuration);
      data.ssingleDuration = ConvertUtil.longDuration2DHHMMSSsssTime(data.singleDuration);
      data.ssingleTotalDuration = ConvertUtil.longDuration2DHHMMSSsssTime(data.singleTotalDuration);
      data.smaxSingleStandbyDuration = ConvertUtil.longDuration2DHHMMSSsssTime(data.maxSingleStandbyDuration);

      if (data.productTreeDetailWorkstationProgramList) {
        data.productTreeDetailWorkstationProgramList.forEach(item => {
          if (item.workstationProgram) {
            item['workstationProgramId'] = item.workstationProgram.workstationProgramId;
          }
        })
      }
      this.dataModel = data;

      if (this.dataModel.componentList) {
        this.auxMaterialList = this.dataModel.componentList.filter(itm => +itm.direction === 0);
        this.componentList = this.dataModel.componentList.filter(itm => +itm.direction === -1);
        this.materialList = this.dataModel.componentList.filter(itm => +itm.direction === 1);
      } else {
        this.auxMaterialList = [];
        this.componentList = [];
        this.materialList = [];
      }
    }
  };

  @Input('id') set setid(id) {
    if(id) {
      this.initialize(id);
    }
  }

  dataModel;

  constructor(private loaderService: LoaderService,
              private _compSvc: ProductTreeOperationService,
              private utilities: UtilitiesService) {

  }

  ngOnInit() {

  }

  initialize(id) {
    this.loaderService.showLoader();
    this._compSvc.getDetail(id).then((res) => {
      const data = JSON.parse(JSON.stringify(res));

      if (data.operation) {
        data.operationId = data.operation.operationId;
      }

      data.ssingleSetupDuration = ConvertUtil.longDuration2DHHMMSSsssTime(data.singleSetupDuration);
      data.ssingleDuration = ConvertUtil.longDuration2DHHMMSSsssTime(data.singleDuration);
      data.ssingleTotalDuration = ConvertUtil.longDuration2DHHMMSSsssTime(data.singleTotalDuration);
      data.smaxSingleStandbyDuration = ConvertUtil.longDuration2DHHMMSSsssTime(data.maxSingleStandbyDuration);

      if (data.productTreeDetailWorkstationProgramList) {
        data.productTreeDetailWorkstationProgramList.forEach(item => {
          if (item.workstationProgram) {
            item['workstationProgramId'] = item.workstationProgram.workstationProgramId;
          }
        })
      }
      this.dataModel = data;

      if (this.dataModel.componentList) {
        this.auxMaterialList = this.dataModel.componentList.filter(itm => +itm.direction === 0);
        this.componentList = this.dataModel.componentList.filter(itm => +itm.direction === -1);
        this.materialList = this.dataModel.componentList.filter(itm => +itm.direction === 1);
      } else {
        this.auxMaterialList = [];
        this.componentList = [];
        this.materialList = [];
      }
      this.loaderService.hideLoader();
    }).catch((error) => {
      this.utilities.showErrorToast(error);
      this.loaderService.hideLoader();
    })
  }

  OpenOperationDetails(operation) {
    if (operation) {
      this.loaderService.showDetailDialog(DialogTypeEnum.OPERATION, operation.operationId);
    }
  }
  OpenWorkStationDetails(workstation) {
    if (workstation) {
      this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, workstation.workStationId);
    }
  }


  featuresUpdated(event) {
    this.dataModel.productTreeDetailWorkstationProgramList = event;
  }
}
