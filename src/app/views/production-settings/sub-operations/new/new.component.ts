import {Component, EventEmitter, OnInit, Output, Input, OnDestroy} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import { SubOperationService } from 'app/services/dto-services/operation/sub-operation.service';
import { Subscription } from 'rxjs';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';

@Component({
  selector: 'sub-operation-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewSubOperationComponent implements OnInit, OnDestroy {
  @Output() saveAction = new EventEmitter<any>();


  @Input() operationId = null;
  @Input() operationCode = null;
  @Input() operationName = null;

  subOperation = {
    active: true,
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


  constructor(
              private _subOperationSvc: SubOperationService,
              private loaderService: LoaderService,
              private utilities: UtilitiesService
            ) {}

  ngOnInit() {
    this.subOperation.operationId = this.operationId;
    this.subOperation.operationCode = this.operationCode;
    this.subOperation.operationName = this.operationName;
    this.subscription = this._subOperationSvc.saveAction$.asObservable().subscribe(rs => {
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


 

  reset() {
    this.subOperation = {
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
  }

  save() {
    this.loaderService.showLoader();
    if (this.operationId) {
      this.subOperation.operationId = this.operationId;
    }
    this._subOperationSvc.save(this.subOperation)
      .then(result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.reset();
          this.counter = 1;
          this.saveAction.emit(result);
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.counter = 1;
        this.utilities.showErrorToast(error);
      });
  }


}
