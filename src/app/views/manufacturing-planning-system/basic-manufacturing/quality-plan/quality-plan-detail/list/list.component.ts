import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { UtilitiesService } from 'app/services/utilities.service';
import { ProductTreeDetailQualityPlanFilterDto } from 'app/dto/product-tree/quality-plan.dto';
import { Subject } from 'rxjs';
import { ProductTreeDetailQualityPlanService } from 'app/services/dto-services/product-tree/prod-tree-quality-plan-service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { LoaderService } from 'app/services/shared/loader.service';

@Component({
  selector: 'product-tree-quality-plan-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ProductTreeQualityPlanListComponent implements OnInit {

  @ViewChild('myModal') public myModal: ModalDirective;

  equipmentModal = {
    modal: null,
    data: null,
    id: null
  };
  productTreeDetailId: any;

  @Input('productTreeDetailId') set pTDI(productTreeDetailId) {
    
    if (productTreeDetailId) {
      this.productTreeDetailId = productTreeDetailId;
      this.pageFilter.productTreeDetailId = productTreeDetailId;
    }
  }

  detailMode: boolean = false;

  @Input('detailMode') set dM(detailMode) {
    this.detailMode = detailMode;
  };

  @Input() productTreeDetailOperationId;

  detailQualityPlan: any = [];

  @Input('tableData') set x(tableData) {
    if (tableData) {
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
    { field: 'productTreeDetailQualityPlanId', header: 'QUALITY_PLAN_ID' },
    { field: 'productTreeDetailQualityPlanCode', header: 'QUALITY_PLAN_CODE' },
    { field: 'stockNo', header: 'MATERIAL_NO' },
    { field: 'stockName', header: 'MATERIAL_NAME' },
    { field: 'qualityGroup', header: 'GROUP' },
    { field: 'groupCounter', header: 'GROUP_COUNTER' },
    { field: 'keyDate', header: 'KEY_DATE' },
  ]

  modal = { active: false };

  pageFilter: ProductTreeDetailQualityPlanFilterDto = {
    createDate: null,
    fromLotSize: null,
    groupCounter: null,
    keyDate: null,
    orderByDirection: 'desc',
    orderByProperty: null,
    pageNumber: 1,
    pageSize: 100,
    plannerGroup: null,
    plantId: null,
    productTreeDetailId: null,
    productTreeDetailQualityPlanCode: null,
    productTreeDetailQualityPlanId: null,
    qualityGroup: null,
    qualityPlanStatus: null,
    qualityUsageId: null,
    query: null,
    stockId: null,
    toLotSize: null,
    updateDate: null
  }

  private searchTerms = new Subject<any>();

  constructor(
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private _utilitiesSvc: UtilitiesService,
    private _pTreeDetailQualtiyPlanSvc: ProductTreeDetailQualityPlanService,
    private _loadderSvc: LoaderService) {
  }

  ngOnInit() {

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._pTreeDetailQualtiyPlanSvc.filter(term))).subscribe(
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
          this._pTreeDetailQualtiyPlanSvc.delete(id)
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
