import {Injectable} from '@angular/core';
import {BasePageService} from '../base/base-page.service';
import {HttpControllerService} from 'app/services/core/http-controller.service';
import {OptionService} from '../base/option-service';

@Injectable()
export class MediaService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService) {
    super();
  }

  uploadMediaWithRef(formData: FormData, referenceId, tableType) {

    return this._httpSvc.post('media/upload/' + referenceId + '/' + tableType, formData, this._opt.getFileHeader());
  }

  uploadMedia(formData: FormData) {
    return this._httpSvc.post('media/upload', formData, this._opt.getFileHeader());
  }

  listMedia(referenceId, mediaType) {
    return this._httpSvc.get('media/list/' + referenceId + '/' + mediaType, this._opt.getHeader());
  }

  updateMedias(mediaArray, referenceId, tableType) {
    return this._httpSvc.post('media/update/' + referenceId + '/' + tableType, mediaArray, this._opt.getHeader());
  }

  updateMediasWithArticleType(mediaArray, referenceId, tableType, articalType) {
    return this._httpSvc.post('media/updateMediaV2/' + referenceId + '/' + tableType + '/' + articalType, mediaArray, this._opt.getHeader());
  }

  uploadMediasWithArticleType(formData: FormData, referenceId, tableType, articalType) {
    return this._httpSvc.post('media/uploadMediaV2/' + referenceId + '/' + tableType + '/' + articalType, formData, this._opt.getHeader());
  }

  deleteMedia(mediaId) {
    return this._httpSvc.get('media/delete/' + mediaId, this._opt.getHeader());
  }

  getMedia(mediaId) {
    return this._httpSvc.get('media/' + mediaId, this._opt.getHeader());
  }

  getPdfDocument(data) {
    return this._httpSvc.post('print/getPdfDocument', data, { responseType: 'blob' });
  }

}
