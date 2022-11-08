import { Component, OnInit, Input } from '@angular/core';
import { WorkcenterService } from 'app/services/dto-services/workcenter/workcenter.service';
import { PlantService } from 'app/services/dto-services/plant/plant.service';
import { WorkstationService } from 'app/services/dto-services/workstation/workstation.service';
import { LoaderService } from 'app/services/shared/loader.service';


@Component({
  selector: 'app-initial-screen',
  templateUrl: './initial-screen.component.html',
  styleUrls: ['./initial-screen.component.scss']
})
export class InitialScreenComponent implements OnInit {
  editMode:boolean=false;
  constructor(
    private _workcenterSvc:WorkcenterService,
    private _plantSvc:PlantService,
    private loaderService: LoaderService,
    private _workstationSvc:WorkstationService){
   }
   id;
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.editMode=true;
      this.initializeList(this.id);
    }
  };
   workcenterList;
   plantList;
   workStationCategoryList;
   workStation=
  {
    workStationId:null,
    workCenterId:null,
    plantId:null,
    workCategoryId:null
   }
  filterWorkcenter = {pageNumber: 1, pageSize: 500, workCenterName: ''};
  ngOnInit() {
    this.initialize();
  }
  initialize()
  {
    //plantList
     this._plantSvc.getAllPlants().then(result => {
      console.log("PlantId",result);
      this.plantList = result;
      console.log(result);
    }).catch(error => console.log(error));
    //work-centre
    this._workcenterSvc.filter(this.filterWorkcenter).then(result => this.workcenterList = result['content']).catch(error => console.log(error));
    this._workstationSvc.getCategoryList().then(result => {
      console.log("workStationCode",result);
      this.workStationCategoryList = result;
    }).catch(error => console.log(error));
  }
  private initializeList(id){
    this.workStation.workStationId = this.id;
    this.loaderService.showLoader();
    this._workstationSvc.getDetail(id)
      .then((result:any)=>{
        this.loaderService.hideLoader();
        console.log("@resultInitial",JSON.stringify(result));
        if((result.plant.plantId))
        {
          this.workStation.plantId=result.plant.plantId;
        }
        if ((result.workCenter.workCenterId))
        {
          this.workStation.workCenterId=result.workCenter.workCenterId;
        }
        if ((result.workStationCategory.wsCatCode))
        {
          this.workStation.workCategoryId=result.workStationCategory.wsCatCode;
        }
      })
      .catch(error => {
        this.loaderService.hideLoader();
        console.log(error)
      });
  }

 onChangeWorkCentre($event)
  {
    this._workcenterSvc.sendWorkCentreID($event);
  }

 onChangePlant($event)
  {
    this._workcenterSvc.sendPlantID($event);
  }
  
 onChangeWorkCategory($event)
  {
    this._workcenterSvc.sendWorkCategoryID($event);
  }
}
