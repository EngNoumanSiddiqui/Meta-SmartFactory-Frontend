import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ScrapTypeService } from 'app/services/dto-services/scrap-type.service';
import { ScrapCauseService } from 'app/services/dto-services/scrap-services/scrap-cause.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'scrap-cause-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class ScrapCauseNewComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();
  scrapTypeList: any[];

pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    query: null,
    orderByProperty: null,
    orderByDirection: 'desc'
  };


  scrapCauseReqDto = {
      scrapCauseId: null,
      scrapCauseName: '',
      scrapCode: '',
      createAutoProdOrder: false,
      setup: false,
      scrapDescription: '',
      scrapTypeId: null,
      scrapMaster: false,
      scrapRawMaterial: null,
      scrapMaterial: null,
      plantId: null
  }


  constructor(
    private scrapTypeSvc: ScrapTypeService,
    private scrapCauseService: ScrapCauseService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _userSvc: UsersService
  ) {
    const setPlant = this._userSvc.getPlant();
    let selectedPlant = JSON.parse(setPlant);
    if (selectedPlant) {
      this.scrapCauseReqDto.plantId = selectedPlant.plantId;
    }
  }



  ngOnInit() {
    this.scrapTypeSvc.filter({pageNumber: 1, pageSize: 500, typeScrap: true, plantId:this.scrapCauseReqDto.plantId}).then(result => {
        this.scrapTypeList = result['content'];
      }).catch(error => {
        console.error(error);
      });
  }

  reset() {
    this.scrapCauseReqDto = {
      scrapCauseId: null,
      scrapCauseName: '',
      createAutoProdOrder: false,
      setup: false,
      scrapCode: '',
      scrapMaster: false,
      scrapDescription: '',
      scrapTypeId: null,
      scrapRawMaterial: null,
      scrapMaterial: null,
      plantId: this.scrapCauseReqDto.plantId
    }
  }
  save() {
    this.loaderService.showLoader();
    console.log('@beforeSave', this.scrapCauseReqDto);
    this.scrapCauseService.save(this.scrapCauseReqDto).then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.reset();
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  onChangeScrapCauseFor(event, cause){
    // if(cause == 'input' && event) {
    //   this.scrapCauseReqDto.scrapRawMaterial =  event;
    //   this.scrapCauseReqDto.scrapMaterial =  !event;
    // }else if(cause == 'output' && event) {
    //   this.scrapCauseReqDto.scrapMaterial =  event;
    //   this.scrapCauseReqDto.scrapRawMaterial =  !event;

    // }
  }
}
