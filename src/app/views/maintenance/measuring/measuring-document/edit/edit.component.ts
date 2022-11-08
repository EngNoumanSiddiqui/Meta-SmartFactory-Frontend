import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
 
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {MeasuringDocumentService} from '../../../../../services/dto-services/measuring/measuring-document.service';
import {UsersService} from '../../../../../services/users/users.service';

@Component({
  selector: 'measuring-document-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditMeasuringDocumentComponent implements OnInit {

  dataModel = {
    'active': true,
    'counterReading': null,
    'employeeId': null,
    'measurementDocumentId': null,
    'equipmentCodeGroupHeaderId': null,
    'equipmentId': null,
    'equipmentMeasuringPointId': null,
    'measurementDate': null,
    'parameter': null,
    'valuationCode': '',
    plantId: null
  };

  modal = {
    active: false
  }
  selectedMeasurementPoint;
  detailMeasuringDocument;

  @Output() saveAction = new EventEmitter<any>();
  id;
  selectedMeasurementEquipment: any;
  selectedPlant: any;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  constructor(private measuringSvc: MeasuringDocumentService,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _userSvc: UsersService) {

    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.dataModel.plantId = this.selectedPlant.plantId;
    }

    /*this._route.params.subscribe((params) => {
     this.id = params['id'];
     this.operation.operationId = this.id;
     this.initialize(this.id);
     });*/
  }
  ngOnInit(){

  }

  private initialize(id) {
    this.loaderService.showLoader();
    this.measuringSvc.getDetail(id)
      .then(result => {
        this.detailMeasuringDocument = result;
        this.loaderService.hideLoader();
        if ((result['counterReading'])) {
          this.dataModel['counterReading'] = result['counterReading'];
        }
        if ((result['counterOverflowReading'])) {
          this.dataModel['counterOverflowReading'] = result['counterOverflowReading'];
        }
        if ((result['employee'])) {
          this.dataModel['employeeId'] = result['employee'].employeeId;
        }
        if ((result['equipmentMeasuringPoint'])) {
          this.selectedMeasurementPoint = result['equipmentMeasuringPoint'];
          this.dataModel['equipmentMeasuringPointId'] = result['equipmentMeasuringPoint'].equipmentMeasuringPointId;
        }
        if ((result['equipmentCodeGroupHeader'])) {
          this.dataModel['equipmentCodeGroupHeaderId'] = result['equipmentCodeGroupHeader'].equipmentCodeGroupHeaderId;
        }
        if ((result['equipment'])) {
          this.dataModel['equipmentId'] = result['equipment'].equipmentId;
          this.selectedMeasurementEquipment = result['equipment'];
        }
        if ((result['measurementDate'])) {
          this.dataModel['measurementDate'] = new Date(result['measurementDate']);
        }
        if ((result['measurementDocumentId'])) {
          this.dataModel['measurementDocumentId'] = result['measurementDocumentId'];
        }
        if ((result['equipmentMeasuringDocumentId'])) {
          this.dataModel['equipmentMeasuringDocumentId'] = result['equipmentMeasuringDocumentId'];
        }
        if ((result['parameter'])) {
          this.dataModel['parameter'] = result['parameter'];
        }
        if ((result['valuationCode'])) {
          this.dataModel['valuationCode'] = result['valuationCode'];
        }
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }
  setSelectedEmployee(employee) {
    if (employee) {
      this.dataModel.employeeId = employee.employeeId;
    } else {
      this.dataModel.employeeId = null;
    }
  }

  setSelectedMeasurementPoint(equipment) {
    this.selectedMeasurementPoint = equipment;
    if (equipment) {
      this.dataModel.equipmentMeasuringPointId = equipment.equipmentMeasuringPointId;
      if (equipment.equipment) {
        this.selectedMeasurementEquipment = equipment.equipment;
        this.dataModel.equipmentId = equipment.equipment?.quipmentId;
      }
    } else {
      this.dataModel.equipmentMeasuringPointId = null;
    }
  }


  reset() {


    this.dataModel = {
      'active': true,
      'counterReading': null,
      'employeeId': null,
      'equipmentCodeGroupHeaderId': null,
      'measurementDocumentId': null,
      'equipmentId': null,
      'equipmentMeasuringPointId': null,
      'measurementDate': null,
      'parameter': null,
      'valuationCode': null,
      plantId: null
    };
  }


  save() {
    this.loaderService.showLoader();

    this.measuringSvc.save(this.dataModel)
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


  cancel() {
    this.saveAction.emit('close');
    this.detailMeasuringDocument = null;
  }

}

