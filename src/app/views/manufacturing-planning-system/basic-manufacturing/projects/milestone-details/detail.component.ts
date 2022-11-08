import { Component, OnInit, Input } from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ProjectService } from 'app/services/dto-services/project/project.service';
import { MilestoneDto } from 'app/dto/projectdto/project.dto';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';

@Component({
    selector: 'milestone-details',
    templateUrl: 'detail.component.html'
})

export class MileStoneDetailsComponent implements OnInit {

  milestoneItemdto: any = new MilestoneDto();
  
  @Input('id') set xw(id) {
    if (id) {
      this.loaderService.showLoader();
      this.projectService.getMilestoneDetail(id).then(result => {
        this.setData(result);
        this.loaderService.hideLoader();
      }).catch(err => {
        this.utilities.showErrorToast(err);
        this.loaderService.hideLoader();
      })
    }
  }
    
      constructor(
        private loaderService: LoaderService,
        private utilities: UtilitiesService,
    private projectService: ProjectService,
        ) {
      }
    
      ngOnInit() {
      }

      openProdOrderList(id) {
        this.loaderService.showDetailDialog(DialogTypeEnum.PRODUCTIONORDERLIST, id);
      }
    
      setData(result) {
        this.milestoneItemdto= {...result};
      }

      modalProdOrderShow(prodId) {
        this.loaderService.showDetailDialog(DialogTypeEnum.PRODUCTIONORDER, prodId);
      }
      modalProjectShow(prodId) {
        if(prodId) {
          this.loaderService.showDetailDialog(DialogTypeEnum.PROJECT, prodId);
        }
      }
      modalWorkCenter(workcenterId) {
        this.loaderService.showDetailDialog(DialogTypeEnum.WORKCENTER, workcenterId);
      }
      modalWarehouserShow(prodId) {
        this.loaderService.showDetailDialog(DialogTypeEnum.WAREHOUSE, prodId);
      }
      modalMAterialShow(prodId) {
        this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, prodId);
      }
      
      showJobDetail(jobOrderId) {
        this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDER, jobOrderId);
      }
    
      showStockDetail(stockId) {
        this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, stockId);
      }
    
}
