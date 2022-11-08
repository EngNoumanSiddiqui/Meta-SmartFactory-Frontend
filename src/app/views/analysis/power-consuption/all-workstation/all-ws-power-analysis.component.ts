import {Component, OnInit} from '@angular/core';
import {WorkStationPowerDto} from '../../../../dto/analysis/power-consumption/power-consumption-anal';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import {PowerConsumptionService} from '../../../../services/dto-services/power-consumption/power-consumption-service';
import * as moment from 'moment';
import {ConvertUtil} from '../../../../util/convert-util';
@Component({
  templateUrl: './all-ws-power-analysis.html',

})
export class AllWorkstationPowerAnalysisComponent implements OnInit {
  showLoader = false;

  myWorkDetails: WorkStationPowerDto[];

  selectedWorkDetails = [];


  cols = [
    {field: 'date', header: 'date'},
    {field: 'shiftId', header: 'shift-id'},
    {field: 'power', header: 'power'},
    {field: 'cost', header: 'cost'}
  ];

  pageFilter = {
    endDate: null,
    startDate: null
  };

  validEmployee = {
    endDate: null,
    startDate: null
  }

  constructor(private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private pwrService: PowerConsumptionService) {


  }


  ngOnInit(): void {
  }

  exportAsPng(printSectionId: string) {
    this.utilities.exportAsPng(printSectionId);
  }


  analyze() {
    this.loaderService.showLoader();
    this.showLoader = true;
    if (this.pageFilter.startDate) {

      this.validEmployee.startDate = this.pageFilter.startDate;
    }
    if (this.pageFilter.endDate) {
      this.validEmployee.endDate = this.pageFilter.endDate;
    }

    this.filter(this.pageFilter);

  }


  filter(data) {
    this.loaderService.showLoader();
    const me = this;
    const temp = Object.assign({}, data);

    const ofset = moment().utcOffset();

    temp.startDate = moment(data.startDate).add(ofset, 'minutes').toDate();
    temp.endDate = moment(data.endDate).add(ofset, 'minutes').toDate();


    this.pwrService.filterAllWorkStationPowerConsumption(temp)
      .then(result => {
        this.loaderService.hideLoader();
        this.showLoader = false;
        this.myWorkDetails = result as WorkStationPowerDto[];

        this.normalize(this.myWorkDetails);

      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.showLoader = false;
        this.utilities.showErrorToast(error)
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
