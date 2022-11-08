import { Component, OnInit, Input } from '@angular/core';
import { ScrapCauseService } from 'app/services/dto-services/scrap-services/scrap-cause.service';
import { LoaderService } from 'app/services/shared/loader.service';

@Component({
  selector: 'scrap-cause-rework-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class ScrapCauseDetailReworkComponent implements OnInit {

  id;
  scrapCauseReqDto = {
    scrapCauseId: null,
    scrapCauseName: '',
    scrapCode: '',
    scrapMaster: false,
    scrapDescription: '',
    createAutoProdOrder: false,
    scrapType: null
  }

  @Input('id') set idt(id) {
    this.id = id;
    if (this.id) {
      this.initialize(this.id);
    }
  }
  constructor(
    private scrapCauseService: ScrapCauseService,
    private loaderService: LoaderService,
  ) { }

  ngOnInit() {
  }

  private initialize(id) {
    this.loaderService.showLoader();
    this.scrapCauseService.getUpdateDetail(this.id).then(result => {
      console.log('#onDetail', result);
      this.scrapCauseReqDto = {
        scrapCauseId: result['scrapCauseId'],
        scrapCauseName: result['scrapCauseName'],
        scrapCode: result['scrapCode'],
        scrapMaster: result['scrapMaster'],
        scrapDescription: result['scrapDescription'],
        createAutoProdOrder: result['createAutoProdOrder'],
        scrapType: result['scrapType']
      }
      this.loaderService.hideLoader();
    }).catch(error => {
      this.loaderService.hideLoader();
      console.log(error)
    });
  }

}
