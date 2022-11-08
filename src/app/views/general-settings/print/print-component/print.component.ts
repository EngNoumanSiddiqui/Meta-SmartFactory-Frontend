import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import {PrintService} from '../../../../services/dto-services/print/print.service';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import {CmsLogService} from '../../../../services/dto-services/print/cms-log.service';
import { ConvertUtil } from 'app/util/convert-util';
// import domToPdf from 'dom-to-pdf';
@Component({
  selector: 'print-component',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class PrintComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;

  @Input() requestPrintDto;
  @Input() editMode = true;

  @Input('active') set modalActive(active) {
    if (active) {
      // if (this.editMode) {
      //   // this.getPrintHtmlDocumentThenEdit();
      // } else {
        // this.getPrintHtmlDocumentThenPrint();
        this.commonModal.active = true;
      // }
    }
  }

  @Input('pdf_preview') set setpdf(pdf_preview) {
    if (pdf_preview) {
      this.getPdfDocumentPreview(pdf_preview);
    }
  }

  @Output() activeEvent = new EventEmitter();

  responsePrintDto;
  modal = {active: false};
  commonModal = {active: false};

  requestCreateCMSLogDto = {
    'commonTempleteLogId': null,
    'fullText': null,
    'referenceId': null,
    'cmsId': null
  }

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      {class: 'arial', name: 'Arial'},
      {class: 'times-new-roman', name: 'Times New Roman'},
      {class: 'calibri', name: 'Calibri'},
      {class: 'comic-sans-ms', name: 'Comic Sans MS'}
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    sanitize: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };

  constructor(private printService: PrintService,
              private cmsLogService: CmsLogService,
              private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private loaderService: LoaderService,
              private utilities: UtilitiesService) {
  }

  ngOnInit() {
  }


  onSelectTemplate(event) {
    this.requestPrintDto.templateId = event.templeteId;
    if(ConvertUtil.isDST(new Date())){ 
      this.requestPrintDto.offset = new Date().getTimezoneOffset() + 60;
    } else {
      this.requestPrintDto.offset = new Date().getTimezoneOffset();
    }
    this.commonModal.active = false;
    if (this.editMode) {
      this.getPrintHtmlDocumentThenEdit();
    } else {
      this.getPrintHtmlDocumentThenPrint();
    }
    // this.getPrintHtmlDocumentThenPrint();
  }
  getPrintHtmlDocumentThenEdit() {
    this.loaderService.showLoader();
    this.printService.getHtmlDocument(this.requestPrintDto)
      .then(result => {
        this.loaderService.hideLoader();
        this.responsePrintDto = result;
        this.modal.active = true;

      }).catch(error => {
        this.activeEvent.next(false);
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
    });
  }

  getPdfDocumentPreview(pdfHtml) {
    this.printService.getPDFDocument(pdfHtml).toPromise().then((data: any) => {
      window.location.assign(data);
    });
  }

  printPreview() {
    let printContents, popupWin;
    popupWin = window.open('blank', '_blank', 'scrollbars=yes,resizeable=yes,fullscreen=yes');
    printContents = this.responsePrintDto.printText;
    popupWin.document.open();
    popupWin.document.write(`
      <html>
          <head>
              <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
              <style>
              //........Customized style.......
              @media print {
                pre {
                    border: 0px;
                }
            }
              </style>

              <script type="text/javascript">
                window.moveTo(0,0);
                window.resizeTo(screen.width,screen.height);
              </script>
          </head>
          <body class="col-md-12" onload="window.print(); window.close()">
              ${printContents}
          </body>
      </html>
    `);
    popupWin.onafterprint = (evt) => this.afterPrint(evt);
    // popupWin.document.close();
  }


  pdfExport() {
    let printContents, popupWin;
    popupWin = window.open('blank', '_blank', 'scrollbars=yes,resizeable=yes,fullscreen=yes');
    popupWin.focus();
    printContents = this.responsePrintDto.printText;
    popupWin.document.open();
    popupWin.document.write(`
      <html>
          <head>
              <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
              <style>
                  @media print {
                    pre {
                        border: 0px;
                    }
                }
              </style>
          </head>
          <body class="col-md-12" id="myprintbody">
              ${printContents}
          </body>
      </html>
    `);

    popupWin.moveTo(0,0);
    popupWin.resizeTo(screen.width,screen.height);
     setTimeout(() => {
      popupWin.print();
     }, 700);
    // setTimeout(() => {
    //   const content = popupWin.document.getElementById('myprintbody');
    //   var options = {
    //     filename: 'file.pdf'
    //   };
    //   domToPdf(content, options, function() {
    //     // console.log('done');
    //     popupWin.document.close();
    //   });
    // }, 400);
    
  }

  getPrintHtmlDocumentThenPrint() {
    this.loaderService.showLoader();
    // const stylesHtml = this.getTagsHtml('style');
    // const linksHtml = this.getTagsHtml('link');
    // const metaHtml = this.getTagsHtml('meta');
    // const scriptHtml = this.getTagsHtml('script');
    // ${linksHtml}
    // ${stylesHtml}
    let printContents, popupWin;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');

    this.printService.getHtmlDocument(this.requestPrintDto)
      .then(result => {
        this.loaderService.hideLoader();
        this.responsePrintDto = result;
        printContents = this.responsePrintDto.printText;
        popupWin.document.open();
        popupWin.document.write(`
          <html>
              <head>
                  <title>Print tab</title>
                  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
                  <style>
                  //........Customized style.......
                  @media print {
                    pre {
                        border: 0px;
                    }
                  }
                  </style>
              </head>
              <body onload="window.print(); window.close()">
                  ${printContents}
              </body>
          </html>
        `);
        
        popupWin.onafterprint = (evt) => this.afterPrint(evt);
        popupWin.document.close();
        this.activeEvent.next(false);
      }).catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
        this.activeEvent.next(false);
    });
  }

  getTagsHtml(tagName: keyof HTMLElementTagNameMap) {
    const htmlStr: string[] = [];
    const elements = document.getElementsByTagName(tagName);
    for (let idx = 0; idx < elements.length; idx++) {
      htmlStr.push(elements[idx].outerHTML);
    }

    return htmlStr.join('\r\n');
  }

  afterPrint(event) {
    console.log('Functionality to run after printing');
    // this.saveLog();
  };

  saveLog() {
    this.loaderService.showLoader();

    this.requestCreateCMSLogDto.fullText = this.responsePrintDto.printText;
    this.requestCreateCMSLogDto.referenceId = this.responsePrintDto.itemId;
    this.requestCreateCMSLogDto.cmsId = this.responsePrintDto.templateId;
    // console.log('@beforeSave', this.commonTemplateDto);
    this.cmsLogService.save(this.requestCreateCMSLogDto)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }
}
