
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BookType } from 'xlsx/types';
import { saveAs } from 'file-saver';
import { Clipboard } from '@angular/cdk/clipboard';
import { JsonPipe } from '@angular/common';
import 'assets/js/jspdf-autotable.js';


// type BookType = 'xlsx' | 'xlsm' | 'xlsb' | 'xls' | 'xla' | 'biff8' | 'biff5' | 'biff2' | 'xlml' | 'ods' | 'fods' | 'csv' | 'txt' | 'sylk' | 'html' | 'dif' | 'rtf' | 'prn' | 'eth';
@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  // Observable string sources
  private plantAnnouncedSource = new BehaviorSubject<any>(null);
  private plantConfirmedSource = new BehaviorSubject<any>(null);
  public $plantchanged = new BehaviorSubject<any>(null);
  private organizationSubject = new BehaviorSubject<any>(null);
  // Observable string streams
  plantAnnounced$ = this.plantAnnouncedSource.asObservable();
  plantConfirmed$ = this.plantConfirmedSource.asObservable();
  organizationAnnounced$ = this.organizationSubject.asObservable();

  plantListSubscription$ = new BehaviorSubject<any>(null);

  withPanelSubject = new BehaviorSubject<boolean>(false);

  constructor( private clipBoard: Clipboard ) { }

  // Service message commands
  announceMission(plant: any) {
    this.plantAnnouncedSource.next(plant);
  }
  announceOrganization(organization: any) {
    this.organizationSubject.next(organization);
  }

  confirmMission(plant: any) {
    this.plantConfirmedSource.next(plant);
  }

  exportPdf(exportColumns, data, fileName="exportFile") {
    import("jspdf").then(jsPDF => {
        // import("jspdf-autotable").then(x => {
            const doc = new jsPDF.default(0,0);
            doc.autoTable(exportColumns, data);
            doc.save(fileName+'.pdf');
        // });
    })
}
  exportAsFile(data, type:BookType="csv", fileName="exportFile") {
    import("xlsx").then(xlsx => {

        const worksheet =  xlsx.utils.json_to_sheet(data);
        const header = Object.keys(data[0]); // columns name
        let wscols = [];
        for (var i = 0; i < header.length; i++) {  // columns length added
          wscols.push({ wch: header[i].length+10, width: header[i].length+10, wpx: header[i].length+10})
        }
        worksheet["!cols"] = wscols;
        // worksheet["!cols"] = [{ width: 150, wch: 150 }, { wch: 150 }, { wch: 200 },
        //   { wch: 250 }, { wch: 150 }, { wch: 100 }, { wch: 100 }, { wch: 200 }, { wch: 200 } ]; ;
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

        const excelBuffer: any = xlsx.write(workbook, { bookType: type, type: 'array' });
        // XLSX.writeFile(wb, "SheetJS.xlsb", {compression:true});
        this.saveAsExcelFile(excelBuffer, fileName, type);
    });
  }

  saveTextAsFile( text: Object | string, fileName: string ): void {

    const data = typeof text === 'object' ? new JsonPipe().transform( text ) : text;
    const blob = new Blob([data], {
      type: 'text/plain;charset=utf-8'
    });

    saveAs(blob, fileName);
  }

  copyToClipBoard( text: Object | string  ): void {
    const data = typeof text === 'object' ? new JsonPipe().transform( text ) : text;
    this.clipBoard.copy( data );
  }


  saveAsExcelFile(buffer: any, fileName: string, type: BookType): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.'+type;
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}
