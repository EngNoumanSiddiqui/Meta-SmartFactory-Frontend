import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
 
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { DefectRecordingService } from 'app/services/dto-services/quality-inspection/defect-recording/defect-recording.service'
import { environment } from 'environments/environment';
import { DefectTypeService } from 'app/services/dto-services/defect-type/defect-type.service';
import { InspectionService } from 'app/services/dto-services/inspection-charateristics/inspection.service';

@Component({
  selector: 'edit-defect-recording',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditDefectRecording implements OnInit {
  defectRecording = {
    createDate: null,
    defectRecordingId: null,
    defectRecordingCode: null,
    codeGroupId: null,
    defectTypeId: null,
    inspectionCharacteristicId: null,
    inspectionLotId: null,
    inspectionLotResultRecordingId: null,
    inspectionOperationId: null,
    jobOrderId: null,
    stockId: null,
    updateDate: null,
  };
  
  

  id;
  defectTypes: any;
  inspectionCharacteristics: any;

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
    private _defectTypeService: DefectTypeService,
    private _inspectionService: InspectionService,
    private _defectRecordingService: DefectRecordingService) {
  }

  ngOnInit() {
    this._defectTypeService.filterDefectType({pageNumber: 1, pageSize: 9999}).then((res: any) => this.defectTypes = res['content']);
    this._inspectionService.filterInspCharacteristic({pageNumber: 1, pageSize: 9999}).then((res: any) => this.inspectionCharacteristics = res['content']);
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.defectRecording.defectRecordingId = this.id;
        this.initialize(this.id);
      }
    });
  }

  private initialize(id) {
    this.defectRecording.defectRecordingId = this.id;
    this.loaderService.showLoader();

    this._defectRecordingService.detailDefectRecording(id).then(
      (result: any ) => {
        this.loaderService.hideLoader();
        this.defectRecording = {
          createDate: result.createDate,
          defectRecordingId: result.defectRecordingId,
          defectRecordingCode: result.defectRecordingCode,
          codeGroupId: result.qualityCodeGroup ? result.qualityCodeGroup.codeGroupId : null,
          defectTypeId: result.qualityDefectType ? result.qualityDefectType.defectTypeId : null,
          inspectionCharacteristicId: result.qualityInspectionCharacteristic ? result.qualityInspectionCharacteristic.inspectionCharacteristicId : null,
          inspectionLotId: result.qualityInspectionLot ? result.qualityInspectionLot.inspectionLotId : null,
          inspectionLotResultRecordingId: result.qualityInspectionLotResultRecording ? result.qualityInspectionLotResultRecording.inspectionlotResultRecordingId : null,
          inspectionOperationId: result.qualityInspectionOperation ? result.qualityInspectionOperation.inspectionOperationId : null,
          jobOrderId: result.jobOrder ? result.jobOrder.jobOrderId : null,
          stockId: result.stock ? result.stock.stockId : null,
          updateDate: result.updateDate,
        };
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }
  
  save() {
    this.loaderService.showLoader();
    this._defectRecordingService.saveDefectRecording(this.defectRecording)
    .then(result => {
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

  cancel() {
    this.saveAction.emit('close');
  }
}
