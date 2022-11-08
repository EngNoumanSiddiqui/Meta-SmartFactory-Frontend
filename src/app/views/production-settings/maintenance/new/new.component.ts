import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Message} from 'primeng';
import {MaintenanceService} from '../../../../services/dto-services/maintenance/maintenance.service';
import {PartService} from '../../../../services/dto-services/part/part.service';
import {WorkstationService} from '../../../../services/dto-services/workstation/workstation.service';
import {EmployeeService} from '../../../../services/dto-services/employee/employee.service';
import {EnumMaintenanceTypeService} from '../../../../services/dto-services/enum/maintenance-type.service';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'maintenance-new',
  templateUrl: './new.component.html'
})
export class NewMaintenanceComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  msgs: Message[] = [];
  maintenance = {
    'maintenanceNo': null,
    'maintenanceType': null,
    'workStationId': null,
    'description': null,
    'plannedDate': null,
    'maintenanceEmployeeIdList': [],
    'maintenancePartDtoList': []
  };
  params = {
    employeeName: null,
    employeeTitleName: null,
    dialog: {title: '', inputValue: ''}
  };

  filterEmployee = {pageNumber: 1, pageSize:500, employeeName: null};
  filterPart = {pageNumber: 1, pageSize:500, partName: null};
  filterWorkstation = {pageNumber: 1, pageSize:500, workStationName: null};

  workStationList;
  employeeList;
  partList;
  maintenanceTypes;
  selectedEmployeeList = [];

  constructor(private _router: Router,
              private _maintenanceSvc: MaintenanceService,
              private _maintenanceTypeSvc: EnumMaintenanceTypeService,
              private _translateSvc: TranslateService,
              private _partSvc: PartService,
              private _employeeSvc: EmployeeService,
              private _workStationSvc: WorkstationService, private utilities: UtilitiesService,
              private loaderService: LoaderService) {

  }

  ngOnInit() {
    this._maintenanceTypeSvc.getEnumList().then(result => this.maintenanceTypes = result).catch(err => this.showError(err));
    this._workStationSvc.filter(this.filterWorkstation).then(result => this.workStationList = result['content']).catch(err => this.showError(err));
    this.getEmployeeItems();
    this.getPartItems();
  }

  goPage() {
    this._router.navigate(['/settings/maintenance']);
  }

  save() {
    this.loaderService.showLoader();
    this._maintenanceSvc.save(this.maintenance)
      .then(result  => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.reset();
          this.saveAction.emit(result);
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }


  addPartList(item) {
    item.quantity = 1;
    item.unit = '';
    this.maintenance.maintenancePartDtoList.push(item);
  }

  addEmployeeList(item) {
    this.selectedEmployeeList.push(item);
  }

  deletePartFromList(item) {
    this.maintenance.maintenancePartDtoList = this.maintenance.maintenancePartDtoList.filter(part => part.partId !== item['partId']);
  }

  deleteEmployeeFromList(item) {
    this.selectedEmployeeList = this.selectedEmployeeList.filter(emp => emp.employeeId !== item['employeeId']);
  }


  getPartItems() {
    this._partSvc.filter(this.filterPart).then(result => this.partList = result['content']).catch(err => this.showError(err));
  }

  getEmployeeItems() {
    this._employeeSvc.filter(this.filterEmployee).then(result => this.employeeList = result['content']).catch(err => this.showError(err))
  }

  reset() {
    this.maintenance = {
      'maintenanceNo': null,
      'maintenanceType': null,
      'workStationId': null,
      'description': null,
      'plannedDate': null,
      'maintenanceEmployeeIdList': [],
      'maintenancePartDtoList': []
    };
  }

  /************************* TOASTR & PRIME NG Messages  *************************/
  // Prime NG Growl in other ways Toaster
  showMessage(severity: string, summary: string, detail: string) {
    this.msgs.push({
      severity: severity,
      summary: this._translateSvc.instant(summary),
      detail: this._translateSvc.instant(detail)
    });
    setTimeout(() => {
      this.clearMessage();
    }, 4000);
  }

  clearMessage() {
    this.msgs = [];
  }

  showError(error) {
            let mess = ''; if (error.toString().indexOf('fieldErrors')>0) {      error = JSON.parse(error);    }
    if (error['fieldErrors'] && error['fieldErrors'].length > 0) {
      for (const msg of error['fieldErrors']) {
        mess += this.msgs + '<strong>' + msg['field'].toString() + '</strong> :' + msg['message'].toString() + '</br>';
      }
      this.showMessage('error', 'error', mess);
    } else if (error['errorCode']) {
      this.showMessage('error', 'error', error['errorCode']);
    } else {
      this.showMessage('error', 'error', error);
    }
  }

  isValidate() {
    let message = '';

    // if (this.maintenance.quantity === '' )     { message  += '[' + this._translateSvc.instant('quantity') + '] '; }
    // if (this.maintenance.wareHouseIdx === '' ) { message  += '[' + this._translateSvc.instant('warehouse') + '] '; }
    // if (this.maintenance.orderQuantity === '' ){ message  += '[' + this._translateSvc.instant('order-quantity' ) + '] '; }

    if (message === '') {
      return true;
    } else {
      message += this._translateSvc.instant('have-to-be-defined')
      this.utilities.showWarningToast(message);
      return false;
    }
  }
}
