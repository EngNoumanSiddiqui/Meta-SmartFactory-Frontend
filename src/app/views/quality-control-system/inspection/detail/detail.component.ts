import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InspectionService } from 'app/services/dto-services/inspection-charateristics/inspection.service';
import { ControlIndicatorService } from 'app/services/dto-services/inspection-charateristics/control-indicator/controlIndicator.service';
import { ImageViewerComponent } from '../../../image/image-viewer/image-viewer.component';
import { LoaderService } from '../../../../services/shared/loader.service';

@Component({
  selector: 'detail-inspection',
  templateUrl: './detail.component.html',
})

export class DetailInspectionComponent implements OnInit {
  @ViewChild(ImageViewerComponent) imageViewerComponent: ImageViewerComponent;
  id;
  showTable1 = true;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      console.log('id: ', id);
      this.initialize(this.id);
    }
  };

  inspChar;

  @Output() selectedTab = new EventEmitter<any>();

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _inspSvc: InspectionService,
    private loaderService: LoaderService,
    private _controlIndicatorService: ControlIndicatorService) {
  }

  private initialize(id: string) {
    this.loaderService.showLoader();
    this._inspSvc.detailInspCharacteristic(id).then(
      result => {
        this.inspChar = result;
        this.loaderService.hideLoader();
      }).catch(error => {
        console.log("error: ", error)
        this.loaderService.hideLoader();
      });
      
    // this._inspSvc.getUpdateDetail(this.id).subscribe(
    //   result => {
    //     this.inspChar = result;
    //     this.loaderService.hideLoader();
    //   },
    //   error => {
    //     console.log(error);
    //   });
  }

  ngOnInit() {
    this.getControlIndicators();
  }

  handleChange(e) {
    const index = e.index;
    this.selectedTab.emit(index);
  }

  // control indicator work with dummy data
  selectedColumns = [
    { field: 'controlIndicatorId', header: 'Characteristic Control Indicator Id' },
    { field: 'controlIndicatorCode', header: 'Characteristic Control Indicator Code' },
    { field: 'controlIndicatorType', header: 'Indicator Type' },
    { field: 'controlIndicatorSample', header: 'Indicator Sample' },
    { field: 'controlIndicatorResult', header: 'Indicator Result' },
    { field: 'defectRecording', header: 'Defect recording' }
  ];
  cols = [
    { field: 'controlIndicatorId', header: 'Characteristic Control Indicator Id' },
    { field: 'controlIndicatorCode', header: 'Characteristic Control Indicator Code' },
    { field: 'controlIndicatorType', header: 'Indicator Type' },
    { field: 'controlIndicatorSample', header: 'Indicator Sample' },
    { field: 'controlIndicatorResult', header: 'Indicator Result' },
    { field: 'defectRecording', header: 'Defect recording' }
  ];

  controlIndicators = [];
  getControlIndicators() {
    this.controlIndicators = [];
    this.loaderService.showLoader();
    this._controlIndicatorService.getAll().subscribe(
      result => {
        this.loaderService.hideLoader();
        this.controlIndicators = result['content'];
      },
      error => {
        this.loaderService.hideLoader();
        this.controlIndicators = [];
      }
    );
  }
// display work
  displayControlIndicatorModal = {
    modal: null,
    data: null,
    id: null
  };
  modal = { active: false };

  modalShow(id, mod: string) {
    this.displayControlIndicatorModal.id = id;
    this.displayControlIndicatorModal.modal = mod;
    this.modal.active = true;
  }

  modalClone(mod: string, data) {
    this.displayControlIndicatorModal.modal = mod;
    this.displayControlIndicatorModal.data = data[0].stockId;
    this.modal.active = true;
  }

}
