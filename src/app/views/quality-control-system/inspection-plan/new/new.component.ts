import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { InspectionPlanService } from 'app/services/dto-services/inspection-plan/inspection-plan.service';
import { UsersService } from 'app/services/users/users.service';
import { UsageDecisionService } from 'app/services/dto-services/quality-inspection/usage-decision/usage-decision.service';


@Component({
  selector: 'new-inspection-plan',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewInspectionPlan implements OnInit {
  @Input() fromAutoComplete = false;
  @Output() saveAction = new EventEmitter<any>();

  inspectionPlan = {
    createDate: null,
    fromLotSize: null,
    group: null,
    groupCounter: null,
    inspectionPlanCode: null,
    inspectionPlanId: null,
    inspectionPlanStatus: null,
    keyDate: null,
    planningWorkcenterId: null,
    plantId: null,
    qualityUsageId: null,
    stockId: null,
    toLotSize: null,
    updateDate: null
  };
  activeIndex = 0;
  selectedPlant: any;
  usageList: any;

  constructor(
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _userSvc: UsersService,
    private _inspectionPlanService: InspectionPlanService,
    private qualityUsageSrv: UsageDecisionService,
  ) {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.inspectionPlan.plantId = this.selectedPlant.plantId;
    }
  }

  ngOnInit() {
    this.qualityUsageSrv.filterUsageDecision({pageNumber: 1, pageSize: 9999}).then((res: any) => {
      this.usageList = res['content'];
    })
  }

  save() {
    this.loaderService.showLoader();
    this._inspectionPlanService.saveInspectionPlan(this.inspectionPlan).then(
      result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        this.inspectionPlan.inspectionPlanId = result['inspectionPlanId'];
        setTimeout(() => {
          // this.saveAction.emit('close');
          this.activeIndex = 1;
        }, environment.DELAY);
      },
      error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
      }
    );
  }

  reset() {
    this.inspectionPlan = {
      createDate: null,
      fromLotSize: null,
      group: null,
      groupCounter: null,
      inspectionPlanCode: null,
      inspectionPlanId: null,
      inspectionPlanStatus: null,
      keyDate: null,
      planningWorkcenterId: null,
      plantId: null,
      qualityUsageId: null,
      stockId: null,
      toLotSize: null,
      updateDate: null
    };
  }
}
