import {Component, OnInit, Output, EventEmitter, Input, OnChanges} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UtilitiesService} from 'app/services/utilities.service';
import {LoaderService} from 'app/services/shared/loader.service';
 
import {environment} from '../../../../../../environments/environment';
import {CmsTypeService} from '../../../../../services/dto-services/print/cms-type.service';
import {UsersService} from '../../../../../services/users/users.service';
import {EnumService} from '../../../../../services/dto-services/enum/enum.service';

@Component({
  selector: 'common-template-type-edit',
  templateUrl: './common-template-type-edit.component.html',
  styleUrls: ['./common-template-type-edit.component.scss']
})
export class CommonTemplateTypeEditComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();
  id;

  templateTypeDto = {
    'commonTempleteTypeId': 0,
    'commonTempleteTypeCode': null,
    'commonTempleteTypeDescription': null,
    plantId: null
  }

  @Input('id')
  set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  selectedPlant: any;
  commonTemplateTypeList: any[];

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private cmsTypeService: CmsTypeService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService,
              private _userSvc: UsersService,
              private enumService: EnumService) {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.templateTypeDto.plantId = this.selectedPlant.plantId;
    }
  }

  ngOnInit() {
    // console.log("@onEdit",this.id);
    this.enumService.getCommonTemplateTypeEnum().then(result => {
      this.commonTemplateTypeList = result;
    }).catch(error => {
      console.error(error);
    });
  }

  private initialize(id) {
    this.templateTypeDto.commonTempleteTypeId = this.id;
    this.loaderService.showLoader();
    this.cmsTypeService.detail(this.id).then(result => {
      console.log('#onEdit', result);
      this.loaderService.hideLoader();
      if ((result['commonTempleteTypeCode'])) {
        this.templateTypeDto.commonTempleteTypeCode = result['commonTempleteTypeCode'];
      }
      if ((result['commonTempleteTypeDescription'])) {
        this.templateTypeDto.commonTempleteTypeDescription = result['commonTempleteTypeDescription'];
      }
    }).catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error)
      console.log(error)
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
      'commonTempleteTypeId': 0,
      'commonTempleteTypeCode': null,
      'commonTempleteTypeDescription': null,
      plantId: this.selectedPlant?.plantId
    }
  }
}
