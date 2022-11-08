import {Component, EventEmitter, Input, OnInit, Output, ViewChild, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {WorkcenterService} from '../../../../services/dto-services/workcenter/workcenter.service';
 
import {WorkcenterTypeService} from '../../../../services/dto-services/workcenter-type/workcenter-type.service';
import {ImageAdderComponent} from '../../../image/image-adder/image-adder.component';
import {TableTypeEnum} from '../../../../dto/table-type-enum';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import {environment} from '../../../../../environments/environment';
import { Subscription } from 'rxjs';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'workcenter-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditWorkcenterComponent implements OnInit, OnDestroy {
  @ViewChild(ImageAdderComponent) imageAdderComponent: ImageAdderComponent;
  selectedPlant: any;
  workcenter = {
    'plantId': null,
    'description': null,
    'workCenterId': null,
    'workCenterName': null,
    'workCenterNo': null,
    'workCenterTypeId': null,
    'maxChangeOverCount': null
  };
  tableTypeForImg = TableTypeEnum.WORKCENTER;
  @Output() saveAction = new EventEmitter<any>();
  id;
  subscription: Subscription;
  @Input('id') set z(id) {
    this.id = id;
    if (this.id) {
      this.initialize(this.id);
    }
  };
  @Input('data') set dt(data) {
    if (data) {
      this.id = data.workCenterId;
      this.workcenter = {
        'plantId': data.plant ? data.plant.plantId : null,
        'description': data.description,
        'workCenterId': data.workCenterId,
        'workCenterName': data.workCenterName,
        'workCenterNo': data.workCenterNo,
        'maxChangeOverCount': data.maxChangeOverCount,
        'workCenterTypeId': data.workcenterType ? data.workcenterType.workCenterTypeId : null
      };
    }
  };
  params = {
    dialog: {title: '', inputValue: ''}
  };
  workcenterTypeList;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private loaderService: LoaderService,
              private _workcenterTypeSvc: WorkcenterTypeService,
              private utilities: UtilitiesService,
              private _userSvc: UsersService,
              private _workcenterSvc: WorkcenterService) {
                this.selectedPlant = JSON.parse(this._userSvc.getPlant());
                this.workcenter.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;
    /* this._route.params.subscribe((params) => {
     this.id = params['id'];
     this.workcenter.workCenterId = this.id;
     this.initializa(this.id);
     });*/
  }
  private initialize(id: string) {
    this.workcenter.workCenterId = this.id;
    this.loaderService.showLoader();
    this._workcenterSvc.getUpdateDetail(id)
      .then(result => {
        this.loaderService.hideLoader();
        this.extracted(result);
      }).then(() =>
      this.imageAdderComponent.initImages(this.id, this.tableTypeForImg))
      .catch(error => {
        this.loaderService.hideLoader();
        console.log(error);
      });
  }
  setSelectedPlant(event) {
    if (event) {
      this.workcenter.plantId = event.plantId;
      this._workcenterTypeSvc.getIdNameList().then((result: any) => { 
        if (result && this.workcenter.plantId) {
          result = result.filter(itm => this.workcenter.plantId === itm.plantId);
        }
        this.workcenterTypeList = result;
      }).catch(error => console.log(error));
    }
    
  }

  private extracted(result) {
    if ((result['description'])) {
      this.workcenter['description'] = result['description'];
    }
    if ((result['workCenterName'])) {
      this.workcenter['workCenterName'] = result['workCenterName'];
      
    }
    if ((result['workCenterNo'])) {
      this.workcenter['workCenterNo'] = result['workCenterNo'];
    }
    if ((result['workCenterTypeId'])) {
      this.workcenter['workCenterTypeId'] = result['workCenterTypeId'];
    }
    if ((result['workStations'])) {
      this.workcenter['workStations'] = result['workStations'];
    }
    this.workcenter.plantId = result.plant ? result.plant.plantId : null;
  }

  ngOnInit() {
    this._workcenterTypeSvc.getWorkCentreTypeByPlantId(this.workcenter.plantId).then((result: any) => {
      // if (result && this.workcenter.plantId) {
      //   result = result.filter(itm => this.workcenter.plantId === itm.plantId);
      // }
      this.workcenterTypeList = result;
    }).catch(error => console.log(error));
    this.subscription = this._workcenterSvc.saveAction$.asObservable().subscribe(rs => {
      this.save();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  saveWorkcenterType() {
    this._workcenterTypeSvc.save({'workCenterTypeName': this.params.dialog.inputValue, plantId: this.workcenter.plantId})
      .then((result: any) => {
        this.utilities.showSuccessToast('saved-success');
        this.workcenterTypeList.push({'workCenterTypeId': result.workCenterTypeId, 'workCenterTypeName': this.params.dialog.inputValue});
        this.workcenter.workCenterTypeId = result.workCenterTypeId;
        this.params.dialog.inputValue = '';
      })
      .catch(error => this.utilities.showErrorToast(error));
  }

  cancel() {
    this._router.navigate(['/settings/workcenter']);
  }

  goPage() {
    this._router.navigate(['/settings/workcenter']);
  }

  save() {
    this.loaderService.showLoader();
    console.log('Data', this.workcenter);
    this._workcenterSvc.update(this.workcenter)
      .then(() => {
        this.loaderService.hideLoader();
        this.saveImages(this.id)
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }


  private saveImages(id) {
    this.imageAdderComponent.updateMedia(id, TableTypeEnum.WORKCENTER).then(() => {
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      }
    ).catch(error => this.utilities.showErrorToast(error));

  }


}
