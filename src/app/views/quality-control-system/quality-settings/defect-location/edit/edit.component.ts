import {Component, EventEmitter, Input, OnInit, Output, AfterViewInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
 
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
import { DefectLocationsService } from 'app/services/dto-services/defect-location/defect-locations.service'
@Component({ 
  selector: 'edit-defect-location', 
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'] 
})
export class EditDefectLocation implements OnInit {

  defectLocationType = {
    defectLocationId: null,
    defectLocationCode: null,
    text: null,
  }; 

  id;

  @Input() plantId = null;
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
              private _defectLocationsService: DefectLocationsService) {
  }

  ngOnInit() {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.defectLocationType.defectLocationId = this.id;
        this.initialize(this.id);
      }
    });
  }

  private initialize(id) {
    this.defectLocationType.defectLocationId = this.id;
    this.loaderService.showLoader();

    this._defectLocationsService.detail(id).then(
      result => {
        this.loaderService.hideLoader();
        if ((result['defectLocationCode'])) {
          this.defectLocationType.defectLocationCode = result['defectLocationCode'];
        }
        if ((result['text'])) {
          this.defectLocationType.text = result['text'];
        }
      }).catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }
  reset() {
    this.defectLocationType.defectLocationCode='',
    this.defectLocationType.text=''
  }

  save() {
    this.loaderService.showLoader();
    this.defectLocationType['plantId']= this.plantId;
    this._defectLocationsService.save(this.defectLocationType).then(
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
