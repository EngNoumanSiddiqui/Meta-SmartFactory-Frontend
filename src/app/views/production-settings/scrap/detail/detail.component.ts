import { Component, OnInit, Input } from '@angular/core';
import { ScrapService } from 'app/services/dto-services/scrap.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { CommonTemplateTypeEnum, RequestPrintDto } from 'app/dto/print/print.model';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'scrap-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class ScrapDetailComponent implements OnInit {

  id;
  selectedPlant: any;
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };
  scrap;


  requestPrintDto: RequestPrintDto = new RequestPrintDto();
  printComponent = {active: false};

  constructor(
    private scrapService: ScrapService,
    private utilities: UtilitiesService,
    private userService: UsersService,
    private loaderService: LoaderService
  ) { 
    const plant = JSON.parse(this.userService.getPlant());
      if (plant) {
        this.selectedPlant = plant;
      }
  }

  ngOnInit() {
  }
  private initialize(id: string) {
    this.loaderService.showLoader();
    this.scrapService.getUpdateDetail(id)
      .then(result => {
        this.loaderService.hideLoader();
        this.scrap = result;
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }


  getPrintHtmlDocument() {
    // this.requestPrintDto.templateId = 5;
    this.requestPrintDto.templateTypeCode = CommonTemplateTypeEnum.SCRAP;
    this.requestPrintDto.plantId = this.selectedPlant?.plantId;
    this.requestPrintDto.itemId = this.id;
    this.printComponent.active = true;
  }

  showPlantDetailModal(plant){
    if(plant) this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, plant.plantId);
  }

  showJobOrderDetailModal(jobOrder){
    if(jobOrder) this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDER, jobOrder.jobOrderId);
  }
  showJobOrderOperationDetailModal(id){
    if(id) this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDEROPERATION, id);
  }

  showWorkstationDetailModal(workStation){
    if(workStation) this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, workStation.workStationId);
  }

  showMaterialDetailModal(material){
    if(material) this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, material.stockId);
  }

  showBatchDetailModal(batch){
    if(batch) this.loaderService.showDetailDialog(DialogTypeEnum.BATCH, batch);
  }

  showWarehouseDetailModal(warehouse){
    if(warehouse) this.loaderService.showDetailDialog(DialogTypeEnum.WAREHOUSE, warehouse.wareHouseId);
  }

  showOperatorDetailModal(opeartor){
    if(opeartor) this.loaderService.showDetailDialog(DialogTypeEnum.STAFF, opeartor.employeeId);
  }

  showShiftDetailDialog(shiftId){
    if(shiftId) this.loaderService.showDetailDialog(DialogTypeEnum.SHIFTSETTING, shiftId);
  }

  showScrapCauseDetailModal(id){
    if(id) this.loaderService.showDetailDialog(DialogTypeEnum.SCRAPCAUSE, id);
    
  }
}
