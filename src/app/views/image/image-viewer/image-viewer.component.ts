import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

import {MediaService} from '../../../services/media/media.service';

@Component({
  selector: 'image-viewer',
  templateUrl: './image-viewer.component.html',

})

export class ImageViewerComponent implements OnChanges {

  images = [];
  @Input() showTitle = true;
  @Input() referenceID;
  @Input() tableType;
  @Input() showDescription = true;
  activeSlideIndex = 0;
  showUploadSpin = false;
  activeIndex = 0;
  displayCustom = false;
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

    // if (this.referenceID && this.tableType) {
    //   this.initImages(this.referenceID, this.tableType);
    // }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.referenceID && changes.referenceID.currentValue && changes.tableType && changes.tableType.currentValue) {
      const referenceID = changes.referenceID.currentValue;
      const tableType = changes.tableType.currentValue;
      this.initImages(referenceID, tableType);     
    }
  }

// called from another component
  initImages(referenceId, tableType) {
    this.showUploadSpin = true;
    this._mediaSvc.listMedia(referenceId, tableType).then(res => this.initializeImages(res))
    .catch(err => this.showUploadSpin=false);
  }
  
  downloadFiles() {
    this.images.forEach((image: any) => {
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
    this.showUploadSpin = false;
    if (pictures) {
      this.images = pictures;
    }
  }

  resetImages() {
    this.images = [];
  }


}
