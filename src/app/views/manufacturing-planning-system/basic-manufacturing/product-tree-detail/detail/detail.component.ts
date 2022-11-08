import {Component, Input, OnInit} from '@angular/core';
import { ConvertUtil } from 'app/util/convert-util';
import { LoaderService } from 'app/services/shared/loader.service';
import { ProductTreeDetailService } from 'app/services/dto-services/product-tree/prod-tree-detail.service';
import { UtilitiesService } from 'app/services/utilities.service';
@Component({
  selector: 'product-tree-detail-detail',
  templateUrl: './detail.component.html'
})
export class DetailProductTreeDetailComponent implements OnInit {


  @Input() productTreeId;
  index: any;
  openModalType: any;
  auxMaterialList: any;
  componentList: any;


  @Input('data') set x(data) {
    if (data) {


      data.ssingleSetupDuration = ConvertUtil.longDuration2DHHMMSSsssTime(data.singleSetupDuration);
      data.ssingleDuration = ConvertUtil.longDuration2DHHMMSSsssTime(data.singleDuration);
      data.ssingleTotalDuration = ConvertUtil.longDuration2DHHMMSSsssTime(data.singleTotalDuration);
      data.smaxSingleStandbyDuration = ConvertUtil.longDuration2DHHMMSSsssTime(data.maxSingleStandbyDuration);

      if (data.workstation) {
        data.workstationId = data.workstation.workStationId;
      }
      
      this.dataModel = data;

      if (this.dataModel.componentList) {
        this.auxMaterialList = this.dataModel.componentList.filter(itm => itm.direction === 0);
        this.componentList = this.dataModel.componentList.filter(itm => itm.direction !== 0);
      } else {
        this.auxMaterialList = [];
        this.componentList = [];
      }
    }
  };

  @Input('index') set indexx(modal) {
    if (modal.index) {
     this.index = modal.index;
    }
    if (modal.openModalType !== null && modal.openModalType !== undefined) {
      this.openModalType = modal.openModalType;
    }
  }



  dataModel;

  constructor(private loaderService: LoaderService,
              private _compSvc: ProductTreeDetailService,
              private utilities: UtilitiesService) {

  }

  ngOnInit() {

  }

  handleChange(e) {
    this.index = e.index;
  }


}
