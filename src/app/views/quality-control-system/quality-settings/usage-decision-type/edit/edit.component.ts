import {Component, EventEmitter, Input, OnInit, Output, AfterViewInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
 
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { DefectTypeService } from 'app/services/dto-services/defect-type/defect-type.service'
import { environment } from 'environments/environment';
import { UsageDecisionTypeService } from 'app/services/dto-services/usage-decision-type/usage.decision.type.service';

@Component({
  selector: 'edit-usage-decision-type',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})

export class EditUsageDecisionType implements OnInit {
  
  usageDecisionType = {
    qmQualityUsageDecisionTypeCode: null,
    qmQualityUsageDecisionTypeDescription: null,
    qmQualityUsageDecisionTypeId: null,
  };

  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  myModal;

  params = {
    cityDisabled: true,
    dialog: {
      title: '',
      inputText: '',
      inputValue: ''
    },
    displayDialog: false,
  };

  @Output() saveAction = new EventEmitter<any>();
  lastAccountNos;

  constructor(
    private _route: ActivatedRoute,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _usageDecisionTypeService: UsageDecisionTypeService
    ) {
  }

  ngOnInit() {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.usageDecisionType.qmQualityUsageDecisionTypeId = this.id;
        this.initialize(this.id);
      }
    });
  }

  ngAfterViewInit() {
    // this.showImages();
  }

  private initialize(id) {
    this.usageDecisionType.qmQualityUsageDecisionTypeId = this.id;
    this.loaderService.showLoader();

    this._usageDecisionTypeService.detail(id).then(
      result => {
        this.loaderService.hideLoader();
        if ((result['qmQualityUsageDecisionTypeCode'])) {
          this.usageDecisionType.qmQualityUsageDecisionTypeCode = result['qmQualityUsageDecisionTypeCode'];
        }
        if ((result['qmQualityUsageDecisionTypeDescription'])) {
          this.usageDecisionType.qmQualityUsageDecisionTypeDescription = result['qmQualityUsageDecisionTypeDescription'];
        }
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }
  reset() {
    this.usageDecisionType.qmQualityUsageDecisionTypeCode='';
    this.usageDecisionType.qmQualityUsageDecisionTypeDescription='';
  }

  save() {
    this.loaderService.showLoader();
    this._usageDecisionTypeService.update(this.usageDecisionType).then(
      result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      }).catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
      
  }

  cancel() {
    this.saveAction.emit('close');
  }

}
