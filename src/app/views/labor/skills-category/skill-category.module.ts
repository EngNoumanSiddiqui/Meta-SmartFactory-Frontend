import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule, ListboxModule, PickListModule, ColorPickerModule, AutoCompleteModule } from 'primeng';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { ImageModule } from 'app/views/image/image-module';
import { FormsModule } from '@angular/forms';
import { TreeModule } from 'primeng/tree';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {ModalModule} from 'ngx-bootstrap/modal';
import { DropdownModule } from 'primeng/dropdown';
import { SkillCategoryRoutingModule } from './skill-category.routing';
import { SkillCategoryNewComponent } from './new/new.component';
import { SkillCategoryEditComponent } from './edit/edit.component';
import { SkillCategoryDetailComponent } from './detail/detail.component';
import { SkillCategoryListComponent } from './list/list.component';
import { SkillCategoryService } from 'app/services/dto-services/employee/skill-category.service';
@NgModule({
  declarations: [SkillCategoryNewComponent, SkillCategoryEditComponent, SkillCategoryDetailComponent, SkillCategoryListComponent],
  imports: [
    CommonModule,
    ConfirmDialogModule,
    DassSharedModule,
    ImageModule,
    FormsModule,
    TreeModule,
    ListboxModule,
    ModalModule.forRoot(),
    PickListModule,
    TooltipModule,
    ColorPickerModule,
    AutoCompleteModule,
    SkillCategoryRoutingModule,
    DropdownModule
  ],
  providers: [SkillCategoryService]
})
export class SkillCategoryModule { }
