import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { UsersService } from 'app/services/users/users.service';
import { ActTypeService } from 'app/services/dto-services/act-type/act-type.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'account-type-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class AccountTypeEditComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  
  workcenters: any[];
  selectedPlant: any;
  payLoadObject =
    {
      "accountPosition": "SUPPLIER",
      "actTypeId": null,
      "actTypeName": null,
      "actTypeNo": null,
      "plantId": null

    }
  id;

  // @Input('id') set z(id) {
  //   this.id = id;
  //   if (id) {
  //     setTimeout(() => {
  //       this.initialize(this.id);
  //     }, 1000);
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
      };
    }
  };

  constructor(private accountTypeService: ActTypeService,
    private loaderService: LoaderService,
    private _userSvc: UsersService,
    private utilities: UtilitiesService, ) {
      this.selectedPlant = JSON.parse(this._userSvc.getPlant());
      this.payLoadObject.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;
  }

  ngOnInit() {
  }
  setSelectedPlant(event) {
    this.payLoadObject.plantId = event.plantId;
  }
  

  save() {
    this.loaderService.showLoader();
    this.accountTypeService.update(this.payLoadObject)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('updated-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });

  }
  reset() {
    // this.payLoadObject = {
    //   'operationTypeDescription': null,
    //   'operationTypeId': null,
    //   'operationTypeName': null,
    //   'plantId': null
    // }
    

  }

}
