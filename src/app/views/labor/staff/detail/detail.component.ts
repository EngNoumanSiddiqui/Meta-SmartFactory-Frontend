import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EmployeeService} from '../../../../services/dto-services/employee/employee.service';

import {MediaService} from '../../../../services/media/media.service';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import { ImageAdderComponent } from 'app/views/image/image-adder/image-adder.component';
import { TableTypeEnum } from 'app/dto/table-type-enum';

@Component({
  selector: 'staff-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailStaffComponent implements OnInit {
  id;
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };
  @ViewChild(ImageAdderComponent) imageAdderComponent: ImageAdderComponent;

  staff = {
    'address1': '',
    'address2': '',
    ccList: '',
    bccList: '',
    dummy: false,
    'birthDate': '',
    'bloodGroup': '',
    'cancelDate': '',
    'cityName': '',
    'countryName': '',
    'departmentName': '',
    employeeCostRate: null,
    'description': '',
    'districtName': '',
    'email': '',
    'employeeId': '',
    'employeeNo': '',
    'employeeTitleName': '',
    'firstName': '',
    'gender': '',
    'gsm': '',
    'groupType': null,
    'identity': '',
    'rfid': '',
    'plant': null,
    'jobEntryDate': '',
    'jobExitDate': '',
    'lastName': '',
    'managerFirstName': '',
    'managerLastName': '',
    'phone': '',
    'userStatus': '',
    'employeeRoleDtoList': [],
    'employeePermissionDtoList': []
  };
  picture;

  expanded;
  tableTypeForImg = TableTypeEnum.STAFF;
  constructor(private _route: ActivatedRoute,
              private _employeeSvc: EmployeeService,
              private _router: Router,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _mediaSvc: MediaService) {

    this._route.params.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.initialize(this.id);
      }
    });
  }

  private initialize(id: string) {
    this.expanded = false;
    this.reset();
    this.loaderService.showLoader();
    this._employeeSvc.getDetail(id)
      .then(result => {
        const stf: any = result;
        this.staff = stf;
        this.loaderService.hideLoader();
        if ((stf['address1'])) {
          this.staff['address1'] = stf['address1'];
        }
        if ((stf['address2'])) {
          this.staff['address2'] = stf['address2'];
        }
        if ((stf['dummy'])) {
          this.staff['dummy'] = stf['dummy'];
        }
        if ((stf['birthDate'])) {
          this.staff['birthDate'] = stf['birthDate'];
        }
        this.staff.employeeCostRate = result['employeeCostRate'];
        if ((stf['bloodGroup'])) {
          this.staff['bloodGroup'] = stf['bloodGroup'];
        }
        if ((stf['cancelDate'])) {
          this.staff['cancelDate'] = stf['cancelDate'];
        }
        if ((result['groupType'])) {
          this.staff['groupType'] = result['groupType'];
        }
        if ((stf['cityName'])) {
          this.staff['cityName'] = stf['cityName'];
        }
        if ((stf['countryName'])) {
          this.staff['countryName'] = stf['countryName'];
        }
        if ((stf['departmentName'])) {
          this.staff['departmentName'] = stf['departmentName'];
        }
        if ((stf['description'])) {
          this.staff['description'] = stf['description'];
        }
        if ((stf['districtName'])) {
          this.staff['districtName'] = stf['districtName'];
        }
        if ((stf['email'])) {
          this.staff['email'] = stf['email'];
        }
        if ((stf['employeeId'])) {
          this.staff['employeeId'] = stf['employeeId'];
        }
        if ((stf['employeeNo'])) {
          this.staff['employeeNo'] = stf['employeeNo'];
        }
        if ((stf['employeeTitleName'])) {
          this.staff['employeeTitleName'] = stf['employeeTitleName'];
        }
        if ((stf['firstName'])) {
          this.staff['firstName'] = stf['firstName'];
        }
        if ((stf['gender'])) {
          this.staff['gender'] = stf['gender'];
        }
        if ((stf['gsm'])) {
          this.staff['gsm'] = stf['gsm'];
        }
        if ((stf['plant'])) {
          this.staff['plant'] = stf['plant'];
        }

        if ((stf['identity'])) {
          this.staff['identity'] = stf['identity'];
        }
        if ((stf['jobEntryDate'])) {
          this.staff['jobEntryDate'] = stf['jobEntryDate'];
        }
        if ((stf['jobExitDate'])) {
          this.staff['jobExitDate'] = stf['jobExitDate'];
        }
        if ((stf['lastName'])) {
          this.staff['lastName'] = stf['lastName'];
        }
        if ((stf['managerFirstName'])) {
          this.staff['managerFirstName'] = stf['managerFirstName'];
        }
        if ((stf['managerLastName'])) {
          this.staff['managerLastName'] = stf['managerLastName'];
        }
        if ((stf['phone'])) {
          this.staff['phone'] = stf['phone'];
        }
        if ((stf['userStatus'])) {
          this.staff['userStatus'] = stf['userStatus'];
        }
        if ((stf['mediaId'])) {
          this._mediaSvc.getMedia(stf['mediaId']).then(media =>
            this.initPicture(media));
        }

        if ((result['employeeRoleDtoList'])) {
          this.staff['employeeRoleDtoList'] = result['employeeRoleDtoList'];
        }
        if ((result['employeePermissionDtoList'])) {
          this.staff['employeePermissionDtoList'] = result['employeePermissionDtoList'];
        }
        this.showImages();

      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  showImages() {
    if ((this.imageAdderComponent)) {
      if (this.staff && this.staff.employeeId || this.id) {
        this.imageAdderComponent.initImages(this.staff.employeeId || this.id, this.tableTypeForImg);
      }

    }
  }
  initPicture(media) {
    this.picture = media.path;
  }


  ngOnInit() {
  }

  goPage(id) {
    if (id === -1) {
      this._router.navigate(['/general-settings/staff/new']);
    } else {
      this._router.navigate(['/general-settings/staff/edit/' + id]);
    }
  }

  reset() {
    this.staff = {
      'address1': '',
      'address2': '',
      'birthDate': '',
      'bloodGroup': '',
      'cancelDate': '',
      'cityName': '',
      'countryName': '',
      dummy: false,
      ccList: '',
    bccList: '',
      employeeCostRate: '',
      'departmentName': '',
      'description': '',
      'districtName': '',
      'email': '',
      'employeeId': '',
      'employeeNo': '',
      'employeeTitleName': '',
      'firstName': '',
      'gender': '',
      'gsm': '',
      'identity': '',
      'groupType': '',
      'jobEntryDate': '',
      'jobExitDate': '',
      'lastName': '',
      'rfid': '',
      'plant':'',
      'managerFirstName': '',
      'managerLastName': '',
      'phone': '',
      'userStatus': '',
      'employeeRoleDtoList': [],
      'employeePermissionDtoList': []
    };
    this.picture = null;
  }

  getRfid (rfid: any): any {
    if (rfid) {
      // tslint:disable-next-line: no-construct
      let stars = '';
      const nrfid = new String(rfid);
      for (let index = 0; index < nrfid.length; index++) {
        stars =  stars + '*';
      }

      return stars
    }
    return '';
  }

  showRolesPermissions() {
    this.expanded = !this.expanded;
  }
}
