import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
 
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import {QualityInfoRecordService} from 'app/services/dto-services/quality-info-record/quality-info-record.service';
import { environment } from 'environments/environment';
import { QualityInspectionControlDataService } from 'app/services/dto-services/quality-inspection-control-data/quality-inspection-control-data-certification.service';

@Component({
  selector: 'edit-inspection-control-data',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditInspectionControlData implements OnInit {

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

  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };
  @Input('qualityInfoRecordId') qualityInfoRecordId;

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
              private _qualityInspectionControlDataService: QualityInspectionControlDataService,) {
  } 

  ngOnInit() {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.inspectionControlData.inspectionControlDataId = this.id;
        this.initialize(this.id);
      }
    });
  }

  private initialize(id) {
    this.inspectionControlData.inspectionControlDataId = this.id;
    this.loaderService.showLoader();

    this._qualityInspectionControlDataService.detail(id).then(
      result => {
        this.loaderService.hideLoader();
        this.inspectionControlData = {
          createDate : result['createDate'],
          inspectionControlDataCode : result['inspectionControlDataCode'],
          inspectionControlDataId : result['inspectionControlDataId'],
          leadTime : result['leadTime'],
          qualityCertificateControlId : result['qualityCertificateControl']?.certificateControlId,
          qualityInfoRecordId : result['qualityInfoRecord']?.qualityInfoRecordId,
          qualityInspectionControlDataCertificationId : result['qualityInspectionControlDataCertification']?.inspectionControlDataCertification,
          qualityVendorSourceInspectionId : result['qualityVendorSourceInspection']?.vendorSourceInspectionId,
          updateDate : result['updateDate'],
        };
        
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
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
    this.loaderService.showLoader();
    this._qualityInspectionControlDataService.save(this.inspectionControlData).then(
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
