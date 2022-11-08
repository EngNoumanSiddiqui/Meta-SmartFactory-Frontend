import { Component, OnInit, Input } from '@angular/core';
import { ScrapService } from 'app/services/dto-services/scrap.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';

@Component({
  selector: 'rework-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class ScrapDetailComponent implements OnInit {

  id;
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };
  scrap;
  constructor(
    private scrapService: ScrapService,
    private utilities: UtilitiesService,
    private loaderService: LoaderService
  ) { }

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

  showPlantDetailModal(plant) {
    if (plant) this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, plant.plantId);
  }

  showJobOrderDetailModal(jobOrder) {
    if (jobOrder) this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDER, jobOrder.jobOrderId);
  }
  showJobOrderOperationDetailModal(jobOrderOperation) {
    if (jobOrderOperation) this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDEROPERATION, jobOrderOperation.jobOrderOperationId);
  }

  showWorkstationDetailModal(workStation) {
    if (workStation) this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, workStation.workStationId);
  }

  showMaterialDetailModal(material) {
    if (material) this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, material.stockId);
  }

  showBatchDetailModal(batch) {
    if (batch) this.loaderService.showDetailDialog(DialogTypeEnum.BATCH, batch);
  }

  showWarehouseDetailModal(warehouse) {
    if (warehouse) this.loaderService.showDetailDialog(DialogTypeEnum.WAREHOUSE, warehouse.wareHouseId);
  }

  showOperatorDetailModal(opeartor) {
    if (opeartor) this.loaderService.showDetailDialog(DialogTypeEnum.STAFF, opeartor.employeeId);
  }
  showShiftDetailDialog(shiftId){
    if(shiftId) this.loaderService.showDetailDialog(DialogTypeEnum.SHIFTSETTING, shiftId);
  }
}
