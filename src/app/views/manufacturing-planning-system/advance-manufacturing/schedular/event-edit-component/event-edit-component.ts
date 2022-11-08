import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'event-edit',
  templateUrl: './event-edit.component.html'
})
export class EventEditComponent implements OnInit {
  jobOrder;

  tempModel = {
    id: null,
    startDate: null,
    endDate: null,
    jobOrderId: null,
    resourceId: null
  }
  @Output() closeAction = new EventEmitter<any>();
  @Output() deleteAction = new EventEmitter<any>();
  @Output() saveAction = new EventEmitter<any>();

  selectedWorkStation;

  workstations;

  @Input('jobOrder') set JobOrder(jobOrder) {
    this.jobOrder = jobOrder;
    if (jobOrder) {
      this.tempModel.id = jobOrder.id;
      this.tempModel.startDate = jobOrder.startDate;
      this.tempModel.endDate = jobOrder.endDate;
      this.tempModel.jobOrderId = jobOrder.jobOrderId;
      this.tempModel.resourceId = jobOrder.resourceId;
      if (this.workstations) {
        this.selectedWorkStation = this.workstations.find(item => item.workStationId === jobOrder.resourceId);
      }
    }
  }

  @Input('workstations') set workstation(workstations) {
    this.workstations = workstations;
    if (this.jobOrder) {
      this.selectedWorkStation = workstations.find(item => item.workStationId === this.jobOrder.resourceId);
    }
  }


  constructor() {
  }

  ngOnInit() {

  }

  save() {

    this.saveAction.emit(this.tempModel);
  }

  delete() {
    this.deleteAction.emit(this.tempModel);
  }

  setSelectedWorkstation(event) {
    if (event) {
      this.tempModel.resourceId = event.workStationId;
    } else {
      this.tempModel.resourceId = null;

    }
  }

  close() {
    this.closeAction.emit('close');
  }
}
