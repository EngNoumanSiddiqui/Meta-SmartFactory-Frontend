import {Component, Input, OnInit} from '@angular/core';
import { OrganizationService } from 'app/services/dto-services/organization/organization.service';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'organization-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {


  @Input() data
  selectedPlant: any;

  @Input('id') set xw(organizationId) {
    if (organizationId) {
      this.organizationService.getByPlant(this.selectedPlant?.plantId).then((organizations:any )=> {
        if(organizations){
          let organization = organizations.filter((element)=> element.organizationId == organizationId );
          if(organization){
            this.data = organizationId[0];
          }
        }
      });
    }
  }

  constructor(private organizationService: OrganizationService, private _userSvc: UsersService) {
    this.selectedPlant = JSON.parse(this._userSvc.getPlant());
  }

  ngOnInit() {

  }

}
