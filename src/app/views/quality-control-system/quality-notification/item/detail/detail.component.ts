import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import {ItemService} from 'app/services/dto-services/quality-notification/item/item.service'

import { ImageViewerComponent } from '../../../../image/image-viewer/image-viewer.component';
import { LoaderService } from '../../../../../services/shared/loader.service';

@Component({
  selector: 'detail-item',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailItem implements OnInit {

    @ViewChild(ImageViewerComponent) imageViewerComponent: ImageViewerComponent;
    id;
    showTable1 = true;
  
    @Input('id') set z(id) {
      this.id = id;
      if (id) {
        // this.initialize(this.id);
      }
    };
  
    item;
  
    @Output() selectedTab = new EventEmitter<any>();
  
    constructor(
      private loaderService: LoaderService,
      private _itemService: ItemService) {
    }
  
    // private initialize(id: string) {
    //   this.loaderService.showLoader();
    //   this._itemService.getUpdateDetail(this.id).subscribe(
    //     result => {
    //       this.item = result;
    //       this.loaderService.hideLoader();
    //     },
    //     error => {
    //       console.log(error);
    //     });
    // }
  
    ngOnInit() {
    }
  
    handleChange(e) {
      const index = e.index;
      this.selectedTab.emit(index);
    }

}
