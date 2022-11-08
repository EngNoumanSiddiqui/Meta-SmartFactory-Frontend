import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
 
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ResultRecordingService } from 'app/services/dto-services/quality-inspection/result-recording/result-recording.service'
import { environment } from 'environments/environment';

@Component({
  selector: 'edit-result-recording',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditResultRecording implements OnInit {
  @Input() plantId = null;
  resultRecording = {
    resultRecordingId: null,
    inspectionCharacteristic: null,
    specifications: null,
    recordType: null,
    inspect: null,
    inspected: null,
    result: null,
    defect: null,
    attribute: null,
    inspectionDescription: null,
    valuation: null,
  };
  
  inspectionCharacteristics = [
    'Item 1',
    'Item 2', 
    'Item 3'
  ];
  attributes = [
    'Attribute 1',
    'Attribute 2'
  ];

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
    private _resultRecordingService: ResultRecordingService) {
  }

  ngOnInit() {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.resultRecording.resultRecordingId = this.id;
        this.initialize(this.id);
      }
    });
  }

  private initialize(id) {
    this.resultRecording.resultRecordingId = this.id;
    this.loaderService.showLoader();

    this._resultRecordingService.detailResultRecording(id).then(
      result => {
        this.loaderService.hideLoader();
        if ((result['inspectionCharacteristic'])) {
          this.resultRecording.inspectionCharacteristic = result['inspectionCharacteristic'];
        }
        if ((result['specifications'])) {
          this.resultRecording.specifications = result['specifications'];
        }
        if ((result['recordType'])) {
          this.resultRecording.recordType = result['recordType'];
        }
        if ((result['inspect'])) {
          this.resultRecording.inspect = result['inspect'];
        }
        if ((result['inspected'])) {
          this.resultRecording.inspected = result['inspected'];
        }
        if ((result['result'])) {
          this.resultRecording.result = result['result'];
        }
        if ((result['defect'])) {
          this.resultRecording.defect = result['defect'];
        }
        if ((result['attribute'])) {
          this.resultRecording.attribute = result['attribute'];
        }
        if ((result['inspectionDescription'])) {
          this.resultRecording.inspectionDescription = result['inspectionDescription'];
        }
        if ((result['valuation'])) {
          this.resultRecording.valuation = result['valuation'];
        }
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }
  
  onSelectedInspChar(event) {
    if (event) {
      this.resultRecording.inspectionCharacteristic = event.inspCharName;
      this.resultRecording.recordType = "Record Type 1";
      this.resultRecording.specifications = "Specification 1";
      this.resultRecording.inspect = 7;
    }
  }
  
  save() {
    this.loaderService.showLoader();
    this.resultRecording['plantId'] = this.plantId;
    this._resultRecordingService.update(this.resultRecording.resultRecordingId, this.resultRecording).subscribe(
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
 