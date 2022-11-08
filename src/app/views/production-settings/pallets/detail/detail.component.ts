import {Component, Input, OnInit} from '@angular/core';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { PalletSettingsService } from 'app/services/dto-services/pallet/pallet-settings.service';

@Component({
  selector: 'pallet-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailPalletComponent implements OnInit {

  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  pallet: any ;


  constructor(private _palletSettingSvc: PalletSettingsService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService) {

    /* this._route.params.subscribe((params) => {
     this.id = params['id'];
     this.initialize(this.id);
     });*/
  }

  private initialize(id) {
    this.loaderService.showLoader();
    this._palletSettingSvc.getDetail(id)
      .then(result => {
        this.loaderService.hideLoader();
        this.pallet = result;
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  ngOnInit() {
  }

  showPlantDetail(plantId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, plantId);
  }
  showWareHouseDetail(wareHouseId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WAREHOUSE, wareHouseId);
  }
}

