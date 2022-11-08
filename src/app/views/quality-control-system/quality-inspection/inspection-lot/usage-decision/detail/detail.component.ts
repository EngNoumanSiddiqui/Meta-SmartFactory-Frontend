import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { UsageDecisionService } from 'app/services/dto-services/quality-inspection/usage-decision/usage-decision.service'
import { ImageViewerComponent } from '../../../../../image/image-viewer/image-viewer.component';
import { LoaderService } from 'app/services/shared/loader.service';

@Component({
  selector: 'detail-usage-decision',
  templateUrl: './detail.component.html',
})

export class DetailUsageDecision implements OnInit {
  @ViewChild(ImageViewerComponent) imageViewerComponent: ImageViewerComponent;
  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  usageDecision;

  @Output() selectedTab = new EventEmitter<any>();

  constructor(
    private loaderService: LoaderService,
    private _usageDecisionService: UsageDecisionService) {
  }

  private initialize(id: string) {
    this.loaderService.showLoader();
    this._usageDecisionService.detailUsageDecision(this.id).then(
      result => {
        this.usageDecision = result;
        this.loaderService.hideLoader();
      },
      error => {
        console.log(error);
      });
  }

  ngOnInit() {
  }

  handleChange(e) {
    const index = e.index;
    this.selectedTab.emit(index);
  }

}
