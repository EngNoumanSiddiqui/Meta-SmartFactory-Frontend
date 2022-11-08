import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
 
import {EmployeeService} from '../../../../services/dto-services/employee/employee.service';
import {WorkstationService} from '../../../../services/dto-services/workstation/workstation.service';
import {PartService} from '../../../../services/dto-services/part/part.service';
import {MaintenanceService} from '../../../../services/dto-services/maintenance/maintenance.service';
import {EnumMaintenanceTypeService} from '../../../../services/dto-services/enum/maintenance-type.service';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import {environment} from '../../../../../environments/environment';


@Component({
  selector: 'maintenance-edit',
  templateUrl: './edit.component.html'
})
export class EditMaintenanceComponent implements OnInit {

  maintenance = {
    'maintenanceId': 0,
    'maintenanceNo': null,
    'maintenanceType': null,
    'workStationId': null,
    'description': null,
    'plannedDate': null,
    'comments': null,
    'maintenanceEmployeeIdList': [],
    'maintenanceEmployeeDtoList': [],
    'maintenancePartDtoList': []
  };

  @Output() saveAction = new EventEmitter<any>();
  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  params = {
    dialog: {title: '', inputValue: ''}
  };

  filterEmployee = {pageNumber: 1, pageSize: 500, firstName: null, employeeTitleName: null, employeeName: null};
  filterPart = {pageNumber: 1, pageSize: 500, partName: null};
  filterWorkstation = {pageNumber: 1, pageSize: 500, workStationName: null};

  workStationList;
  employeeList;
  partList;
  maintenanceTypes;

  constructor(private _employeeSvc: EmployeeService,
              private _workStationSvc: WorkstationService,
              private _route: ActivatedRoute,
              private _maintenanceTypeSvc: EnumMaintenanceTypeService,
              private _router: Router,
              private _partSvc: PartService,
              private _maintenanceSvc: MaintenanceService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService) {

    /* this._route.params.subscribe((params) => {
     this.id = params['id'];
     this.maintenance.maintenanceId = params['id'];
     console.log(this.id);
     });*/

  }

  private initialize(id) {
    this.maintenance.maintenanceId = this.id;
    this.loaderService.showLoader();
    this._maintenanceSvc.getUpdateDetail(this.id).then(result => {
      this.loaderService.hideLoader();
      if ((result['maintenanceNo'])) {
        this.maintenance.maintenanceNo = result['maintenanceNo'];
      }
      if ((result['description'])) {
        this.maintenance.description = result['description'];
      }

      if ((result['plannedDate'])) {
        this.maintenance.plannedDate = new Date(result['plannedDate']);
      }
      if ((result['workStationId'])) {
        this.maintenance.workStationId = result['workStationId'];
      }
      if ((result['comments'])) {
        this.maintenance.comments = result['comments'];
      }
      if ((result['maintenanceType'])) {
        this.maintenance.maintenanceType = result['maintenanceType'];
      }
      if ((result['maintenanceEmployeeDtoList'])) {
        this.maintenance.maintenanceEmployeeDtoList = result['maintenanceEmployeeDtoList'];
      }
      if ((result['maintenancePartDetailDtoList'])) {
        this.maintenance.maintenancePartDtoList = result['maintenancePartDetailDtoList'];
      }
      /*this.initialize(result)*/
    }).catch(error => {
      this.loaderService.hideLoader();
      console.log(error)
    });
  }

  ngOnInit() {
    this._maintenanceTypeSvc.getEnumList().then(result => this.maintenanceTypes = result)
      .catch(err => {
        this.utilities.showErrorToast(err);
      });
    this._workStationSvc.filter(this.filterWorkstation).then(result => this.workStationList = result['content']).catch(err => {
      this.utilities.showErrorToast(err);
    });
    this.getEmployeeItems();
    this.getPartItems();

  }

  deletePartFromList(item) {
    this.maintenance.maintenancePartDtoList = this.maintenance.maintenancePartDtoList.filter(part => part.partId !== item['partId']);
  }

  deleteEmployeeFromList(item) {
    this.maintenance.maintenanceEmployeeDtoList = this.maintenance.maintenanceEmployeeDtoList.filter(emp => emp.employeeId !== item['employeeId']);
  }

  addPartList(item) {
    item.quantity = 1;
    item.unit = '';
    this.maintenance.maintenancePartDtoList.push(item);
  }

  addEmployeeList(item) {
    this.maintenance.maintenanceEmployeeDtoList.push(item);
  }


  getPartItems() {
    this._partSvc.filter(this.filterPart).then(result => this.partList = result['content']).catch(err => {
      this.utilities.showErrorToast(err);
    });
  }

  getEmployeeItems() {
    this._employeeSvc.filter(this.filterEmployee).then(result => this.employeeList = result['content']).catch(err => {
      this.utilities.showErrorToast(err);
    })
  }

  goPage() {
    this._router.navigate(['/settings/maintenance']);
  }

  save() {
    this.loaderService.showLoader();
    const myIdList = [];
    for (const emp of this.maintenance.maintenanceEmployeeDtoList) {
      myIdList.push(emp.employeeId);
    }
    this.maintenance.maintenanceEmployeeIdList = myIdList;
    this._maintenanceSvc.update(this.maintenance)
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


  cancel() {
    this.goPage();
  }


}
