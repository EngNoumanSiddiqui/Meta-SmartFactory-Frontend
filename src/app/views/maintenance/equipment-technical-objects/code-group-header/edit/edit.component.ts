import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {EquipmentCodeGroupHeaderService} from '../../../../../services/dto-services/maintenance-equipment/code-group-header.service';
import {environment} from '../../../../../../environments/environment';
import {EquipmentGroupCodeHeaderRequestDto} from '../../../../../dto/maintenance/equipment-group-code-header.dto';
 
import {UsersService} from '../../../../../services/users/users.service';
/**
 * Created by reis on 31.07.2019.
 */

@Component({
  selector: 'code-group-header-edit',
  templateUrl: './edit.component.html'
})
export class EditCodeGroupHeaderComponent implements OnInit {


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
  modal = {active: false};
  dataModel: EquipmentGroupCodeHeaderRequestDto = new EquipmentGroupCodeHeaderRequestDto();

  detailData;
  selectedPlant: any;


  constructor(private _router: Router,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private equipmentService: EquipmentCodeGroupHeaderService,
              private _userSvc: UsersService) {

    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.dataModel.plantId = this.selectedPlant.plantId;
    } else {
      this.dataModel.plantId = null;
    }
  }


  ngOnInit() {
    this.initialize(this.id);
  }


  private initialize(id) {

    this.loaderService.showLoader();
    this.equipmentService.getDetail(this.id)
      .then(result => {
        this.loaderService.hideLoader();
        this.detailData = result;

        if ((result['equipmentCodeGroup'])) {
          this.dataModel.equipmentCodeGroupId = result['equipmentCodeGroup'].equipmentCodeGroupId;
        }
        if ((result['codeGroup'])) {
          this.dataModel.codeGroup = result['codeGroup'];
        }
        if ((result['equipmentCodeGroupHeaderId'])) {
          this.dataModel.equipmentCodeGroupHeaderId = result['equipmentCodeGroupHeaderId'];
        }
        if ((result['shortText'])) {
          this.dataModel.shortText = result['shortText'];
        }


      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }
  setSelectedCodeGroup(codeGroup) {
    if (codeGroup) {
      this.dataModel.equipmentCodeGroupId = codeGroup.equipmentCodeGroupId;
    } else {
      this.dataModel.equipmentCodeGroupId = null;

    }
  }

  save() {
    this.loaderService.showLoader();
    this.equipmentService.save(this.dataModel)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.detailData = null;
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  cancel() {
    this.saveAction.emit('close');
  }
}
