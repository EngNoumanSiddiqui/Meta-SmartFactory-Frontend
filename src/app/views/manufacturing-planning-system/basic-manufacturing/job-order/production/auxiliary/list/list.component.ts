import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import { ProductionOrderMaterialService } from 'app/services/dto-services/production-order/production-order-material.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';

@Component({
  selector: 'auxiliary-component-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class AuxiliaryComponentListComponent implements OnInit {

  @ViewChild('myModal') public myModal: ModalDirective;
  equipmentModal = {
    modal: null,
    data: null,
    id: null
  };

  @Input() direction;
  @Input() detailMode = false;

  tableData = [];
  plantId = null;
  @Input('plantId') set plx(plantId) {
    if (plantId) {
      this.plantId = plantId;
    }
  }
  @Input('tableData') set x(tableData) {
    this.productionOrderMaterialService.auxiliaryMaterialChangedSubject.next(tableData);

    if (tableData) {
      this.tableData = tableData;
    }
  }

  @Output() saveEvent = new EventEmitter();


  cols = [
    {field: 'jobOrderStockId', header: 'job-order-stock-id'},
    {field: 'stockNo', header: 'stock-no'},
    {field: 'component', header: 'component'},
    {field: 'direction', header: 'direction'},
    {field: 'neededQuantity', header: 'quantity'},
    {field: 'unit', header: 'quantity-unit'},
  ];

  modal = {active: false};

  constructor(private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private productionOrderMaterialService: ProductionOrderMaterialService) {
  }

  ngOnInit() {
  }


  modalShow(id, mod: string, data) {
    this.equipmentModal.id = id;
    this.equipmentModal.modal = mod;
    this.equipmentModal.data = data;

    this.modal.active = true;
  }


  delete(id, index) {


      this.tableData.splice(index, 1)
      this.tableData = [...this.tableData];
      this.onTableDataChange();

  }

  onTableDataChange() {
    this.saveEvent.next(this.tableData);
  }


  addOrUpdate(item) {
    console.log('AddOrUpdateItem', item)
    console.log('AddOrUpdateData', this.equipmentModal.data)
    if (this.equipmentModal.data) {// edit event
      this.equipmentModal.data.neededQuantity = item.neededQuantity;
      this.equipmentModal.data.unit = item.unit;
      this.equipmentModal.data.component = item.component;
      this.equipmentModal.data.stockId = item.stockId;
      this.equipmentModal.data.stockName = item.stockName;
      this.equipmentModal.data.direction = item.direction;
    } else {// new event
      this.tableData = [item, ...this.tableData];
    }
    this.onTableDataChange();
  }
  showStockDetail(stockId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, stockId);
  }

  showProductTreeDetail(productTreeId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PRODUCTTREE, productTreeId);
  }
}
