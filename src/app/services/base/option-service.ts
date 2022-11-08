import {HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {DassTokenEnum} from '../../dto/enum/das-token-enum';
import * as moment from "moment";

@Injectable()
export class OptionService {

  options = {};
  fileOptions = {};


  constructor() {

  }

  getHeader() {
    const tokenData = JSON.parse(localStorage.getItem(DassTokenEnum.TOKEN_DATA_KEY));
    const utcOffset = moment().utcOffset() / 60;
    return this.options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .append('Authorization', tokenData['token_type'] + ' ' + tokenData['access_token'])
        .append('Accept-UTC-Time-Offset', utcOffset.toString())
    };
  }

  getTextHeader() {
    const tokenData = JSON.parse(localStorage.getItem(DassTokenEnum.TOKEN_DATA_KEY));
    const utcOffset = moment().utcOffset() / 60;
    return this.options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'text/plain; charset=utf-8')
        .append('Authorization', tokenData['token_type'] + ' ' + tokenData['access_token'])
        .append('Accept-UTC-Time-Offset', utcOffset.toString()),
      responseType: 'text'
    };
  }

  getFileHeader() {
    const tokenData = JSON.parse(localStorage.getItem(DassTokenEnum.TOKEN_DATA_KEY));
    const utcOffset = moment().utcOffset() / 60;
    return  this.fileOptions = {
      headers: new HttpHeaders()
        .set('Authorization', tokenData['token_type'] + ' ' + tokenData['access_token'])
        .append('Accept-UTC-Time-Offset', utcOffset.toString()),

    };
  }

  getBlobHeader(){
    const tokenData = JSON.parse(localStorage.getItem(DassTokenEnum.TOKEN_DATA_KEY));
    return  this.fileOptions = {
      headers: new HttpHeaders().set('Authorization', tokenData['token_type'] + ' ' + tokenData['access_token']),
      responseType: 'blob'
    };
  }
}
