import {Component, EventEmitter, OnInit, Output, ViewChild, Input} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {environment} from '../../../../environments/environment';
import {EnumService} from '../../../services/dto-services/enum/enum.service';
import {ConvertUtil} from '../../../util/convert-util';
import {UtilitiesService} from '../../../services/utilities.service';
import {LoaderService} from '../../../services/shared/loader.service';
import {EquipmentService} from '../../../services/dto-services/equipment/equipment.service';
import { ChoosePaneEquipment } from 'app/dto/choose-panes/choose.panes';
import { ProductDetailItemCommunicatingService } from 'app/views/manufacturing-planning-system/basic-manufacturing/product-detail-item.service';


@Component({
  selector: 'choose-equipment-pane',
  templateUrl: './choose-equipment-pane.component.html',
})
export class ChooseEquipmentPaneComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  equipmentModal = {
    modal: null,
    id: null
  };

  @Input('plantId')
  set plantIdy(plantId) {
    if (plantId) {
      this.pageFilter.planningPlatId = plantId;
    } else {
      this.pageFilter.planningPlatId = null;
    }
    this.filter(this.pageFilter);
  }

  @Input() removeTopButtons = false;


  pagination = {
    totalElements: 0,
    currentPage: 1,
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    totalPages: 1,
    TotalPageLinkButtons: 5,
    RowsPerPageOptions: [10, 20, 30, 50, 100, 1000],
    rows: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    tag: ''
  };

  pageFilter: ChoosePaneEquipment = {
    description: null,
    equipmentName: null,
    equipmentNo: null,
    orderByDirection: 'desc',
    orderByProperty: null,
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    planningPlatId: 0,
    query: null,
  };

  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];

  selectedColumns = [
    {field: 'equipmentId', header: 'equipment-id'},
    {field: 'equipmentNo', header: 'equipment-no'},
    {field: 'equipmentName', header: 'equipment-name'},
    {field: 'description', header: 'description'},
    {field: 'validFrom', header: 'valid-from'},
    {field: 'equipmentCategory', header: 'category'},
    {field: 'equipmentABCIndicator', header: 'abc-indicator'},
    {field: 'planningPlant', header: 'planning-plant'},
    {field: 'equipmentPlannerGroup', header: 'planner-group'},
    {field: 'maintenanceWorkstation', header: 'maintenance-workstation'},
    {field: 'maintenanceWorkstationPlant', header: 'maintenance-workstation-plant'},

  ];
  cols = [
    {field: 'equipmentId', header: 'equipment-id'},
    {field: 'equipmentNo', header: 'equipment-no'},
    {field: 'equipmentName', header: 'equipment-name'},
    {field: 'description', header: 'description'},
    {field: 'validFrom', header: 'valid-from'},
    {field: 'equipmentCategory', header: 'category'},
    {field: 'equipmentABCIndicator', header: 'abc-indicator'},
    {field: 'planningPlant', header: 'planning-plant'},
    {field: 'equipmentPlannerGroup', header: 'planner-group'},
    {field: 'maintenanceWorkstation', header: 'maintenance-workstation'},
    {field: 'maintenanceWorkstationPlant', header: 'maintenance-workstation-plant'},
    {field: 'equipmentObjectType', header: 'object-type'},
    {field: 'weight', header: 'weight'},
    {field: 'weightUnit', header: 'weight-unit'},
    {field: 'manufacturer', header: 'manufacturer'},
    {field: 'modelNumber', header: 'model'},
    {field: 'manufacturerPartNo', header: 'manufacturer-part-no'},
    {field: 'manufacturerSerialNo', header: 'manufacturer-serial-no'},
    {field: 'manufacturerMonth', header: 'manufacturer-month'},
    {field: 'manufacturerYear', header: 'manufacturer-year'},
    {field: 'manufacturerCountry', header: 'manufacturer-country'},
  ];


  equipments = [];
  listStatus;

  showLoader = false;

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;

    this.filter(this.pageFilter);
  }

  modalShow(id, mod: string) {

    this.equipmentModal.id = id;
    this.equipmentModal.modal = mod;

    this.myModal.show();
  }
  @Output() selectedEvent = new EventEmitter();
  constructor(private _confirmationSvc: ConfirmationService,
              private _enumEquipmentStatus: EnumService,
              private _translateSvc: TranslateService,
              private prodDetailCommunicatingService: ProductDetailItemCommunicatingService,
              private _equipmentSvc: EquipmentService, private utilities: UtilitiesService,
              private loaderService: LoaderService) {

  }

  onRowSelect(event) {
    // event.data
    this.selectedEvent.next(event);

    this.utilities.showInfoToast(event.equipmentName + ' added');

  }
  ngOnInit() {
    this.filter(this.pageFilter);
    this._enumEquipmentStatus.getEquipmentStatusList().then(result => this.listStatus = result).catch(error => console.log(error));
  }

  filter(data) {
    this.loaderService.showLoader();
    this._equipmentSvc.filter(data)
      .then(result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.equipments = result['content'];

       if (this.prodDetailCommunicatingService.seletedProdDTItem && this.prodDetailCommunicatingService.seletedProdDTItem.equipmentList) {
        for (const arr of this.prodDetailCommunicatingService.seletedProdDTItem.equipmentList) {
          this.equipments = arr.equipment ? (this.equipments.filter(itm => itm.equipmentId !== arr.equipment.equipmentId)) : this.equipments;
        }
       }
        this.loaderService.hideLoader();
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  myChanges(event) {
    this.pagination.currentPage = event.currentPage;
    this.pagination.pageNumber = event.pageNumber;
    this.pagination.totalElements = event.totalElements;
    this.pagination.pageSize = event.pageSize;
    this.pagination.TotalPageLinkButtons = event.totalPageLinkButtons;
    if (this.pagination.tag !== event.searchItem) {
      this.pagination.pageNumber = 1;
    }
    this.pagination.tag = event.searchItem;

    this.pageFilter.pageNumber = this.pagination.pageNumber;
    this.pageFilter.pageSize = this.pagination.pageSize;
    this.pageFilter.query = this.pagination.tag;

    setTimeout(() => {
      this.filter(this.pageFilter)
    }, 500);
  }

  reOrderData(id, item: string) {
    this.pageFilter.orderByProperty = item;

    if (this.classReOrder[id] === 'asc') {
      this.classReOrder[id] = 'desc';
    } else {
      this.classReOrder[id] = 'asc';
    }

    this.pageFilter.orderByDirection = this.classReOrder[id];
    this.filter(this.pageFilter);
  }

  resetFilter() {
    this.pageFilter = {
      pageNumber: 1,
      pageSize: this.pageFilter.pageSize,
      equipmentNo: null,
      planningPlatId: null,
      equipmentName: null,
      description: null,
      //equipmentStatus: null,
      query: null,
      orderByProperty: null,
      orderByDirection: 'desc'
    };
    this.filter(this.pageFilter);
  }


  delete(id) {
    console.log(id);
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this._equipmentSvc.delete(id)
          .then(() => {
            this.utilities.showInfoToast('deleted-success');
            this.filter(this.pageFilter);
          })
          .catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }


}
