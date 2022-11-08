import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
@Component({
  selector: 'job-order-workstation-program-new',
  templateUrl: './new.component.html'
})
export class NewJobOrderWorkstationProgramComponent implements OnInit {


  @Output() saveAction = new EventEmitter<any>();


  @Input('data') set x(data) {
    if (data) {
      this.dataModel = data;
    }
  };


  dataModel = {
    jobOrderWorkstationProgramId: null,
    workstationProgramId: null,
    workstationProgramDescription: null,
    workstationProgram: null,
    description: null,
    operationOrder: null,
  };

  constructor(private loaderService: LoaderService,
              private utilities: UtilitiesService) {

  }

  ngOnInit() {

  }

  save() {

    if (!this.dataModel.workstationProgramId) {

      this.utilities.showWarningToast('workstation-program-must-be-selected');
      return;
    }

    this.loaderService.showLoader();


      this.saveAction.emit(this.dataModel);
      this.loaderService.hideLoader();
      this.utilities.showSuccessToast('saved-success');


  }


  setSelectedWorkstationProgram(criteria) {
    this.dataModel.workstationProgram = criteria;
    if (criteria) {
      this.dataModel.workstationProgramId = criteria.workstationProgramId;
      this.dataModel.workstationProgramDescription = criteria.description;
    } else {
      this.dataModel.workstationProgramId = null;
      this.dataModel.workstationProgramDescription = null;
    }

  }


}
