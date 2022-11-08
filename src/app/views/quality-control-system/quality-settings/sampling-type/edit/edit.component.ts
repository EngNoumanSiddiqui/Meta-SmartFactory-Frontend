import {Component, EventEmitter, Input, OnInit, Output, AfterViewInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
 
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { SamplingTypeService } from 'app/services/dto-services/sampling-type/sampling-type.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'edit-sampling-type',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditSamplingType implements OnInit, AfterViewInit {

  samplingType = {
    samplingTypeCode: null,
    samplingTypeId: null,
    samplingTypeText: null,
    createDate: null,
    updateDate: null,
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
    private _SamplingTypeService: SamplingTypeService) {
  }

  ngOnInit() {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.samplingType.samplingTypeId = this.id;
        this.initialize(this.id);
      }
    });
  }

  ngAfterViewInit() {
    // this.showImages();
  }

  private initialize(id) {
    this.samplingType.samplingTypeId = this.id;
    this.loaderService.showLoader();

    this._SamplingTypeService.detailSamplingType(id).then(
      (result: any) => {
        this.loaderService.hideLoader();
        this.samplingType = {
          samplingTypeCode: result.samplingTypeCode,
          samplingTypeId: result.samplingTypeId,
          samplingTypeText: result.samplingTypeText,
          createDate: result.createDate,
          updateDate: result.updateDate
        };
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }
  reset() {
    this.samplingType = {
      samplingTypeCode: null,
      samplingTypeId: null,
      samplingTypeText: null,
      createDate: null,
      updateDate: null
    };
  }

  save() {
    this.loaderService.showLoader();
    this._SamplingTypeService.update(this.samplingType.samplingTypeId, this.samplingType).subscribe(
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
