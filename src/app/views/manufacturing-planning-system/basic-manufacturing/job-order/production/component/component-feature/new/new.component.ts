import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';

@Component({
  selector: 'job-order-component-feature-new',
  templateUrl: './new.component.html'
})
export class NewJobOrderComponentFeatureComponent implements OnInit {


  @Output() saveAction = new EventEmitter<any>();

  @Input() jobOrderStockId;

  @Input('data') set x(data) {
    if (data) {
      if (data.productTreeCriteria) {
        data.productTreeCriteriaId = data.productTreeCriteria.productTreeCriteriaId;
      }
      this.dataModel = data;
    }
  };


  dataModel = {
    jobOrderComponentFeatureId: null,
    criteriaMinValue: null,
    criteriaMaxValue: null,
    criteriaUnit: null,
    productTreeCriteriaId: null,
    productTreeCriteria: null,
    jobOrderStockId: null

  };

  constructor(private loaderService: LoaderService,
              private utilities: UtilitiesService) {

  }

  ngOnInit() {

  }

  save() {


    this.loaderService.showLoader();


      this.saveAction.emit(this.dataModel);
      this.loaderService.hideLoader();
      this.utilities.showSuccessToast('saved-success');



  }


  setSelectedCriteria(criteria) {
    this.dataModel.productTreeCriteria = criteria;
    if (criteria) {
      this.dataModel.productTreeCriteriaId = criteria.productTreeCriteriaId;
    } else {
      this.dataModel.productTreeCriteriaId = null;
    }

  }


}
