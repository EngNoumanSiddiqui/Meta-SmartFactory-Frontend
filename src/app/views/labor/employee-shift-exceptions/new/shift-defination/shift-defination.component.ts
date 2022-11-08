///import { ShiftSettingsService } from './../../../../services/dto-services/shift-setting/shift-setting.service';
//import { environment } from './../../../../../environments/environment';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EmployeeGroupService } from 'app/services/dto-services/employee-group.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { environment } from 'environments/environment';
import { ShiftSettingsService } from 'app/services/dto-services/shift-setting/shift-setting.service';

@Component({
  selector: 'shift-defination',
  templateUrl: './shift-defination.component.html',
  styleUrls: ['./shift-defination.component.scss']
})
export class ShiftDefinationComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  /*******formModle*******/
  employeeShift={
      employeeGroupId:null,
      employeeId:null,
      employeeShiftsId:null,
      shiftId:null
  }  
/*******formModle*******/
  employees=[];
  employeeGroup=[];
  shiftSettingList=[];
  showHide:boolean=false;
  hideEmployeeList:boolean=false;
  hideEmployeeGroup:boolean=false;
nonGroupEmpPageFilter = 
  {
      pageNumber: 1,
      pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
      employeeGroupId:null,
      groupCode: null,
      groupName: null,
      orderByDirection:null,
      orderByProperty:null,
      query:null
  }
groupEmpPageFilter={
    orderByDirection:null,
    orderByProperty:null,
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    query:null
  };
  constructor(
    private _confirmationSvc: ConfirmationService,
    private _router: Router,
    private _translateSvc: TranslateService,
    private _shiftService:ShiftSettingsService,
    private _employeeSvc:EmployeeGroupService,       
    private utilities: UtilitiesService,
    private loaderService: LoaderService){}

ngOnInit(){
  this.getNonGroupedEmployee(this.nonGroupEmpPageFilter);
  this.getGroupedEmployee(this.groupEmpPageFilter);
  this.getShiftList();
  //console.log("showHide",this.showHide);
  //console.log("status",this.hideEmployeeList);
  //console.log("statusGroup",this.hideEmployeeGroup);

  if(this.showHide==false){
    this.hideEmployeeList=true;
    //this.hideEmployeeGroup=false;
  }
  else{
    //this.hideEmployeeList=false;
    this.hideEmployeeGroup=true;
  }
}

getNonGroupedEmployee(data){
  this.loaderService.showLoader();
  this._employeeSvc.search(data)
    .then(result => {
    this.employees=result['content'];
    this.loaderService.hideLoader();
  }).catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error)
    });
}

getGroupedEmployee(data){
  this.loaderService.showLoader();
  this._employeeSvc.filter(data)
    .then(result => {
    this.employeeGroup=result['content'];
    console.log("GroupedDataShape",this.employeeGroup);
    this.loaderService.hideLoader();
  }).catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error)
    });
}

getShiftList(){
  this._shiftService.getShiftSettingsList().then((result:any)=>{
    this.shiftSettingList=result;
    console.log("shiftSetting",this.shiftSettingList);
  });
}
showHideEmployeeList(value){
  if(value===true){
    this.hideEmployeeList=false;
    this.hideEmployeeGroup=true;
    this.employeeShift.employeeId=null;
  }
  else{
    this.hideEmployeeList=true;
    this.hideEmployeeGroup=false;
    this.employeeShift.employeeGroupId=null;
  }
}

save(){
  this.loaderService.showLoader();
  //console.log("@beforeSaved",this.employeeShift);
  this._employeeSvc.saveEmployeeShift(this.employeeShift)
    .then((empShift:any)=>{
      this.loaderService.hideLoader();
      console.log("@returnAfterSave",empShift)
      this.utilities.showSuccessToast('Employee Shift' + empShift + 'saved successfully');
      setTimeout(()=>{
        this.reset();
        this.saveAction.emit('close');
      }, environment.DELAY);
    })
    .catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error)
    });
}
reset(){
  this.employeeShift={
    employeeGroupId:null,
    employeeId: null,
    employeeShiftsId: null,
    shiftId: null
}
}

}
