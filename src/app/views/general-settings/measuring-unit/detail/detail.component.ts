import {Component, Input, OnInit} from '@angular/core';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { MeasuringUnitService } from 'app/services/dto-services/measuring/measuring-unit.service';

@Component({
  selector: 'measuring-unit-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailMeasuringUnitComponent implements OnInit {

  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  measuringUnitDetail: any;


  constructor(
              private _measuringUnitSvc: MeasuringUnitService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService) {
  }

  private initialize(id) {
    this.loaderService.showLoader();
    this._measuringUnitSvc.getDetail(id)
      .then(result => {
        this.loaderService.hideLoader();
        this.measuringUnitDetail = result;
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  ngOnInit() {
  }
  showMaterialDetail(materialId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, materialId);
  }
}

