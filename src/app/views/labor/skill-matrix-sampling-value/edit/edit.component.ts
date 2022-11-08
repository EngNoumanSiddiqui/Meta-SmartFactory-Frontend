import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import {environment} from '../../../../../environments/environment';
import * as moment from 'moment';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { SkillMatrixSamplingValueService } from 'app/services/dto-services/skill-matrix-report/skill-matrix-sampling-value.service';
@Component({
  selector: 'skill-matrix-sampling-value-edit',
  templateUrl: './edit.component.html'
})
export class EditSkillMatrixSamplingValueComponent implements OnInit {
  @Output()saveAction= new EventEmitter<any>();

  samplingValue = {
    groupType: null,
    max: null,
    min: null,
    skillMatrixSamplingValueId: null,
    value: null,
    plantId: null,
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

  id;
  
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };
  @Input('data') set zdata(data) {
    
    if (data) {
      this.samplingValue = Object.assign({}, data);
    }
  };

  constructor( private _enumService: EnumService,
    private skillSamplingSrvc: SkillMatrixSamplingValueService,
              private loaderService: LoaderService, private utilities: UtilitiesService) {}

  private initialize(id) {
    this.loaderService.showLoader();
    this.samplingValue.skillMatrixSamplingValueId = this.id;
    this.skillSamplingSrvc.details(id)
      .then(result => {
        this.loaderService.hideLoader();
        this.samplingValue = {
          groupType: result['groupType'],
          max: result['max'],
          min: result['min'],
          plantId: this.samplingValue.plantId,
          skillMatrixSamplingValueId: result['skillMatrixSamplingValueId'],
          value: result['value'],
          color: result['color']
        };
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  ngOnInit() {
    
    this._enumService.getSkillMatrixGroupTypeEnum().then(result => this.SkillMatrixTypes = result).catch(error => console.log(error));
  }

  save() {
      this.loaderService.showLoader();
      this.skillSamplingSrvc.save(this.samplingValue)
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

  reset() {
    this.samplingValue = {
      groupType: null,
      max: null,
      plantId: this.samplingValue.plantId,
      min: null,
      skillMatrixSamplingValueId: this.samplingValue.skillMatrixSamplingValueId,
      value: null,
      color: '#d1043e'
    };
  }

}

