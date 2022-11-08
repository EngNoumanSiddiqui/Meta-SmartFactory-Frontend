/**
 * Created by reis on 31.07.2019.
 */
import {Component, Input, OnInit} from '@angular/core';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {LoaderService} from '../../../../../services/shared/loader.service';
import { ConvertUtil } from 'app/util/convert-util';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';

@Component({
  selector: 'order-operation-detail',
  templateUrl: './detail.component.html'
})
export class OrderOperationDetailComponent implements OnInit {

  showLoader = false;
  data: any;

  modalType = DialogTypeEnum;
  @Input('data') set setdata(data) {
    if (data) {
      this.data = JSON.parse(JSON.stringify(data));
      if (this.data.duration) {
        this.data.duration = ConvertUtil.longDuration2DHHMMSSTime(this.data.duration * 1000);
      }
    }
  }

  constructor(private utilities: UtilitiesService,
              private loaderService: LoaderService) {
  }

  ngOnInit() {
  }

  isLoading() {
    return this.loaderService.isLoading();
  }


  showDetailModal(id, type) {
    this.loaderService.showDetailDialog(type, id);
  }


}
