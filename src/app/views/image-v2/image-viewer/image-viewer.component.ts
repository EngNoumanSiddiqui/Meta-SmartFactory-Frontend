import {Component, Input} from '@angular/core';

import {MediaService} from '../../../services/media/media.service';

@Component({
  selector: 'image-viewer-v2',
  templateUrl: './image-viewer.component.html',

})

export class ImageViewerV2Component {

  // images = [];

  rfqImageList = [];
  confirmImageList = [];

  @Input() showTitle = true;
  @Input() referenceID;
  @Input() tableType;
  @Input() showDescription = true;


  // activeSlideIndex = 0;
  activerfqSlideIndex = 0;
  activeConfirmSlideIndex = 0;
  // activeIndex = 0;
  activerfqIndex = 0;
  activeConfirmIndex = 0;
  // displayCustom = false;
  displayrfqCustom = 0;
  displayConfirmCustom = 0;

  responsiveOptions:any[] = [
    {
        breakpoint: '1024px',
        numVisible: 5
    },
    {
        breakpoint: '768px',
        numVisible: 3
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
];

  constructor(private _mediaSvc: MediaService) {

    if (this.referenceID && this.tableType) {
      this.initImages(this.referenceID, this.tableType);
    }
  }

// called from another component
  initImages(referenceId, tableType) {

    this._mediaSvc.listMedia(referenceId, tableType).then(res => this.initializeImages(res));
  }
  
  downloadFiles() {
    [...this.rfqImageList, ...this.confirmImageList].forEach((image: any) => {
      let link = document.createElement('a');
      link.setAttribute('type', 'hidden');
      link.setAttribute('href', image.path);
      link.setAttribute('download', image.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  }

  private initializeImages(pictures) {
    if (pictures) {
      this.rfqImageList = pictures.filter((picture) => !picture.mediaArticleType || (picture.mediaArticleType !== 'SALES_ORDER_DETAIL_CONFIRMED'));
      // this.rfqImageList = pictures.filter((picture) => picture.mediaArticleType === 'SALES_ORDER_DETAIL_RFQ');
      this.confirmImageList = pictures.filter((picture) => picture.mediaArticleType === 'SALES_ORDER_DETAIL_CONFIRMED');
      // this.images = pictures;
    }
  }

  resetImages() {
    // this.images = [];
    
  }


}
