import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {EquipmentCodeGroupItemService} from '../../../../../services/dto-services/maintenance-equipment/code-group-item.service';
import {EquipmentCodeGroupHeaderService} from '../../../../../services/dto-services/maintenance-equipment/code-group-header.service';
import {EquipmentGroupCodeItemRequestDto} from '../../../../../dto/maintenance/equipment-group-code-item.dto';
import {environment} from '../../../../../../environments/environment';
import { UsersService } from 'app/services/users/users.service';
@Component({
  selector: 'code-group-item-new',
  templateUrl: './new.component.html'
})
export class NewCodeGroupItemComponent implements OnInit {
  selectedPlant: any;
    constructor(
              private _router: Router,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _userSvc: UsersService,
              private equipmentService: EquipmentCodeGroupItemService,
              private equipmentCodeGroupHeaderService: EquipmentCodeGroupHeaderService) {

  }
  @Output() saveAction = new EventEmitter<any>();
  params = {
    dialog: {title: '', inputValue: '', visible: false}
  };
  modal = {active: false};
  dataModel: EquipmentGroupCodeItemRequestDto = new EquipmentGroupCodeItemRequestDto();
  codeGroupHeaderList: any[];
  selectedCodeGroupHeader: any;

  ngOnInit() {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.dataModel.plantId = this.selectedPlant.plantId;
    } else {
      this.dataModel.plantId = null;
    }
      this.equipmentCodeGroupHeaderService.filter({pageSize: 1000, plantId:this.dataModel.plantId, pageNumber: 1})
        .then(r => {
          this.codeGroupHeaderList = r['content'];
        }).catch();
  }
  save() {
    this.loaderService.showLoader();
    this.dataModel.equipmentCodeGroupItemId = '';
    this.dataModel.equipmentCodeGroupheaderId = this.selectedCodeGroupHeader.equipmentCodeGroupHeaderId;
    this.equipmentService.save(this.dataModel)
      .then(result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.reset();
          this.saveAction.emit(result);
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }
  reset(){
    this.dataModel = new EquipmentGroupCodeItemRequestDto();
    this.dataModel.plantId = this.selectedPlant.plantId;
  }
}
