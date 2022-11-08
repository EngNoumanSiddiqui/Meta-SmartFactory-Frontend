import { filter } from 'rxjs/operators';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { EmployeeGroupService } from 'app/services/dto-services/employee-group.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { environment } from 'environments/environment';
import { EmployeeGenericGroupService } from 'app/services/dto-services/employee-generic-group.service';

import { EmployeeService } from 'app/services/dto-services/employee/employee.service';
import { UsersService } from '../../../../services/users/users.service';
import { OperationService } from 'app/services/dto-services/operation/operation.service';

@Component({
    selector: 'emp-exchnage-group',
    templateUrl: './exchange-group.component.html',
    //   styleUrls: ['./new.component.scss']
})
export class ExchangeGroupComponent implements OnInit {

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
            groupCode: null,
            groupName: null,
            groupSubType: null,
            groupType: null,
            plantId: null,
            parentGroupId: null,
            referenceId: null,

            employeeIdList1: [],
            groupCode1: null,
            groupName1: null,
            parentGroupId1: null,
            referenceId1: null
        };

    operationTypes: any;

    exchangeGroups = [];

    @Input('exchangeGroup') set eg(data){
        if(data){
            this.exchangeGroups = data.sort((a,b)=> a.employeeGenericGroupId - b.employeeGenericGroupId);
            this.exchangeGroups.forEach((item, index) => {
                if(index == 0){
                    this.empGroupCode.groupName = item.groupName;
                    this.empGroupCode.groupCode = item.groupCode;
                    this.empGroupCode.groupSubType = item.groupSubTypeEnum.message;
                    this.empGroupCode.referenceId = item.referenceItemDto.itemId;
                    this.sourceEmployeeList = item.members;
                }else{
                    this.empGroupCode.groupName1 = item.groupName;
                    this.empGroupCode.groupCode1 = item.groupCode;
                    this.empGroupCode.referenceId1 = item.referenceItemDto.itemId;
                    this.targetEmployeeList= item.members;
                }
            })
            this.empGroupCode.groupType = 'HUMAN_RESOURCES';
            this.empGroupCode.groupSubType = 'SHIFT_GROUP';
        }
    }

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
        this.empGroupCode.employeeIdList = [];
        this._empGenericSvc.getEmployeeGenericGroupTypes().then((res:any) => {
            this.employeeAllGenericGroupTypes = res;
            if (this.employeeAllGenericGroupTypes.length > 0) {
                this.separateGenericGroupTypes(this.employeeAllGenericGroupTypes);
                this.filterSubGroups();
            }
        });
        this._opeartionTypeSvc.getDetailByPlantId(this.pageFilter.plantId).then((res) => {
            this.operationTypes = res;
        })
    }

    getSourceEmployees() {
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

    reset() {
        this.empGroupCode = {
            employeeIdList: [],
            groupCode: null,
            plantId: null,
            groupName: null,
            groupSubType: 'SHIFT_GROUP',
            groupType: 'HUMAN_RESOURCES',
            parentGroupId: null,
            referenceId: null,
            
            employeeIdList1: [],
            groupCode1: null,
            groupName1: null,
            parentGroupId1: null,
            referenceId1: null
        }
    }

    setSelectedWorkStation($event, id="referenceId") {
        this.empGroupCode[id] = $event.workStationId;
    }

    setSelectedWorkCenter(event, id="referenceId") {
        this.empGroupCode[id] = event.workCenterId;
    }
    setSelectedOperationType(event, id="referenceId") {
        this.empGroupCode[id] = event.operationTypeId;
    }

    setSelectedPlannerGroup(e, id="referenceId") {
        this.empGroupCode[id] = e.plannerGroupId;
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

    setSelectedOperation(event, id="referenceId") {
        this.empGroupCode[id] = event.operationId;
    }

    save() {
        let empGroupCode = Object.assign({}, this.empGroupCode);
        // empGroupCode.groupSubType = this.empGroupCode.groupSubType.split(' ').join('');
console.log('@sourceEmployeeList', this.sourceEmployeeList)
console.log('@targetedEmployees', this.targetEmployeeList); 
        console.log('@empGroupCode', empGroupCode); 
        // return;
        let sourceEmployeeList = this.sourceEmployeeList.map(item => item.employeeId);
        let targetEmployeeList = this.targetEmployeeList.map(item => item.employeeId);
        for(var i = 0; i<2; i++){
           
            let   genericGroupRequestDto =
            {
              employeeGenericGroupId: null,
              employeeIdList: (i ==0)? sourceEmployeeList: targetEmployeeList,
              groupCode: (i ==0)? empGroupCode.groupCode: empGroupCode.groupCode1,
              groupName: (i ==0)? empGroupCode.groupName: empGroupCode.groupName,
              plantId: empGroupCode.plantId,
              groupSubType: empGroupCode.groupSubType,
              groupType: empGroupCode.groupType,
              parentGroupId: (i ==0)? empGroupCode.parentGroupId: empGroupCode.parentGroupId1,
              referenceId: (i ==0)? empGroupCode.referenceId: empGroupCode.referenceId1
            }
            this.loaderService.showLoader();
            this._empGenericSvc.save(genericGroupRequestDto)
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

    }

    filterSubGroups() {
        const me = this;
        console.log('@employeeAllGenericGroups', this.employeeGenericGroupTypes)
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

    
}
