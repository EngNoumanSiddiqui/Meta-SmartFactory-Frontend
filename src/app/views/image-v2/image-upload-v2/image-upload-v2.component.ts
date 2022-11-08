import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MediaService } from '../../../services/media/media.service';
import { forkJoin, from, Observable } from 'rxjs';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'image-upload-v2',
  templateUrl: './image-upload-v2.component.html'
})
export class ImageUploadV2Component implements OnInit {

  @Output() imageUrlList = new EventEmitter<any>();

  uploadedFiles: any[] = [];
  
  @Input() tableType: any;
  @Input() referenceId: any;
  @Input() articleType: any;

  showUploadSpin = false;

  constructor(private _mediaSvc: MediaService, private utilities: UtilitiesService) {

  }


  ngOnInit() {
  }


  myUploader(event) {
    if(event && event.files) {
      this.showUploadSpinner();
      const $promises: Observable<any>[] = [];
      const files = event.files;
      files.forEach((file) => {
        const formData = new FormData();
        formData.append('file', file, file['name']);
        // if (this.referenceId && this.tableType) {
        //  $promises.push(from(this._mediaSvc.uploadMediasWithArticleType(formData, this.referenceId, this.tableType, this.articleType)));
        // } else {
          $promises.push(from(this._mediaSvc.uploadMedia(formData)));
        // }
      });
      forkJoin([...$promises]).subscribe((result:any) => {
        const finalRes = result.map((result: any) => this.addImage(result));
        this.imageUrlList.next(finalRes);
        this.uploadedFiles = [];
        this.hideUploadSpinner();
      });
    }
  }

  private addImage(media) {
    const med = {
        'mediaId': media.mediaId, 'path': media.path, 'description': '', 
        'extension': media.extension,
        'title': media.fileName
      }
    ;
    return med;
  }


  
  private showUploadSpinner() {
    this.showUploadSpin = true;
  }

  private hideUploadSpinner() {
    this.showUploadSpin = false;
  }

}
