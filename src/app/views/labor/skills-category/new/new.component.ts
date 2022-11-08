import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { environment } from 'environments/environment';
import { SkillCategoryService } from 'app/services/dto-services/employee/skill-category.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
@Component({
  selector: 'skill-category-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class SkillCategoryNewComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  skillcategDto = {
    skillMatrixCategoryCode: null,
    groupType: null,
    plantId: null,
    skillMatrixCategoryDescription: null
  };
  @Input("plantId") set setPlantID(plantId) {
    if(plantId) {
      this.skillcategDto.plantId = plantId;
    }
  }
  groupTypeList: any;
  constructor(
    private skillCategorySrv: SkillCategoryService,
    private utilities: UtilitiesService,
    private loaderService: LoaderService,
    private enumService: EnumService,
  ) {}  

  ngOnInit() {
    this.enumService.getSkillMatrixGroupTypeEnum().then(res =>  this.groupTypeList = res).catch(err => console.error(err));
   }

  reset() {
    this.skillcategDto = {
      skillMatrixCategoryCode: null,
      groupType: null,
      plantId : this.skillcategDto.plantId,
      skillMatrixCategoryDescription: null
    };
  }

  save() {
    this.loaderService.showLoader();
    this.skillCategorySrv.save(this.skillcategDto)
      .then((groupMember: any) => {
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
