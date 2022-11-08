import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
import { QualityControlKeyServiceService } from 'app/services/dto-services/quality-control-key/quality-control-key-service.service';


@Component({
  selector: 'edit-quality-control-key',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditQualityControlKey implements OnInit {

  qualityControlKey = {
    qmControlKeyId: null,
    qmControlKeyText: null,
    qmControlKeyCode: null,
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
  @Input() plantId = null;

  constructor(
    private _route: ActivatedRoute,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _qualityControlKeyServiceService: QualityControlKeyServiceService) {
  }

  ngOnInit() {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.qualityControlKey.qmControlKeyId = this.id;
        this.initialize(this.id);
      }
    });
  }

  private initialize(id) {
    this.qualityControlKey.qmControlKeyId = this.id;
    this.loaderService.showLoader();

    this._qualityControlKeyServiceService.get(id).then(
      result => {
        this.loaderService.hideLoader();
        if ((result['qmControlKeyCode'])) {
          this.qualityControlKey.qmControlKeyCode = result['qmControlKeyCode'];
        }
        if ((result['qmControlKeyText'])) {
          this.qualityControlKey.qmControlKeyText = result['qmControlKeyText'];
        }
      }).catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });

  }
  reset() {
    this.qualityControlKey.qmControlKeyCode = '',
      this.qualityControlKey.qmControlKeyText = ''
  }

  save() {
    this.loaderService.showLoader();
    this.qualityControlKey['plantId'] = this.plantId;
    this._qualityControlKeyServiceService.save(this.qualityControlKey).then(
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
