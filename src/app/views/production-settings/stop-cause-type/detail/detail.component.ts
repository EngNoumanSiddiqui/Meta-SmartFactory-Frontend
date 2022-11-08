import {Component, OnInit, Input} from '@angular/core';
import {PlantService} from 'app/services/dto-services/plant/plant.service';
import {LoaderService} from 'app/services/shared/loader.service';
import {UsersService} from 'app/services/users/users.service';
import {UtilitiesService} from 'app/services/utilities.service';
import {StopCauseTypeService} from '../../../../services/dto-services/stop-cause-type/stop-cause-type.service';

@Component({
  selector: 'stop-cause-type-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  detailResult = {
    stopCauseTypeCode: null,
    stopCauseTypeId: null,
    groupType: null,
    stopCauseTypeName: null,
    orderNo: null
  };
  id;
  selectedPlant: any;


  @Input('data') set zdt(data) {
    this.setDetail(data);
  };

  private setDetail(data) {
    if (data) {
      const dt = JSON.parse(JSON.stringify(data));
      this.detailResult = {
        stopCauseTypeCode: dt.stopCauseTypeCode,
        stopCauseTypeId: dt.stopCauseTypeId,
        orderNo: dt.orderNo,
        groupType: dt.groupType ? dt.groupType : null,
        stopCauseTypeName: dt.stopCauseTypeName
      };
    }
  }

  @Input('id') set x(id) {
    if (id) {
      this.id = id;
      this.loaderService.showLoader();
      this.stopCauseTypeService.getDetail(id).then(result => {
        this.setDetail(result);
      }).catch(err => {
        this.service.showErrorToast(err);
      }).finally(() => {
        this.loaderService.hideLoader();
      });
    }

  }


  constructor(private stopCauseTypeService: StopCauseTypeService,
              private loaderService: LoaderService,
              private service: UtilitiesService,
              private _userSvc: UsersService) {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);

  }

  ngOnInit() {
  }
}

