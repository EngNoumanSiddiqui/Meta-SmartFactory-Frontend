import {Component, OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

import {UtilitiesService} from 'app/services/utilities.service';
import {LoaderService} from 'app/services/shared/loader.service';
import {CmsTypeService} from '../../../../../services/dto-services/print/cms-type.service';

@Component({
  selector: 'common-template-type-detail',
  templateUrl: './common-template-type-detail.component.html',
  styleUrls: ['./common-template-type-detail.component.scss']
})
export class CommonTemplateTypeDetailComponent implements OnInit {
  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  templateTypeDto;

  constructor(
    private cmsTypeService: CmsTypeService,
    private _router: Router,
    private _translateSvc: TranslateService,
    private utilities: UtilitiesService,
    private loaderService: LoaderService) {
  }

  ngOnInit() {
  }

  private initialize(id: string) {
    this.loaderService.showLoader();
    this.cmsTypeService.detail(id)
      .then(result => {
        this.loaderService.hideLoader();
        this.templateTypeDto = result;
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }
}
