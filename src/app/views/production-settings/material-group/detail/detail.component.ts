import { Component, OnInit, Input } from '@angular/core';
import { PlantService } from 'app/services/dto-services/plant/plant.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  workcenters: any[];
  detailResult:any[];
  id;

  @Input('id') set z(id) {
    this.filter();
    this.id = id;
    if (id) {
      setTimeout(()=>{
        this.initialize(this.id);
      },1000);
    }
  };

  constructor(private _industryService: PlantService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService, ) {
  }

  ngOnInit() {
    this.filter();
  }
  filter() {
    this._industryService.getAllMaterialGroup().then((result: any) => {
      //console.log("@industry", result);
      this.loaderService.hideLoader();
      this.workcenters = result;
    })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }
  initialize(id) {
    
    if (id) {
       this.detailResult = this.workcenters.filter(materialGroup => materialGroup.stockGroupId === id);
      
       console.log("demo", this.detailResult);
    
    }
  }
  

}
