import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import { by } from 'protractor';
import { on } from 'cluster';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ProductTreeCriteriaService } from 'app/services/dto-services/product-tree/prod-tree-criteria.service';
import { environment } from 'environments/environment';
@Component({
  selector: 'product-tree-criteria-edit',
  templateUrl: './edit.component.html'
})
export class EditProductTreeCriteriaComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();
  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  dataModel;

  constructor(private _router: Router,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private mCategoryService: ProductTreeCriteriaService) {

  }

  ngOnInit() {
    this.initialize(this.id);
  }

  private initialize(id) {

    this.loaderService.showLoader();
    this.mCategoryService.getDetail(this.id)
      .then(result => {
        this.loaderService.hideLoader();
        if (result) {
          this.dataModel = result;
        }

      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  save() {
    this.loaderService.showLoader();
    this.mCategoryService.save(this.dataModel)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.dataModel = null;
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  cancel() {
    this.dataModel = null;
    this.saveAction.emit('close');
  }
}
