import { Component, OnInit, Input } from '@angular/core';
import { SkillCategoryService } from 'app/services/dto-services/employee/skill-category.service';

@Component({
  selector: 'skill-category-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class SkillCategoryDetailComponent implements OnInit {
  id;
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
    skillMatrixCategoryDescription: null
  };
  constructor(
    private skillCategorySrv: SkillCategoryService
  ) {}  

  ngOnInit() { }

  reset() {
    this.skillcategDto = {
      skillMatrixCategoryId: this.id,
      skillMatrixCategoryCode: null,
      groupType: null,
      skillMatrixCategoryDescription: null
    };
  }
  initialize(id) {
    this.skillcategDto.skillMatrixCategoryId = this.id;
    this.skillCategorySrv.getDetail(id).then((result: any) => {
      this.skillcategDto = {
        skillMatrixCategoryId: result.skillMatrixCategoryId,
        skillMatrixCategoryCode: result.skillMatrixCategoryCode,
        groupType: result.groupType,
        skillMatrixCategoryDescription: result.skillMatrixCategoryDescription
      };
    });
  }
}
