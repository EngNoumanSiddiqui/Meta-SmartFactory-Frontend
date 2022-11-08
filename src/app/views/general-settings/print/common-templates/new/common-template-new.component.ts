import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {UtilitiesService} from 'app/services/utilities.service';
import {LoaderService} from 'app/services/shared/loader.service';
import {environment} from '../../../../../../environments/environment';
import {CmsService} from '../../../../../services/dto-services/print/cms.service';
import {CmsTypeService} from '../../../../../services/dto-services/print/cms-type.service';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import {UsersService} from '../../../../../services/users/users.service';
import {EnumService} from '../../../../../services/dto-services/enum/enum.service';
import {RequestPrintDto} from '../../../../../dto/print/print.model';
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
// import {ChangeEvent} from '@ckeditor/ckeditor5-angular';

@Component({
  selector: 'common-template-new',
  templateUrl: './common-template-new.component.html',
  styleUrls: ['./common-template-new.component.scss']
})
export class CommonTemplateNewComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  commonTemplateTypeList: any[];

  // public EditorClassic = ClassicEditor;
  // public EditorDocument = DecoupledEditor;

  commonTemplateDto = {
    'templeteTitle': null,
    'templeteText': null,
    'templetePrintSize': null,
    'langCode': null,
    'commonTemplateType': null,
    'actId': null,
    'emailBody': null,
    defaultTemplate: false,
    plantId: null
  }

  langCodes = [
    {label: 'ENGLISH', value: 'EN'},
    {label: 'SLOVENIJA', value: 'SLO'},
    {label: 'МАКЕДОНСКИ', value: 'MK'},
    {label: 'TURKCE', value: 'TR'},
    {label: 'MAGYAR', value: 'HU'}
  ];;

  requestPrintDto: RequestPrintDto = new RequestPrintDto();
  // requestPrintDto = {
  //   templateId: null,
  //   templateText: null,
  //   templateTypeId: null,
  //   itemId: null,
  //   plantId: null
  // };
  printComponent = {active: false};

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '297mm', // height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: '210mm', // width: 'auto',
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

  editorConfigEmailBody: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '40mm', // height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: '210mm', // width: 'auto',
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
      {
        name: 'angularWrapperImg',
        class: 'angularWrapperImg',
        tag: 'img',
      }
    ],
    uploadUrl: '',
    sanitize: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };

  selectedPlant: any;

  constructor(
    private cmsService: CmsService,
    private cmsTypeService: CmsTypeService,
    private utilities: UtilitiesService,
    private loaderService: LoaderService,
    private _userSvc: UsersService,
    private enumService: EnumService
  ) {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.requestPrintDto.plantId = this.selectedPlant.plantId;
      this.commonTemplateDto.plantId = this.selectedPlant.plantId;
    }
  }

  ngOnInit() {
    this.enumService.getCommonTemplateTypeEnum().then(result => {
      this.commonTemplateTypeList = result;
    }).catch(error => {
      console.error(error);
    });
  }

  // public onReady( editor ) {
  //   editor.ui.getEditableElement().parentElement.insertBefore(
  //     editor.ui.view.toolbar.element,
  //     editor.ui.getEditableElement()
  //   );
  //
  //   editor.plugins.get( 'FileRepository' ).createUploadAdapter = loader => new Adapter( loader );
  // }
  //
  // public onChange( { editor }: ChangeEvent ) {
  //   const data = editor.getData();
  //   // this.commonTemplateDto.templeteText = data;
  //   console.log( data );
  // }

  setSelectedCustomer(act) {
    if (act) {
      this.commonTemplateDto.actId = act.actId;
    } else {
      this.commonTemplateDto.actId = null;
    }
  }

  save() {
    this.loaderService.showLoader();
    // console.log('@beforeSave', this.commonTemplateDto);
    this.cmsService.save(this.commonTemplateDto)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          // this.reset();
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  reset() {
    this.commonTemplateDto = {
      'templeteTitle': null,
      'templeteText': null,
      'templetePrintSize': null,
      'langCode': null,
      'commonTemplateType': null,
      'actId': null,
      'emailBody': null,
      defaultTemplate: false,
      plantId: this.selectedPlant?.plantId
    }
  }

  getPrintHtmlDocument() {
    this.requestPrintDto.templateText = this.commonTemplateDto.templeteText;
    // this.requestPrintDto.templateTypeId = this.commonTemplateDto.cmsTypeId;
    this.requestPrintDto.templateTypeCode = this.commonTemplateDto.commonTemplateType;
    this.requestPrintDto.itemId = -1;
    this.printComponent.active = true;
  }
}
