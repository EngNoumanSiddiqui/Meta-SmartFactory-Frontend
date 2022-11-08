import {Component, EventEmitter, OnInit, Output, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {TableTypeEnum} from '../../../../dto/table-type-enum';
import {UtilitiesService} from '../../../../services/utilities.service';
import {environment} from '../../../../../environments/environment';
import { Subscription } from 'rxjs';
import { LoaderService } from 'app/services/shared/loader.service';
import { OperationTypeToWSTypeService } from 'app/services/dto-services/operation/operation-type-to-ws-type.service';
import { OperationService } from 'app/services/dto-services/operation/operation.service';

@Component({
  selector: 'optype-to-wstype-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit, OnDestroy {
  @Output() saveAction = new EventEmitter<any>();
  optypetowstypeReqDto = {
    'operationTypeId': null,
    'operationTypeToWsTypeId': null,
    'workStationTypeId': null
  }
  subscription: Subscription;
  TypeList: any;
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
