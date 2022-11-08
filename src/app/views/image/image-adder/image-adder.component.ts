import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

import {MediaService} from '../../../services/media/media.service';
import {MediaDto} from '../../../dto/media/media.dto';
import {UtilitiesService} from '../../../services/utilities.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, from, Observable } from 'rxjs';

@Component({
  selector: 'image-adder',
  templateUrl: './image-adder.component.html'
})

export class ImageAdderComponent implements OnChanges {
  selectedFile: File = null;

  @Input() tableType: any;
  @Input() referenceId: any;
  @Input() isFile;
  images = [];
  isDisabled = true;
  showUploadSpin = false;
  showDeleteSpin = false;
  path: any;

  uploadedFiles: any[] = [];

  activeSlideIndex = 0;

  constructor(private _mediaSvc: MediaService,
    private http: HttpClient, private sanitizer: DomSanitizer, private utilities: UtilitiesService) {

  }
  ngOnChanges(changes: SimpleChanges) {
    if(changes.referenceId && changes.referenceId.currentValue && changes.tableType && changes.tableType.currentValue) {
      const referenceId = changes.referenceId.currentValue;
      const tableType = changes.tableType.currentValue;
      this.showUploadSpinner();
      this.initImages(referenceId, tableType);     
    }
  }

// called from another component
  initImages(referenceId, tableType) {

    this._mediaSvc.listMedia(referenceId, tableType).then(res => this.initializeImages(res));
  }

  private initializeImages(pictures) {
    if (pictures) {
      this.images = pictures;
      // this.images.forEach(itm => {
      //   if (itm.path.includes('.pdf')) {
      //     this.makeRequestForCall(itm);
      //   }
      // });
    }
    this.hideUploadSpinner();
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

  onSelectFile(event) {
    const files = event.srcElement.files;
    if (files.length > 0) {
      this.selectedFile = files[0];
      this.isDisabled = false;
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.path = e.target.result;
        if (this.selectedFile.type === 'application/pdf') {
          this.path = this.sanitizer.bypassSecurityTrustResourceUrl(this.path);
        }
        // } else{
          
        // }
      };
      if (this.selectedFile.type !== 'application/pdf') {
        reader.readAsDataURL(files[0]);
      } else {
        this.path = URL.createObjectURL(this.selectedFile);
      }
    } else {
      this.selectedFile = null;
      this.isDisabled = true;
    }

  }

//   onUpload(event) {
//     if(event && event.files) {
//       this.uploadedFiles = [...event.files];
//     }
//     // for(let file of event.files) {
//     //     this.uploadedFiles.push(file);
//     // }

//     // this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
// }

  private showUploadSpinner() {
    this.isDisabled = true;
    this.showUploadSpin = true;
  }

  private hideUploadSpinner() {
    this.isDisabled = false;
    this.showUploadSpin = false;
  }

  myUploader(event) {
    if(event && event.files) {
      this.showUploadSpinner();
      const $promises: Observable<any>[] = [];
      const files = event.files;
      files.forEach((file) => {
        const formData = new FormData();
        formData.append('file', file, file['name']);
        if (this.referenceId && this.tableType) {
         $promises.push(from(this._mediaSvc.uploadMediaWithRef(formData, this.referenceId, this.tableType)));
        } else {
          $promises.push(from(this._mediaSvc.uploadMedia(formData)));
        }
      });
      forkJoin([...$promises]).subscribe((result:[]) => {
        result.forEach((result: any) => this.addImage(result));
        this.uploadedFiles = [];
        this.hideUploadSpinner();
      }, err => {
        this.hideUploadSpinner();
        this.utilities.showErrorToast(err);
      });
    }
  }

  uploadV2(formData) {
    this.showUploadSpinner();
    if (this.referenceId && this.tableType) {
      this._mediaSvc.uploadMediaWithRef(formData, this.referenceId, this.tableType).then((mediaDto: MediaDto) => {
        this.addImage(mediaDto);
        this.uploadedFiles = [];
        this.hideUploadSpinner();
      }).catch(err => {
        this.hideUploadSpinner();
        this.utilities.showErrorToast(err);
      });
    } else {
      this._mediaSvc.uploadMedia(formData).then((mediaDto: MediaDto) => {
        this.addImage(mediaDto);
        this.uploadedFiles = [];
        this.hideUploadSpinner();
      }).catch(err => {
        this.hideUploadSpinner();
        this.utilities.showErrorToast(err);
      });
    }
  }

  upload() {
    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);
    this.showUploadSpinner();

    if (this.referenceId && this.tableType) {
      this._mediaSvc.uploadMediaWithRef(formData, this.referenceId, this.tableType).then((mediaDto: MediaDto) => {

        this.addImage(mediaDto);
        this.hideUploadSpinner();
        this.selectedFile = null;
      }).catch(err => {
        this.hideUploadSpinner();
        this.utilities.showErrorToast(err);
      });
    } else {
      this._mediaSvc.uploadMedia(formData).then((mediaDto: MediaDto) => {
        this.addImage(mediaDto);

        this.hideUploadSpinner();
        this.selectedFile = null;
      }).catch(err => {
        this.hideUploadSpinner();
        this.utilities.showErrorToast(err);
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
    this.images.push(med);
    setTimeout(() => {
      this.activeSlideIndex = this.images.length - 1;
    }, 1000);
    this.isDisabled = true;

  }


  deleteMedia() {

    const mediaIdToDelete = this.images[this.activeSlideIndex].mediaId;
    this.showDeleteSpin = true;
    this._mediaSvc.deleteMedia(mediaIdToDelete).then(res => {
        const remove = this.activeSlideIndex;

        this.images.splice(remove, 1);
        this.activeSlideIndex = this.activeSlideIndex > 0 ? this.activeSlideIndex - 1 : 0;
        this.showDeleteSpin = false;
      }
    ).catch(error => {
      this.showDeleteSpin = false;
    });

  }

  updateMedia(referenceId, tableType) {
    return this._mediaSvc.updateMedias(this.images, referenceId, tableType);
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

  cancelUpload() {
    this.selectedFile = null;
    this.path = null;
  }
}
