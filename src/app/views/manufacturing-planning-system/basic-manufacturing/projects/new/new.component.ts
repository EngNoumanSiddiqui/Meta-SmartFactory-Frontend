import { UsersService } from 'app/services/users/users.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'environments/environment';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { MilestoneDto, ProjectRequestObject } from 'app/dto/projectdto/project.dto';
import { ProjectService } from 'app/services/dto-services/project/project.service';

@Component({
  selector: 'project-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class ProjectNewComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();

  projectDto: ProjectRequestObject = new ProjectRequestObject();

  milestoneItemdto: MilestoneDto = new MilestoneDto();
  params = {
    dialog: { title: '', inputValue: '', visible: false }
  };
  selectedDetailIndex = -1;
  selectedPlant: any;

  statusList = ['PLANNED', 'PROCESSING', 'COMPLETED', 'CANCELLED'];

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
    private _confirmationSvc: ConfirmationService,
    private userSvc: UsersService,
    private _translateSvc: TranslateService,
    private _enumSvc: EnumService) {
    this.selectedPlant = JSON.parse(this.userSvc.getPlant());
  }

  ngOnInit() {
    this.projectDto.status = 'PLANNED';
    this.projectDto.plantId = this.selectedPlant?.plantId;
  }
  onOrderStatusChanged(event) {
    if (event) {
      this.projectDto.milestoneDtoList.forEach(itm => {
        itm.status = this.projectDto.status;
      });
    }
  }

  setData(result) {
    this.projectDto = {... result};
    this.projectDto['responsibleEmployeeId'] = this.projectDto['responsibleEmployee']?.employeeId;
    delete this.projectDto['responsibleEmployee'];
    delete this.projectDto['plant'];

    this.projectDto.plantId = this.selectedPlant?.plantId;
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

  
  save() {
    this.loaderService.showLoader();
    this.projectService.save(this.projectDto)
      .then(result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  reset() {
    const newProjDto = new ProjectRequestObject();
    newProjDto.projectId = this.projectDto.projectId;
    newProjDto.plantId = this.projectDto.plantId;
    this.projectDto = Object.assign({}, newProjDto);
  }

  openPurchaseQuotationDetailsModal(index) {
    this.params.dialog.title = 'milestone-details';
    this.params.dialog.visible = true;
    this.selectedDetailIndex = index;
    if (this.selectedDetailIndex < 0) {
      // new
      this.resetNewItemDetails();
      
    } else {
      // edit
      this.milestoneItemdto = Object.assign({}, this.projectDto.milestoneDtoList[index]);
      this.milestoneItemdto.startDate = this.milestoneItemdto.startDate ? new Date(this.milestoneItemdto.startDate) : null;
      this.milestoneItemdto.finishDate = this.milestoneItemdto.finishDate ? new Date(this.milestoneItemdto.finishDate) : null;

      this.milestoneItemdto.scheduledStartDate = this.milestoneItemdto.scheduledStartDate ? new Date(this.milestoneItemdto.scheduledStartDate) : null;
      this.milestoneItemdto.scheduledFinishDate = this.milestoneItemdto.scheduledFinishDate ? new Date(this.milestoneItemdto.scheduledFinishDate) : null;
      
      this.milestoneItemdto.actualStartDate = this.milestoneItemdto.actualStartDate ? new Date(this.milestoneItemdto.actualStartDate) : null;
      this.milestoneItemdto.actualFinishDate = this.milestoneItemdto.actualFinishDate ? new Date(this.milestoneItemdto.actualFinishDate) : null;
     
    }
  }

  

  addDetails() {
    // const cloneOfNewOrderDetailListItem = Object.assign({}, this.newRequestOrderDetailCreateDto);
    if (this.selectedDetailIndex < 0) {
      // add
      this.projectDto.milestoneDtoList.push(this.milestoneItemdto);
    } else {
      // update
      this.projectDto.milestoneDtoList[this.selectedDetailIndex] = {...this.milestoneItemdto};
    }
    this.params.dialog.visible = false;
  }

  resetNewItemDetails() {
    this.milestoneItemdto = new MilestoneDto();
    this.milestoneItemdto.status = this.projectDto.status;
    this.milestoneItemdto.responsibleEmployeeId = this.projectDto.responsibleEmployeeId;
  }

  deletePurchaseQuotationDetailsModal(index) {
    const detailItem = this.projectDto.milestoneDtoList[index];
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {

        if(detailItem.milestoneId) {
          this.loaderService.showLoader();
          this.projectService.deleteMilestone(detailItem.milestoneId).then(res => {
            this.projectDto.milestoneDtoList.splice(index, 1);    
            this.utilities.showSuccessToast('deleted');
            this.loaderService.hideLoader();
          }, err => {
            this.utilities.showErrorToast(err);
            this.loaderService.hideLoader();
          })
        } else {
          this.projectDto.milestoneDtoList.splice(index, 1);
        }
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }
}
