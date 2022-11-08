import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { ProductTreeComponentFeatureService } from 'app/services/dto-services/product-tree/product-tree-component-feature.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'prod-tree-component-feature-new',
  templateUrl: './new.component.html'
})
export class NewProductTreeComponentFeatureComponent implements OnInit {


  @Output() saveAction = new EventEmitter<any>();

  @Input() productTreeDetailComponentId;

  @Input('data') set x(data) {
    if (data) {
      if (data.productTreeCriteria) {
        data.productTreeCriteriaId = data.productTreeCriteria.productTreeCriteriaId;
      }
      this.dataModel = data;
    }
  };


  dataModel = {
    productTreeDetailComponentFeatureId: null,
    criteriaMinValue: null,
    criteriaMaxValue: null,
    criteriaUnit: null,
    productTreeCriteriaId: null,
    productTreeCriteria: null,
    productTreeDetailComponentId: null

  };

  constructor(private loaderService: LoaderService,
              private _compSvc: ProductTreeComponentFeatureService,
              private utilities: UtilitiesService) {

  }

  ngOnInit() {

  }

  save() {


    if (!this.dataModel.productTreeCriteriaId) {

      this.utilities.showWarningToast('product-tree-criteria-must-be-selected');
      return;
    }

    this.loaderService.showLoader();

    // if criteria id is not null, that mean this feautre will be saved  or update standalone
    if (this.productTreeDetailComponentId) {
      this.dataModel.productTreeDetailComponentId = this.productTreeDetailComponentId;
      this._compSvc.save(this.dataModel)
        .then(result => {
          this.loaderService.hideLoader();
          this.utilities.showSuccessToast('saved-success');
          setTimeout(() => {
            this.saveAction.emit(result);
          }, environment.DELAY);
        })
        .catch(error => {
          this.loaderService.hideLoader();
          this.utilities.showErrorToast(error);
        });
    } else { // this mean feature will be saved after criteria saved
      this.saveAction.emit(this.dataModel);
      this.loaderService.hideLoader();
      this.utilities.showSuccessToast('saved-success');
    }


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
