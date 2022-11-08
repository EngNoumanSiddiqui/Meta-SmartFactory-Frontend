import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { InspectionMethodService } from 'app/services/dto-services/inspection-method/inspection-method.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';


@Component({
  selector: 'new-inspection-method',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewInspectionMethod implements OnInit {
  @Input() fromAutoComplete = false;
  @Input() plantId = null;
  @Output() saveAction = new EventEmitter<any>();
  
  inspectionMethod = {
    inspectionMethodId: null,
    inspectionMethodCode: null,
    inspectionMethodName: null,
    inspectionMethodStatus: 'READY',
    plantId: this.plantId,
    validFrom: null,
    description: null
  };
  statusList = [];

  constructor(
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private enumService: EnumService,
    private _inspectionMethodService: InspectionMethodService
  ) {}

  ngOnInit() {
    this.enumService.getQualityInspectionMethodStatusEnum().then((res: any ) => this.statusList = res);
  }

  setSelectedPlant(event) {
    if (event) {
      this.inspectionMethod.plantId = event.plantId;
    } else {
      this.inspectionMethod.plantId = null;
    }
  }
  
  save() {
    this.loaderService.showLoader();
    this.inspectionMethod.plantId = this.plantId;
    this._inspectionMethodService.saveInspectionMethod(this.inspectionMethod).then(
      result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      },
      error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
      }
    );

    // this._inspectionMethodService.save(this.inspectionMethod).subscribe(
    //   result => {
    //     this.loaderService.hideLoader();
    //     this.utilities.showSuccessToast('saved-success');
    //     setTimeout(() => {
    //       this.saveAction.emit('close');
    //     }, environment.DELAY);
    //   },
    //   error => {
    //     this.utilities.showErrorToast(error);
    //     this.loaderService.hideLoader();
    //   }
    // );
  }
}
