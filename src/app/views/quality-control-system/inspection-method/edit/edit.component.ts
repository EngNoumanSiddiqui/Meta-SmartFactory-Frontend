import {Component, EventEmitter, Input, OnInit, Output, AfterViewInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
 
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { InspectionMethodService } from 'app/services/dto-services/inspection-method/inspection-method.service';
import { environment } from 'environments/environment';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
@Component({
  selector: 'edit-inspection-method',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditInspectionMethod implements OnInit, AfterViewInit {
  inspectionMethod = {
    inspectionMethodId: null,
    inspectionMethodCode: null,
    inspectionMethodName: null,
    plantId: null,
    validFrom: null,
    description: null,
    inspectionMethodStatus: null
  };

  statusList = [];

  id;

  // tableTypeForImg = TableTypeEnum.COMPANY;
  // @ViewChild(ImageAdderComponent, {static: false}) imageAdderComponent: ImageAdderComponent;
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  @Input() plantId = null;

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
              private enumService: EnumService,
              private _inspectionMethodService: InspectionMethodService) {
  }

  ngOnInit() {
    this.enumService.getQualityInspectionMethodStatusEnum().then((res: any ) => this.statusList = res);
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.inspectionMethod.inspectionMethodId = this.id;
        this.initialize(this.id);
      }
    });
  }

  ngAfterViewInit() {
    // this.showImages();
  }

  private initialize(id) {
    this.inspectionMethod.inspectionMethodId = this.id;
    this.loaderService.showLoader();

    this._inspectionMethodService.detailInspectionMethod(id).then(
      result => {
        this.loaderService.hideLoader();
        if ((result['inspectionMethodCode'])) {
          this.inspectionMethod.inspectionMethodCode = result['inspectionMethodCode'];
        }
        if ((result['inspectionMethodName'])) {
          this.inspectionMethod.inspectionMethodName = result['inspectionMethodName'];
        }
        if ((result['plant'])) {
          this.inspectionMethod.plantId = result['plant'].plantId;
        }
        if ((result['validFrom'])) {
          this.inspectionMethod.validFrom = new Date (result['validFrom']);
        }
        if ((result['description'])) {
          this.inspectionMethod.description = result['description'];
        }
        if ((result['inspectionMethodStatus'])) {
          this.inspectionMethod.inspectionMethodStatus = result['inspectionMethodStatus'];
        }
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  setSelectedPlant(event) {
    if (event) {
      this.inspectionMethod.plantId = event.plantId;
    } else {
      this.inspectionMethod.plantId = null;
    }
  }

  save() {
    this.loaderService.showLoader();
    if (!this.inspectionMethod.inspectionMethodStatus) {
      this.inspectionMethod.inspectionMethodStatus = 'READY';
    }
    this.inspectionMethod.plantId = this.plantId;
    this._inspectionMethodService.saveInspectionMethod(this.inspectionMethod).then(
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
