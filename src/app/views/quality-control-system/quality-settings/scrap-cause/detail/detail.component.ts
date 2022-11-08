import { Component, OnInit, Input } from '@angular/core';
import { ScrapCauseService } from 'app/services/dto-services/scrap-services/scrap-cause.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { LoaderService } from 'app/services/shared/loader.service';

@Component({
  selector: 'scrap-cause-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class ScrapCauseDetailComponent implements OnInit {

  id;
  scrapCauseReqDto = {
    scrapCauseId: null,
    createAutoProdOrder: false,
    setup: false,
    scrapCauseName: '',
    scrapCode: '',
    scrapDescription: '',
    scrapMaster: false,
    scrapType: null,
    scrapRawMaterial: null,
    scrapMaterial: null
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
        createAutoProdOrder: result['createAutoProdOrder'],
        setup: result['setup'],
        scrapMaster: result['scrapMaster'],
        scrapCode: result['scrapCode'],
        scrapDescription: result['scrapDescription'],
        scrapType: result['scrapType'],
        scrapRawMaterial: result['scrapRawMaterial'],
        scrapMaterial: result['scrapMaterial']
      }
      this.loaderService.hideLoader();
    }).catch(error => {
      this.loaderService.hideLoader();
      console.log(error)
    });
  }

  showDetailDialog(id){
    if(id) this.loaderService.showDetailDialog(DialogTypeEnum.SCRAPTYPE, id);
  }

}
