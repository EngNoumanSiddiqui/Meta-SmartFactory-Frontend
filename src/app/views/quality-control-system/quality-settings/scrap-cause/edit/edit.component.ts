import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ScrapTypeService } from 'app/services/dto-services/scrap-type.service';
import { ScrapCauseService } from 'app/services/dto-services/scrap-services/scrap-cause.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'scrap-cause-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class ScrapCauseEditComponent implements OnInit {

  id;
  scrapCauseReqDto = {
    scrapCauseId: null,
    createAutoProdOrder: false,
    setup: false,
    scrapCauseName: '',
    scrapCode: '',
    scrapDescription: '',
    scrapTypeId: null,
    scrapMaster: false,
    scrapRawMaterial: null,
    scrapMaterial: null,
    plantId:null
  }
  scrapTypeList = [];
  @Output() saveAction = new EventEmitter<any>();

  @Input('id') set idt(id) {
    this.id = id;
    if (this.id) {
      this.initialize(this.id);
    }
  }
  selectedPlant: any;

  constructor(
    private scrapTypeSvc: ScrapTypeService,
    private scrapCauseService: ScrapCauseService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _userSvc: UsersService
  ) {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
  }

  ngOnInit() {
    this.scrapTypeSvc.filter({pageNumber: 1, pageSize: 500, typeScrap: true,plantId:this.selectedPlant.plantId}).then(result => {
        this.scrapTypeList = result['content'];
      }).catch(error => {
        console.error(error);
      });
  }

  private initialize(id) {
    this.loaderService.showLoader();
    this.scrapCauseService.getUpdateDetail(this.id).then(result => {
      // console.log('#onEdit', result);
      this.scrapCauseReqDto = {
        scrapCauseId: result['scrapCauseId'],
        scrapCauseName: result['scrapCauseName'],
        createAutoProdOrder: result['createAutoProdOrder'],
        setup: result['setup'],
        scrapMaster: result['scrapMaster'],
        scrapCode: result['scrapCode'],
        scrapDescription: result['scrapDescription'],
        scrapTypeId: result['scrapType'] ? result['scrapType'].scrapTypeId : null,
        scrapRawMaterial: result['scrapRawMaterial'],
        scrapMaterial: result['scrapMaterial'],
        plantId: this.selectedPlant.plantId
      }
      this.loaderService.hideLoader();
    }).catch(error => {
      this.loaderService.hideLoader();
      console.log(error)
    });
  }
  reset() {
    this.scrapCauseReqDto = {
      scrapCauseId: null,
      scrapCauseName: '',
      createAutoProdOrder: false,
      setup: false,
      scrapMaster: false,
      scrapCode: '',
      scrapDescription: '',
      scrapTypeId: null,
      scrapRawMaterial: null,
      scrapMaterial: null,
      plantId: null
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
