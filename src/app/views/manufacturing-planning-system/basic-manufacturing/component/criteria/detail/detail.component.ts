/**
 * Created by reis on 31.07.2019.
 */
import {Component, Input, OnInit} from '@angular/core';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';

@Component({
  selector: 'product-tree-criteria-detail',
  templateUrl: './detail.component.html'
})
export class ProductTreeCriteriaDetailComponent implements OnInit {

  showLoader = false;

  @Input() data: any;

  constructor(private utilities: UtilitiesService,
              private loaderService: LoaderService) {
  }

  ngOnInit() {
  }

  isLoading() {
    return this.loaderService.isLoading();
  }


}
