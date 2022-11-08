import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {EmployeeGroupService} from 'app/services/dto-services/employee-group.service';
import {UtilitiesService} from 'app/services/utilities.service';
import {LoaderService} from 'app/services/shared/loader.service';
import {environment} from 'environments/environment';
import {EmployeeGenericGroupService} from 'app/services/dto-services/employee-generic-group.service';
 
import {EmployeeService} from 'app/services/dto-services/employee/employee.service';
import {UsersService} from '../../../../services/users/users.service';
import { OperationService } from 'app/services/dto-services/operation/operation.service';

@Component({
  selector: 'emp-gen-group-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();
  employeeAllGenericGroupTypes: any[] = [];
  employeeGenericGroupTypes: any[] = [];
  filteredEmployeeSubGroup: any[] = [];
  employeeList;
  selectedPlant: any = {
    plantId: null,
    plantName: null
  };
  pageFilter =
    {
      pageNumber: 1,
      pageSize: 9000,
      // pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
      orderByDirection: null,
      orderByProperty: null,
      query: null,
      plantId: null
    };
  /*******PickList********/
  sourceEmployeeList;
  targetEmployeeList;
  /******PickList*********/
  empGroupCode =
    {
      employeeIdList: [],
      workUnderSupervision: false,
      groupCode: null,
      groupName: null,
      groupSubType: null,
      groupType: null,
      plantId: null,
      parentGroupId: null,
      referenceId: null
   };

   referenceItemDto: any = {};

  operationTypes:any;

  constructor(
    private _empGroupSvc: EmployeeGroupService,
    private _empService: EmployeeService,
    private _empGenericSvc: EmployeeGenericGroupService,
    private utilities: UtilitiesService,
    private _userSvc: UsersService,
    private loaderService: LoaderService,
    private _opeartionTypeSvc: OperationService) {
    this.selectedPlant = JSON.parse(this._userSvc.getPlant());
    this.pageFilter.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;
    this.empGroupCode.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;
  }

  ngOnInit() {
    this.sourceEmployeeList = [];
    this.getSourceEmployees();
    this.targetEmployeeList = [];
    this.empGroupCode.employeeIdList = [];
    this._empGenericSvc.getEmployeeGenericGroupTypes().then(res => {
      this.employeeAllGenericGroupTypes = res as any[];
      if (this.employeeAllGenericGroupTypes.length > 0) {
        this.separateGenericGroupTypes(this.employeeAllGenericGroupTypes);
      }
    });
    this._opeartionTypeSvc.getDetailByPlantId(this.pageFilter.plantId).then((res)=> {
       this.operationTypes = res;
    })
  }

  setSelectedOperation(event){
    this.empGroupCode.referenceId = event?.operationId;
  }
  setSelectedMaterialGroup(event){
    this.empGroupCode.referenceId = event?.stockGroupId;
  }

  setForkLiftItem(event) {
    if(event) {
      this.empGroupCode.referenceId = event.forkliftId;
    } else {
      this.empGroupCode.referenceId = null;
    }
  }
  setWarehouseItem(event) {
    if(event) {
      this.empGroupCode.referenceId = event.wareHouseId;
    } else {
      this.empGroupCode.referenceId = null;
    }
  }

  getSourceEmployees () {
    this._empService.filter(this.pageFilter).then(result => {
      this.sourceEmployeeList = result['content'];
      // console.log('@sourceData', this.sourceEmployeeList);
    });
  }
  separateGenericGroupTypes(employeeGenericGroupTypes: any[] = []) {
    this.employeeGenericGroupTypes = [];
    employeeGenericGroupTypes.forEach(item => {
      if ((item)) {
        this.employeeGenericGroupTypes.push(item);
      }
    });
  }


  pushEmp(value) {
    value.forEach(element => {
      this.empGroupCode.employeeIdList.push(element.employeeId);
    });
  }

  popEmp(event) {
    // console.log("@pop",$event);
    event.forEach(element => {
      this.empGroupCode.employeeIdList = this.empGroupCode.employeeIdList.filter(empId => empId !== element.employeeId);
    });
    // this.empGroupCode.employeeIdList.forEach(remove => {
    //   $event.forEach(element => {
    //     if (element.employeeId === remove) {
    //       // console.log("@match",remove);
    //       const index = this.empGroupCode.employeeIdList.indexOf(remove);
    //       this.empGroupCode.employeeIdList.splice(index, 1);
    //     }
    //   });
    // });
  }

  onPushToAllTarget(allEmp) {
    this.empGroupCode.employeeIdList = [];
    allEmp.forEach(element => {
      this.empGroupCode.employeeIdList.push(element.employeeId);
    });
  }

  onBackToAllSource() {
    this.empGroupCode.employeeIdList = [];
  }

  reset() {
    this.empGroupCode = {
      employeeIdList: [],
      workUnderSupervision: false,
      groupCode: null,
      plantId: null,
      groupName: null,
      groupSubType: null,
      groupType: null,
      parentGroupId: null,
      referenceId: null
    }
  }

  setSelectedWorkStation($event) {
    this.empGroupCode.referenceId = $event.workStationId;
  }

  setSelectedWorkCenter(event) {
    this.empGroupCode.referenceId = event.workCenterId;
  }

  setSelectedOperationType(event){
    if(event) {
      this.empGroupCode.referenceId = event.operationTypeId;
    } else {
      this.empGroupCode.referenceId = null;
    }
    
  }
  onChangeSubType(event) {
    if(event && (event === 'HUMAN_RESOURCES')) {
      // this.genericGroupRequestDto.referenceId = this.filteredEmployeeSubGroup.find(itm => itm.message==event).id;
      this.empGroupCode.referenceId = 98;
      this.referenceItemDto.itemName = this.filteredEmployeeSubGroup.find(itm => itm.message==event).message;
    } else if(event && (event === 'SHIFT_GROUP')) {
      this.empGroupCode.referenceId = 2;
      this.referenceItemDto.itemName = this.filteredEmployeeSubGroup.find(itm => itm.message==event).message;
    } else {
      this.empGroupCode.referenceId = null;
      this.referenceItemDto.itemName = null;
    }
  }
  
  save() {
    let empGroupCode = Object.assign({}, this.empGroupCode);
    empGroupCode.groupSubType =  this.empGroupCode.groupSubType.split(' ').join('');
    this.loaderService.showLoader();
    this._empGenericSvc.save(empGroupCode)
      .then((groupMember: any) => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('General Group Member' + groupMember.groupName + ' saved successfully');
        this.targetEmployeeList = [];
        setTimeout(() => {
          this.reset();
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  filterSubGroups() {
    const me = this;
    me.filteredEmployeeSubGroup = [];
    if (this.empGroupCode.groupType) {
      this.employeeAllGenericGroupTypes.forEach(item => {
        if (this.empGroupCode.groupType === item.groupType.message || this.empGroupCode.groupType === item.groupType) {
          item.groupSubType.forEach(subGroupItem => {
              me.filteredEmployeeSubGroup.push(subGroupItem);
          });
        }
      });
    }
  }

  setSelectedPlannerGroup(e) {
    this.empGroupCode.referenceId = e.plannerGroupId;
  }

  setSelectedPlant(plant) {
    if (plant) {
      this.selectedPlant = plant;
      this.empGroupCode.plantId = plant.plantId;
      this.pageFilter.plantId = this.selectedPlant.plantId;
      this.getSourceEmployees();
    } else {
      this.selectedPlant = null;
      this.pageFilter.plantId = null;
    }
  }
}
