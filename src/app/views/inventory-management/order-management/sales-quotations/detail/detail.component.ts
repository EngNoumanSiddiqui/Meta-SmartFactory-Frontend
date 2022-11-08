import {Component, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { SalesOrderQuotationsService } from 'app/services/dto-services/sales-order-quotations/sales-order-quotations.service';
import { ImageViewerComponent } from 'app/views/image/image-viewer/image-viewer.component';
import { TableTypeEnum } from 'app/dto/table-type-enum';
import { CreateSalesQuotations } from 'app/dto/sale-order/sale-order-quotation.model';
import { UsersService } from 'app/services/users/users.service';
import { ActService } from 'app/services/dto-services/act/act.service';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'sales-quotations-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.componet.scss']
})
export class DetailSaleQuotationsComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  // @ViewChild(ImageViewerComponent) imageViewerComponent: ImageViewerComponent;
  @ViewChildren(ImageViewerComponent) imageViewerComponent: QueryList<ImageViewerComponent>;
  // @ViewChild('orderDetailPlan') orderDetailPlanComponent: OrderDetailPlanQuotationsComponent;

  id;
  // saleOrder: any = {};
  saleOrder: any = new CreateSalesQuotations();
  showLoader = true;

  params = {
    orderDetail: null,
    transferObj: null,
    dialog: {title: '', inputValue: '', visible: false, active: true},
    title: ''
  };
  selectedOrderDetail;
  notificationSelectedColumns = [
    { field: 'stockTransferReceiptNotificationId', header: 'stock-transfer-receipt-notification-id'},
    { field: 'stockTransferNotificationDetailId', header: 'stock-transfer-notification-detail-id'},
    { field: 'materialNo', header: 'material-no'},
    { field: 'materialName', header: 'material-name'},
    { field: 'quantity', header: 'quantity'},
    { field: 'baseUnit', header: 'unit'},
    { field: 'goodMovementDocumentType', header: 'good-movement-document-type'},
    { field: 'goodsMovementActivityType', header: 'goods-movement-activity-type'},
    { field: 'goodsMovementStatus', header: 'status'},
  ];
  notificationTree = [];
  itemId: any;
  selectedPlant: any;
  today = new Date();
  
  actListSubject = new BehaviorSubject([]);
  actList$ = this.actListSubject.asObservable();

  selectedCustomerSubject = new BehaviorSubject(null);
  selectedCustomer$ =  this.selectedCustomerSubject.asObservable();
  selectedOrganization: any;

  @Input('id') set x(id) {
    this.id = id;
    if (id) {
      this.initialize(id);
    }
  }

  @Input('itemId') set xitemId(itemId) {
    this.itemId = itemId;
    if (itemId) {
      this.getOrderId(itemId);
    }
  }

  @Input('quotationStatus') set xstatus(quotationStatus) {
    // when sendMail clicked status will be changed to OFFER_SENT
    if (quotationStatus && quotationStatus !== '') {
      this.saleOrder.orderQuotationStatus = quotationStatus;
      this.saleOrder.orderQuotationDetailList.forEach((item: any) => {
        item.orderDetailQuotationStatus = quotationStatus;
      });
    }
  }

  initializeAll() {
    // if (this.orderDetailPlanComponent) {
    //   this.orderDetailPlanComponent.initialize();
    // }
    this.initialize(this.id);
  }

  createProforma(myModal) {
    this.params.dialog.title = 'invoice';
    this.params.dialog.visible = true;
    setTimeout(() => {
      myModal.show();
    }, 300);
  }

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _actSvc: ActService,
              private userSvc: UsersService,
              private _saleSvc: SalesOrderQuotationsService,
              private loaderService: LoaderService, private utilities: UtilitiesService) {

                this.selectedPlant = JSON.parse(this.userSvc.getPlant());
                this.selectedOrganization = JSON.parse(this.userSvc.getOrganization());
    // this._route.params.subscribe((params) => {
    //   this.id = params['id'];
    //   this.initialize(this.id);
    // });


    this.selectedCustomer$= combineLatest([this.actList$, this.selectedCustomer$]).pipe(
      filter(([actList, selectedCustomer]) => !!actList && !!actList.length && !!selectedCustomer),
      map(([actList, selectedCustomer]) => {
          const act = actList.find((item) => item.actId == selectedCustomer.actId);
          if (act) {
            return act;
          }
      })
    );

  }

  public initialize(id: string) {
    this.loaderService.showLoader();
    this._saleSvc.getDetail(id)
      .then((result: any) => {
        // console.log(result);
        this.saleOrder = result as any;
        // if (this.saleOrder.orderQuotationDetailList.length > 0) {
        //   this.params.orderDetail = this.saleOrder.orderQuotationDetailList[0];
        // }

        if (this.saleOrder.act) {
          this.selectedCustomerSubject.next({actId: result?.act?.actId, actName: result?.act?.actName});
        }
        // if (this.actList && this.selectedCustomer) {
        //   const act = this.actList.find((item) => item.actId == this.selectedCustomer.actId);
        //   if (act) {
        //     this.selectedCustomer = act;
        //   }
        // }

        setTimeout(() => {
          if (this.imageViewerComponent && this.imageViewerComponent.length) {
            this.saleOrder.orderQuotationDetailList.forEach((item, index) => {
              this.imageViewerComponent.toArray()[index].initImages(item.quotationDetailId, TableTypeEnum.SALES_QUOTATION_DETAIL);
            });

          }
        }, 1000);

        this.loaderService.hideLoader();
      })
      .catch(error => {
        this.utilities.showErrorToast(error)
        this.loaderService.hideLoader();
      });
  }

  ngOnInit() {
    this._actSvc.filter({
      "pageNumber": 1,
      "pageSize": 9999,
      "plantId": this.selectedPlant?.plantId,
      accountPosition: 'CUSTOMER'
    }).then(result => {
      this.actListSubject.next(result['content']);
      // if (result && result['content'] && this.selectedCustomer) {
      //   const act = this.actList.find((item) => item.actId == this.selectedCustomer.actId);
      //   if (act) {
      //     this.selectedCustomer = act;
      //   }
      // }

    }).catch(error => console.log(error));


    
    
  }


  

  closeModal() {
    this.params.transferObj = null;
    this.params.title = '';
    this.myModal.hide();
  }

  getOrderId(itemId) {
    this._saleSvc.filterOrderDetails({
      'orderByDirection': 'desc',
      'orderByProperty': 'quotationDetailId',
      'orderDetailId': itemId,
      'pageNumber': 1,
      'pageSize': 10
    }).toPromise().then(res => {
      if (res['content'] && res['content'].length > 0) {
        this.initialize(res['content'][0].orderQuotationId);
      }
    })
  }
  showDetailDialog(id, type: string) {
    this.loaderService.showDetailDialog(DialogTypeEnum[type], id);
  }

    // get TotalSalesPrice() {
    //   return this.saleOrder?.orderQuotationDetailList?.reduce((total, item) => total + item.salePrice, 0) || 0;
    // }

    get TotalSalesPrice() {
      this.saleOrder.totalSalesPrice = this.saleOrder?.orderQuotationDetailList?.reduce((total, item) => total + item.salePrice, 0) || 0;
      return this.saleOrder.totalSalesPrice;
    }
    get TotalVatPrice() {
      this.saleOrder.totalVatPrice = this.saleOrder?.orderQuotationDetailList?.reduce((total, item) => total + item.vatPrice, 0);
      return this.saleOrder.totalVatPrice;
    }
    get TotalNetPrice() {
      this.saleOrder.totalNetPrice = this.saleOrder?.orderQuotationDetailList?.reduce((total, item) => total + item.netPrice, 0);
      return this.saleOrder.totalNetPrice;
    }
}
