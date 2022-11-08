import {Component, EventEmitter, Input, OnInit, Output, AfterViewInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
 
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ValuationModeService } from 'app/services/dto-services/valuation-mode/valuation-mode.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'edit-valuation-mode',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditValuationMode implements OnInit {
  @Input() plantId = null;
 
  valuationMode = {
    createDate: null,
    samplingProcedureValuationModeCode: null,
    samplingProcedureValuationModeId: null,
    samplingProcedureValuationModeText: null,
    updateDate: null
  };

  @Input('data') set z(data) {
    if (data) {
      this.valuationMode = {
        createDate: data.createDate,
        samplingProcedureValuationModeCode: data.samplingProcedureValuationModeCode,
        samplingProcedureValuationModeId: data.samplingProcedureValuationModeId,
        samplingProcedureValuationModeText: data.samplingProcedureValuationModeText,
        updateDate: data.updateDate
      };
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
              private _valuationModeService: ValuationModeService) {
  }

  ngOnInit() {
    
  }

  
  reset() {
   
  }

  save() {
    this.loaderService.showLoader();
    this.valuationMode['plantId'] = this.plantId;
    this._valuationModeService.save(this.valuationMode).then(
      result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  cancel() {
    this.saveAction.emit('close');
  }

}
