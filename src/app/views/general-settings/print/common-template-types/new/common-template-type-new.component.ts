import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {UtilitiesService} from 'app/services/utilities.service';
import {LoaderService} from 'app/services/shared/loader.service';
import {environment} from '../../../../../../environments/environment';
import {CmsTypeService} from '../../../../../services/dto-services/print/cms-type.service';
import {UsersService} from '../../../../../services/users/users.service';
import {EnumService} from '../../../../../services/dto-services/enum/enum.service';

@Component({
  selector: 'common-template-type-new',
  templateUrl: './common-template-type-new.component.html',
  styleUrls: ['./common-template-type-new.component.scss']
})
export class CommonTemplateTypeNewComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();

  templateTypeDto = {
    'commonTempleteTypeCode': null,
    'commonTempleteTypeDescription': null,
    plantId: null
  }

  selectedPlant: any;
  commonTemplateTypeList: any[];

  constructor(
    private cmsTypeService: CmsTypeService,
    private utilities: UtilitiesService,
    private loaderService: LoaderService,
    private _userSvc: UsersService,
    private enumService: EnumService
  ) {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.templateTypeDto.plantId = this.selectedPlant.plantId;
    }
  }

  ngOnInit() {
    this.enumService.getCommonTemplateTypeEnum().then(result => {
      this.commonTemplateTypeList = result;
    }).catch(error => {
      console.error(error);
    });
  }

  save() {
    this.loaderService.showLoader();
    console.log('@beforeSave', this.templateTypeDto);
    this.cmsTypeService.save(this.templateTypeDto)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.reset();
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  reset() {
    this.templateTypeDto = {
      'commonTempleteTypeCode': null,
      'commonTempleteTypeDescription': null,
      plantId: this.selectedPlant?.plantId
    }
  }

}
