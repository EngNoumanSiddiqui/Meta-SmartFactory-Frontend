import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { environment } from 'environments/environment';
import { SkillCategoryService } from 'app/services/dto-services/employee/skill-category.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';

@Component({
  selector: 'skill-category-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class SkillCategoryEditComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  id;
  groupTypeList: any;
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  skillcategDto = {
    skillMatrixCategoryId: null,
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
  constructor(
    private skillCategorySrv: SkillCategoryService,
    private utilities: UtilitiesService,
    private enumService: EnumService,
    private loaderService: LoaderService,
  ) {}  

  ngOnInit() {
    this.enumService.getSkillMatrixGroupTypeEnum().then(res =>  this.groupTypeList = res).catch(err => console.error(err));
   }

  reset() {
    this.skillcategDto = {
      skillMatrixCategoryId: this.id,
      skillMatrixCategoryCode: null,
      plantId: this.skillcategDto.plantId,
      groupType: null,
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

  initialize(id) {
    this.skillcategDto.skillMatrixCategoryId = this.id;
    this.skillCategorySrv.getDetail(id).then((result: any) => {
      this.skillcategDto = {
        skillMatrixCategoryId: result.skillMatrixCategoryId,
        skillMatrixCategoryCode: result.skillMatrixCategoryCode,
        groupType: result.groupType,
        plantId: this.skillcategDto.plantId,
        skillMatrixCategoryDescription: result.skillMatrixCategoryDescription
      };
    });
  }
}
