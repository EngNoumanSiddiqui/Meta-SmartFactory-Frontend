import {Component, OnInit} from '@angular/core';
import {ResponsePowerCostJobOrderDto} from '../../../../dto/analysis/power-consumption/power-consumption-anal';
import {environment} from '../../../../../environments/environment';
import {PowerConsumptionService} from '../../../../services/dto-services/power-consumption/power-consumption-service';
import {UtilitiesService} from '../../../../services/utilities.service';
import {LoaderService} from '../../../../services/shared/loader.service';
import * as moment from 'moment';
import {ConvertUtil} from '../../../../util/convert-util';
@Component({
  templateUrl: './job-order-power-analysis.html'
})
export class JoborderPowerAnalysisComponent implements OnInit {

  myItems: Array<ResponsePowerCostJobOrderDto>;


  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    startDate: null,
    endDate: null,
    customer: null,
    product: null,
    workStation: null,
    query: null,
    orderByProperty: null,
    orderByDirection: 'asc'
  };


  selectedJobOrders = [];


  cols = [
    {field: 'jobOrderId', header: 'job-order-id'},
    {field: 'actualStartTime', header: 'actual-start'},
    {field: 'actualFinishTime', header: 'actual-finish'},
    {field: 'customer', header: 'customer'},
    {field: 'product', header: 'product'},
    {field: 'workStation', header: 'workstation'},
    {field: 'operationDuration', header: 'operation-duration'},
    {field: 'plannedQuantity', header: 'planned-quantity'},
    {field: 'producedQuantity', header: 'produced-quantity'},
    {field: 'power', header: 'power'},
    {field: 'cost', header: 'cost'}
  ];

  selectedColumns = [
    {field: 'jobOrderId', header: 'job-order-id'},
    {field: 'actualStartTime', header: 'actual-start'},
    {field: 'actualFinishTime', header: 'actual-finish'},
    {field: 'customer', header: 'customer'},
    {field: 'product', header: 'product'},
    {field: 'workStation', header: 'workstation'},
    {field: 'operationDuration', header: 'operation-duration'},
    {field: 'plannedQuantity', header: 'planned-quantity'},
    {field: 'producedQuantity', header: 'produced-quantity'},
    {field: 'power', header: 'power'},
    {field: 'cost', header: 'cost'}
  ];


  pagination = {
    totalElements: 0,
    currentPage: 1,
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    totalPages: 1,
    rows: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    TotalPageLinkButtons: 5,
    RowsPerPageOptions: [10, 20, 30, 50, 100, 1000],
    tag: ''
  };


  constructor(private powerService: PowerConsumptionService, private utilities: UtilitiesService, private loaderService: LoaderService) {

  }

  exportAsPng(printSectionId: string) {
    this.utilities.exportAsPng(printSectionId);
  }


  analyze() {
    this.filter(this.pageFilter);
  }

  ngOnInit(): void {

  }

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;


    this.filter(this.pageFilter);
  }


  filter(data) {
    this.loaderService.showLoader();


    const temp = Object.assign({}, data);

    const ofset = moment().utcOffset();

    temp.startDate = moment(data.startDate).add(ofset, 'minutes').toDate();
    temp.endDate = moment(data.endDate).add(ofset, 'minutes').toDate();


    this.powerService.jobOrderConsumption(temp).then(result => {
      this.pagination.currentPage = result['currentPage'];
      this.pagination.totalElements = result['totalElements'];
      this.pagination.totalPages = result['totalPages'];
      this.myItems = [];
      this.myItems = result['content']as ResponsePowerCostJobOrderDto[];

      this.normalize(this.myItems);
      this.loaderService.hideLoader();
    }).catch(error => {
      this.myItems = [];
      this.utilities.showErrorToast(error);
      this.loaderService.hideLoader();
    });
  }


  normalize(myItems) {
    if (!myItems) {
      return;
    }
    myItems.forEach(item => {
      item.power = ConvertUtil.fix(item.power, 2);
      item.cost = ConvertUtil.fix(item.cost, 2);
    });
  }
}
