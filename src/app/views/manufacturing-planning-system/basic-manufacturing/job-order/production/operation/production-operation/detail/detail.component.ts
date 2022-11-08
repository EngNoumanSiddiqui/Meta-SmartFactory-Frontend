import {Component, Input, OnInit} from '@angular/core';
import { JobOrderService } from 'app/services/dto-services/job-order/job-order.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ConvertUtil } from 'app/util/convert-util';
@Component({
  selector: 'job-order-operation-detail',
  templateUrl: './detail.component.html'
})
export class DetailJobOrderOperationComponent implements OnInit {


  @Input() productTreeDetailId;

  @Input('data') set x(data) {
    if (data) {

      this.dataModel = data;
    }
  };

  @Input('id') set xid(id) {
    if (id) {
      this.initialize(id);
    }
  };


  dataModel;

  constructor(private loaderService: LoaderService,
    private jobOrderService: JobOrderService,
              private utilities: UtilitiesService) {

  }

  ngOnInit() {

  }

  getReadableTime(time) {
    if(time) {
      return ConvertUtil.longDuration2DHHMMSSsssTime(time)
    } else {
      return '';
    }
  }

  initialize(id) {
    this.loaderService.showLoader();
    this.jobOrderService.getJobOrderOperationDetails(id).then(res => {
      this.loaderService.hideLoader();
      this.dataModel = res;
    }).catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error);
    })
  }



  featuresUpdated(event) {
    this.dataModel.productTreeDetailWorkstationProgramList = event;
  }

  showJobOrderDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDER, id)
  }

  showWorkstationDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, id)
  }
  showOperationDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.OPERATION, id)
  }
}
