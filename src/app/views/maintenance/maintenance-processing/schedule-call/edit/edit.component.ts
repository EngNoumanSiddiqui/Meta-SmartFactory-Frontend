import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {OrderOperationService} from '../../../../../services/dto-services/maintenance-equipment/order-operation.service';
import { MaintenancePlanScheduleCallService } from 'app/services/dto-services/maintenance/maintenance-plan-schedule-call.service';
/**
 * Created by reis on 31.07.2019.
 */

@Component({
  selector: 'schedule-call-edit',
  templateUrl: './edit.component.html'
})
export class EditScheduleCallComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();
  data;
  @Input('data') set z(data) {
    this.data = data;
    if (data) {
      this.initializeData(this.data);
    }
  };
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
  detailData;

  constructor(private _router: Router,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private scheduleCallService: MaintenancePlanScheduleCallService) {

  }

  ngOnInit() {
    // this.initialize(this.id);
  }
  private initializeData(data: any) {

  }

  save() {
    this.loaderService.showLoader();
    this.scheduleCallService.save(this.dataModel)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.cancel();
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  cancel() {
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
    this.detailData = null;
    this.saveAction.emit('close');
  }
}
