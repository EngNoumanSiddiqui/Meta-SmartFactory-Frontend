import { Component, OnInit, Input } from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ProjectService } from 'app/services/dto-services/project/project.service';
import { ProjectTaskDto } from 'app/dto/projectdto/project.dto';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';

@Component({
    selector: 'project-task-details',
    templateUrl: 'detail.component.html'
})

export class ProjectTaskDetailsComponent implements OnInit {

  projectTaskItemdto = new ProjectTaskDto();
  
  @Input('id') set xw(id) {
    if (id) {
      this.loaderService.showLoader();
      this.projectService.getProjectTaskDetail(id).then(result => {
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
        this.projectTaskItemdto= {...result};
        if(result.project) {
          this.projectTaskItemdto.projectId = result.project.projectId;
          this.projectTaskItemdto.projectNo = result.project.code;
        }
      }

      modalMilestoneShow(prodId) {
        this.loaderService.showDetailDialog(DialogTypeEnum.MILESTONE, prodId);
      }
      modalProjectShow(prodId) {
        if(prodId) {
          this.loaderService.showDetailDialog(DialogTypeEnum.PROJECT, prodId);
        }
      }
      modalWorkCenter(workcenterId) {
        this.loaderService.showDetailDialog(DialogTypeEnum.WORKCENTER, workcenterId);
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
