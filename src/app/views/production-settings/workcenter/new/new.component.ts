import {Component, EventEmitter, OnInit, Output, ViewChild, OnDestroy, Input} from '@angular/core';
import {Router} from '@angular/router';
import {WorkcenterService} from '../../../../services/dto-services/workcenter/workcenter.service';
import {WorkcenterTypeService} from '../../../../services/dto-services/workcenter-type/workcenter-type.service';
import {EmployeeService} from '../../../../services/dto-services/employee/employee.service';
import {ImageAdderComponent} from '../../../image/image-adder/image-adder.component';
import {TableTypeEnum} from '../../../../dto/table-type-enum';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import {environment} from '../../../../../environments/environment';
import { Subscription } from 'rxjs';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'workcenter-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewWorkcenterComponent implements OnInit, OnDestroy {
  @ViewChild(ImageAdderComponent) imageAdderComponent: ImageAdderComponent;
  @Output() saveAction = new EventEmitter<any>();
  selectedPlant: any;
  @Input() fromModal = false;
  workcenter = {
    'description': null,
    'plantId': null,
    'workCenterName': null,
    'workCenterNo': null,
    'workCenterTypeIdx': null,
    'maxChangeOverCount': null
  }

  id;
  employeeList;
  params = {
    dialog: {title: '', inputValue: ''}
  };
  workcenterTypeList;
  filterEmployee = {pageNumber: 1, pageSize: 500, firstName: ''};
  subscription: Subscription;

  constructor(private _empSvc: EmployeeService,
              private _router: Router,
              private loaderService: LoaderService,
              private _workcenterTypeSvc: WorkcenterTypeService,
              private utilities: UtilitiesService,
              private _userSvc: UsersService,
              private _workcenterSvc: WorkcenterService) {

    this.selectedPlant = JSON.parse(this._userSvc.getPlant());
    this.workcenter.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;

  }


  ngOnInit() {
    this._empSvc.filter(this.filterEmployee).then(result => this.employeeList = result).catch(error => console.log(error));
    this._workcenterTypeSvc.getWorkCentreTypeByPlantId(this.workcenter.plantId).then(result => this.workcenterTypeList = result).catch(error => console.log(error));
    this.subscription = this._workcenterSvc.saveAction$.asObservable().subscribe(rs => {
      this.save();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  setSelectedPlant(event) {
    if (event) {
      this.workcenter.plantId = event.plantId;
      this._workcenterTypeSvc.getIdNameList().then((result: any) => { 
        if (result && this.workcenter.plantId) {
          result = result.filter(itm => this.workcenter.plantId === itm.plantId);
        }
        this.workcenterTypeList = result;
      }).catch(error => console.log(error));
    }
  }

  saveWorkcenterType() {
    this._workcenterTypeSvc.save({'workCenterTypeName': this.params.dialog.inputValue, plantId: this.workcenter.plantId})
      .then((result: any) => {
        this.utilities.showSuccessToast('saved-success');
        this.workcenterTypeList.push({'workCenterTypeId': result.workCenterTypeId, 'workCenterTypeName': this.params.dialog.inputValue});
        this.workcenter.workCenterTypeIdx = result.workCenterTypeId;
        this.params.dialog.inputValue = '';
      })
      .catch(error => this.utilities.showErrorToast(error));
  }
  

  reset() {
    this.workcenter = {
      'description': null,
      'plantId': null,
      'workCenterName': null,
      'workCenterNo': null,
      'workCenterTypeIdx': null,
      'maxChangeOverCount': null
    }
  }

  goPage() {
    this._router.navigate(['/settings/workcenter']);
  }


  save() {
    this.loaderService.showLoader();
    this._workcenterSvc.save(this.workcenter)
      .then(workcenterId => {
        this.loaderService.hideLoader();
        this.saveImages(workcenterId)
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  private saveImages(workcenterId) {
    this.imageAdderComponent.updateMedia(workcenterId, TableTypeEnum.WORKCENTER).then(() => {
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.reset();
          this.saveAction.emit(workcenterId);
        }, environment.DELAY);
      }
    ).catch(error => this.utilities.showErrorToast(error));
  }

}
