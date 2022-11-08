import {WorkstationService} from 'app/services/dto-services/workstation/workstation.service';
import {LoaderService} from 'app/services/shared/loader.service';
import {Component, OnInit, Input} from '@angular/core';
import {WorkstationEfficiencyDto} from '../../../../../dto/workstation/workstation.model';
import {WorkstationErpService} from '../../../../../services/dto-services/workstation/workstation-erp.service';

@Component({
  selector: 'app-basic-detail',
  templateUrl: './basic-detail.component.html',
  styleUrls: ['./basic-detail.component.scss']
})
export class BasicDetailComponent implements OnInit {
  id;
  workstation: any;

  workStationEfficiencyList: any = [];
  standardKeyList;
  standardKeyParameterList;

  constructor(
    private loaderService: LoaderService,
    private _workstationSvc: WorkstationService,
    private workstationErpService: WorkstationErpService) {
  }

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize();
    }
  };

  ngOnInit() {
  }



  initialize() {

    let count = 0;
    this._workstationSvc.getStandardKeyList().then(result => {
      this.standardKeyList = result;
      console.log('@standardKeyList', this.standardKeyList);
      if (count < 2) {
        count++;
        console.log('@count1', count);
        if (count === 2) {
          this.getWorkstationParameterEfficiencyRates();
        }
      }

    }).catch(error => console.log(error));

    this._workstationSvc.getStandardKeyParameterList().then(result => {
      this.standardKeyParameterList = result;
      console.log('@standardParams', this.standardKeyParameterList);
      if (count < 2) {
        count++;
        console.log('@count2', count);
        if (count === 2) {
          this.getWorkstationParameterEfficiencyRates();
        }
      }
    })
      .catch(error => console.log(error));
  }


  public getWorkstationParameterEfficiencyRates() {
    this.workStationEfficiencyList = [];
    this.workstationErpService.getWorkstationPrmtEffcnRates(this.id).then(result => {
      this.workStationEfficiencyList = [];
      const myResult = result as WorkstationEfficiencyDto[];
      // private String wsEffcnCode;
      // private String wsEffcnParameterCode;
      // private double wsEffcnRate;
      myResult.forEach(resultItem => {
        const workstationEfficiencyItemTemp: WorkstationEfficiencyDto = new WorkstationEfficiencyDto();
        for (const sklItem of this.standardKeyList) {
          if (sklItem.standartKey === resultItem.wsEffcnCode) {
            workstationEfficiencyItemTemp.wsEffcnCode = Object.assign({}, sklItem);
            break;
          }
        }
        for (const paramItem of this.standardKeyParameterList) {
          if (paramItem.standartKey === resultItem.wsEffcnCode && paramItem.standartParameter === resultItem.wsEffcnParameterCode) {
            workstationEfficiencyItemTemp.wsEffcnParameterCode = Object.assign({}, paramItem);
            break;
          }
        }
        workstationEfficiencyItemTemp.wsEffcnRate = resultItem.wsEffcnRate;
        workstationEfficiencyItemTemp.wsPrmtId = resultItem.wsPrmtId;
        workstationEfficiencyItemTemp.wsId = resultItem.wsId;
        this.workStationEfficiencyList.push(workstationEfficiencyItemTemp);
      });
    }).catch(error => console.log(error));

  }

}
