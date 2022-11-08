import { IndustryService } from './../../../../services/dto-services/industry.service';
import { WorkCenter } from './../../../../dto/equipment-task/equipment-task.model';
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
  payLoadObject =
    {
      'industryCode': null,
      'industryId': null,
      'industryName': null,
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
    this._industryService.getAllIndustry().then((result: any) => {
      
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
      let editResult = this.workcenters.filter(industry => industry.industryId === id);
      
      this.payLoadObject.industryCode = editResult[0].industryCode;
      this.payLoadObject.industryId = editResult[0].industryId;
      this.payLoadObject.industryName = editResult[0].industryName;

    }
  }

  save() {
    this.loaderService.showLoader();
    this._industryService.saveIndustry(this.payLoadObject)
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
    this.payLoadObject =
      {
        'industryCode': null,
        'industryId': null,
        'industryName': null,
      }

  }

}
