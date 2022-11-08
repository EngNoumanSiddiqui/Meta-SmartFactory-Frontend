import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PartService } from 'app/services/dto-services/part/part.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';

import { ScrapTypeService } from 'app/services/dto-services/scrap-type.service';
import { environment } from 'environments/environment';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'scrap-type-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();
  id;

  part = {
    'scrapCode': null,
    'scrapDescription': null,
    'scrapTypeId': 0,
    'typeRework': false,
    'typeScrap': true,
    'plantId': null
  }

  @Input('id')
  set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };
  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private scrapTypeService: ScrapTypeService,
    private utilities: UtilitiesService,
    private loaderService: LoaderService,
    private _userSvc: UsersService) {
    const setPlant = this._userSvc.getPlant();
    const selectedPlant = JSON.parse(setPlant);
    if (selectedPlant) {
      this.part.plantId = selectedPlant.plantId;
    }
  }

  ngOnInit() {
    // console.log("@onedit",this.id);
  }

  private initialize(id) {
    this.part.scrapTypeId = this.id;
    this.loaderService.showLoader();
    this.scrapTypeService.getUpdateDetail(this.id).then(result => {
      console.log('#onEdit', result);
      this.loaderService.hideLoader();
      if ((result['scrapCode'])) {
        this.part.scrapCode = result['scrapCode'];
      }
      if ((result['scrapDescription'])) {
        this.part.scrapDescription = result['scrapDescription'];
      }
      if ((result['typeRework'])) {
        this.part.typeRework = result['typeRework'];
      }
      if ((result['plant'])) {
        this.part.plantId = this.part.plantId || result['plant']?.plantId;
      }
      if ((result['typeScrap'])) {
        this.part.typeScrap = result['typeScrap'];
      }
    }).catch(error => {
      this.loaderService.hideLoader();
      console.log(error)
    });
  }
  save() {
    this.loaderService.showLoader();
    console.log('@beforeSave', this.part);
    this.scrapTypeService.save(this.part)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.reset();
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }
  reset() {
    this.part = {
      'scrapCode': null,
      'scrapDescription': null,
      'scrapTypeId': 0,
      'typeRework': false,
      'typeScrap': false,
      'plantId': this.part.plantId

    }
  }


  ontypeScrapchanged(event) {
    if (event === true) {
      this.part.typeRework = false;
    } else {
      this.part.typeRework = true;
    }
  }
  ontypeReworkchanged(event) {
    if (event === true) {
      this.part.typeScrap = false;
    } else {
      this.part.typeScrap = true;
    }
  }
}
