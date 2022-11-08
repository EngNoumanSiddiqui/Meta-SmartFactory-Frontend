import { Component, OnInit, Input } from '@angular/core';
import { EmployeeGroupService } from 'app/services/dto-services/employee-group.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
@Component({
  selector: 'emp-shift-exception-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  empExceptionalShiftDetails;
  id;
  @Input('id') set z(id){
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };
  constructor(
    private _employeeSvc:EmployeeGroupService,       
    private utilities: UtilitiesService,
    private loaderService: LoaderService) { }

  ngOnInit() {
  }
  private initialize(id)
  {
    this.loaderService.showLoader();
    this._employeeSvc.getEmployeeExceptionalShiftDetail(id).then((result:any)=>{
      this.empExceptionalShiftDetails=result;
    this.loaderService.hideLoader();
    }).catch(error=>
    {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error)
    });
  }

}
