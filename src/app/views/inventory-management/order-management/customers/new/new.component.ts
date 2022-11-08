import { Component, EventEmitter, OnInit, Output, OnDestroy, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { ConfirmationService } from 'primeng';
import { ContactPerson } from 'app/dto/customer/customer.model';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { ActService } from 'app/services/dto-services/act/act.service';
import { ActTypeService } from 'app/services/dto-services/act-type/act-type.service';
import { CityService } from 'app/services/dto-services/city/city.service';
import { CountryService } from 'app/services/dto-services/country/country.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
import { UsersService } from 'app/services/users/users.service';
import { ImageAdderComponent } from 'app/views/image/image-adder/image-adder.component';
import { TableTypeEnum } from 'app/dto/table-type-enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'customer-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})

export class NewCustomerComponent implements OnInit, OnDestroy {

  @ViewChild(ImageAdderComponent) imageAdderComponent: ImageAdderComponent;

  @Input() fromAutoComplete = false;
  selectedPlant: any;
  selectedContactPersonIndex = null;
  submitted: boolean = false;
  @Input('plantId') set setplantId(plantId) {
    if(plantId) {
      this.customer.plantId = plantId;
    }
  }

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
    'phone': null,
    postalCode: null,
    'prefix': null,
    'responsibleEmployeeId': null,
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

  @Input('accountPosition') set setaccountPosition(accountPosition) {
    if(accountPosition) {
      this.customer.accountPosition = accountPosition;
    }
  }

  @Output() saveAction = new EventEmitter<any>();
  // Enum get gelecek
  // @ViewChild(ImageAdderComponent, {static: false}) imageAdderComponent: ImageAdderComponent;
  actTypes;

  cities;

  countries;

  myModal;

  lastAccountNos;

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

  subscription: Subscription;

  contactPersons = new Array<ContactPerson>();

  contactperson = new ContactPerson();

  contactpersonDialog = { active: false, data: null };

  commonPriorities = [];

  constructor(
    private _actSvc: ActService,
    private _actTypeSvc: ActTypeService,
    private _citySvc: CityService,
    private userSvc: UsersService,
    private _countrySvc: CountryService,
    private _router: Router,
    private loaderService: LoaderService,
    private _confirmationSvc: ConfirmationService,
    private utilities: UtilitiesService,
    private _translateSvc: TranslateService,
    private _enumSvc: EnumService) {
      this.selectedPlant = JSON.parse(this.userSvc.getPlant());
      this.customer.plantId = this.selectedPlant?.plantId;
  }

  ngOnInit() {
    this._actSvc.getLastActNos().then(result => this.lastAccountNos = result).catch(error => console.log(error));
    if(this.selectedPlant) {
      this._actTypeSvc.getbyPlantId(this.selectedPlant.plantId).then(result => this.actTypes = result).catch(error => console.log(error));
    }
    this._countrySvc.getIdNameList().then(result => this.countries = result).catch(error => console.log(error));
    this.subscription = this._actSvc.saveAction$.asObservable().subscribe(rs => { this.save(); });
    this._enumSvc.getCommonPriorityEnum().then((result:any) => this.commonPriorities = result).catch(error => console.log(error));
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

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
    // console.log('@beforeSave', this.customer); return;
    // const me = this;
    

    if (!this.contactPersons || this.contactPersons.length === 0) {
      this.utilities.showWarningToast('add minimum one contact person');
      return;
    } 


    if (!this.customer.contractDto.currency) {
      this.utilities.showWarningToast('currency-is-missing');
      return;
    } 
    


    this.loaderService.showLoader();
    this.submitted = true;
    this._actSvc.save(this.customer)
      .then(id => {
        // this.loaderService.hideLoader();
        // this.utilities.showSuccessToast('saved-success');
        this.customer['actId'] = id;
        this.saveContactPersons();
        this.saveImages(id);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.submitted = false;
        this.utilities.showErrorToast(error)
      });

    
    

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
  saveContactPersons() {
    this.contactPersons.forEach(p => p.actId = this.customer.actId);
    if (this.contactPersons[0].actId) {
      forkJoin(this.contactPersons.map(pr => this._actSvc.saveActContactPersonObservable(pr))).toPromise().then(res => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit(this.customer);
          this.reset();
        }, environment.DELAY);
      })
        .catch(error => {
          this.loaderService.hideLoader();
          this.submitted = false;
          this.utilities.showErrorToast(error)
        });
    }
  }
  // private saveImages(customerId) {
  //   this.imageAdderComponent.updateMedia(customerId, TableTypeEnum.COMPANY).then(() => {
  //       // this.utilities.showSuccessToast('saved-success');
  //       setTimeout(() => {
  //         this.saveAction.emit();
  //         this.reset();
  //       }, environment.DELAY);
  //     }
  //   ).catch(error => this.utilities.showErrorToast(error));
  // }


  goPage() {
    this._router.navigate(['/customers']);
  }

  saveDialog() {
    if (this.params.dialog.title === 'type') {
      // const data = { 'actTypeName': this.params.dialog.inputValue };
      const data =
      {
        "accountPosition": this.params.dialog.accountPosition,
        "actTypeId": null,
        "actTypeName": this.params.dialog.inputValue,
        "actTypeNo": this.params.dialog.actTypeNo,
        "plantId": this.selectedPlant?.plantId

      }
      this._actTypeSvc.save(data)
        .then(id => {
          this.customer.actTypeId = id;
          this.utilities.showSuccessToast('saved-success');
          this.params.dialog.inputValue = null;
          this.params.dialog.accountPosition = null;
          this.params.dialog.actTypeNo = null;
          this._actTypeSvc.getbyPlantId(this.selectedPlant?.plantId).then(result => this.actTypes = result).catch(error => console.log(error));
        })
        .catch(error => this.utilities.showErrorToast(error));
    }
  }

  reset() {
    this.customer = {
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
      'phone': null,
      'prefix': null,
      'responsibleEmployeeId': null,
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
  }

  prioritySelection(event){
    if(event){
      this.customer.priority = event.target.value;
    }else{
      this.customer.priority = null;
    }
  }

  onAccountTypeChanged(event) {
    if(event) {
      this.customer.accountPosition = this.actTypes.find(itm => itm.actTypeId === +event)?.accountPosition;
    }
  }

  contactpersonreset() {
    this.contactperson = new ContactPerson();
  }

  newcontactPerson() {
    this.contactperson = new ContactPerson();
    this.selectedContactPersonIndex = null;
    this.contactpersonDialog.active = true;
  }
  savecontactPerson() {
    if(this.selectedContactPersonIndex !== null) {
      this.contactPersons[this.selectedContactPersonIndex]= this.contactperson;
    } else {
      this.contactPersons.push(this.contactperson);
    }
    this.contactpersonDialog.active = false;
  }
  editContactPerson(index) {
    this.selectedContactPersonIndex = index;
    this.contactperson = this.contactPersons[index];
    this.contactpersonDialog.active = true;
  }
  removeContactPerson(index) {
    this.contactPersons.splice(index, 1);
  }
}
