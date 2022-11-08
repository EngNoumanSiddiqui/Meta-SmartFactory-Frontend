import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { RequestPrintDto } from 'app/dto/print/print.model';
// import { AuthMicrosoftService } from 'app/services/auth/auth-microsoft.service';
import { ActService } from 'app/services/dto-services/act/act.service';
import { EmployeeService } from 'app/services/dto-services/employee/employee.service';
import { PrintService } from 'app/services/dto-services/print/print.service';
import { MediaService } from 'app/services/media/media.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { LoaderService } from 'app/services/shared/loader.service';
import { UsersService } from 'app/services/users/users.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ConvertUtil } from 'app/util/convert-util';

@Component({
  selector: 'app-send-mail',
  templateUrl: './send-mail.component.html',
  styleUrls: ['./send-mail.component.scss']
})
export class SendMailComponent implements OnInit {
  @ViewChild("fileAttach") fileAttach: ElementRef<HTMLInputElement>;
  loader: boolean = false;
  selectedPlant: any;

  @Output() onHide = new EventEmitter<any>();

  addDocModal= {active:false};
  modal= {active:false};
  sendModal= {active:false};


  editorViewConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '120mm', // 
    // height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
     width: 'auto', //width: '106mm',
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

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    // height: '40mm', // 
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
     width: 'auto', //width: '106mm',
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

  // get authenticated(): boolean {
  //   return this.authMicrosoft.authenticated;
  // }
  // // The user
  // get user(): any | undefined {
  //   return this.authMicrosoft.user;
  // }
  mail = {
    from: null,
    to: null,
    subject: null,
    ccList: null,
    bccList:null,
    body: null,
    attachment: null,
    base64file: null,
  }

  fileUrl = null;

  pdfDto = {
    itemId: null,
    plantId: null,
    templateId: null,
    templateText: null,
    templateTypeCode: null,
  }
  

  requestPrintDto: RequestPrintDto = new RequestPrintDto();


  commonModal = {active: false};

  selectedTemplatePrintText = '';

  @Input('data') set setData(data) {
    if(data) {
      // this.mail.subject = data.referenceId;
      
      // this.mail.body = data.emailTemplate;
      this.pdfDto.itemId = data.itemId;
      this.pdfDto.templateTypeCode = data.templateTypeCode;
      this.mail.subject= data.subject;
      if(data.actId) {
        this.getActData(data.actId);
      }
      this.commonModal.active = true;
      this.requestPrintDto.templateTypeCode = data.templateTypeCode;
      this.requestPrintDto.itemId = this.pdfDto.itemId;

      // if(this.pdfDto.itemId && this.pdfDto.templateTypeCode) {
      //   this.getPDFDocument();
      // }
    }
  }
  constructor(
    private _userSvc: UsersService,
    private utilsService: UtilitiesService,
    private _empSvc: EmployeeService,
    private loaderService: LoaderService,
    private _actSvc: ActService, 
    private printService: PrintService,
    private mediaService: MediaService) {
      this.selectedPlant = JSON.parse(this._userSvc.getPlant());
      this.pdfDto.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;
      this.requestPrintDto.plantId = this.pdfDto.plantId;
     }

  ngOnInit() {
    this.loader = true;
    // this.authMicrosoft.checkGetUser().then((result: any) => {
    //   this.mail.from = result?.email;
    //   this.loader = false;

    // }).catch(error => {
    //   console.log(error);
    //   this.loader = false;
    // });
    this._empSvc.getProfileDetail()
    .then(result => {
      if ((result['email'])) {
        this.mail.from = result['email'];
        this.mail.ccList = result['ccList'];
        this.mail.bccList = result['bccList'];
      }
    }).catch(error => console.log(error));
  }

  onSelectTemplate(event) {
    // this.pdfDto.templateId = event.templeteId;
    this.requestPrintDto.templateId = event.templeteId;
    if(ConvertUtil.isDST(new Date())){ 
      this.requestPrintDto.offset = new Date().getTimezoneOffset() + 60;
    } else {
      this.requestPrintDto.offset = new Date().getTimezoneOffset();
    }

    this.getPrintHtmlDocumentThenEdit();
    this.mail.body= event.emailBody;
    this.commonModal.active = false;
    // this.modal.active = true;
    
  }

  selectTemplate() {
    this.pdfDto.templateText = this.selectedTemplatePrintText;
    this.modal.active = false;
    this.sendModal.active = true;
    this.getPDFDocument();
  }

  getPrintHtmlDocumentThenEdit() {
    this.loaderService.showLoader();
    this.printService.getHtmlDocument(this.requestPrintDto)
      .then(result => {
        this.loaderService.hideLoader();
        this.selectedTemplatePrintText = result['printText'];
        this.modal.active = true;

      }).catch(error => {
        // this.activeEvent.next(false);
        this.loaderService.hideLoader();
        // this.utilities.showErrorToast(error)
    });
  }


  getActData(actId) {
    this._actSvc.getDetail(actId).then(result => {
      this.mail.to = result['email'];
      // this.mail.body = result['emailTemplate']
      // this.mail.ccList = result['ccList'];
      // this.mail.bccList = result['bccList'];
      this.loader = false;
    }).catch(error => {
      this.loader = false;
      console.log(error);
    });
  }

  // async signIn() {
  //   await this.authMicrosoft.signIn();
  // }

 getBase64(file) {
    return new Promise(function(resolve, reject) {
        var reader = new FileReader();
        reader.onload = function() { resolve(reader.result); };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
  }
  getPDFDocument() {
    this.loader = true;
    this.mediaService.getPdfDocument(this.pdfDto).then(async (result: Blob) => {
      const file = new File([result], this.pdfDto.templateTypeCode + (this.mail.subject? ("_"+this.mail.subject): "") + '.pdf', { type: 'application/pdf' });
        this.mail.attachment = file;
        this.fileUrl = window.URL.createObjectURL(file);

        let base64file =<any> await this.getBase64(file);
        this.mail.base64file = base64file.split(',')[1];
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        this.fileAttach.nativeElement.files = dataTransfer.files;
        this.loader = false;

        // let downloadLink = document.createElement('a');
        // downloadLink.href = window.URL.createObjectURL(file);
        // if (this.pdfDto.templateTypeCode + '.pdf')
        //     downloadLink.setAttribute('download', this.pdfDto.templateTypeCode + '.pdf');
        // document.body.appendChild(downloadLink);
        // downloadLink.click();
        // setTimeout(() => {
        //   document.body.removeChild(downloadLink);
        // }, 100);
    }).catch(error => {
      console.log(error);
      this.loader = false;
      this.utilsService.showErrorToast('file loaded faild');
    });
  }

  closeModal() {
    this.onHide.emit(true);
    this.loaderService.hideDetailDialog(DialogTypeEnum.MAIL);
  }

  sendMail() {
    this.loader = true;
    const data = {
      "body": this.mail.body,
      "from": this.mail.from,
      "subject": this.mail.subject,
      "to": this.mail.to,
      "ccList": this.mail.ccList,
      "bccList": this.mail.bccList,
      // fileToUploadList: [this.mail.attachment]
    }
    const formData = new FormData();
    // formData.append('email', JSON.stringify(data));
    formData.append('fileToUpload', this.mail.attachment, this.mail.attachment.name);
    // const reqDto = {
    //   "email": data,
    //   "fileToUploadList": formData
    // }
    this._actSvc.sendMailCCBCCWithAttachmentV2(data, formData).then(result => {
      this.loader = false;
      this.utilsService.showSuccessToast('Mail sent successfully');
      this.loaderService.hideDetailDialog(DialogTypeEnum.MAIL);
    }).catch(error => {
      this.loader = false;
      console.log(error);
      this.utilsService.showErrorToast('Mail sent failed');
    });

    // this.authMicrosoft.sendMail(this.mail).then(result => {
    //   this.loader = false;
    //   this.utilsService.showSuccessToast('Mail sent successfully');
    //   this.loaderService.hideDetailDialog(DialogTypeEnum.MAIL);
    // }).catch(error => {
    //   console.log(error);
    //   this.utilsService.showErrorToast('Mail sending failed');
    //   this.loader = false;
    // })
  }

  // On file Select
  onChange(event) {
    if(event) {
      this.mail.attachment = event.target?.files[0] || null;
      this.fileUrl = window.URL.createObjectURL(this.mail.attachment);
    }
  }

}
