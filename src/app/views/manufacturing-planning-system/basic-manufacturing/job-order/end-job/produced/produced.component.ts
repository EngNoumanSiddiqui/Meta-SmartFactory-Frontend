import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'end-job-produced',
    templateUrl: './produced.component.html',
    styles: [`
  .tw-50 td{
      width:50%;
  }
  `]
})

export class EndJobProducedComponent implements OnInit {

    jobOrder: any;

    plantSubscription: Subscription;

    @Input('jobOrder') set jO(jobOrder) {
        this.jobOrder = jobOrder;
    }

    selectedPlant = {plantId: null, plantName: null};

    formGroup: FormGroup;
    
    constructor(
        private _appStateSvc: AppStateService,
        private _formBuilder: FormBuilder
    ) {
        this.plantSubscription = this._appStateSvc.plantAnnounced$.subscribe(res => {
            if ((res)) {
                this.selectedPlant = res;
            }
        });
    }

    ngOnInit() { 
        this.buildEndJobForm();
    }

    buildEndJobForm(){
        this.formGroup = this._formBuilder.group({
            
        });
    }

    setSelectedBatch(batch){
        console.log('@batch', batch)
    }
}