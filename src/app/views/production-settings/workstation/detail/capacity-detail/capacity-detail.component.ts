import {Component, OnInit, Input} from '@angular/core';
import {LoaderService} from 'app/services/shared/loader.service';
import {WorkstationService} from 'app/services/dto-services/workstation/workstation.service';
 
import {WorkstationErpService} from '../../../../../services/dto-services/workstation/workstation-erp.service';
import {WorkstationCapacityDto} from '../../../../../dto/workstation/workstation.model';
import * as moment from 'moment';

@Component({
  selector: 'app-capacity-detail',
  templateUrl: './capacity-detail.component.html',
  styleUrls: ['./capacity-detail.component.scss']
})
export class CapacityDetailComponent implements OnInit {
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initializeList(this.id);
    }
  };

  id;
  workstation: any;
  capacityList: WorkstationCapacityDto[] = [];
  workStationCapacityCategoryList;


  constructor(private loaderService: LoaderService,
              private _workstationSvc: WorkstationService,
              private workstationErpService: WorkstationErpService) {
  }

  ngOnInit() {
    this._workstationSvc.getworkStationCapacityCategoryList().then(result => {
      this.workStationCapacityCategoryList = result;
    })
      .catch(error => console.log(error));
  }

  private initializeList(id) {
    this.loaderService.showLoader();
    this.workstationErpService.getWorkStationsCapacityListByWsId(this.id)
      .then(result => {
        this.capacityList = result as WorkstationCapacityDto[];
        this.loaderService.hideLoader();
        this.capacityList.forEach(item => {
          if ((item.lenghtOfBreaks)) {
            item.lenghtOfBreaks = moment().startOf('day').add(item.lenghtOfBreaks, 'second').toDate();
          }
          if ((item.start)) {
            item.start = new Date(item.start);
          }
          if ((item.finish)) {
            item.finish = new Date(item.finish);
          }
        });
      })
      .catch(error => {
        this.loaderService.hideLoader();
        console.log(error);
      });
  }


  editCapacity(i) {
    
  }
  removeCapacity(i) {
    this.capacityList.splice(i, 1);
  }
  getCapacityCategoryById(capacityUnitId: any) {
    if (this.workStationCapacityCategoryList) {
      const workstationCapasityItemFiterArr = this.workStationCapacityCategoryList.filter(item => item.wsCapacityCode === capacityUnitId);
      if (workstationCapasityItemFiterArr != null && workstationCapasityItemFiterArr.length > 0) {
        return workstationCapasityItemFiterArr[0].wsCapacityCategory;
      } else {
        return '';
      }
    }
  }

}
