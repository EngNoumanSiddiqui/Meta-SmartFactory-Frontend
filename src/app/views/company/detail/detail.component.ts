import {Component, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit} from '@angular/core';
import {LoaderService} from '../../../services/shared/loader.service';
import {UtilitiesService} from '../../../services/utilities.service';

import { ImageAdderComponent } from '../../image/image-adder/image-adder.component';
import { TableTypeEnum } from '../../../dto/table-type-enum';
import { PlantService } from 'app/services/dto-services/plant/plant.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'company-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailCompanyComponent implements OnInit, AfterViewInit {
  plantModal = {active: false, modal: null, data: null, uniqueId: null};
  company = {
    'address': null,
    'cityId': null,
    'cityName': null,
    'companyAddress': null,
    'companyId': null,
    'companyCode': null,
    'companyName': null,
    'countryId': null,
    'countryName': null,
    'plantList': null,
    'postcode': null
  };
  tableTypeForImg = TableTypeEnum.COMPANY;
  @Input('data') set z(data) {
    if (data) {
      this.company = {
        'address': data.address,
        'companyAddress': data.companyAddress,
        'companyId': data.companyId,
        'countryId' : data.countryId,
        'countryName': data.countryName,
        'cityId' : data.cityId,
        'cityName': data.cityName,
        'plantList': data.plantList,
        'companyCode': data.companyCode,
        'companyName': data.companyName,
        'postcode': data.postcode
      };

      if ( !this.company.plantList) {
        this.retrievePlantList();
      }
    }
  };
  @ViewChild(ImageAdderComponent) imageAdderComponent: ImageAdderComponent;

  constructor(private plantSvc: PlantService, private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService, private utilities: UtilitiesService ) {
  }

  ngOnInit() {
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.showImages();
    }, 1000);

  }
  retrievePlantList() {
    this.plantSvc.getAllPlants().then((res: any) => {
      if (res) {
        this.company.plantList = res;
      }
    });
  }
  showImages() {
    if ((this.imageAdderComponent)) {
      if (this.company && this.company.companyId ) {
        this.imageAdderComponent.initImages(this.company.companyId, this.tableTypeForImg);
      }

    }
  }

  modalShow(data, modal, uniqueId) {
    this.plantModal.data = data;
    this.plantModal.modal = modal;
    this.plantModal.uniqueId = uniqueId;

    this.plantModal.active = true;
  }

  deletePlant(plantId) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.plantSvc.deleteplant(plantId)
          .then(() => {
            this.utilities.showSuccessToast('deleted-success');
            this.retrievePlantList();
          })
          .catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showWarningToast('cancelled-operation');
      }
    })
  }
}
