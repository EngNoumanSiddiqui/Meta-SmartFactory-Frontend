import { Component, EventEmitter, Input, OnInit, Output, ViewChild, OnDestroy } from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { ProductTreeWorkstationProgramService } from 'app/services/dto-services/product-tree/product-tree-workstation-program.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
import { UsersService } from 'app/services/users/users.service';
import { UsageDecisionService } from 'app/services/dto-services/quality-inspection/usage-decision/usage-decision.service';
import { ProductTreeDetailQualityPlanCreateDto } from 'app/dto/product-tree/quality-plan.dto';
import { ProductTreeDetailQualityPlanService } from 'app/services/dto-services/product-tree/prod-tree-quality-plan-service';
import { ProductTreeService } from 'app/services/dto-services/product-tree/prod-tree.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'product-tree-quality-plan-new',
  templateUrl: './new.component.html'
})

export class ProductTreeQualityPlanNewComponent implements OnInit, OnDestroy {

  selectedPlant: any;

  @Output() saveAction = new EventEmitter<any>();

  @Input('productTreeDetailId') set pDId(productTreeDetailId){
    this.dataModel.productTreeDetailId = productTreeDetailId;
  }

  @Input() productTreeDetailOperationId;

  @Input('data') set x(data) {
    console.log('@data', data)
    if (data) {
      if (data.workstationProgram) {
        data.workstationProgramId = data.workstationProgram.workstationProgramId;
      }
      this.dataModel = data;
    }
  };

  dataModel:ProductTreeDetailQualityPlanCreateDto = {
    createDate: null,
    fromLotSize: null,
    groupCounter: null,
    keyDate: null,
    plannerGroup: null,
    plantId: null,
    productTreeDetailId: null,
    productTreeDetailQualityPlanCode: null,
    productTreeDetailQualityPlanId: null,
    qualityGroup: null,
    qualityPlanStatus: null,
    qualityUsageId: null,
    stockId: null,
    toLotSize: null,
    updateDate: null,
    workCenterId: null
  };

  usageList = [];

  productTreeSelectedMaterial: any;

  materialSubscription: Subscription;

  constructor(
    private loaderService: LoaderService,
    private _compSvc: ProductTreeWorkstationProgramService,
    private utilities: UtilitiesService,
    private _userSvc: UsersService,
    private qualityUsageSrv: UsageDecisionService,
    private _pTreeDetailQualtiyPlanSvc: ProductTreeDetailQualityPlanService,
    private _prodTreeSvc: ProductTreeService) {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.dataModel.plantId = this.selectedPlant.plantId;
    }
  }

  ngOnInit() {
    this.qualityUsageSrv.filterUsageDecision({ pageNumber: 1, pageSize: 9999 }).then((res: any) => this.usageList = res['content']);
    this.materialSubscription = this._prodTreeSvc.productTreeMaterial$.subscribe(res => {
      this.productTreeSelectedMaterial = res;
      if(res){
        this.dataModel.stockId = res.stockId;
      }else{
        this.dataModel.stockId = null;
      }
    });
  }

  ngOnDestroy(){
    this.materialSubscription.unsubscribe();
  }

  save() {
//     console.log('@save', this.dataModel);
// return;
    this.loaderService.showLoader();
    // if product tree detail id or operation  id is not null, that mean this workstation program  will be saved  or update standalone
    // if (this.productTreeDetailOperationId || this.productTreeDetailId) {

      console.log('@save', this.dataModel);
      this._pTreeDetailQualtiyPlanSvc.save(this.dataModel)
        .then(result => {
          this.loaderService.hideLoader();
          this.utilities.showSuccessToast('saved-success');
          setTimeout(() => {
            this.saveAction.emit(result);
          }, environment.DELAY);
        })
        .catch(error => {
          this.loaderService.hideLoader();
          this.utilities.showErrorToast(error);
        });
    // } else { // this mean feature will be saved after criteria saved
    //   this.saveAction.emit(this.dataModel);
    //   this.loaderService.hideLoader();
    //   this.utilities.showSuccessToast('saved-success');
    // }


  }


  setSelectedWorkstationProgram(criteria) {
    console.log('criteria', criteria)
    // this.dataModel.workstationProgram = criteria;
    // if (criteria) {
    //   this.dataModel.workstationProgramId = criteria.workstationProgramId;
    //   this.dataModel.description = criteria.description;
    //   this.dataModel.plcCode = criteria.plcCode;
    //   this.dataModel.plcValue = criteria.plcValue;
    //   this.dataModel.unit = criteria.unit;
    // } else {
    //   this.dataModel.workstationProgramId = null;
    // }

  }

  onMaterialChange(event) {
    console.log('onMaterialChange', event)
    this.dataModel.stockId = event.stockId;
  }

}
