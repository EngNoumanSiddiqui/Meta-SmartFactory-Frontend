/**
 * Created by reis on 29.07.2019.
 */
import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import { ProductionOrderMaterialService } from 'app/services/dto-services/production-order/production-order-material.service';
import { Subscription } from 'rxjs';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
@Component({
  selector: 'job-order-component-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class JobOrderComponentListComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  equipmentModal = {
    modal: null,
    data: null,
    id: null
  };

  @Input() direction;
  @Input() material=false;
  @Input() detailMode = false;
  @Input() allowOneMaterail: boolean = false;
  @Input() materialType: string;

  tableData = [];

  @Input('tableData') set x(tableData) {
      this.productionOrderMaterialService.componentMaterialChangedSubject.next(tableData);
console.log('@JobOrderComponentListComponent', tableData);
    if (tableData) {
      this.tableData = tableData;
    }
  }
  plantId;
  @Input('plantId') set plx(plantId) {
    if (plantId) {
      this.plantId = plantId;
    }
  }
  @Output() saveEvent = new EventEmitter();
  materialSub: Subscription;

  cols = [
    {field: 'jobOrderStockId', header: 'job-order-stock-id'},
    {field: 'position', header: 'position'},
    {field: 'stockNo', header: 'stock-no'},
    {field: 'stockName', header: 'component'},
    {field: 'weight', header: 'weight'},

    // {field: 'dimensionUnit', header: 'dimension-unit'},
    {field: 'neededQuantity', header: 'planned-quantity'},
    
    {field: 'currentStockQuantity', header: 'current-used-quantity'},

    {field: 'totalSetupQuantity', header: 'total-setup-quantity'},
    // {field: 'currentStockQuantity', header: 'produced-quantity'},
    {field: 'defectQuantity', header: 'scrap-quantity'},
    {field: 'reworkQuantity', header: 'rework-quantity'},
    {field: 'unit', header: 'quantity-unit'},
    {field: 'extraProductionPercentage', header: 'extra-production-percentage'},
    // {field: 'materialCost', header: 'material-cost'},
  ];

  modal = {active: false};

  constructor(private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private productionOrderMaterialService: ProductionOrderMaterialService) {
                this.materialSubscription();
  }

  ngOnInit() {
    if(this.material) {
      if(this.cols.find(itm => itm.field === 'currentStockQuantity')) {
        this.cols.find(itm => itm.field === 'currentStockQuantity').header = 'current-produced-quantity';
      }
      if(this.cols.find(itm => itm.field === 'stockName')) {
        this.cols.find(itm => itm.field === 'stockName').header = 'material';
      }

      this.cols.splice(this.cols.length - 2, 0, {field: 'waitingForJobDeliveredQuantity', header: 'reserved-quantity'});
    }
  }

  materialSubscription(){
    this.materialSub = this.productionOrderMaterialService.materialChanged().subscribe(res => {
      if(res && this.allowOneMaterail){
        this.tableData[0] = {
          stockId : (res.component)? res.component.stockId: res.stockId,
          stockNo : (res.component)? res.component.stockNo: res.stockNo,
          stockName: (res.component)? res.component.stockName: res.stockName,
          neededQuantity: (res.neededQuantity)? res.neededQuantity : 1,
          unit: (res.unit)? res.unit : res.baseUnit
        }
        this.onTableDataChange();
      }
    })
  }

  modalShow(id, mod: string, data) {

    this.equipmentModal.id = id;
    this.equipmentModal.modal = mod;
    this.equipmentModal.data = data;

    this.modal.active = true;
  }


  delete(id, index) {
      if(this.allowOneMaterail){
        this.productionOrderMaterialService.materialChangedSubject.next(null);
      }
      this.tableData.splice(index, 1)
      this.tableData = [...this.tableData];
      this.onTableDataChange();

  }

  onTableDataChange() {
    this.saveEvent.next(this.tableData);
  }


  addOrUpdate(item) {
    console.log('item===========>', item)
    if (this.equipmentModal.data) {// edit event
      this.equipmentModal.data.neededQuantity = item.neededQuantity;
      this.equipmentModal.data.unit = item.unit;
      this.equipmentModal.data.component = item.component;
      this.equipmentModal.data.stockId = item.stockId;
      this.equipmentModal.data.stockName = (item.component)? item.component.stockName : item;
      this.equipmentModal.data.direction = item.direction;
      this.equipmentModal.data.stockNo = item.component.stockNo;
    } else {// new event
      this.tableData = [item, ...this.tableData];
    }
    if(this.allowOneMaterail){
      this.productionOrderMaterialService.materialChangedSubject.next(item);
    }
    this.onTableDataChange();
  }

  showStockDetail(stockId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, stockId);
  }

  showJobOrderDetail(jobOrderId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDER, jobOrderId);
  }
}
