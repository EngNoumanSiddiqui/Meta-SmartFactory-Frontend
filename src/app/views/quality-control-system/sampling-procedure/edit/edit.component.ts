import {Component, EventEmitter, Input, OnInit, Output, AfterViewInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
 
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { SamplingProcedureService } from 'app/services/dto-services/sampling-procedure/sampling-procedure.service';
import { environment } from 'environments/environment';
import { SamplingProcedurePointService } from 'app/services/dto-services/sampling-procedure/sampling-procedure-point.service';
@Component({
  selector: 'edit-sampling-procedure',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditSamplingProcedure implements OnInit {
  samplingProcedure = {
    createDate: null,
    samplingProcedureId: null,
    acceptance: null,
    sampleSize: null,
    samplingProcedureCode: null,
    samplingProcedureName: null,
    samplingProcedureInspectionPointId: null,
    qualitySamplingProcedureUsageIndicatorId: null,
    samplingProcedureValuationModeId: null,
    samplingTypeId: null,
    updateDate: null,
    plantId: null
  }

  id;

  // tableTypeForImg = TableTypeEnum.COMPANY;
  // @ViewChild(ImageAdderComponent, {static: false}) imageAdderComponent: ImageAdderComponent;
  @Input() plantId = null;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  myModal;

  params = {
    cityDisabled: true,
    dialog: {
      title: '',
      inputText: '',
      inputValue: ''
    },
    displayDialog: false,
  };

  @Output() saveAction = new EventEmitter<any>();
  lastAccountNos;

  constructor(
    private _route: ActivatedRoute,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _samplingProcedure: SamplingProcedureService
    ) {
  }

  ngOnInit() {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.samplingProcedure.samplingProcedureId = this.id;
        this.initialize(this.id);
      }
    });
  }

  private initialize(id) {
    this.samplingProcedure.samplingProcedureId = this.id;
    this.loaderService.showLoader();

    this._samplingProcedure.detailSamplingProcedure(id).then(
      result => {
        this.loaderService.hideLoader();
        if ((result['samplingProcedureCode'])) {
          this.samplingProcedure.samplingProcedureCode = result['samplingProcedureCode'];
        }
        if ((result['samplingProcedureName'])) {
          this.samplingProcedure.samplingProcedureName = result['samplingProcedureName'];
        }
       
        if ((result['sampleSize'])) {
          this.samplingProcedure.sampleSize = result['sampleSize'];
        }
        if ((result['acceptance'])) {
          this.samplingProcedure.acceptance = result['acceptance'];
        }
        if ((result['samplingType'])) {
          this.samplingProcedure.samplingTypeId = result['samplingType'].samplingTypeId;
        }
        if ((result['samplingProcedureUsageIndicator'])) {
          this.samplingProcedure.qualitySamplingProcedureUsageIndicatorId = result['samplingProcedureUsageIndicator'].samplingProcedureUsageIndicatorId;
        }
        if ((result['samplingProcedureValuationMode'])) {
          this.samplingProcedure.samplingProcedureValuationModeId = result['samplingProcedureValuationMode'].samplingProcedureValuationModeId;
        }
        if ((result['samplingProcedureInspectionPoint'])) {
          this.samplingProcedure.samplingProcedureInspectionPointId = result['samplingProcedureInspectionPoint'].samplingProcedurePointId;
        }
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  save() {
    this.loaderService.showLoader();
    this.samplingProcedure.plantId = this.plantId;
    this._samplingProcedure.updateSamplingProcedure(this.samplingProcedure).then(
      result => {
        console.log("save result", result)

        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  onselectSamplingType(event) {
    if (event) {
      this.samplingProcedure.samplingTypeId = event.samplingTypeId;
    } else {
      this.samplingProcedure.samplingTypeId = null;
    }
  }
  onselectSamplingProcValueMode(event) {
    if (event) {
      this.samplingProcedure.samplingProcedureValuationModeId = event.samplingProcedureValuationModeId;
    } else {
      this.samplingProcedure.samplingProcedureValuationModeId = null;
    }
  }
  onselectInspPoint(event) {
    if (event) {
      this.samplingProcedure.samplingProcedureInspectionPointId = event.samplingProcedurePointId;
    } else {
      this.samplingProcedure.samplingProcedureInspectionPointId = null;
    }
  }

  cancel() {
    this.saveAction.emit('close');
  }
}
