import { Component, OnInit, Input } from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ProjectService } from 'app/services/dto-services/project/project.service';
import { MilestoneDto, ProjectRequestObject } from 'app/dto/projectdto/project.dto';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';

@Component({
    selector: 'project-details',
    templateUrl: 'detail.component.html'
})

export class ProjectDetailsComponent implements OnInit {
  projectDto: any = new ProjectRequestObject();

  milestoneItemdto: MilestoneDto = new MilestoneDto();
  @Input('id') set xw(id) {
    if (id) {
      this.loaderService.showLoader();
      this.projectService.getDetail(id).then(result => {
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
        this.projectDto = {... result};
        this.projectDto['responsibleEmployeeId'] = this.projectDto['responsibleEmployee']?.employeeId;
        // delete this.projectDto['responsibleEmployee'];
    
        this.projectDto.startDate = this.projectDto.startDate ? new Date(this.projectDto.startDate) : null;
        this.projectDto.finishDate = this.projectDto.finishDate ? new Date(this.projectDto.finishDate) : null;
        this.projectDto.milestoneDtoList =  [];
        this.projectDto.milestoneDtoList = result.milestoneList.map(ml => {
          ml.projectId = ml.project?.projectId;
          ml.responsibleEmployeeId = ml.responsibleEmployee?.employeeId;
          // ml.startDate = ml.startDate ? new Date(ml.startDate) : null;
          // ml.finishDate = ml.finishDate ? new Date(ml.finishDate) : null;
          return ml;
        });
      }


      modalWorkCenter(workcenterId) {
        this.loaderService.showDetailDialog(DialogTypeEnum.WORKCENTER, workcenterId);
      }
    
}
