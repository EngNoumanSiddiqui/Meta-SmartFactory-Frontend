import {Component, OnInit, ViewChild} from '@angular/core';
import {TableTypeEnum} from '../../../dto/table-type-enum';
import {EnumBloodGroupService} from '../../../services/dto-services/enum/blood-group.service';
import {CityService} from '../../../services/dto-services/city/city.service';
import {CountryService} from '../../../services/dto-services/country/country.service';
import {EmployeeService} from '../../../services/dto-services/employee/employee.service';
import {TranslateService} from '@ngx-translate/core';
import {MediaService} from '../../../services/media/media.service';
 
import {ModalDirective} from 'ngx-bootstrap/modal';
import {UtilitiesService} from '../../../services/utilities.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html'
})
export class EditProfileComponent implements OnInit {
  tableTypeForImg = TableTypeEnum.STAFF;
  picture: any;
  staff = {
    'employeeId': '',
    'address1': '',
    'address2': '',
    'birthDate': null,
    'bloodGroup': '',
    'cityId': '',
    'countryId': '',
    'email': null,
    'firstName': '',
    'gsm': '',
    'phone': '',
    'lastName': '',
    'password': null,
    'mediaId': null,
  };
  id;
  CountryList;
  CityList;
  BloodList;
  params = {
    dialog: {title: '', inputValue: ''}
  };
  @ViewChild('myModal') public myModal: ModalDirective;

  constructor(private _enumBloodSvc: EnumBloodGroupService,
              private _citySvc: CityService,
              private _countrySvc: CountryService,
              private _empSvc: EmployeeService,
              private utilities: UtilitiesService,
              private _translateSvc: TranslateService,
              private _mediaSvc: MediaService) {

  }

  public initialize() {
    this._enumBloodSvc.getEnumList().then(result => this.BloodList = result).catch(error => console.log(error));
    this._countrySvc.getIdNameList().then(result => this.CountryList = result).catch(error => console.log(error));
    this.myModal.show();
    this.reset();
    this._empSvc.getProfileDetail()
      .then(result => {
        if ((result['employeeId'])) {
          this.staff['employeeId'] = result['employeeId'];
        }
        if ((result['address2'])) {
          this.staff['address2'] = result['address2'];
        }
        if ((result['address1'])) {
          this.staff['address1'] = result['address1'];
        }
        if ((result['birthDate'])) {
          this.staff['birthDate'] = new Date(result['birthDate']);
        }
        if ((result['bloodGroup'])) {
          this.staff['bloodGroup'] = result['bloodGroup'];
        }
        // if ((result['countryId'])) {
        this.staff['countryId'] = result['countryId'];
        // }
        // if ((result['cityId'])) {
        this.staff['cityId'] = result['cityId'];
        this.countrySelection('');
        // }
        if ((result['identity'])) {
          this.staff['identity'] = result['identity'];
        }
        if ((result['email'])) {
          this.staff['email'] = result['email'];
        }
        if ((result['firstName'])) {
          this.staff['firstName'] = result['firstName'];
        }
        if ((result['gsm'])) {
          this.staff['gsm'] = result['gsm'];
        }
        if ((result['phone'])) {
          this.staff['phone'] = result['phone'];
        }
        if ((result['lastName'])) {
          this.staff['lastName'] = result['lastName'];
        }
        if ((result['employeeNo'])) {
          this.staff['employeeNo'] = result['employeeNo'];
        }

        if ((result['mediaId'])) {
          this.staff['mediaId'] = result['mediaId'];
          this._mediaSvc.getMedia(result['mediaId']).then(media =>
            this.initPicture(media));
        }


      })
      .catch(error => this.utilities.showErrorToast(error));
  }

  ngOnInit() {

  }

  reset() {
    this.staff = {
      'employeeId': this.id,
      'address1': '',
      'address2': '',
      'birthDate': null,
      'bloodGroup': '',
      'cityId': '',
      'countryId': '',
      'email': '',
      'firstName': '',
      'gsm': '',
      'phone': '',
      'lastName': '',
      'password': null,
      'mediaId': null,
    };
    this.picture = null;
  }


  setLoadedImage(media) {
    if (media.hasOwnProperty('path')) {

      this.staff.mediaId = media.mediaId;
      this.picture = media.path;
    } else {
      this.picture = null;
      this.staff.mediaId = null;
    }
  }


  countrySelection(event) {
    if (this.staff.countryId != null) {
      this._citySvc.getIdNameList(this.staff.countryId)
        .then(result => this.CityList = result)
        .catch(error => this.utilities.showErrorToast(error));

    }
  }

  save() {
    const me = this;

    this._empSvc.updateProfile(this.staff)
      .then(() => {
        this.utilities.showSuccessToast('updated-success')
        setTimeout(() => {
          me.close();
        }, 2500);
      })
      .catch(error => this.utilities.showErrorToast(error));
  }


  private initPicture(media) {
    this.picture = media.path;

  }


  close() {
    this.myModal.hide();
  }
}
