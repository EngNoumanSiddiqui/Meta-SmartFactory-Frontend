import { Component, OnInit, Input } from '@angular/core';
import { ScrapTypeService } from 'app/services/dto-services/scrap-type.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';

@Component({
  selector: 'scrap-type-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  id;
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };
  part;
  constructor(
    private scrapTypeService:ScrapTypeService,
     private _router: Router,
     private _translateSvc: TranslateService,
    private utilities: UtilitiesService,
    private loaderService: LoaderService) { }
  ngOnInit() {
  }

  private initialize(id: string) {
    this.loaderService.showLoader();
    this.scrapTypeService.getUpdateDetail(id)
      .then(result => {
        this.loaderService.hideLoader();
        this.part = result;
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }
}
