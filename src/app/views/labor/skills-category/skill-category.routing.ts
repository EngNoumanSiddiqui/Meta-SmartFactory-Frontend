import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SkillCategoryListComponent } from './list/list.component';

const routes: Routes = [
  {path: '', data: {title: 'skill-matrix-category'},
  children:
  [
    { path: '', component: SkillCategoryListComponent, data: { title: 'skill-matrix-category'} },
  ]
}];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SkillCategoryRoutingModule { }
