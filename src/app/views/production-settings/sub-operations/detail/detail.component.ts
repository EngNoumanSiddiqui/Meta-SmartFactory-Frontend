import {Component, Input, OnInit} from '@angular/core';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { SubOperationService } from 'app/services/dto-services/operation/sub-operation.service';


@Component({
  selector: 'sub-operation-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailSubOperationComponent implements OnInit {
  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  operation: any = {
    active: null,
    createDate: null,
    operation: null,
    operationCode: null,
    operationName: null,
    operationId: null,
    subOperationId: null,
    subOperationName: null,
    totalSkillValue: null,
    updateDate: null,
  };

  constructor(
              private utilities: UtilitiesService,
              private _subOperationSvc: SubOperationService,
              private loaderService: LoaderService) {
  }

  private initialize(id) {
    this.loaderService.showLoader();
    this._subOperationSvc.getDetail(id)
      .then(result => {
        this.operation = {
          active: result['active'],
          createDate: result['createDate'],
          operationCode: result['operation']?.operationCode,
          operationName: result['operation']?.operationName,
          operationId: result['operation']?.operationId,
          subOperationId: result['subOperationId'],
          subOperationName: result['subOperationName'],
          totalSkillValue: result['totalSkillValue'],
          updateDate: result['updateDate'],
        };
        this.loaderService.hideLoader();
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  ngOnInit() {
  }

}

