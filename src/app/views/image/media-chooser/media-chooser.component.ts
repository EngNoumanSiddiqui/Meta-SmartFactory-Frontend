import {Component, EventEmitter, Input, Output} from '@angular/core';

import {MediaService} from '../../../services/media/media.service';
import {MediaDto} from '../../../dto/media/media.dto';
import {UtilitiesService} from '../../../services/utilities.service';

@Component({
  selector: 'media-chooser',
  templateUrl: './media-chooser.component.html',

})

export class MediaChooserComponent {
  selectedFile: File;
  @Output() mediaIdEvent = new EventEmitter();
  @Input() accept: string;
  @Input() referenceId: any;
  @Input() tableType: any;
  @Input() picture: any;
  isDisabled = true;
  showSpin = false;
  path: any;

  constructor(private mediaService: MediaService, private  utilities: UtilitiesService) {

  }


  onSelectFile(event) {
    const files = event.srcElement.files;

    if (files.length > 0) {
      this.selectedFile = files[0];
      this.isDisabled = false;
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.path = e.target.result;
      };

      reader.readAsDataURL(files[0]);
    } else {
      this.selectedFile = null;
      this.isDisabled = true;
    }

  }

  showSpinner() {
    this.isDisabled = true;
    this.showSpin = true;
  }

  hideSpinner() {
    this.isDisabled = false;
    this.showSpin = false;
  }

  upload() {
    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);
    this.showSpinner();

    if (this.referenceId && this.tableType) {
      this.mediaService.uploadMediaWithRef(formData, this.referenceId, this.tableType).then((mediaDto: MediaDto) => {
        this.sendEvent(mediaDto);
        this.hideSpinner();
        this.selectedFile = null;
      }).catch(err => {
        this.hideSpinner();
        this.utilities.showErrorToast(err);
      });
    } else {
      this.mediaService.uploadMedia(formData).then((mediaDto: MediaDto) => {
        this.sendEvent(mediaDto);
        this.hideSpinner();
        this.selectedFile = null;
      }).catch(err => {
        this.hideSpinner();
        this.utilities.showErrorToast(err);
      });
    }

  }

  sendEvent(media: MediaDto) {
    const med = {
        'mediaId': media.mediaId, 'path': media.path, 'description': '', 'title': this.selectedFile.name
      }
    ;
    this.mediaIdEvent.next(med);
    this.isDisabled = true;
  }


}
