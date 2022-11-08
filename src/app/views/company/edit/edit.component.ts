import {Component, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ActService} from '../../../services/dto-services/act/act.service';
import {CityService} from '../../../services/dto-services/city/city.service';
import {CountryService} from '../../../services/dto-services/country/country.service';
import {ActTypeService} from '../../../services/dto-services/act-type/act-type.service';
import {EnumActStatusService} from '../../../services/dto-services/enum/act-status.service';
 
import {LoaderService} from '../../../services/shared/loader.service';
import {UtilitiesService} from '../../../services/utilities.service';
import {environment} from '../../../../environments/environment';
import { Subscription } from 'rxjs';
import { TableTypeEnum } from '../../../dto/table-type-enum';
import { ImageAdderComponent } from '../../image/image-adder/image-adder.component';
import { CompanyService } from 'app/services/dto-services/company/company.service';
import { PlantService } from 'app/services/dto-services/plant/plant.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';

// TODO: Validationlar eklenecek


@Component({
  selector: 'company-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditCompanyComponent implements OnInit, AfterViewInit, OnDestroy {
  plantModal = {active: false, modal: null, data: null};
  company = {
    'address': null,
    'cityId': null,
    'cityName': null,
    'companyAddress': null,
    'companyId': null,
    'companyCode': null,
    'companyName': null,
    'countryId': null,
    'countryName': null,
    'plantList': null,
    'postcode': null
  };
  tableTypeForImg = TableTypeEnum.COMPANY;
  @ViewChild(ImageAdderComponent) imageAdderComponent: ImageAdderComponent;
  subscription: Subscription;
  countries: any;
  cities: any;
  cityDisabled: boolean;
  @Input('data') set z(data) {
    if (data) {
      this.company = {
        'address': data.address,
        'companyAddress': data.companyAddress,
        'companyId': data.companyId,
        'countryId' : data.countryId,
        'countryName': data.countryName,
        'cityId' : data.cityId,
        'cityName': data.cityName,
        'plantList': data.plantList,
        'companyCode': data.companyCode,
        'companyName': data.companyName,
        'postcode': data.postcode
      };
      if ( !this.company.plantList) {
        this.retrievePlantList();
      }
      if (this.company.countryId) {
        this._citySvc.getIdNameList(this.company.countryId)
        .then(result => {this.cities = result; this.cityDisabled = false; })
        .catch(error => console.log(error));
      }
    }
  };

  @Output() saveAction = new EventEmitter<any>();

  constructor(private companyService: CompanyService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _citySvc: CityService,
    private _countrySvc: CountryService,
    private loaderService: LoaderService,
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private plantSvc: PlantService,
    private utilities: UtilitiesService) {


  }

  ngOnInit() {
    this._countrySvc.getIdNameList().then(result => this.countries = result).catch(error => console.log(error));
    this._route.params.subscribe((params) => {
      // this.id = params['id'];
      // if (this.id) {
      //   this.company.companyId = this.id;
      //   // this.initialize(this.id);
      // }
    });
    this.subscription = this.companyService.saveAction$.asObservable().subscribe(rs => {
      this.save();
    });
  }
  retrievePlantList() {
    this.plantSvc.getAllPlants().then((res: any) => {
      if (res) {
        this.company.plantList = res;
      }
    });
  }
  countrySelection(event) {
    if (this.company.countryId !== null) {
      this.countries.forEach(country => {
        if (this.company.countryId === country.countryId) {
          this.company.countryName = country.countryName;
        }
      });
      this._citySvc.getIdNameList(this.company.countryId)
        .then(result => this.cities = result)
        .catch(error => console.log(error));

      this.cityDisabled = false;
    } else {
      this.cityDisabled = true;
    }

  }

  modalShow(data, modal, company = null) {
    if (!data.company) {
      data.company = company;
    }
    this.plantModal.data = data;
    this.plantModal.modal = modal;
    // this.plantModal.uniqueId = ;

    this.plantModal.active = true;
  }
  deletePlant(plantId) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.plantSvc.deleteplant(plantId)
          .then(() => {
            this.utilities.showSuccessToast('deleted-success');
            this.retrievePlantList();
          })
          .catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showWarningToast('cancelled-operation');
      }
    })
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.showImages();
  }
  showImages() {
    if ((this.imageAdderComponent)) {
      if (this.company && this.company.companyId) {
        this.imageAdderComponent.initImages(this.company.companyId, this.tableTypeForImg);
      }

    }
  }
  save() {
    this.loaderService.showLoader();
    this.companyService.save(this.company)
      .then((company: any) => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        this.saveImages(company.companyId);
        // setTimeout(() => {
        //   this.saveAction.emit('close');
        // }, environment.DELAY);
      }).catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }
  private saveImages(companyId) {
    this.imageAdderComponent.updateMedia(companyId, TableTypeEnum.COMPANY).then(() => {
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      }
    ).catch(error => this.utilities.showErrorToast(error));
  }
  
  cancel() {
    this._router.navigate(['/customers']);
    this.saveAction.emit('close');
  }
}
