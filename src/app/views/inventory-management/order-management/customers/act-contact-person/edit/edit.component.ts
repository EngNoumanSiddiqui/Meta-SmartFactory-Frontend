import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { TableTypeEnum } from 'app/dto/table-type-enum';
import { ImageAdderComponent } from 'app/views/image/image-adder/image-adder.component';
import { Subscription } from 'rxjs';
import { ActService } from 'app/services/dto-services/act/act.service';
import { ActTypeService } from 'app/services/dto-services/act-type/act-type.service';
import { CityService } from 'app/services/dto-services/city/city.service';
import { CountryService } from 'app/services/dto-services/country/country.service';
import { EnumActStatusService } from 'app/services/dto-services/enum/act-status.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';

import { environment } from 'environments/environment';

@Component({
  selector: 'contact-peron-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {

  customer = {
    'actContactPersonId': null,
    'actId': null,
    'departmentId': null,
    'email': null,
    'fax': null,
    'mobile': null,
    'name': null,
    'phone': null,
    'surname': null
  }
  @Input('actId') set onact(actId) {
    if (actId) {
      this.customer.actId = actId;
    }
  }
  id;
  tableTypeForImg = TableTypeEnum.COMPANY;
  @ViewChild(ImageAdderComponent) imageAdderComponent: ImageAdderComponent;
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
      inputText: '',
      inputValue: ''
    },
    displayDialog: false,
  };

  @Output() saveAction = new EventEmitter<any>();
  lastAccountNos;

  constructor(private _actSvc: ActService,
    private _actTypeSvc: ActTypeService,
    private _citySvc: CityService,
    private _countrySvc: CountryService,
    private _enumActStatus: EnumActStatusService,
    private _router: Router,
    private _route: ActivatedRoute,
    private loaderService: LoaderService,
    private utilities: UtilitiesService) {


  }

  ngOnInit() {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.customer.actId = this.id;
        this.initialize(this.id);
      }
    });

    this._enumActStatus.getEnumList().then(result => this.actStatus = result).catch(error => console.log(error));
    this.subscription = this._actSvc.saveAction$.asObservable().subscribe(rs => {
      this.save();
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  reset() {
    this.customer = {
      'actContactPersonId': null,
      'actId': null,
      'departmentId': null,
      'email': null,
      'fax': null,
      'mobile': null,
      'name': null,
      'phone': null,
      'surname': null
    };
  }

  private initialize(id) {
    this.customer.actContactPersonId = this.id;
    this.loaderService.showLoader();
    this._actSvc.getActContactPersonDetail(id).then(result => {
      this.loaderService.hideLoader();
      console.log(result);
      if ((result['email'])) {
        this.customer.email = result['email'];
      }
      if ((result['name'])) {
        this.customer.name = result['name'];
      }
      if ((result['phone'])) {
        this.customer.phone = result['phone'];
      }
      if ((result['surname'])) {
        this.customer.surname = result['surname'];
      }
      if ((result['mobile'])) {
        this.customer.mobile = result['mobile'];
      }
      if ((result['fax'])) {
        this.customer.mobile = result['fax'];
      }

    }).catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error)
    });
  }


  save() {
    this.loaderService.showLoader();
    this._actSvc.saveActContactPerson(this.customer)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');

        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  cancel() {
    this._router.navigate(['/customers']);
    this.saveAction.emit('close');
  }

}
