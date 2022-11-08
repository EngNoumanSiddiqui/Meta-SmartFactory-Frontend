import {Component, EventEmitter, Input, OnInit, Output, AfterViewInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
 
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { DefectTypeService } from 'app/services/dto-services/defect-type/defect-type.service'
import { environment } from 'environments/environment';

@Component({
  selector: 'edit-defect-type',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditDefectType implements OnInit {
  defectType = {
    defectTypeId: null,
    defectTypeCode: null,
    defectTypeText: null,
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
    private _defectTypeService: DefectTypeService) {
  }

  ngOnInit() {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.defectType.defectTypeId = this.id;
        this.initialize(this.id);
      }
    });
  }

  ngAfterViewInit() {
    // this.showImages();
  }

  private initialize(id) {
    this.defectType.defectTypeId = this.id;
    this.loaderService.showLoader();

    this._defectTypeService.detailDefectType(id).then(
      result => {
        this.loaderService.hideLoader();
        if ((result['defectTypeCode'])) {
          this.defectType.defectTypeCode = result['defectTypeCode'];
        }
        if ((result['defectTypeText'])) {
          this.defectType.defectTypeText = result['defectTypeText'];
        }
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }
  reset() {
    this.defectType.defectTypeCode='';
    this.defectType.defectTypeText='';
  }

  save() {
    this.loaderService.showLoader();
    this._defectTypeService.updateDefectType(this.defectType).then(
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
