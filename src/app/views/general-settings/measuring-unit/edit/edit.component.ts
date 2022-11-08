import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import {environment} from '../../../../../environments/environment';
import { UsersService } from 'app/services/users/users.service';
import { MeasuringUnitService } from 'app/services/dto-services/measuring/measuring-unit.service';

@Component({
  selector: 'measuring-unit-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditMeasuringUnitComponent implements OnInit {
  measuringUnitDto = {
    alternativeUnit: null,
    baseUnit: null,
    createDate: null,
    denominator: null,
    equipmentId: null,
    numerator: null,
    stockId: null,
    stockUnitMeasureId: null,
    unitType: null,
    updateDate: null,
    workStationId: null
  };
  selectedPlant: any;
  measuringUnitList: any;
  
  @Output() saveAction = new EventEmitter<any>();
  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  constructor(private _route: ActivatedRoute,
    private _translateSvc: TranslateService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _userSvc: UsersService,
    private _measuringUnitSvc: MeasuringUnitService) {
      const setPlant = this._userSvc.getPlant();
      this.selectedPlant = JSON.parse(setPlant);
  }

  private initialize(id) {
    this.loaderService.showLoader();
    this._measuringUnitSvc.getDetail(id)
      .then((res: any) => {
        this.loaderService.hideLoader();
        this.measuringUnitDto = {
          alternativeUnit: res.alternativeUnit,
          baseUnit: res.baseUnit,
          createDate: res.createDate ? new Date(res.createDate) : null,
          denominator: res.denominator,
          equipmentId: res.equipment ? res.equipment.equipmentId : null,
          numerator: res.numerator,
          stockId: res.stock ? res.stock.stockId : null,
          stockUnitMeasureId: res.stockUnitMeasureId,
          unitType: res.unitType,
          updateDate: res.updateDate ? new Date(res.updateDate) : null,
          workStationId: res.workStation ? res.workStation.workStationId : null
        };
      }).then()
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  ngOnInit() {

    this._measuringUnitSvc.getMeasuringUnitList().then((res: any) => {
      this.measuringUnitList = res;
    }).catch(err => console.error(err));
  }

  onmeasuringUnitSelected(event) {
    if (event === 'TIME') {
      this.measuringUnitDto.baseUnit = 'MINUTE';

    } else if (event === 'DISTANCE') {
      this.measuringUnitDto.baseUnit = 'MM';

    } else if (event === 'WEIGHT') {
      this.measuringUnitDto.baseUnit = 'GR';

    }
  }

  save() {

    this.loaderService.showLoader();
    this._measuringUnitSvc.save(this.measuringUnitDto)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('updated-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }


}
