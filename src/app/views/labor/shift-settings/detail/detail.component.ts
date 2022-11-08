import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ShiftSettingsService } from 'app/services/dto-services/shift-setting/shift-setting.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { LoaderService } from 'app/services/shared/loader.service';

@Component({
  selector: 'shift-setting-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class ShiftSettingDetailComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();
  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  responseShiftDto = {
    description: null,
    endTime: null,
    example: null,
    plant: {
      address: null,
      cityId: null,
      cityName: null,
      companyAddress: null,
      companyId: null,
      countryId: null,
      countryName: null,
      createdDate: null,
      plantCode: null,
      plantId: null,
      plantName: null,
      postcode: null,
    },
    shiftId: null,
    shiftName: null,
    shiftOrderNo: null,
    shiftNo: null,
    startTime: null,
    maxChangeOverCount: null
  }

  constructor(
    private _shiftSettingSvc: ShiftSettingsService,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {}

  initialize(id) {
    this._shiftSettingSvc.getShiftDetail(id).then((result: any) => {
      this.responseShiftDto = result;
    });
  }

  openPlantModal(plantId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, plantId);
  }
}
