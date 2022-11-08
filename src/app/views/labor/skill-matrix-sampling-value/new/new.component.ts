
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../services/shared/loader.service';
import {environment} from '../../../../../environments/environment';
import {UtilitiesService} from '../../../../services/utilities.service';
import { SkillMatrixSamplingValueService } from 'app/services/dto-services/skill-matrix-report/skill-matrix-sampling-value.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';

@Component({
  selector: 'skill-matrix-sampling-value-new',
  templateUrl: './new.component.html'
})
export class NewSkillMatrixSamplingValueComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  samplingValue = {
    groupType: null,
    max: null,
    min: null,
    plantId: null,
    skillMatrixSamplingValueId: null,
    value: null,
    color: '#d1043e'
  };

  @Input("plantId") set setPlantID(plantId) {
    if(plantId) {
      this.samplingValue.plantId = plantId;
    }
  }

  stopCauseTypeList;
  stopCauseStatus;
  SkillMatrixTypes: any;

  constructor(private _router: Router,
    private _enumService: EnumService,
    private skillSamplingSrvc: SkillMatrixSamplingValueService,
              private loaderService: LoaderService, private utilities: UtilitiesService) {

  }

  ngOnInit() {
    this._enumService.getSkillMatrixGroupTypeEnum().then(result => this.SkillMatrixTypes = result).catch(error => console.log(error));
  }

  reset() {
    this.samplingValue = {
      groupType: null,
      max: null,
      min: null,
      plantId: this.samplingValue.plantId,
      skillMatrixSamplingValueId: null,
      value: null,
      color: '#d1043e'
    };
  }

  save() {
    
    this.loaderService.showLoader();
    this.skillSamplingSrvc.save(this.samplingValue)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
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

