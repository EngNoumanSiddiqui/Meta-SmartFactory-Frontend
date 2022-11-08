import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
 
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { InspectionSpecificationService } from 'app/services/dto-services/quality-inspection/inspection-specification.service';
import { environment } from 'environments/environment';
@Component({
  selector: 'edit-inspection-spec',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditInspectionSpec implements OnInit {
  @Input() plantId;
  inspectionSpecification = {
    inspectionSpecificationId: null,
    inspectionPlan: null,
    group: null,
    groupCounter: null,
    usage: null,
    sampleSize: null,
    keyDate: new Date(),
  };

  usageList = [
    'Usage 1',
    'Usage 2'
  ];

  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };
  @Input('inspectionLotId') inspectionLotId;

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
              private _inspectionSpecificationService: InspectionSpecificationService) {
  }

  ngOnInit() {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.inspectionSpecification.inspectionSpecificationId = this.id;
        this.initialize(this.id);
      }
    });
  }

  private initialize(id) {
    this.inspectionSpecification.inspectionSpecificationId = this.id;
    this.loaderService.showLoader();

    this._inspectionSpecificationService.getUpdateDetail(id).subscribe(
      result => {
        console.log('getResult', result);
        
        this.loaderService.hideLoader();
        if ((result['inspectionPlan'])) {
          this.inspectionSpecification.inspectionPlan = result['inspectionPlan'];
        }
        if ((result['group'])) {
          this.inspectionSpecification.group = result['group'];
        }
        if ((result['groupCounter'])) {
          this.inspectionSpecification.groupCounter = result['groupCounter'];
        }
        if ((result['usage'])) {
          this.inspectionSpecification.usage = result['usage'];
        }
        if ((result['sampleSize'])) {
          this.inspectionSpecification.sampleSize = result['sampleSize'];
        }
        if ((result['keyDate'])) {
          this.inspectionSpecification.keyDate = result['keyDate'];
        }
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      }); 
  }

  save() {
    this.loaderService.showLoader();
    this.inspectionSpecification['plantId'] = this.plantId;
    this._inspectionSpecificationService.update(this.inspectionSpecification.inspectionSpecificationId,this.inspectionSpecification).subscribe(
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
