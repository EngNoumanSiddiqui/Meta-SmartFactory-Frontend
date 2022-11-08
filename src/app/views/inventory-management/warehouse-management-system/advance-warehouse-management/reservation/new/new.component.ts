import { AppStateService } from 'app/services/dto-services/app-state.service';
import {Component, EventEmitter, OnInit, Output, ViewChild, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';

import { Subscription } from 'rxjs';
import { ImageAdderComponent } from 'app/views/image/image-adder/image-adder.component';
import { RequestReservationCreateDto } from 'app/dto/reservation/reservation.model';
import { LoaderService } from 'app/services/shared/loader.service';
import { PlantService } from 'app/services/dto-services/plant/plant.service';
import { StockCardService } from 'app/services/dto-services/stock/stock.service';
import { WarehouseService } from 'app/services/dto-services/warehouse/warehouse.service';
import { ProductionOrderService } from 'app/services/dto-services/production-order/production-order.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { SalesOrderService } from 'app/services/dto-services/sales-order/sales-order.service';
import { ReservationService } from 'app/services/dto-services/reservation/reservation.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ResponseJobOrderFilterDto } from 'app/dto/job-order/job-order.model';
import { ResponseOrderFilterListDto } from 'app/dto/sale-order/sale-order.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'reservation-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewReservationComponent implements OnInit, OnDestroy {
  @ViewChild(ImageAdderComponent) imageAdderComponent: ImageAdderComponent;
  @Output() saveAction = new EventEmitter<any>();

  equipment = {
    'equipmentNo': null,
    'equipmentName': null,
    'description': null,
    'placeNo': null,
    'width': null,
    'length': null,
    'height': null,
    'stockIdx': null,
  };
  movementTypeList: any = [];
  productionOrders: any = [];
  jobOrderList: any = [];
  saleOrders: any = [];
  saleOrderDetailList: any = [];
  stocks: any = [];
  unitList: any = [];
  plantList: any = [];
  wareHouseList: any = [];
  reservationRequestDto = new RequestReservationCreateDto();
  reservationRequestDtoList: any = [];


  filterAllData = {
    pageNumber: 1,
    plantId: null,
    pageSize: 10000
  };

  selectedItemIndex = -1;

  plants = {
    plantId: null,
    plantName: null,
    plantCode: null,
    createdDate: null,
    address: null,
    postcode: null
  };

  modal: any;
  params = {
    dialog: {title: '', inputValue: '', visible: false},

    warehouseDialog: {title: '', stockId: null, stockName: '', visible: false, item: null},
  };
  private selectedDetailIndex: number;
  sub: Subscription;
  selectedPlant: any;

  constructor(private _router: Router,
              private loaderService: LoaderService,
              private _plantSvc: PlantService,
              private stockService: StockCardService,
              private _wareHouseSvc: WarehouseService,
              private _prodOrderSvc: ProductionOrderService,
              private _enumSvc: EnumService,
              private appStateSvc:AppStateService,
              private _orderSvc: SalesOrderService,
              private _reservationSvc: ReservationService,
              private utilities: UtilitiesService) {
                this.sub = this.appStateSvc.plantAnnounced$.subscribe((res:any) => {
                  if (!(res)) {
                    this.reservationRequestDto.plantId = null;
                    this.selectedPlant = null;

                  } else {
                    this.reservationRequestDto.plantId = res.plantId;
                    this.filterAllData.plantId = res.plantId;
                    this.selectedPlant = res;
                  }
                });
            

  }

  setSelectedBatch(batch) {
    if (batch) {
      this.reservationRequestDto.batch = batch.batchCode;
    } else {
      this.reservationRequestDto.batch = null;
    }
  }

  ngOnInit() {
    // this._plantSvc.getAllPlants().then(result => {
    //   this.plantList = result;
    //   console.log(result);
    // }).catch(error => console.log(error));

    this._enumSvc.getMovementTypeList().then(r => {
      this.movementTypeList = r;
    });
    this.sub = this.appStateSvc.plantAnnounced$.subscribe((res:any) => {
      if (!(res)) {
        this.reservationRequestDto.plantId = null;
        this.selectedPlant = null;

      } else {
        this.reservationRequestDto.plantId = res.plantId;
        this.filterAllData.plantId = res.plantId;
        this.selectedPlant = res;
      
    
    
        this._wareHouseSvc.filter(this.filterAllData)
        .then(result => this.wareHouseList = result['content'])
        .catch(error => console.log(error));
      }
    });

    

    // this._plantSvc.getAllPlants()
    //   .then((result: any) => this.plants = result)
    //   .catch(error => console.log(error));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  setSelectedMaterial(stock) {
    this.unitList = null;
    this.reservationRequestDto.baseUnit = null;
    if (stock) {
      this.reservationRequestDto.material = stock;
      this.reservationRequestDto.baseUnit = stock.baseUnit;
      this.reservationRequestDto.baseUnitOfStock = stock.baseUnit
      this.stockService.metarialActiveUnits(stock.stockId).then(result => {
        this.unitList = result;
      });
    } else {
      this.reservationRequestDto.material = null;
      this.reservationRequestDto.baseUnitOfStock = null;
    }
  }


  reset() {
    this.reservationRequestDtoList = [];
    this.reservationRequestDto = new RequestReservationCreateDto();
  }


  openTransferDetailsModal(index) {
    this.params.dialog.title = 'Reservation Details';
    this.params.dialog.visible = true;
    this.selectedDetailIndex = index;

    if (this.selectedDetailIndex < 0) {
      // new
      const newReservationRequest = new RequestReservationCreateDto();
      newReservationRequest.movementType = this.reservationRequestDto.movementType;
      newReservationRequest.prodOrder = this.reservationRequestDto.prodOrder;
      newReservationRequest.jobOrder = this.reservationRequestDto.jobOrder;
      newReservationRequest.saleOrder = this.reservationRequestDto.saleOrder;
      newReservationRequest.orderDetail = this.reservationRequestDto.orderDetail;
      newReservationRequest.plantId = this.reservationRequestDto.plantId;

      newReservationRequest.materialId = this.reservationRequestDto.materialId;
      newReservationRequest.materialName = this.reservationRequestDto.materialName;
      newReservationRequest.baseUnit = this.reservationRequestDto.baseUnit;
      newReservationRequest.baseUnitOfStock = this.reservationRequestDto.baseUnitOfStock
      this.reservationRequestDto = newReservationRequest;
    } else {
      // edit
      this.reservationRequestDto = Object.assign({}, this.reservationRequestDtoList[index]);
    }
  }


  deleteDetailFromList(index) {
    this.reservationRequestDtoList.splice(index, 1);
  }


  resetNewItemDetails() {
    this.reservationRequestDto = new RequestReservationCreateDto();
  }

  addDetails() {
    const cloneOfReservationRequestDto = Object.assign({}, this.reservationRequestDto);
    if (this.selectedDetailIndex < 0) {
      // add
      this.reservationRequestDtoList.push(cloneOfReservationRequestDto);
    } else {
      // update
      this.reservationRequestDtoList[this.selectedDetailIndex] = cloneOfReservationRequestDto;
    }
    this.params.dialog.visible = false;
    console.log(this.reservationRequestDtoList);
  }

  saveReservation() { // call web service
    this.loaderService.showLoader();
    const reservationRequestData: any = [];
    this.reservationRequestDtoList.forEach(r => {
      const reservationItem = {
        'baseUnit': r.baseUnit,
        'batch': r.batch,
        'finalIssue': r.finalIssue,
        'materialId': r.materialId,
        'movementType': r.movementType,
        'plantId': r.plantId,
        'height': r.height,
        'width': r.width,
        'dimensionUnit': r.dimensionUnit,
        'prodOrderId': r.prodOrder == null ? null : r.prodOrder.prodOrderId,
        'jobOrderId': r.jobOrder == null ? null : r.jobOrder.jobOrderId,
        'quantity': r.quantity,
        'reservationId': null,
        'saleOrderId': r.saleOrder == null ? null : r.saleOrder.orderId,
        'orderDetailId': r.orderDetail == null ? null : r.orderDetail.orderDetailId,
        'status': 'MANUEL',
        'warehouseId': r.wareHouse.wareHouseId
      };
      reservationRequestData.push(reservationItem);
    });

    this._reservationSvc.saveStockReservationList(reservationRequestData)
      .then(() => {
        this.loaderService.hideLoader();
        console.log('ok');
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.reset();
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });


  }

  onProductionOrderChange($event, prodOrderId: number) {
    const detailItem = this.productionOrders.find(item => item.prodOrderId === prodOrderId);
    this.jobOrderList = detailItem.jobOrderList;

    this.reservationRequestDto.materialId = detailItem.materialId;
    this.reservationRequestDto.materialName = detailItem.materialName;
    this.reservationRequestDto.baseUnit = detailItem.baseUnit;
    this.reservationRequestDto.baseUnitOfStock = detailItem.baseUnit;
    this.reservationRequestDto.height = detailItem.height;
    this.reservationRequestDto.width = detailItem.width;
    this.reservationRequestDto.dimensionUnit = detailItem.dimensionUnit;

    this.stockService.metarialActiveUnits(detailItem.materialId).then(result => {
      this.unitList = result;
    });
  }

  onSaleOrderChange($event, saleOrderId: number) {
    const detailItem = this.saleOrders.find(item => item.orderId === saleOrderId);
    this.saleOrderDetailList = detailItem.orderDetailDtoList;
  }

  onSaleOrderDetailChange($event, saleOrderDetailId: number) {
    const detailItem = this.saleOrderDetailList.find(item => item.orderId === saleOrderDetailId);

    this.reservationRequestDto.materialId = detailItem.stockId;
    this.reservationRequestDto.materialName = detailItem.stockName;
    this.reservationRequestDto.baseUnit = detailItem.unit;
    this.reservationRequestDto.baseUnitOfStock = detailItem.unit;
    this.reservationRequestDto.height = detailItem.height;
    this.reservationRequestDto.width = detailItem.width;
    this.reservationRequestDto.dimensionUnit = detailItem.dimensionUnit;

    this.stockService.metarialActiveUnits(detailItem.stockId).then(result => {
      this.unitList = result;
    });
  }

  onMovementTypeChange($event: {}, movementType: string) {
    if (movementType === 'RESERVATION_FOR_PRODUCTION_ORDER') {
      this.reservationRequestDto.saleOrder = null;
      this.reservationRequestDto.orderDetail = null;
      this.saleOrderDetailList = [];
      this.loaderService.showLoader();
      this._prodOrderSvc.filterProdObservable(this.filterAllData).subscribe(
        result => {
          this.productionOrders = result['content'] as ResponseJobOrderFilterDto[];
          this.loaderService.hideLoader();
        },
        error2 => {
          console.log(error2)
        });
  
    
    } else if (movementType === 'RESERVATION_FOR_SALE_ORDER') {
      this.reservationRequestDto.prodOrder = null;
      this.reservationRequestDto.jobOrder = null;
      this.jobOrderList = [];
      this.loaderService.showLoader();
      this._orderSvc.filter(this.filterAllData)
      .then(result => {
        this.saleOrders = result['content'] as ResponseOrderFilterListDto[];
        this.loaderService.hideLoader();
        console.log(result);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
    }
  }
}
