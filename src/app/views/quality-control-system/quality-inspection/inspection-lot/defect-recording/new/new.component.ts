import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { DefectRecordingService } from 'app/services/dto-services/quality-inspection/defect-recording/defect-recording.service';
import { InspectionService } from 'app/services/dto-services/inspection-charateristics/inspection.service';
import { DefectTypeService } from 'app/services/dto-services/defect-type/defect-type.service';
import { UsersService } from 'app/services/users/users.service';
@Component({
  selector: 'new-defect-recording',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewDefectRecording implements OnInit{
  @Input() fromAutoComplete = false;
  @Output() saveAction = new EventEmitter<any>();

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
  }
  selectedPlant: any;
  codeGroups = [];
  defectTypes = [];
  inspectionCharacteristics = [];
  inspectionOperations = [];
  inspectionLots = [];
  resultRecordings = [];
  jobOrders = [];

  constructor(
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _defectRecordingService: DefectRecordingService,
    private _defectTypeService: DefectTypeService,
    private _inspectionService: InspectionService,
    private _userSvc: UsersService,
  ) {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.defectRecording.stockId = this.selectedPlant.plantId;
    }
  }

  ngOnInit() {
    // this._codeGroupService.filter({pageNumber: 1, pageSize: 9999}).then((res: any) => this.codeGroups = res['content']);
    this._defectTypeService.filterDefectType({pageNumber: 1, pageSize: 9999}).then((res: any) => this.defectTypes = res['content']);
    this._inspectionService.filterInspCharacteristic({pageNumber: 1, pageSize: 9999}).then((res: any) => this.inspectionCharacteristics = res['content']);
    // this._inspectionOperationsService.filterInspectionOperation({pageNumber: 1, pageSize: 9999}).then((res: any) => this.inspectionOperations = res['content']);
    // this._inspectionLotService.filterInspectionLot({pageNumber: 1, pageSize: 9999}).then((res: any) => this.inspectionLots = res['content']);
    // this._resultRecordingService.filterResultRecording({pageNumber: 1, pageSize: 9999}).then((res: any) => this.resultRecordings = res['content']);
    // this._jobOrderService.filter({pageNumber: 1, pageSize: 9999}).then((res: any) => this.jobOrders = res['content']);
  }
  
 

  save() {
    this.loaderService.showLoader();
    this._defectRecordingService.saveDefectRecording(this.defectRecording).then(
      result => {
        // this.defectRecording.defectRecordingId = result.defectRecordingId;
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      },
      error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
      }
    );
  }

}
