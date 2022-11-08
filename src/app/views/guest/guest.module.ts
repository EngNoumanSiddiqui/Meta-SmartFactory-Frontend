import {NgModule} from '@angular/core';

import {GuestRoutingModule} from './guest-routing.module';

import {P404Component} from './404/404.component';
import {P500Component} from './500/500.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {FormsModule} from '@angular/forms';
import {DassSharedModule} from '../../shared/dass-shared.module';
import { TooltipModule} from 'primeng';

@NgModule({
  imports: [
    FormsModule,
    GuestRoutingModule,
    DassSharedModule,
    TooltipModule
  ],
  declarations: [
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent
  ]
})
export class GuestModule { }
