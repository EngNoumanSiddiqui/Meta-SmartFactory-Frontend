import {Injectable} from '@angular/core';
import {BasePageService} from '../../base/base-page.service';
import {HttpControllerService} from '../../core/http-controller.service';
import {OptionService} from '../../base/option-service';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})

export class PrintService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService) {
    super();
  }

  getHtmlDocument(data) {
    return this._httpSvc.post('print/getHtmlDocument', data, this._opt.getHeader());
  }
  getPDFDocument(data) {
    return this._httpSvc.getObservable('print/getPdfDocument/?html=' + data).pipe(map(
    (res) => {
        return new Blob([res.blob()], { type: 'application/pdf' });
    }));
    // return this._httpSvc.post('print/getPdfDocument/?html=' + data, this._opt.getHeader());
  }

  async getDocumentANDDownload(data, fileName) {

    try {
      const htmContent = await this._httpSvc.post('print/getHtmlDocument', data, this._opt.getHeader());
      const printPage = `
      <html>
          <head>
              <title>Print tab</title>
              <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
              <style>
              //........Customized style.......
              </style>
          </head>
          <body>
              ${htmContent['printText']}
          </body>
      </html>
    `

    // let doc = new jsPDF();
    // doc.addHTML(printPage, function() {
    //    doc.save(fileName + ".pdf");
    // });


    } catch (error) {
      console.log(error);
    }
    
  }

}
