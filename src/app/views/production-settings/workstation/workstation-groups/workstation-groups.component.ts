import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-workstation-groups',
  templateUrl: './workstation-groups.component.html',
  styleUrls: ['./workstation-groups.component.scss']
})
export class WorkstationGroupsComponent implements OnInit, OnChanges {

  @Input() workstationId = null;
  @Input() workstationNo = null;
  @Input() workstationName = null;
  @Input() isDetails = false;
  
  selectedIndex = -1;

  @Input('data') set setData(data) {
    if(data) {
      this.workstationGroupList = data || [];
    }
  };
  workstationGroupList = [];
  workstationGroup = {
    stockGroupCode: null,
    stockGroupId: null,
    workStationId: null,
    workStationName: null,
    workStationNo: null,
    workstationMaterialGroupId: null,
  }

  dialog = {active: null};
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(smpleChanges: SimpleChanges) {
    if(smpleChanges.workstationId && smpleChanges.workstationId.currentValue) {
      this.workstationGroup.workStationId = smpleChanges.workstationId.currentValue;
    }
    if(smpleChanges.workstationNo && smpleChanges.workstationNo.currentValue) {
      this.workstationGroup.workStationNo = smpleChanges.workstationNo.currentValue;
    }
    if(smpleChanges.workstationName && smpleChanges.workstationName.currentValue) {
      this.workstationGroup.workStationName = smpleChanges.workstationName.currentValue;
    }
  }

  newWorkstationGroup() {
    this.workstationGroup = {
      stockGroupCode: null,
      stockGroupId: null,
      workStationId: this.workstationId,
      workStationName: this.workstationName,
      workStationNo: this.workstationNo,
      workstationMaterialGroupId: null,
    };
    this.dialog.active = true;
  }
  editWorkstationGroup(index) {
    this.selectedIndex = index;
    this.workstationGroup = {...this.workstationGroupList[index]};
    this.dialog.active = true;
  }
  removeWorkstationGroup(index) {
    this.workstationGroupList.splice(index, 1);
  }
  
  saveWorkstationGroup() {
    if(this.selectedIndex >= 0) {
      this.workstationGroupList.splice(this.selectedIndex, 0, {...this.workstationGroup})
    } else {
      this.workstationGroupList.push({...this.workstationGroup});
    }
    this.dialog.active=false;
  }

  reset() {
    this.workstationGroup = {
      stockGroupCode: null,
      stockGroupId: null,
      workStationId: this.workstationId,
      workStationName: this.workstationName,
      workStationNo: this.workstationNo,
      workstationMaterialGroupId: this.workstationGroup.workstationMaterialGroupId,
    }
  }

}
