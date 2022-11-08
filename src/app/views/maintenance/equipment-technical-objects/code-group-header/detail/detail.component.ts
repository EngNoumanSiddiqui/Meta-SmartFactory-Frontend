/**
 * Created by reis on 31.07.2019.
 */
import {Component, Input, OnInit} from '@angular/core';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {LoaderService} from '../../../../../services/shared/loader.service';

@Component({
  selector: 'code-group-header-detail',
  templateUrl: './detail.component.html'
})
export class CodeGroupHeaderDetailComponent implements OnInit {

  showLoader = false;

  @Input('data') data: any;

  constructor(private utilities: UtilitiesService,
              private loaderService: LoaderService) {
  }

  ngOnInit() {
  }

  isLoading() {
    return this.loaderService.isLoading();
  }


}
