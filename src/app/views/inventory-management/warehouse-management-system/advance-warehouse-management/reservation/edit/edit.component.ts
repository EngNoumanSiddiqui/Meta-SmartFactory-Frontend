import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import { UsersService } from 'app/services/users/users.service';
import { ResponseReservationDetailDto } from 'app/dto/reservation/reservation.model';
import { WorkstationService } from 'app/services/dto-services/workstation/workstation.service';
import { Router } from '@angular/router';
import { LoaderService } from 'app/services/shared/loader.service';
import { ReservationService } from 'app/services/dto-services/reservation/reservation.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';


@Component({
  selector: 'reservation-edit',
  templateUrl: './edit.component.html',
  styleUrls: []
})
export class EditReservationComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  selectedPlant: any;
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
    console.log('id: ' + id);
  };

  id;
  unitList: any = [];
  jobOrderList: any = [];
  saleOrders: any = [];
  stocks: any = [];
  plantList: any = [];
  reservationDetail = new ResponseReservationDetailDto();
  batchCodes = [];



  plants = {
    plantId: null,
    plantName: null,
    plantCode: null,
    createdDate: null,
    address: null,
    postcode: null
  };

  modal = {active: false};
  modal2 = {active: false};
  params = {
    dialog: {title: '', inputValue: '', visible: false},

    warehouseDialog: {title: '', stockId: null, stockName: '', visible: false, item: null},
  };

  constructor(private _workstationSvc: WorkstationService,
              private _router: Router,
              private loaderService: LoaderService,
              private userService: UsersService,
              private _reservationSvc: ReservationService, private utilities: UtilitiesService) {

                this.selectedPlant = JSON.parse(userService.getPlant());

  }

  private initialize(id) {
    this.loaderService.showLoader();
    this._reservationSvc.getReservationDetailForUpdate(this.id).then(result => {
      this.loaderService.hideLoader();
      if (result['requirementDate']) {
        result['requirementDate'] = new Date(result['requirementDate']);
      }
      this.reservationDetail = result as ResponseReservationDetailDto;
      this.reservationDetail['fromWarehouseId'] = this.reservationDetail.warehouseId;
      // console.log('ReservationDetail: ', this.reservationDetail);
    }).catch(error => {
      this.loaderService.hideLoader();

    });
  }

  ngOnInit(): void {
      this._workstationSvc.getWorkstationUnitList().then(result => {
        this.unitList = result;
        // console.log(result);
      }).catch(error => console.log(error));

  }

  resetFormFields() {
    this.reservationDetail.enteredUnitMeasure = null;
    this.reservationDetail.enteredUnitQuantity = 1;

  }

  save() {
    this.loaderService.showLoader();
    // const reservationUpdateRequestDate = {
    //   'baseUnit': this.reservationDetail.enteredUnitMeasure,
    //   'batch': this.reservationDetail.batch,
    //   'finalIssue': this.reservationDetail.finalIssue,
    //   'jobOrderId': this.reservationDetail.itemNo,
    //   'materialId': this.reservationDetail.materialId,
    //   'movementType': this.reservationDetail.movementType,
    //   'orderDetailId': this.reservationDetail.orderDetailId,
    //   'plantId': this.reservationDetail.plantId,
    //   'prodOrderId': this.reservationDetail.prodOrderId,
    //   'quantity': this.reservationDetail.enteredUnitQuantity,
    //   'reservationId': this.reservationDetail.reservationId,
    //   'saleOrderId': this.reservationDetail.saleOrderId,
    //   'status': this.reservationDetail.status,
    //   'warehouseId': this.reservationDetail.warehouseId,
    // }

    this.reservationDetail['baseUnit'] = this.reservationDetail.enteredUnitMeasure;
    this.reservationDetail['quantity'] = this.reservationDetail.requirementQuantity;
    this.reservationDetail['jobOrderId'] = this.reservationDetail.itemNo;
    // this.reservationDetail['fromWarehouseId'] = this.reservationDetail.warehouseId;
    delete this.reservationDetail['salesOrder'];
    delete this.reservationDetail['prodOrder'];
    delete this.reservationDetail['purchaseOrderDetailDto'];
    delete this.reservationDetail['maintenanceOrder'];
    // this.reservationDetail['prodOrderId'] = this.reservationDetail.prodOrderId;

    this._reservationSvc.saveStockReservation(this.reservationDetail)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('updated-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });

  }


  onSelectedTransferNotification(event) {
    if(event) {
      this.reservationDetail.fromWarehouseId = event.warehouseId;
      this.reservationDetail.batch = event.batch;
      this.reservationDetail.barcode = event.barcode;
      this.reservationDetail.locationNo = event.locationNo;
      this.modal2.active = false;
    }
  }
}
