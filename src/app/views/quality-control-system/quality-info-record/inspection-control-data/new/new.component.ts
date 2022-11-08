import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
import { QualityInspectionControlDataService } from 'app/services/dto-services/quality-inspection-control-data/quality-inspection-control-data-certification.service';

@Component({ 
  selector: 'new-inspection-control-data',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewInspectionControlData implements OnInit{

  @Input() fromAutoComplete = false;
  @Output() saveAction = new EventEmitter<any>();
  @Input('qualityInfoRecordId') qualityInfoRecordId;

  inspectionControlData = {
    createDate : null,
    inspectionControlDataCode : null,
    inspectionControlDataId : null,
    leadTime : null,
    qualityCertificateControlId : null,
    qualityInfoRecordId : null,
    qualityInspectionControlDataCertificationId : null,
    qualityVendorSourceInspectionId : null,
    updateDate : null,
  };

  certificateControlList = [
    'Control 1',
    'Control 2'
  ];
  inspectionControlCertificationList = [
    'Certification control 1',
    'Certification control 2'
  ];
  vendorSourceInspectionList= [
    'Vendor Source 1',
    'VendorSource 2'
  ]

  constructor(
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _qualityInspectionControlDataService: QualityInspectionControlDataService) {
  }

  ngOnInit() {
    
  }

  selectVendorSource(event) {
    if(event) {
      this.inspectionControlData.qualityVendorSourceInspectionId = event.vendorSourceInspectionId;
    }
  }

  selectinspectionControlData(event) {
    if(event) {
      this.inspectionControlData.qualityInspectionControlDataCertificationId = event.inspectionControlDataCertification;
    }
  }

  save() {
    this.inspectionControlData.qualityInfoRecordId = this.qualityInfoRecordId;
    this.loaderService.showLoader();
    this._qualityInspectionControlDataService.save(this.inspectionControlData).then(
      result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          // this.saveAction.emit('close');
        }, environment.DELAY);
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }
 
}
