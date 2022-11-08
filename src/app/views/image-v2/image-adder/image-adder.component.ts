import {AfterViewInit, Component, Input} from '@angular/core';

import {MediaService} from '../../../services/media/media.service';

import {UtilitiesService} from '../../../services/utilities.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'image-adder-v2',
  templateUrl: './image-adder.component.html'
})

export class ImageAdderV2Component implements AfterViewInit{
  selectedFile: File = null;

  @Input() tableType: any;
  @Input() referenceId: any;
  
  @Input() isFile;
  isDisabled = true;
  rfqImageList = [];
  confirmImageList = [];
  showDeleteSpin = false;
  path: any;

  activerfqSlideIndex = 0;
  activeConfirmSlideIndex = 0;
  showConfirmSpin: boolean = false;

  constructor(private _mediaSvc: MediaService, private http: HttpClient, private sanitizer: DomSanitizer, private utilities: UtilitiesService) {

  }

  ngAfterViewInit() {
    if (this.referenceId && this.tableType) {
      this.initImages(this.referenceId, this.tableType);
    }
  }

  onrfqImageUrlListChanged(event:any) {
    if(event) {
      this.rfqImageList = [...this.rfqImageList, ...event];
    }
  }
  onConfirmImageUrlListChanged(event:any) {
    if(event) {
      this.confirmImageList = [...this.confirmImageList, ...event];
    }
  }

// called from another component
  initImages(referenceId, tableType) {

    this.referenceId = referenceId;
    this.tableType = tableType;
    this._mediaSvc.listMedia(referenceId, tableType).then(res => this.initializeImages(res));
  }

  initForSaleOrder(referenceId, tableType) {
    this._mediaSvc.listMedia(referenceId, tableType).then(res => this.initializeImages(res));
  }

  private initializeImages(pictures) {
    if (pictures) {
      
      this.rfqImageList = pictures.filter((picture) => !picture.mediaArticleType || (picture.mediaArticleType !== 'SALES_ORDER_DETAIL_CONFIRMED'));
      this.confirmImageList = pictures.filter((picture) => picture.mediaArticleType === 'SALES_ORDER_DETAIL_CONFIRMED');
      // this.images.forEach(itm => {
      //   if (itm.path.includes('.pdf')) {
      //     this.makeRequestForCall(itm);
      //   }
      // });
    }
  }

  makeRequestForCall(itm) {
    const httpheaders = new HttpHeaders({
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': '*',
      'responseType': 'blob'
    });
    this.http.post(itm.path, {}, { headers: httpheaders}).subscribe(
      (response: any) => {
          const blob = new Blob([response], { type: 'application/pdf'});
          const reader = new FileReader();
          reader.onload = (e: any) => {
            itm.path = e.target.result;
          };
          reader.readAsArrayBuffer(blob);
          // saveAs(blob, 'report.pdf');
      },
      e => { console.log(e); }
  );
  }

  

  deleteRFQMedia() {

    const mediaIdToDelete = this.rfqImageList[this.activerfqSlideIndex].mediaId;
    this.showDeleteSpin = true;
    this._mediaSvc.deleteMedia(mediaIdToDelete).then(res => {
        const remove = this.activerfqSlideIndex;

        this.rfqImageList.splice(remove, 1);
        this.activerfqSlideIndex = this.activerfqSlideIndex > 0 ? this.activerfqSlideIndex - 1 : 0;
        this.showDeleteSpin = false;
      }
    ).catch(error => {
      this.showDeleteSpin = false;
    });

  }
  confirmedRFQMedia() {
    const mediaIdToConfirm = this.rfqImageList[this.activerfqSlideIndex];
    if(this.referenceId) {
      this.showConfirmSpin = true;
      this._mediaSvc.updateMediasWithArticleType([{...mediaIdToConfirm}], 
        this.referenceId, 'SALES_ORDER_DETAIL', 'SALES_ORDER_DETAIL_CONFIRMED').then(res => {
          this.rfqImageList.splice(this.activerfqSlideIndex, 1);
          this.activerfqSlideIndex = this.activerfqSlideIndex > 0 ? this.activerfqSlideIndex - 1 : 0;
          this.confirmImageList.push({...mediaIdToConfirm, mediaArticleType: 'SALES_ORDER_DETAIL_CONFIRMED'})
          this.showConfirmSpin = false;
        }
      ).catch(error => {
        this.showConfirmSpin = false;
      });
    }else {
      this.rfqImageList.splice(this.activerfqSlideIndex, 1);
      this.activerfqSlideIndex = this.activerfqSlideIndex > 0 ? this.activerfqSlideIndex - 1 : 0;
      this.confirmImageList.push({...mediaIdToConfirm, mediaArticleType: 'SALES_ORDER_DETAIL_CONFIRMED'})
    }
  }
  deleteConfirmMedia() {

    const mediaIdToDelete = this.confirmImageList[this.activeConfirmSlideIndex].mediaId;
    this.showDeleteSpin = true;
    this._mediaSvc.deleteMedia(mediaIdToDelete).then(res => {
        const remove = this.activeConfirmSlideIndex;

        this.confirmImageList.splice(remove, 1);
        this.activeConfirmSlideIndex = this.activeConfirmSlideIndex > 0 ? this.activeConfirmSlideIndex - 1 : 0;
        this.showDeleteSpin = false;
      }
    ).catch(error => {
      this.showDeleteSpin = false;
    });

  }

  updateMedia(referenceId, tableType) {

    const promises = [];
    if(this.rfqImageList && this.rfqImageList.length > 0) {
      promises.push(this._mediaSvc.updateMediasWithArticleType(this.rfqImageList, referenceId, tableType, 'SALES_ORDER_DETAIL_RFQ'));
    }
    if(this.confirmImageList && this.confirmImageList.length > 0) {
      promises.push(this._mediaSvc.updateMediasWithArticleType(this.confirmImageList, referenceId, tableType, 'SALES_ORDER_DETAIL_CONFIRMED'))
    }

    return Promise.all([
      ...promises
    ]);
      // return this._mediaSvc.updateMediasWithArticleType(this.rfqImageList, referenceId, tableType, 'SALES_ORDER_DETAIL_RFQ');
      // return this._mediaSvc.updateMediasWithArticleType(this.confirmImageList, referenceId, tableType, 'SALES_ORDER_DETAIL_CONFIRMED');
    // }
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

  cancelUpload() {
    this.selectedFile = null;
    this.path = null;
  }
}
