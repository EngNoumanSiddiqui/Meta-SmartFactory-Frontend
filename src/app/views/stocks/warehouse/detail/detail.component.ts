import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
 
import {WarehouseService} from '../../../../services/dto-services/warehouse/warehouse.service';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';

@Component({
  selector: 'warehouse-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailWareHouseComponent implements OnInit {

  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  wareHouse: any = {
    'wareHouseId': '',
    'wareHouseNo': '',
    'wareHouseName': '',
    'scrap': false,
    'rework': false,
    'employeeName': '',
    'employeeSurname': '',
    factoryCalendarId: null,
    'wareHouseStatus': '',
    'wareHouseStockDtoList': '',
    'process': false,
    'purchase': false,
    'quality': false,
    'sales': false,
    'parentId': null,
    'defaultSelected': null
  };


  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _wareHouseSvc: WarehouseService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService) {

    /* this._route.params.subscribe((params) => {
     this.id = params['id'];
     this.initialize(this.id);
     });*/
  }

  private initialize(id) {
    this.loaderService.showLoader();
    this._wareHouseSvc.getDetail(id)
      .then(result => {
        this.loaderService.hideLoader();

       this.wareHouse = result;

      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  ngOnInit() {
  }

  goPage(id) {
    if (id === -1) {
      this._router.navigate(['/stocks/wareHouses/new']);
    } else {
      this._router.navigate(['/stocks/wareHouses/edit/' + this.id]);
    }
  }
  showPlantDetail(plantId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, plantId);
  }
  showMaterialDetail(materialId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, materialId);
  }
  showWarehouseDetailDialog(id){
    this.loaderService.showDetailDialog(DialogTypeEnum.WAREHOUSE, id);
  }

  showFactoryCalenderDetailDialog(id){
    this.loaderService.showDetailDialog(DialogTypeEnum.FACTORYCALENDAR, id);
  }
}

