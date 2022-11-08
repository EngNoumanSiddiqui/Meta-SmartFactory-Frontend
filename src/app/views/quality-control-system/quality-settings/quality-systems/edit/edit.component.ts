import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
import { QualitySystemsService } from 'app/services/dto-services/quality-systems/quality-systems.service';

@Component({
  selector: 'edit-quality-system',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditQualitySystem implements OnInit {
  @Input() plantId = null;
  qualitySystem = {
    qualitySystemId: null,
    qualitySystemCode: null,
    qualitySystemText: null,
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
    private _qualitySystemsService: QualitySystemsService) {
  }

  ngOnInit() {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.qualitySystem.qualitySystemId = this.id;
        this.initialize(this.id);
      }
    });
  }

  private initialize(id) {
    this.qualitySystem.qualitySystemId = this.id;
    this.loaderService.showLoader();

    this._qualitySystemsService.detail(id).then(
      result => {
        this.loaderService.hideLoader();
        if ((result['qualitySystemCode'])) {
          this.qualitySystem.qualitySystemCode = result['qualitySystemCode'];
        }
        if ((result['qualitySystemText'])) {
          this.qualitySystem.qualitySystemText = result['qualitySystemText'];
        }
      }).catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }
  reset() {
    this.qualitySystem.qualitySystemCode = '',
      this.qualitySystem.qualitySystemText = ''
  }

  save() {
    this.loaderService.showLoader();
    this.qualitySystem['plantId'] = this.plantId;
    this._qualitySystemsService.save(this.qualitySystem).then(
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
