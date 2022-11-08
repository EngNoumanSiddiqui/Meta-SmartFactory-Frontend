import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ProductTreeCriteriaService } from 'app/services/dto-services/product-tree/prod-tree-criteria.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'product-tree-criteria-new',
  templateUrl: './new.component.html'
})
export class NewProductTreeCriteriaComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();
  dataModel = {
    code: null,
    description: null
  };

  constructor(private _router: Router,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private mCategoryService: ProductTreeCriteriaService) {

  }

  ngOnInit() {
  }

  save() {
    this.loaderService.showLoader();
    this.mCategoryService.save(this.dataModel)
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

  reset() {

    this.dataModel = {
      code: null,
      description: null
    }
  }
}
