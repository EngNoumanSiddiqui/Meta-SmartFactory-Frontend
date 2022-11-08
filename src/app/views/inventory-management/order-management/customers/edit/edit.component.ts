import {Component, EventEmitter, Input, OnInit, Output, AfterViewInit, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { ContactPerson } from 'app/dto/customer/customer.model';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { ActService } from 'app/services/dto-services/act/act.service';
import { ActTypeService } from 'app/services/dto-services/act-type/act-type.service';
import { CityService } from 'app/services/dto-services/city/city.service';
import { CountryService } from 'app/services/dto-services/country/country.service';
import { EnumActStatusService } from 'app/services/dto-services/enum/act-status.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';

import { environment } from 'environments/environment';
import { UsersService } from 'app/services/users/users.service';
import { ImageAdderComponent } from 'app/views/image/image-adder/image-adder.component';
import { TableTypeEnum } from 'app/dto/table-type-enum';

// TODO: Validationlar eklenecek
@Component({
  selector: 'customer-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})

export class EditCustomerComponent implements OnInit, AfterViewInit, OnDestroy {
  selectedPlant: any;
  @ViewChild(ImageAdderComponent) imageAdderComponent: ImageAdderComponent;

  @Input('plantId') set setplantId(plantId) {
    if(plantId) {
      this.customer.plantId = plantId;
    }
  }
  @Input('CLONE') CLONE = false;
  customer = {
    'actId': null,
    'actNo': null,
    'actName': null,
    'actName2': null,
    'actTypeId': null,
    'contactName': null,
    emailTemplate: null,
    'description': null,
    'address1': null,
    'address2': null,
    'cityId': null,
    plantId: null,
    billingAddress: {
      actAddressId: null,
      actId: null,
      address1: null,
      address2: null,
      cityId: null,
      countryId: null,
      postalCode: null,
    },
    contractDto: {
      "actContractId": null,
      "actId": null,
      "currency": null,
      "deliveryTerm": null,
      discount: null,
      "language": null,
      "parity": null,
      "paymentTerm": null,
      "vat":null,
      "insurance": null,
      "rabate": null,
      "bankName" : null,
      "bankAccountNumber" : null
    },
    shippingAddress: {
      actAddressId: null,
      actId: null,
      address1: null,
      address2: null,
      cityId: null,
      countryId: null,
      postalCode: null,
    },
    'countryId': null,
    'districtId': null,
    'taxId': null,
    'prefix': null,
    'responsibleEmployeeId':null,
    'responsibleEmployee': {
      "employeeId": null,
      "employeeNo": null,
      "firstName": null,
      "identity": null,
      "lastName": null
    },
    'phone': null,
    postalCode: null,
    'fax': null,
    'email': null,
    'webSite': null,
    'gsm': null,
    'accountPosition': 'CUSTOMER',
    'priority': 'MEDIUM',
    registrationNo : null,
    sector : null,
    createdByCode : null,
    createdByName : null,
    updatedByCode : null,
    updatedByName : null,
  };

  id;

  contactPersons = new Array<ContactPerson>();

  contactperson = new ContactPerson();

  contactpersonDialog = {active: false, data: null};

  // tableTypeForImg = TableTypeEnum.COMPANY;
  // @ViewChild(ImageAdderComponent, {static: false}) imageAdderComponent: ImageAdderComponent;
  subscription: Subscription;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  actStatus;

  actTypes;

  cities;

  countries;

  myModal;

  params = {
    cityDisabled: true,
    dialog: {
      title: '',
      accountPosition: null,
      actTypeNo: null,
      inputText: '',
      inputValue: ''
    },
    displayDialog: false,
  };

  @Output() saveAction = new EventEmitter<any>();

  lastAccountNos;

  commonPriorities = [];

  constructor(private _actSvc: ActService,
              private _actTypeSvc: ActTypeService,
              private _citySvc: CityService,
              private _countrySvc: CountryService,
              private _enumActStatus: EnumActStatusService,
              private _router: Router,
              private userSvc: UsersService,
              private _route: ActivatedRoute,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _enumSvc: EnumService) {
                this.selectedPlant = JSON.parse(this.userSvc.getPlant());
                this.customer.plantId = this.selectedPlant?.plantId;

  }

  ngOnInit() {
    // this._route.params.subscribe((params) => {
    //   this.id = params['id'];
    //   if (this.id) {
    //     this.customer.actId = this.id;
    //     this.initialize(this.id);
    //   }
    // });

    this._actSvc.getLastActNos().then(result => this.lastAccountNos = result).catch(error => console.log(error));
    if(this.selectedPlant) {
      this._actTypeSvc.getbyPlantId(this.selectedPlant.plantId).then(result => this.actTypes = result).catch(error => console.log(error));
    }
    this._countrySvc.getIdNameList().then(result => this.countries = result).catch(error => console.log(error));
    this._enumActStatus.getEnumList().then(result => this.actStatus = result).catch(error => console.log(error));
    this.subscription = this._actSvc.saveAction$.asObservable().subscribe(rs => { this.save();});
    this._enumSvc.getCommonPriorityEnum().then((result:any) => this.commonPriorities = result).catch(error => console.log(error));

  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    // this.showImages();
  }

  private initialize(id) {
    this.customer.actId = this.id;
    this.loaderService.showLoader();
    this._actSvc.getUpdateDetail(id).then((result: any)=> {
      this.loaderService.hideLoader();
      this.customer = result;
      this.customer.plantId = result['plant']?.plantId;
      this.customer.contractDto = result['contractDto'] || {};
      // this.customer.contractDto.actId = result['contractDto'].act?.actId || this.customer.actId;

      this.customer.shippingAddress = result['shippingAddress'] || {};
      // this.customer.shippingAddress.actId = this.customer.actId;

      this.customer.billingAddress = result['billingAddress'] || {};
      // this.customer.billingAddress.actId = this.customer.actId;

      this._actSvc.accountContactPersonfilter({pageNumber: 1,
        pageSize: 100, actId: this.customer.actId}).then(res => {
          this.contactPersons = res['content'];
          if(this.CLONE) {
            this.contactPersons.forEach(cp => {
              cp.actContactPersonId = null;
            })
          }
        }).catch(error => {
        this.utilities.showErrorToast(error)
      });


      if (this.imageAdderComponent) {
        if(!this.CLONE) {
          this.imageAdderComponent.initImages(this.id, TableTypeEnum.ACCOUNT);
        }
      }

      if(this.CLONE) {
        this.customer.actId = null;
        this.customer.actNo = null;
        this.customer.actName = null;
        this.customer.actName2 = null;
      }


    }).catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error)
    });
  }

  // showImages() {
  //   if ((this.imageAdderComponent)) {
  //     if (this.customer && this.customer.actId || this.id) {
  //       this.imageAdderComponent.initImages(this.customer.actId || this.id, this.tableTypeForImg);
  //     }

  //   }
  // }
  countrySelection(event) {
    if (this.customer.countryId !== null) {
      this._citySvc.getIdNameList(this.customer.countryId)
        .then(result => this.cities = result)
        .catch(error => console.log(error));

      this.params.cityDisabled = false;
    } else {
      this.params.cityDisabled = true;
    }

  }

  save() {

    if (!this.customer.contractDto.currency) {
      this.utilities.showWarningToast('currency-is-missing');
      return;
    } 
    
    this.loaderService.showLoader();
    const reqDto = JSON.parse(JSON.stringify(this.customer));
    if(Object.keys(reqDto.contractDto).length > 1) {
      reqDto.contractDto.actId = reqDto.actId;
    } else {
      reqDto.contractDto = null;
    }
    if(Object.keys(reqDto.shippingAddress).length > 1) {
      reqDto.shippingAddress.actId = reqDto.actId;
    }else {
      reqDto.shippingAddress = null;
    }
    if(Object.keys(reqDto.billingAddress).length > 1) {
      reqDto.billingAddress.actId = reqDto.actId;
    }else {
      reqDto.billingAddress = null;
    }
    if(this.CLONE) {
      this._actSvc.save(reqDto)
      .then((id) => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        reqDto.actId = id;
        this.saveImages(id);

        this.saveContactPersons();
        // setTimeout(() => {
        //   this.saveAction.emit('close');
        // }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
    } else {
    this._actSvc.update(reqDto)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        this.saveImages(this.id);
        // setTimeout(() => {
        //   this.saveAction.emit('close');
        // }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
    }
  }
  saveContactPersons() {
    this.contactPersons.forEach(p => p.actId = this.customer.actId);
    if (this.contactPersons[0].actId) {
      forkJoin(this.contactPersons.map(pr => this._actSvc.saveActContactPersonObservable(pr))).toPromise().then(res => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit(this.customer);
          // this.reset();
        }, environment.DELAY);
      })
        .catch(error => {
          this.loaderService.hideLoader();
          this.utilities.showErrorToast(error)
        });
    }
  }
  onAccountTypeChanged(event) {
    if(event) {
      this.customer.accountPosition = this.actTypes.find(itm => itm.actTypeId === +event)?.accountPosition;
    }
  }

  private saveImages(stockId) {
    this.imageAdderComponent.updateMedia(stockId, TableTypeEnum.ACCOUNT).then(() => {
      // this.utilities.showSuccessToast('saved-success');
      setTimeout(() => {
        this.saveAction.emit(this.customer);
      }, environment.DELAY);
    }
    ).catch(error => this.utilities.showErrorToast(error));
  }

  prioritySelection(event){
    if(event){
      this.customer.priority = event.target.value;
    }else{
      this.customer.priority = null;
    }
  }

  saveDialog() {
    if (this.params.dialog.title === 'type') {
      // const data = {'actTypeName': this.params.dialog.inputValue};
      const data =
      {
        "accountPosition": this.params.dialog.accountPosition,
        "actTypeId": null,
        "actTypeName": this.params.dialog.inputValue,
        "actTypeNo": this.params.dialog.actTypeNo,
        "plantId": this.selectedPlant?.plantId

      }
      this._actTypeSvc.update(data)
        .then(id => {
          this.utilities.showSuccessToast('saved-success');
          this.customer.actTypeId = id;
          this.params.dialog.inputValue = null;
          this.params.dialog.accountPosition = null;
          this.params.dialog.actTypeNo = null;
          this._actTypeSvc.getbyPlantId(this.selectedPlant?.plantId).then(result => this.actTypes = result).catch(error => console.log(error));
        })
        .catch(error => this.utilities.showErrorToast(error));
    }
  }

  cancel() {
    this._router.navigate(['/customers']);
    this.saveAction.emit('close');
  }


  contactpersonreset() {
    this.contactperson = new ContactPerson();
  }
  newcontactPerson() {
    this.contactperson = new ContactPerson();
    this.contactpersonDialog.active = true;
  }
  savecontactPerson() {
    this.contactperson.actId = this.customer.actId;
    const dto = Object.assign({}, this.contactperson);
    this.loaderService.showLoader();
    this._actSvc.saveActContactPerson(dto).then((res: any) => {
      this.loaderService.hideLoader();
      this.utilities.showSuccessToast('saved-success');
      const newassign = Object.assign({}, res);
      newassign.actId = res.act.actId;
      delete newassign.act;
      if (this.contactperson.actContactPersonId) {
       this.contactPersons.splice(this.contactPersons.findIndex(cp => this.contactperson.actContactPersonId === cp.actContactPersonId), 1, newassign);
      } else {
        this.contactPersons.push(newassign);
      }
      this.contactperson = new ContactPerson();
      this.contactpersonDialog.active = false;
    })
    .catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error)
    });
    // this.contactPersons.push(this.contactperson);
    // this.contactpersonDialog.active = false;
  }
  editContactPerson(index) {
    this.contactperson = this.contactPersons[index];
    this.contactpersonDialog.active = true;
  }
  removeContactPerson(index, actContactPersonId) {
    this._actSvc.deleteActContactPerson(actContactPersonId).then(res => {
      this.loaderService.hideLoader();
      this.utilities.showSuccessToast('deleted-success');
      this.contactPersons.splice(index, 1);
    })
    .catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error)
    });

  }
}
