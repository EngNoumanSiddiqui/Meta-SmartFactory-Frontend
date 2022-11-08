import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { PlantService } from 'app/services/dto-services/plant/plant.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';

import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  workcenters: any[];
  @Input() plantId = null;
  payLoadObject =
  {
    'groupCode': null,
    'groupDescription': null,
    plantId: null,
    'stockGroupId': null,
  }

  id;

  @Input('id') set z(id) {
    this.filter();
    this.id = id;
    if (id) {
      setTimeout(()=>{
        this.initialize(this.id);
      },1000);
    }
  };

  constructor(private _industryService: PlantService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService, ) {
  }

  ngOnInit() {
    this.filter();
  }
  filter() {
    this._industryService.getAllMaterialGroup().then((result: any) => {
      
      this.loaderService.hideLoader();
      this.workcenters = result;
    })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }
  initialize(id) {
    
    if (id) {
      let editResult = this.workcenters.filter(materialGroup => materialGroup.stockGroupId === id);
      console.log("Edit",editResult);
      this.payLoadObject.groupCode = editResult[0].groupCode;
      this.payLoadObject.stockGroupId = editResult[0].stockGroupId;
      this.payLoadObject.groupDescription = editResult[0].groupDescription;

    }
  }

  save() {
    this.loaderService.showLoader();
    this.payLoadObject.plantId = this.plantId;
    this._industryService.saveMaterialGroup(this.payLoadObject)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('updated-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });

  }
  reset() {
    this.payLoadObject ={
      'groupCode': null,
      'groupDescription': null,
      plantId: null,
      'stockGroupId': null,
    }
  }

}
