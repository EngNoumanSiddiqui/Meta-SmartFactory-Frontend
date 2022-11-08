import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from 'app/services/shared/loader.service';
import {UtilitiesService} from 'app/services/utilities.service';
import {environment} from 'environments/environment';
import {PlantService} from 'app/services/dto-services/plant/plant.service';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();

  @Input() plantId = null;
  payLoadObject =
    {
      'groupCode': null,
      'groupDescription': null,
      plantId: this.plantId,
      'stockGroupId': null,
    }
  id;
  params = {
    dialog: { title: '', inputValue: '' }
  };
  
  constructor(private _router: Router,
    private _plantService: PlantService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService, ) {

  }


  ngOnInit() {

    this.payLoadObject.plantId = this.plantId;
  }


  reset() {
    this.payLoadObject =
    {
      
      'groupCode': null,
      'groupDescription': null,
      plantId: this.plantId,
      'stockGroupId': null,
      
    }

  }




  save() {
    this.loaderService.showLoader();
    this.payLoadObject.plantId = this.plantId;
    this._plantService.saveMaterialGroup(this.payLoadObject)
      .then(result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.reset();
          this.saveAction.emit(result);
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

}
