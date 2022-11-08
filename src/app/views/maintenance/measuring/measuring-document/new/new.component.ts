import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {MeasuringDocumentService} from '../../../../../services/dto-services/measuring/measuring-document.service';
import {UsersService} from '../../../../../services/users/users.service';

@Component({
  selector: 'new-measuring-document',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewMeasuringDocumentComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  dataModel = {
    'active': true,
    'counterReading': null,
    'createDate': null,
    'employeeId': null,
    'measurementDocumentId': null,
    'equipmentCodeGroupHeaderId': null,
    'equipmentId': null,
    'equipmentMeasuringPointId': null,
    'measurementDate': null,
    'parameter': null,
    'updateDate': null,
    'valuationCode': null,
    plantId: null
  };

  selectedMeasurementPoint;
  selectedPlant: any;

  modal = {
    active: false
  }

  constructor(private _router: Router,
              private utilities: UtilitiesService,
              private measuringSvc: MeasuringDocumentService,
              private loaderService: LoaderService,
              private _userSvc: UsersService) {

    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.dataModel.plantId = this.selectedPlant.plantId;
    }

  }

  ngOnInit() {
  }


  setSelectedMeasurementPoint(equipment) {
    console.log('Measuerement---', equipment);

    this.selectedMeasurementPoint = equipment;
    if (equipment) {
      this.dataModel.equipmentMeasuringPointId = equipment.equipmentMeasuringPointId;
      this.dataModel.equipmentId = equipment.equipment.equipmentId;
      this.dataModel.equipmentCodeGroupHeaderId = equipment.equipmentCodeGroupHeader ? equipment.equipmentCodeGroupHeader.equipmentCodeGroupHeaderId : null;

    } else {
      this.dataModel.equipmentMeasuringPointId = null;
    }
  }

  setSelectedEmployee(employee) {
    if (employee) {
      this.dataModel.employeeId = employee.employeeId;
    } else {
      this.dataModel.employeeId = null;
    }
  }


  reset() {


    this.dataModel = {
      'active': true,
      'counterReading': null,
      'createDate': null,
      'employeeId': null,
      'measurementDocumentId': null,
      'equipmentCodeGroupHeaderId': null,
      'equipmentId': null,
      'equipmentMeasuringPointId': null,
      'measurementDate': null,
      'parameter': null,
      'updateDate': null,
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


}
