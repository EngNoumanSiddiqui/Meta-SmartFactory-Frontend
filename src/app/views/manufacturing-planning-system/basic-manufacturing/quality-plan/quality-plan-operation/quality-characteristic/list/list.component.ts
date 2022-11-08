import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {UtilitiesService} from 'app/services/utilities.service';
import {Subject} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';
import {LoaderService} from 'app/services/shared/loader.service';
import {ProductTreeDetailQualityPlanCharacFilterDto} from 'app/dto/product-tree/quality-plan.dto';
import {ProductTreeDetailQualityPlanCharacService} from 'app/services/dto-services/product-tree/prod-tree-quality-plan-charac-service';
import {ModalDirective} from 'ngx-bootstrap/modal';

@Component({
  selector: 'product-tree-quality-plan-characteristic-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ProductTreeQualityPlanCharacteristicListComponent implements OnInit {

  @ViewChild('myModal') public myModal: ModalDirective;

  equipmentModal = {
    modal: null,
    data: null,
    id: null
  };

  @Input('qualityInspectionOperationId') set pTDI(qualityInspectionOperationId) {
    console.log('@qualityInspectionOperationId', qualityInspectionOperationId)
    if (qualityInspectionOperationId) {
      this.pageFilter.qualityInspectionOperationId = qualityInspectionOperationId;
    }
  }

  detailMode: boolean = false;

  @Input('detailMode') set dM(detailMode) {
    this.detailMode = detailMode;
    console.log('@detailMode', detailMode)
  };

  @Input() productTreeDetailOperationId;

  detailQualityPlan: any = [];

  @Input('tableData') set x(tableData) {
    if (tableData) {
      console.log('tableData', tableData)
      this.detailQualityPlan = tableData;
    }
  }

  @Output() saveEvent = new EventEmitter();

  modalType: any;

  @Input('openModalType') set onmodal(openModalType) {
    this.modalType = openModalType;
    if (openModalType) {
      setTimeout(() => {
        this.modalShow(null, 'NEW', null);
      }, 1000);
    }
  }

  cols = [
    { field: 'productTreeDetailQualityPlanCharacOperationId', header: 'QUALITY_CHARAC_OPEARTION_ID' },
    { field: 'productTreeDetailQualityPlanCharacOperationCode', header: 'QUALITY_CHARAC_OPERATION_CODE' },
    { field: 'qualityInspectionCharacteristic', header: 'inspection-charateristics' },
    { field: 'qualityInspectionMethod', header: 'inspection-method' },
    { field: 'qualitySamplingProcedure', header: 'sampling-procedure' },
  ]

  modal = { active: false };

  pageFilter: ProductTreeDetailQualityPlanCharacFilterDto = {
    createDate: null,
    inspectionCharacteristicId: null,
    lowerSpecific: null,
    orderByDirection: 'desc',
    orderByProperty: 'productTreeDetailQualityPlanCharacOperationId',
    pageNumber: 1,
    pageSize: 100,
    productTreeDetailQualityPlanCharacOperationCode: null,
    productTreeDetailQualityPlanCharacOperationId: null,
    qualityInspectionCharacteristicId: null,
    qualityInspectionMethodId: null,
    qualityInspectionOperationId: null,
    qualityPlanOperationId: null,
    qualitySamplingProcedureId: null,
    query: null,
    updateDate: null,
    upperLimit: null
  }

  private searchTerms = new Subject<any>();

  constructor(private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private _utilitiesSvc: UtilitiesService,
    private _pTreeDEtailQualityPlanCharacSvc: ProductTreeDetailQualityPlanCharacService,
    private _loadderSvc: LoaderService) {
  }

  ngOnInit() {

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._pTreeDEtailQualityPlanCharacSvc.filter(term))).subscribe(
        result => {
          this.detailQualityPlan = result['content'];
          this._loadderSvc.hideLoader();
        },
        error => {
          this._utilitiesSvc.showErrorToast(error)
          this._loadderSvc.hideLoader();
        }
      );
    this.filter(this.pageFilter);
  }

  filter(data) {
    this._loadderSvc.showLoader();
    this.searchTerms.next(data);
  }

  modalShow(id, mod: string, data) {

    this.equipmentModal.id = id;
    this.equipmentModal.modal = mod;
    this.equipmentModal.data = data;

    this.modal.active = true;
  }


  delete(id, index) {
    if (id) {
      this._confirmationSvc.confirm({
        message: this._translateSvc.instant('do-you-want-to-delete'),
        header: this._translateSvc.instant('delete-confirmation'),
        icon: 'fa fa-trash',
        accept: () => {
          this._pTreeDEtailQualityPlanCharacSvc.delete(id)
            .then(() => {
              this._utilitiesSvc.showSuccessToast('deleted-success');
              this.filter(this.pageFilter);
            })
            .catch(error => this._utilitiesSvc.showErrorToast(error));
        },
        reject: () => {
          this._utilitiesSvc.showInfoToast('cancelled-operation');
        }
      })
    }
  }

  addOrUpdate(item) {
    this.filter(this.pageFilter);
  }

}
