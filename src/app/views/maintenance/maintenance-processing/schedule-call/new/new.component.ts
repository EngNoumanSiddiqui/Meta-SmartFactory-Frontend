import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {OrderOperationService} from '../../../../../services/dto-services/maintenance-equipment/order-operation.service';
import {environment} from '../../../../../../environments/environment';
import { MaintenancePlanScheduleCallService } from 'app/services/dto-services/maintenance/maintenance-plan-schedule-call.service';
@Component({
  selector: 'schedule-call-new',
  templateUrl: './new.component.html'
})
export class NewScheduleCallComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();
  dataModel = {
    actualCycle: null,
    callDate: null,
    completionDate: null,
    cycle: null,
    maintenanceOrderPlanId: null,
    maintenancePlanScheduledCallId: null,
    planDate: null,
    schedulingStatus: null,
    schedulingType: null,
    unit: null
  };

  @Input() maintenanceOrderPlanId;

  constructor(private _router: Router,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private scheduleCallService: MaintenancePlanScheduleCallService) {

  }

  ngOnInit() {
  }

  save() {
    this.dataModel.maintenanceOrderPlanId = this.maintenanceOrderPlanId;
    this.loaderService.showLoader();
    this.scheduleCallService.save(this.dataModel)
      .then(result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.maintenanceOrderPlanId = null;
          this.reset();
          this.saveAction.emit(result);
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  reset() {

    this.dataModel = {
      actualCycle: null,
      callDate: null,
      completionDate: null,
      cycle: null,
      maintenanceOrderPlanId: null,
      maintenancePlanScheduledCallId: null,
      planDate: null,
      schedulingStatus: null,
      schedulingType: null,
      unit: null
    };

  }
}
