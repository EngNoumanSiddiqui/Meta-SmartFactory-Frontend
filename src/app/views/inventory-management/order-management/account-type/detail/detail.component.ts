import { Component, OnInit, Input } from '@angular/core';
import { ActTypeService } from 'app/services/dto-services/act-type/act-type.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UsersService } from 'app/services/users/users.service';
import { UtilitiesService } from 'app/services/utilities.service';

@Component({
  selector: 'account-type-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class AccountTypeDetailComponent implements OnInit {

  payLoadObject: any = {};
  selectedPlant: any;

  // @Input('id') set z(id) {
  //   this.id = id;
  //   if (id) {
  //     this.initialize(id);
  //   }
  // };

  @Input('data') set zdata(data) {
    if (data) {
      this.payLoadObject = {
        "accountPosition" : data['accountPosition'],
        "actTypeId" : data['actTypeId'],
        "actTypeName" : data['actTypeName'],
        "actTypeNo" : data['actTypeNo'],
        "plantId" : data['plantId'] || this.selectedPlant?.plantId,
        "plant" : this.selectedPlant,
      };
    }
  };

  constructor(private accountTypeService: ActTypeService,
    private loaderService: LoaderService,
    private _userSvc: UsersService,
    private utilities: UtilitiesService, ) {
      this.selectedPlant = JSON.parse(this._userSvc.getPlant());
      this.payLoadObject.plant = this.selectedPlant ? this.selectedPlant.plantId : null;
  }

  ngOnInit() {
    // this.filter();
  }
  // initialize(id) {
  //   this.loaderService.showLoader();
  //   this._operationTypeService.getDetail(id).then((data: any) => {
  //     this.loaderService.hideLoader();
  //     if (data) {
  //       this.detailResult = {
  //         'operationTypeDescription': data.operationTypeDescription,
  //         'operationTypeId': data.operationTypeId,
  //         'operationTypeName': data.operationTypeName,
  //         'plant': data.plant
  //       };
  //     }
  //   })
  // }
  

}
