import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ShiftSettingsRequestDto } from "app/dto/shift/shift.dto";
import { ShiftSettingsService } from "app/services/dto-services/shift-setting/shift-setting.service";
import { LoaderService } from "app/services/shared/loader.service";
import { UtilitiesService } from "app/services/utilities.service";
import { SimulationEntity } from "../models/similation-entity.model";
import * as moment from 'moment';

@Component({
  selector: "app-simulation-add-shift",
  templateUrl: "./simulation-add-shift.component.html",
  styleUrls: ["./simulation-add-shift.component.scss"],
})
export class SimulationAddShiftComponent implements OnInit {
  @Output() callBack = new EventEmitter<any>();
  @Output() simulationEmit = new EventEmitter<any>();
  @Input() simulation: SimulationEntity;
  @Input() plant: any;

 @Input() shiftRequestDto: ShiftSettingsRequestDto = {} as any;
  constructor(
    private utilities: UtilitiesService,
    private loadingService: LoaderService,
    private shiftService: ShiftSettingsService
  ) { }

  ngOnInit(): void {
    if(this.shiftRequestDto.shiftId){
      this.shiftRequestDto = Object.assign({}, this.shiftRequestDto);
      this.shiftRequestDto.startTime = moment(this.shiftRequestDto.startTime.toString(), 'HH:mm:ss').toDate();
      this.shiftRequestDto.endTime = moment(this.shiftRequestDto.endTime.toString(), 'HH:mm:ss').toDate();
    }
  }

  async saveShiftSetting() {
    if (this.shiftRequestDto) {
      try {
        console.log(this.shiftRequestDto);
        this.shiftRequestDto.scheduleSimulationId = this.simulation.scheduleSimulationId;
        this.shiftRequestDto.plantId = this.plant.plantId;
        
        this.loadingService.showLoader();
        await this.shiftService.saveShiftSettings(this.shiftRequestDto);
        this.utilities.showSuccessToast("Save Success");
        this.buttonClicked("saved");
        this.loadingService.hideLoader();
      } catch (e) {
        this.utilities.showErrorToast("Save not success!!");
        this.loadingService.hideLoader();
      }
    }
  }

  buttonClicked(type) {
    this.callBack.emit(type);
  }
}
