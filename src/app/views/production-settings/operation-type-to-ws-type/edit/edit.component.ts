import {Component, EventEmitter, Input, OnInit, Output, ViewChild, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import * as moment from 'moment';
 
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import {environment} from '../../../../../environments/environment';
import { Subscription } from 'rxjs';
import { OperationService } from 'app/services/dto-services/operation/operation.service';
import { OperationTypeToWSTypeService } from 'app/services/dto-services/operation/operation-type-to-ws-type.service';

@Component({
  selector: 'optype-to-wstype-edit',
  templateUrl: './edit.component.html'
})
export class EditComponent implements OnInit, OnDestroy {
  
  @Output() saveAction = new EventEmitter<any>();
  optypetowstypeReqDto = {
    'operationTypeId': null,
    'operationTypeToWsTypeId': null,
    'workStationTypeId': null
  };
  subscription: Subscription;
  TypeList: any;
  id: any;
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  
  private initialize(id) {
    this.optypetowstypeReqDto.operationTypeToWsTypeId = this.id;
    this.loaderService.showLoader();
    this.oprtypetowstypeService.getDetails(id)
      .then((result: any) => {
        this.loaderService.hideLoader();
        this.optypetowstypeReqDto = {
          'operationTypeId': result.operationType ? result.operationType.operationTypeId : null,
          'operationTypeToWsTypeId': result.operationTypeToWsTypeId,
          'workStationTypeId': result.workStationType ? result.workStationType.workStationTypeId : null
        };
      }).catch(error => {
        this.loaderService.hideLoader();
        console.log(error)
      });
  }
  constructor(
    private _router: Router,
    private _operationTypeService: OperationService,
    private loaderService: LoaderService,
    private oprtypetowstypeService: OperationTypeToWSTypeService,
    private utilities: UtilitiesService) {
  }

  ngOnInit() {
    this._operationTypeService.operationTypefilter().then( (result: any) => {
      this.TypeList = result;
      // console.log("tar",this.TypeList);
    }).catch(error => console.log(error));
    this.subscription = this.oprtypetowstypeService.saveAction$.asObservable().subscribe(rs => {
      this.save();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  reset() {
    this.optypetowstypeReqDto = {
      'operationTypeId': null,
      'operationTypeToWsTypeId': null,
      'workStationTypeId': null
    }
  }

  selectWorkstationType(event) {
    this.optypetowstypeReqDto.workStationTypeId = +event.workStationTypeId;
  }

  goPage() {
    this._router.navigate(['/settings/workstation']);
  }

  save() {
    this.loaderService.showLoader();
    this.oprtypetowstypeService.save(this.optypetowstypeReqDto)
      .then(workStationId => {
        this.loaderService.hideLoader();
        setTimeout(() => {
          this.saveAction.emit(workStationId);
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }
}
