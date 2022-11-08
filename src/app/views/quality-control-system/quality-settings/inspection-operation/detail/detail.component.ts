import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { InspectionOperationsService } from 'app/services/dto-services/inspection-operations/inspection-operations.service'
import { LoaderService } from 'app/services/shared/loader.service';
@Component({ 
  selector: 'detail-inspection-operation',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailInspectionOperation implements OnInit {

  id;
  showTable1 = true;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  inspectionOperation;  

  @Output() selectedTab = new EventEmitter<any>();

  constructor(
    private loaderService: LoaderService,
    private _inspectionOperationsService: InspectionOperationsService) {
  }

  private initialize(id: string) {
    this.loaderService.showLoader();
    this._inspectionOperationsService.detailInspectionOperation(this.id).then(
      result => {
        this.inspectionOperation = result;
        this.loaderService.hideLoader();
      },
      error => {
        console.log(error);
      });
  }

  ngOnInit() {
  }

  handleChange(e) {
    const index = e.index;
    this.selectedTab.emit(index);
  }

}
