import { ScrapTypeService } from 'app/services/dto-services/scrap-type.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { environment } from 'environments/environment';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'scrap-type-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();

  part = {
    scrapCode: null,
    scrapDescription: null,
    typeRework: false,
    typeScrap: true,
    plantId: null
  }
  constructor(
    private scrapTypeService: ScrapTypeService,
    private utilities: UtilitiesService,
    private loaderService: LoaderService,
    private _userSvc: UsersService
  ) {
    const setPlant = this._userSvc.getPlant();
    let selectedPlant = JSON.parse(setPlant);
    if (selectedPlant) {
      this.part.plantId = selectedPlant.plantId;
    }
  }
  ngOnInit() {
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
      scrapCode: null,
      scrapDescription: null,
      typeRework: false,
      typeScrap: false,
      plantId: this.part.plantId
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
