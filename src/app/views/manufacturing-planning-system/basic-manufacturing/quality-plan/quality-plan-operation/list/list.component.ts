import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { UtilitiesService } from 'app/services/utilities.service';
import { Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { LoaderService } from 'app/services/shared/loader.service';
import { ProductTreeDetailQualityPlanOperationService } from 'app/services/dto-services/product-tree/prod-tree-quality-plan-operation-service';
import { ProductTreeDetailQualityPlanOperationFilterDto } from 'app/dto/product-tree/quality-plan.dto';

@Component({
  selector: 'product-tree-quality-plan-operation-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ProductTreeQualityPlanOperationListComponent implements OnInit {

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

  @Input() productTreeDetailId;
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
    { field: 'productTreeDetailQualityPlanOperationId', header: 'QUALITY_PLAN_OPERATION_ID' },
    { field: 'productTreeDetailQualityPlanOperationCode', header: 'QUALITY_PLAN_OPERATION_CODE' },
    { field: 'qualityInspectionOperation', header: 'inspection-operation' },
    { field: 'workCenter', header: 'workcenter' },
    { field: 'qualityControlKey', header: 'control-key' },
    { field: 'description', header: 'description' },

  ]

  modal = { active: false };

  pageFilter: ProductTreeDetailQualityPlanOperationFilterDto = {
    description: null,
    orderByDirection: null,
    orderByProperty: null,
    pageNumber: 1,
    pageSize: 100,
    productTreeDetailQualityPlanOperationCode: null,
    productTreeDetailQualityPlanOperationId: null,
    qualityControlKeyId: null,
    qualityInspectionOperationId: null,
    qualityPlanId: null,
    query: null,
    workCenterId: null
  }

  private searchTerms = new Subject<any>();

  constructor(private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private _utilitiesSvc: UtilitiesService,
    private _pTreeDEtailQualityPlanOperationSvc: ProductTreeDetailQualityPlanOperationService,
    private _loadderSvc: LoaderService) {
  }

  ngOnInit() {

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._pTreeDEtailQualityPlanOperationSvc.filter(term))).subscribe(
        result => {
          // this.pagination.currentPage = result['currentPage'];
          // this.pagination.totalElements = result['totalElements'];
          // this.pagination.totalPages = result['totalPages'];
          this.detailQualityPlan = result['content'];
          this._loadderSvc.hideLoader();
        },
        error => {
          this._utilitiesSvc.showErrorToast(error)
          this._loadderSvc.hideLoader();
        }
      );
    // console.log('PageFilter =====>', this.pageFilter)
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
          this._pTreeDEtailQualityPlanOperationSvc.delete(id)
            .then(() => {
              this._utilitiesSvc.showSuccessToast('deleted-success');
              this.filter(this.pageFilter);
            })
            .catch(error => this._utilitiesSvc.showErrorToast(error));
        },
        reject: () => {
          this._utilitiesSvc.showInfoToast('cancelled-operation');
        }
      });
    }
  }

  addOrUpdate(item) {
    this.filter(this.pageFilter);
  }

}
