import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NewSkillMatrixSamplingValueComponent} from './new/new.component';
import {EditSkillMatrixSamplingValueComponent} from './edit/edit.component';
import {DetailSkillMatrixSamplingValueComponent} from './detail/detail.component';
import {ListSkillMatrixSamplingValueComponent} from './list/list.component';

const routes: Routes = [
  { path: '', data: {title: 'skill-matrix-sampling-value'},
    children: [
      {path: 'new', component: NewSkillMatrixSamplingValueComponent, data: {title: 'new-stop-cause'}},
      {path: 'edit/:id', component: EditSkillMatrixSamplingValueComponent, data: {title: 'edit-stop-cause'}},
      {path: 'detail/:id', component: DetailSkillMatrixSamplingValueComponent, data: {title: 'stop-cause-detail'}},
      {path: '', component: ListSkillMatrixSamplingValueComponent,  data: {title: 'skill-matrix-sampling-value'}}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkillMatrixSamplingValueRoutingModule {}
