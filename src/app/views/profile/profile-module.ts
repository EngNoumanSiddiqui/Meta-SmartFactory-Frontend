import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../shared/dass-shared.module';

import {CalendarModule} from 'primeng';
import {MediaService} from '../../services/media/media.service';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {EnumBloodGroupService} from '../../services/dto-services/enum/blood-group.service';
import {DialogModule} from 'primeng/dialog';
import {ImageModule} from '../image/image-module';
import {EmployeeService} from '../../services/dto-services/employee/employee.service';
import {EditProfileComponent} from './edit-profile/edit-profile.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {ModalModule} from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ButtonModule,
    FormsModule,
    DialogModule,
    CalendarModule,
    ImageModule,
    ModalModule.forRoot(),
  ],
  declarations: [
    EditProfileComponent,
    ChangePasswordComponent
  ],
  exports: [
    EditProfileComponent,
    ChangePasswordComponent
  ]
  ,
  providers: [
    MediaService,
    EnumBloodGroupService,
    EmployeeService
  ]
})
export class ProfileModule {
}
