import { Component, OnInit, Input } from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { WorkstationService } from 'app/services/dto-services/workstation/workstation.service';
import { UtilitiesService } from 'app/services/utilities.service';
import * as moment from 'moment';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';

@Component({
  selector: 'factory-calendar-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class FactoryCalendarDetailsComponent implements OnInit {

  reqDto = {
    factoryCalendarId: null,
    category: null,
    code: null,
    plant: null,
    factoryCalendarDetailList: [],
    defaultCalendar: null
  }
  @Input('id') set calenderId (id) {
    if(id) {
      this.initialize(id);
    }
  }
  @Input('data') set calenderdata (data) {
    if (data) {
      this.initializeData(data);
    
    }
  }
  constructor(
    private workstationService: WorkstationService,
    private utilities: UtilitiesService,
    private loaderService: LoaderService,
  ) { }

  ngOnInit() {
  }

  openShiftModal(shiftId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.SHIFTSETTING, shiftId);
  }
  private initialize(id: string) {
    this.loaderService.showLoader();
    this.workstationService.getFactoryCalendarById(id).then(result => {
      this.loaderService.hideLoader();
      this.reqDto = result as any;
      if (this.reqDto.factoryCalendarDetailList) {
        this.reqDto.factoryCalendarDetailList.forEach(item => {
          if (item.shift) {
            item.shiftId = item.shift.shiftId;
            item.shiftName = item.shift.shiftName;
          }
          if(item.workstation) {
            item.workstationId =  item.workstation?.workStationId;
            item.workstationName = item.workstation?.workStationName;
          }
          // item.startTime = item.startTime ? moment(item.startTime).format('HH:mm:ss') : null;
          // item.endTime = item.endTime ? moment(item.endTime).format('HH:mm:ss') : null;
        })
      }
    }).catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error);
    });
  }
  private initializeData(data) {
    this.reqDto = JSON.parse(JSON.stringify(data));
  }

  showPlantDetail(id){
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, id);
  }
}
