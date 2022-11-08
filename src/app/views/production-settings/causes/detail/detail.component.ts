import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {StopCauseService} from '../../../../services/dto-services/stop-cause/stop-cause.service';
import {ConvertUtil} from '../../../../util/convert-util';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import * as moment from 'moment';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
@Component({
  selector: 'causes-detail',
  templateUrl: './detail.component.html'
})
export class DetailCauseComponent implements OnInit {


  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  stopCause: any = null;

  offset = moment().utcOffset();
  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _stopCauseSvc: StopCauseService,
              private loaderService: LoaderService, private utilities: UtilitiesService) {

    /*  this._route.params.subscribe((params) => {
     this.id = params['id'];
     this.initialize(this.id);
     });*/
  }

  private initialize(id) {
    console.log('@stopcasue', this.stopCause)
    this.loaderService.showLoader();

    this._stopCauseSvc.getDetail(id).then(result => {
        this.loaderService.hideLoader();
        this.stopCause = result;
        if(result['stopCauseCostRate']) {
          this.stopCause.stopCauseCostRate = parseInt(result['stopCauseCostRate'] * 100 + '')
        }
        this.stopCause.affectOeeAvilability = result['affectOeeAvilability']? true: false,
        this.stopCause.affectOeePerformance = result['affectOeePerformance']? true: false
        if (this.stopCause.startTime) {
          this.stopCause.startTime = moment(result['startTime'].toString(), 'HH:mm:ss').add(this.offset, 'minutes').toDate();
        }
        this.stopCause.duration = ConvertUtil.longDuration2DHHMMSSsssTime(this.stopCause.duration);
        console.log('@stopCause', this.stopCause)
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  ngOnInit() {
  }

  goPage(id) {
    if (id === -1) {
      this._router.navigate(['/settings/causes/new']);
    } else {
      this._router.navigate(['/settings/causes/edit/' + id]);
    }
  }

  showDetailDialog(id, modal){
    if(modal == 'PLANT'){
      this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, id);
    }else if(modal == 'SHIFT'){
      this.loaderService.showDetailDialog(DialogTypeEnum.SHIFTSETTING,id);
    }else if(modal == 'CAUSETYPE'){
      this.loaderService.showDetailDialog(DialogTypeEnum.STOPCAUSETYPE,id);
    }else if(modal == 'WORKCENTER'){
      this.loaderService.showDetailDialog(DialogTypeEnum.WORKCENTER,id);
    }
  }

}

