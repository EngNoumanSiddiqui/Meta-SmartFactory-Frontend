import {Component, Input, OnInit} from '@angular/core';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import * as moment from 'moment';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { SkillMatrixSamplingValueService } from 'app/services/dto-services/skill-matrix-report/skill-matrix-sampling-value.service';
@Component({
  selector: 'skill-matrix-sampling-value-detail',
  templateUrl: './detail.component.html'
})
export class DetailSkillMatrixSamplingValueComponent implements OnInit {


 
  samplingValue = {
    groupType: null,
    max: null,
    min: null,
    skillMatrixSamplingValueId: null,
    value: null,
    color: '#d1043e'
  };

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
  constructor(
    private skillSamplingSrvc: SkillMatrixSamplingValueService,
              private loaderService: LoaderService, private utilities: UtilitiesService) {

    
  }

  private initialize(id) {
    this.loaderService.showLoader();

    this.skillSamplingSrvc.details(id).then((result: any) => {
        this.loaderService.hideLoader();
        this.samplingValue = result;
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  ngOnInit() {
  }
}

