import { Component, EventEmitter, OnInit, Output, ViewChild, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TableTypeEnum } from 'app/dto/table-type-enum';
import { ImageAdderComponent } from 'app/views/image/image-adder/image-adder.component';
import { Subscription } from 'rxjs';
import { ActService } from 'app/services/dto-services/act/act.service';
import { ActTypeService } from 'app/services/dto-services/act-type/act-type.service';
import { CityService } from 'app/services/dto-services/city/city.service';
import { CountryService } from 'app/services/dto-services/country/country.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
@Component({
  selector: 'contact-peron-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit, OnDestroy {



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
  @Output() saveAction = new EventEmitter<any>();
  // Enum get gelecek
  @ViewChild(ImageAdderComponent) imageAdderComponent: ImageAdderComponent;
  actTypes;
  cities;
  countries;
  myModal;
  lastAccountNos;
  params = {
    cityDisabled: true,
    dialog: {
      title: '',
      inputText: '',
      inputValue: ''
    },
    displayDialog: false,
  };
  subscription: Subscription;

  constructor(private _actSvc: ActService,
    private _actTypeSvc: ActTypeService,
    private _citySvc: CityService,
    private _countrySvc: CountryService,
    private _router: Router,
    private loaderService: LoaderService,
    private utilities: UtilitiesService) {

  }

  ngOnInit() {
    // this._actSvc.getLastActNos().then(result => this.lastAccountNos = result).catch(error => console.log(error));
    // this._actTypeSvc.getIdNameList().then(result => this.actTypes = result).catch(error => console.log(error));
    // this._countrySvc.getIdNameList().then(result => this.countries = result).catch(error => console.log(error));
    this.subscription = this._actSvc.saveAction$.asObservable().subscribe(rs => {
      this.save();
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }



  save() {
    // const me = this;
    this.loaderService.showLoader();
    this._actSvc.saveActContactPerson(this.customer)
      .then(id => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          // me.customer['actId'] = id;
          // this.saveAction.emit(me.customer);
          this.saveAction.emit();

          this.reset();

          // this.goPage();
        }, environment.DELAY);

        // this.saveImages(id);

      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });

  }
  private saveImages(customerId) {
    this.imageAdderComponent.updateMedia(customerId, TableTypeEnum.COMPANY).then(() => {
      // this.utilities.showSuccessToast('saved-success');
      setTimeout(() => {
        this.saveAction.emit();

        this.reset();

      }, environment.DELAY);
    }
    ).catch(error => this.utilities.showErrorToast(error));
  }

  goPage() {
    this._router.navigate(['/customers']);
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
    }
  }
}
