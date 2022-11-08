import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {OperationService} from '../../../../services/dto-services/operation/operation.service';
 
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { ConvertUtil } from 'app/util/convert-util';


@Component({
  selector: 'operation-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailOperationComponent implements OnInit {
  id;
  selectedWorkStationIdList: any;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  operation: any = {
    'operationId': '',
    'plant':null,
    'employeeFirstName': '',
    'employeeLastName': '',
    'operationNo': '',
    singleDuration: null,
    location: null,
    singleSetupDuration: null,
    maxSingleStandbyDuration: null,
    'operationName': '',
    operationCostRate: null,
    'operationType': null,
    unit: null,
    factoryCalendar: null,
    outsource: null,
    postponeNextOperation: false,
    transfer: false,
    'operationStatus': '',
    'description': '',
    'operationWorkStationList': []
  };

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private utilities: UtilitiesService,
              private _operationSvc: OperationService,
              private loaderService: LoaderService) {

    this._route.params.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.initialize(this.id);
      }
    });
  }

  private initialize(id) {
    this.loaderService.showLoader();
    this.operation.operationId = id;
    this._operationSvc.getDetail(id)
      .then(result => {
        if ((result['operationId'])) {
          this.operation['operationId'] = result['operationId'];
        }
        if ((result['employeeFirstName'])) {
          this.operation['employeeFirstName'] = result['employeeFirstName'];
        }
        if ((result['employeeLastName'])) {
          this.operation['employeeLastName'] = result['employeeLastName'];
        }
        if ((result['transfer'])) {
          this.operation.transfer = result['transfer'];
        }
        this.operation['unit'] = result['unit'];
        if ((result['postponeNextOperation'])) {
          this.operation.postponeNextOperation = result['postponeNextOperation'];
        }
        if ((result['operationNo'])) {
          this.operation['operationNo'] = result['operationNo'];
        }
        this.operation.operationCostRate = result['operationCostRate'];
        if ((result['operationName'])) {
          this.operation['operationName'] = result['operationName'];
        }
        if ((result['operationType'])) {
          this.operation['operationType'] = result['operationType'];
        }
        if ((result['operationStatus'])) {
          this.operation['operationStatus'] = result['operationStatus'];
        }
        if ((result['plant'])) {
          this.operation['plant'] = result['plant'];
        }
        if ((result['factoryCalendar'])) {
          this.operation['factoryCalendar'] = result['factoryCalendar'];
        }
        if ((result['outsource'])) {
          this.operation['outsource'] = result['outsource'];
        }
        this.operation.ssingleSetupDuration = ConvertUtil.longDuration2DHHMMSSsssTime(result['singleSetupDuration']);
        this.operation.ssingleDuration = ConvertUtil.longDuration2DHHMMSSsssTime(result['singleDuration']);
        this.operation.smaxSingleStandbyDuration = ConvertUtil.longDuration2DHHMMSSsssTime(result['maxSingleStandbyDuration']);
        this.operation.location = result['location'];
        this.operation.currency = result['currency'];
        if ((result['description'])) {
          this.operation['description'] = result['description'];
        }
        if ((result['operationWorkStationList'])) {
          this.operation['operationWorkStationList'] = result['operationWorkStationList'];
          this.selectedWorkStationIdList = this.operation.operationWorkStationList;
        }
        this.loaderService.hideLoader();
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  ngOnInit() {
  }

  goPage(id) {
    if (id === -1) {
      this._router.navigate(['/settings/operations/new']);
    } else {
      this._router.navigate(['/settings/operations/edit/' + id]);
    }
  }

  showWorkStationDetail(workstationId){
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, workstationId);
  }

  showDetailDialog(id){
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, id);
  }

  showLocationDetail(id) { 
    this.loaderService.showDetailDialog(DialogTypeEnum.LOCATION, id);
  }

}

