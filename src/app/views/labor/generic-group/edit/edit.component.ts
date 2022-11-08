import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {LoaderService} from 'app/services/shared/loader.service';
import {UtilitiesService} from 'app/services/utilities.service';
 
import {environment} from 'environments/environment';
import {EmployeeGenericGroupService} from 'app/services/dto-services/employee-generic-group.service';
import {EmployeeService} from 'app/services/dto-services/employee/employee.service';
import {EquipmentPlannerGroupService} from '../../../../services/dto-services/maintenance-equipment/planner-group.service';
import {WorkstationService} from '../../../../services/dto-services/workstation/workstation.service';
import { UsersService } from 'app/services/users/users.service';
import { WorkcenterService } from 'app/services/dto-services/workcenter/workcenter.service';
import { OperationService } from 'app/services/dto-services/operation/operation.service';

@Component({
  selector: 'emp-gen-group-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  employeeAllGenericGroupTypes: any[] = [];
  employeeGenericGroupTypes: any[] = [];
  employeeSubGroup: any[] = [];
  filteredEmployeeSubGroup: any[] = [];
  @Output() saveAction = new EventEmitter<any>();
  // will be change when api is fixed

  referenceItemDto: any = {};
  operationTypes: any;

  detailData;
  /*******PickList********/
  sourceEmployeeList;
  targetEmployeeList;
  /******PickList*********/
  pageFilter =
    {
      pageNumber: 1,
      pageSize: 9000,
      // pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
      orderByDirection: null,
      orderByProperty: null,
      plantId : null,
      query: null
    };
  genericGroupRequestDto =
    {
      employeeGenericGroupId: null,
      employeeIdList: [],
      groupCode: null,
      workUnderSupervision: false,
      groupName: null,
      plantId: null,
      groupSubType: null,
      groupType: null,
      parentGroupId: null,
      referenceId: null
    }
  id;
  private _inputModel = '5';
  selectedPlant: any;
  @Input() isCloned= false;
  @Input('id') set z(id) {
    if(!this.isCloned) {
      this.id = id;
    }
    if (id) {
      this.initialize(id);
      this.targetEmployeeList = [];
    }
  };

  constructor(private _empGenericGroupSvc: EmployeeGenericGroupService,
              private _empSvc: EmployeeService,
              private _router: Router,
              private _route: ActivatedRoute,
              private loaderService: LoaderService,
              private _userSvc: UsersService,
              private utilities: UtilitiesService,
              private plannerGroupService: EquipmentPlannerGroupService,
              private workstationService: WorkstationService,
              private workCenterService: WorkcenterService,
              private _opeartionTypeSvc: OperationService) {
                this.selectedPlant = JSON.parse(this._userSvc.getPlant());
    this.pageFilter.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;
    this.genericGroupRequestDto.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;
   
  }

  ngOnInit() {
    this._opeartionTypeSvc.getDetailByPlantId(this.pageFilter.plantId).then((res)=> {
      this.operationTypes = res;
   })
  }

  private setGroupTypeAndGroupSubTypeComboContent() {
    this._empSvc.filter(this.pageFilter).then(result => {
      this.sourceEmployeeList = result['content'];
    });
    //this.targetEmployeeList = [];
    this._empGenericGroupSvc.getEmployeeGenericGroupTypes().then(res => {
      this.employeeAllGenericGroupTypes = res as any[];
      if (this.employeeAllGenericGroupTypes.length > 0) {
        this.filterSubGroups();
        this.separateGenericGroupTypes(this.employeeAllGenericGroupTypes);
      }
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

  

  private initialize(id) {
    this.setGroupTypeAndGroupSubTypeComboContent();
    const me = this;
    // if (!this.employeeAllGenericGroupTypes || this.employeeAllGenericGroupTypes.length === 0) {// fill group types combos
    //   this.setGroupTypeAndGroupSubTypeComboContent();
    // }
    this.genericGroupRequestDto.employeeGenericGroupId = this.isCloned ? null : this.id;
    this.loaderService.showLoader();
    this._empGenericGroupSvc.getDetail(id).then((result: any) => {
      this.loaderService.hideLoader();
      this.detailData = result;
      // this.workStationEdit.workStationName=result[''].itemName;

      if ((result['groupType'])) {
        this.genericGroupRequestDto.groupType = (result['groupType'].message)? result['groupType'].message : result['groupType'];
        me.filterSubGroups();
      }
      if ((result['groupSubTypeEnum'])) {
        this.genericGroupRequestDto.groupSubType = (result['groupSubTypeEnum'].message)? result['groupSubTypeEnum'].message: result['groupSubTypeEnum']; // api naming property issue
      }
      if ((result['referenceItemDto'])) {
        this.genericGroupRequestDto.referenceId = result['referenceItemDto'].itemId;
        this.referenceItemDto = result['referenceItemDto'] // api naming property issue
      }
      if ((result['groupCode'])) {
        this.genericGroupRequestDto.groupCode = this.isCloned ? null : result['groupCode'];
      }
      this.genericGroupRequestDto.workUnderSupervision = result['workUnderSupervision'];
      if ((result['plant'])) {
        this.genericGroupRequestDto.plantId = result['plant'].plantId;
      }
      if ((result['groupName'])) {
        this.genericGroupRequestDto.groupName = result['groupName'];
      }
      if ((result['members'])) {
        result.members.forEach(element => {
          this.targetEmployeeList.push(element);
          this.genericGroupRequestDto.employeeIdList.push(element.employeeId)
        });
      }
      if(result['referenceItemDto'] && result['referenceItemDto'].itemId) {
        if (this.genericGroupRequestDto.groupSubType === 'WORKSTATION' || 
        this.genericGroupRequestDto.groupSubType === 'MACHINE_SETUP') {
          // me.referenceItemDto = {'workStationId': result['referenceItemDto'].itemId, 'workStationName': result['referenceItemDto'].itemName };
          this.workstationService.getDetail(result['referenceItemDto'].itemId).then((wsResult: any) => {
              me.referenceItemDto = wsResult;
            }
          ).catch(error => {
            this.loaderService.hideLoader();
            this.utilities.showErrorToast(error)
          });
        } else if (this.genericGroupRequestDto.groupSubType === 'MAINTENANCE_PLANNER_GROUP') {
          // me.referenceItemDto = {'plannerGroupId': result['referenceItemDto'].itemId, 'plannerGroup': result['referenceItemDto'].itemName };
          this.plannerGroupService.getDetail(result['referenceItemDto'].itemId).then((pgsResult: any) => {
              me.referenceItemDto = pgsResult;
            }
          ).catch(error => {
            this.loaderService.hideLoader();
            this.utilities.showErrorToast(error)
          });
        } else if (this.genericGroupRequestDto.groupSubType === 'WORKCENTER') {
          this.workCenterService.getDetail(result['referenceItemDto'].itemId).then((pgsResult: any) => {
              me.referenceItemDto = pgsResult;
            }
          ).catch(error => {
            this.loaderService.hideLoader();
            this.utilities.showErrorToast(error)
          });
        } else if (this.genericGroupRequestDto.groupSubType === 'OPERATION ' || this.genericGroupRequestDto.groupSubType === 'OPERATION') {
          me.referenceItemDto = {
            operationId: result['referenceItemDto'].itemId,
            operationName: result['referenceItemDto'].itemName
          }
        }else if(this.genericGroupRequestDto.groupSubType === 'OPERATION_TYPE' || this.genericGroupRequestDto.groupSubType === 'OPERATION_TYPE ' ){
          console.log('@operationTypeName', result)
          me.referenceItemDto = {
            operationTypeId: result['referenceItemDto'].itemId,
            operationTypeName: result['referenceItemDto'].itemName
          }
        } else {
          me.referenceItemDto = result['referenceItemDto'];
        }
      }

      console.log('@referenceItem', this.referenceItemDto)
    }).catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error)
    });

    
  }

  setSelectedPlant(plant) {
    if (plant) {
      this.selectedPlant = plant;
      this.genericGroupRequestDto.plantId = plant.plantId;
      this.pageFilter.plantId = this.selectedPlant.plantId;
      this.setGroupTypeAndGroupSubTypeComboContent();
    } else {
      this.selectedPlant = null;
      this.pageFilter.plantId = null;
    }
  }

  
  setSelectedOperationType(event){
    if(event) {
      this.genericGroupRequestDto.referenceId = event.operationTypeId;
    } else {
      this.genericGroupRequestDto.referenceId = null;
    }
  
  }
  onChangeSubType(event) {
    if(event && (event === 'HUMAN_RESOURCES')) {
      // this.genericGroupRequestDto.referenceId = this.filteredEmployeeSubGroup.find(itm => itm.message==event).id;
      this.genericGroupRequestDto.referenceId = 98;
      this.referenceItemDto.itemName = this.filteredEmployeeSubGroup.find(itm => itm.message==event).message;
    } else if(event && (event === 'SHIFT_GROUP')) {
      this.genericGroupRequestDto.referenceId = 2;
      this.referenceItemDto.itemName = this.filteredEmployeeSubGroup.find(itm => itm.message==event).message;
    } else {
      this.genericGroupRequestDto.referenceId = null;
      this.referenceItemDto.itemName = null;
    }
  }

  setSelectedOperation(event){
    this.genericGroupRequestDto.referenceId = event.operationId;
  }
  setForkLiftItem(event) {
    if(event) {
      this.genericGroupRequestDto.referenceId = event.forkliftId;
    } else {
      this.genericGroupRequestDto.referenceId = null;
    }
  }

  pushEmp(value) {
    value.forEach(element => {
      if (!this.genericGroupRequestDto.employeeIdList.find(itm => itm === element.employeeId)) {
        this.genericGroupRequestDto.employeeIdList.push(element.employeeId);
      }
    });
    this.targetEmployeeList = this.targetEmployeeList.filter((v, i, a) => a.findIndex( t => (t.employeeId === v.employeeId)) === i);
  }

  // require-fix
  popEmp(event) {
    event.forEach(element => {
      this.genericGroupRequestDto.employeeIdList = this.genericGroupRequestDto.employeeIdList.filter(empId => empId !== element.employeeId);
    });
    // console.log('@filterArray', this.genericGroupRequestDto.employeeIdList);
  }

  setSelectedReferenceItemId($event) {
    // console.log('bind with ngModel', $event);
    if (this.genericGroupRequestDto.groupSubType === 'WORKSTATION' ||
    this.genericGroupRequestDto.groupSubType === "MACHINE_SETUP") {
      this.genericGroupRequestDto.referenceId = $event.workStationId;
    } else {
      this.genericGroupRequestDto.referenceId = $event.plannerGroupId;
    }

  }
  setWarehouseItem(event) {
    if(event) {
      this.genericGroupRequestDto.referenceId = event.wareHouseId;
    } else {
      this.genericGroupRequestDto.referenceId = null;
    }
  }


  setSelectedWorkCenter(event) {
    if (event) {
      this.genericGroupRequestDto.referenceId = event.workCenterId;
    } else {
      this.genericGroupRequestDto.referenceId = null;
    }
  }
  setSelectedMaterialGroup(event){
    this.genericGroupRequestDto.referenceId = event?.stockGroupId;
  }

  onPushToAllTarget(allEmp) {
    this.genericGroupRequestDto.employeeIdList = [];
    allEmp.forEach(element => {
      this.genericGroupRequestDto.employeeIdList.push(element.employeeId);
    });
  }

  onBackToAllSource() {
    this.genericGroupRequestDto.employeeIdList = [];
  }

  reset() {
    this.genericGroupRequestDto = {
      employeeGenericGroupId: null,
      employeeIdList: [],
      groupCode: null,
      groupName: null,
      plantId: null,
      workUnderSupervision: false,
      groupSubType: null,
      groupType: null,
      parentGroupId: null,
      referenceId: null
    }
    this.targetEmployeeList = [];
    this.detailData = null;
  }

  filterSubGroups() {
    console.log('filtersubgroups called.', this.genericGroupRequestDto.groupType);
    const me = this;
    me.filteredEmployeeSubGroup = [];
    if (this.genericGroupRequestDto.groupType) {
      this.employeeAllGenericGroupTypes.forEach(item => {
        if (this.genericGroupRequestDto.groupType === item.groupType.message || this.genericGroupRequestDto.groupType === item.groupType) {
          item.groupSubType.forEach(subGroupItem => {
            me.filteredEmployeeSubGroup.push(subGroupItem);
          });
        }
      });
    }
    console.log('filtered group sub type', me.filteredEmployeeSubGroup);
  }
  save() {
    this.loaderService.showLoader();
    if(this.isCloned) {
      this.genericGroupRequestDto.employeeGenericGroupId = null;
    }
    let genericGroupRequestDto = Object.assign({}, this.genericGroupRequestDto);
    genericGroupRequestDto.groupSubType =  this.genericGroupRequestDto.groupSubType.split(' ').join('');

    this._empGenericGroupSvc.save(genericGroupRequestDto)
      .then((groupMember: any) => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('Group Member' + groupMember.groupName + ' updated successfully');
        setTimeout(() => {
          // this.reset();
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }
}
