import {Component, EventEmitter, Input, OnInit, Output, AfterViewInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
 
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { InspectionOperationsService } from 'app/services/dto-services/inspection-operations/inspection-operations.service'
import { environment } from 'environments/environment';

@Component({
  selector: 'edit-inspection-operation',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditInspectionOperation implements OnInit {

  inspectionOperation = {
    inspectionOperationId: null,
    inspectionOperationCode: null,
    inspectionOperationName: null,
    inspectionOperationText: null,
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
              private _inspectionOperationsService: InspectionOperationsService) {
  }

  ngOnInit() {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.inspectionOperation.inspectionOperationId = this.id;
        this.initialize(this.id);
      }
    });
  }

  ngAfterViewInit() {
    // this.showImages();
  }

  private initialize(id) {
    this.inspectionOperation.inspectionOperationId = this.id;
    this.loaderService.showLoader();

    this._inspectionOperationsService.detailInspectionOperation(id).then(
      result => {
        this.loaderService.hideLoader();
        if ((result['inspectionOperationCode'])) {
          this.inspectionOperation.inspectionOperationCode = result['inspectionOperationCode'];
        }
        if ((result['inspectionOperationName'])) {
          this.inspectionOperation.inspectionOperationName = result['inspectionOperationName'];
        }
        if ((result['inspectionOperationText'])) {
          this.inspectionOperation.inspectionOperationText = result['inspectionOperationText'];
        }
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }
  reset() {
    this.inspectionOperation.inspectionOperationCode='',
    this.inspectionOperation.inspectionOperationName=''
    this.inspectionOperation.inspectionOperationText=''
  }

  save() {
    this.loaderService.showLoader();
    this._inspectionOperationsService.saveInspectionOperation(this.inspectionOperation).then(
      result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      }).catch(
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  cancel() {
    this.saveAction.emit('close');
  }
}
