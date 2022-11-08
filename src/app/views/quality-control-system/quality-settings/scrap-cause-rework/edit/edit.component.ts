import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ScrapTypeService } from 'app/services/dto-services/scrap-type.service';
import { ScrapCauseService } from 'app/services/dto-services/scrap-services/scrap-cause.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'scrap-cause-rework-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class ScrapCauseEditComponent implements OnInit {

  id;
  scrapCauseReqDto = {
    scrapCauseId: null,
    scrapCauseName: '',
    scrapMaster: false,
    createAutoProdOrder: false,
    scrapCode: '',
    scrapDescription: '',
    scrapTypeId: null,
    plantId:null,
    scrapRawMaterial: null,
    scrapMaterial: null,
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
    let selectedPlant = JSON.parse(setPlant);
    if (selectedPlant) {
      this.selectedPlant = selectedPlant;
    }
   }

  ngOnInit() {
    this.scrapTypeSvc.filter({pageNumber: 1, pageSize: 500, typeScrap: false, plantId: this.selectedPlant.plantId}).then(result => {
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
        scrapCode: result['scrapCode'],
        scrapDescription: result['scrapDescription'],
        plantId: this.selectedPlant.plantId,
        scrapMaster: result['scrapMaster'],
        createAutoProdOrder: result['createAutoProdOrder'],
        scrapTypeId: result['scrapType'] ? result['scrapType'].scrapTypeId : null,
        scrapRawMaterial: result['scrapRawMaterial'],
        scrapMaterial: result['scrapMaterial'],
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
      scrapCode: '',
      scrapDescription: '',
      scrapTypeId: null,
      scrapMaster: false,
      createAutoProdOrder: false,
      plantId: this.scrapCauseReqDto.plantId,
      scrapRawMaterial: null,
      scrapMaterial: null,
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

}
