import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
/**
 * Created by reis on 31.07.2019.
 */

@Component({
  selector: 'code-group-item-edit',
  templateUrl: './edit.component.html'
})
export class EditCodeGroupItemsComponent implements OnInit {
  selectedPlant: any;
  codeGroupHeaderList = [];
  constructor(private _router: Router,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _userSvc: UsersService,
              private equipmentCodeGroupHeaderService: EquipmentCodeGroupHeaderService,
              private equipmentService: EquipmentCodeGroupItemService,
             ) {

  }

  @Output() saveAction = new EventEmitter<any>();
  id;
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  params = {
    dialog: {title: '', inputValue: '', visible: false}
  };
  selectedCodeGroupHeader: any;
  modal = {active: false};
  dataModel: EquipmentGroupCodeItemRequestDto = new EquipmentGroupCodeItemRequestDto();

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
    // this.initialize(this.id);
  }

  private initialize(id) {
    this.loaderService.showLoader();
    this.equipmentService.getDetail(this.id)
      .then(result => {
        this.loaderService.hideLoader();
        if (result) {
          this.dataModel.equipmentCodeGroupItemId = this.id;
          this.dataModel.parameter = result['parameter'];
          this.dataModel.plantId = this.selectedPlant.plantId;
          this.dataModel.shortText = result['shortText'];
          this.selectedCodeGroupHeader = result['equipmentCodeGroupheader'];
        }

      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  save() {
    this.loaderService.showLoader();
    //this.dataModel.equipmentAbcIndicatorId = '';
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

  reset() {
    this.dataModel.parameter = null;
    this.dataModel.shortText = null;
  }
}
