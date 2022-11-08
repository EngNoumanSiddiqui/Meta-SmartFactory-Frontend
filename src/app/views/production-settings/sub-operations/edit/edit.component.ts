import {Component, EventEmitter, Input, OnInit, Output, OnDestroy} from '@angular/core';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import {environment} from '../../../../../environments/environment';
import { Subscription } from 'rxjs';
import { SubOperationService } from 'app/services/dto-services/operation/sub-operation.service';

@Component({
  selector: 'sub-operation-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditSubOperationComponent implements OnInit, OnDestroy {
  
  @Output() saveAction = new EventEmitter<any>();


  @Input() operationId = null;
  @Input() operationCode = null;
  @Input() operationName = null;

  subOperation = {
    active: null,
    createDate: null,
    operationCode: this.operationCode,
    operationName: this.operationName,
    operationId: this.operationId,
    subOperationId: null,
    subOperationName: null,
    totalSkillValue: null,
    updateDate: null,
  };
  subscription: Subscription;
  counter = 1;
  id;
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  constructor(
              private _SubOperationSvc: SubOperationService,
              private loaderService: LoaderService, private utilities: UtilitiesService,
              ) {}

  private initialize(id) {
    this.loaderService.showLoader();
    this.subOperation.subOperationId = this.id;

    this._SubOperationSvc.getDetail(id)
      .then(result => {
        this.loaderService.hideLoader();
        this.subOperation = {
          active: result['active'],
          createDate: result['createDate'],
          operationCode: result['operation']?.operationNo,
          operationName: result['operation']?.operationName || this.operationName,
          operationId: result['operation']?.operationId,
          subOperationId: result['subOperationId'],
          subOperationName: result['subOperationName'],
          totalSkillValue: result['totalSkillValue'],
          updateDate: result['updateDate'],
        };
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  ngOnInit() {
    // this.subOperation.operationId = this.operationId;
    // this.subOperation.operationCode = this.operationCode;
    this.subscription = this._SubOperationSvc.saveAction$.asObservable().subscribe(rs => {
      if (this.counter === 1) {
        this.save();
        this.counter = this.counter + 1;
      }
    });
  }
 
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  save() {
    this._SubOperationSvc.save(this.subOperation)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('updated-success');
        setTimeout(() => {
          this.saveAction.emit('close');
          this.counter = 1;
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.counter = 1;
        this.utilities.showErrorToast(error);
      });
  }

}
