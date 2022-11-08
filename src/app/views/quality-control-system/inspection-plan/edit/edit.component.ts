import {Component, EventEmitter, Input, OnInit, Output, AfterViewInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
 
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { InspectionPlanService } from 'app/services/dto-services/inspection-plan/inspection-plan.service';
import { environment } from 'environments/environment';
import { UsageDecisionService } from 'app/services/dto-services/quality-inspection/usage-decision/usage-decision.service';
import { UsersService } from 'app/services/users/users.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
@Component({
  selector: 'edit-inspection-plan',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditInspectionPlan implements OnInit, AfterViewInit {
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
  id;
  selectedPlant: any;
  usageList: any;

  statusList = [];

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  @Input('data') set setData(data) {
    if (data) {
      this.inspectionPlan = {
        createDate: data.createDate,
        fromLotSize: data.fromLotSize,
        group: data.group,
        groupCounter: data.groupCounter,
        inspectionPlanCode: data.inspectionPlanCode,
        inspectionPlanId: data.inspectionPlanId,
        inspectionPlanStatus: data.inspectionPlanStatus,
        keyDate: data.keyDate ? new Date(data.keyDate) : null,
        planningWorkcenterId: data.planningWorkcenterId,
        plantId: data.plant ? data.plant.plantId : null,
        qualityUsageId: data.qualityUsage ? data.qualityUsage.usageId : null,
        stockId: data.stock ? data.stock.stockId : null,
        toLotSize: data.toLotSize,
        updateDate: data.updateDate
      };
    }
  };

  myModal;

  params = {
    cityDisabled: true,
    dialog: {
      title: '',
      inputText: '',
      inputValue: ''
    },
    displayDialog: false,
  };

  @Output() saveAction = new EventEmitter<any>();
  lastAccountNos;

  constructor(
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _userSvc: UsersService,
    private _inspectionPlanService: InspectionPlanService,
    private enumService: EnumService,
    private qualityUsageSrv: UsageDecisionService) {
      const setPlant = this._userSvc.getPlant();
      this.selectedPlant = JSON.parse(setPlant);
      if (this.selectedPlant) {
        // this.inspectionPlan.plantId = this.selectedPlant.plantId;
      }
  }

  ngOnInit() {

    this.qualityUsageSrv.filterUsageDecision({pageNumber: 1, pageSize: 9999}).then((res: any) => {
      this.usageList = res['content'];
    })
    this.enumService.getQualityInspectionPlanStatusEnum().then((res: any) => this.statusList = res);
    // this._route.params.subscribe((params) => {
    //   this.id = params['id'];
    //   if (this.id) {
    //     this.inspectionPlan.inspectionPlanId = this.id;
    //     this.initialize(this.id);
    //   }
    // });
  }

  ngAfterViewInit() {
    // this.showImages();
  }

  private initialize(id) {
    // this.inspectionPlan.inspectionPlanId = this.id;
    // this.loaderService.showLoader();

    // this._inspectionPlanService.detailInspectionPlan(id).then(
    //   result => {
    //     this.loaderService.hideLoader();
        
    //   },
    //   error => {
    //     this.loaderService.hideLoader();
    //     this.utilities.showErrorToast(error)
    //   });
  }

  save() {
    this.loaderService.showLoader();
    this.inspectionPlan.plantId = this.selectedPlant.plantId;
    this._inspectionPlanService.saveInspectionPlan(this.inspectionPlan).then(
      result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          // this.saveAction.emit('close');
          this.activeIndex = 1;
        }, environment.DELAY);
      }).catch( error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  cancel() {
    this.saveAction.emit('close');
  }
}
