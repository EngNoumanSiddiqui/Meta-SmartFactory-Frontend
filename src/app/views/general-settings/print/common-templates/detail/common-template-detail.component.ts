import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

import {UtilitiesService} from 'app/services/utilities.service';
import {LoaderService} from 'app/services/shared/loader.service';
import {CmsService} from '../../../../../services/dto-services/print/cms.service';
import {AngularEditorConfig} from '@kolkov/angular-editor';
// import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'common-template-detail',
  templateUrl: './common-template-detail.component.html',
  styleUrls: ['./common-template-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CommonTemplateDetailComponent implements OnInit {
  id;

  // public EditorDocument = DecoupledEditor;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  commonTemplateDto;

  editorConfig: AngularEditorConfig = {
    editable: false,
    spellcheck: true,
    height: '297mm', // height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: '210mm', // width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: false,
    showToolbar: false,
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

  constructor(
    private cmsService: CmsService,
    private _router: Router,
    private _translateSvc: TranslateService,
    private utilities: UtilitiesService,
    private loaderService: LoaderService) {
  }

  ngOnInit() {
  }

  private initialize(id: string) {
    this.loaderService.showLoader();
    this.cmsService.detail(id)
      .then(result => {
        this.loaderService.hideLoader();
        this.commonTemplateDto = result;
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  // public onReady( editor ) {
  //   editor.ui.getEditableElement().parentElement.insertBefore(
  //     editor.ui.view.toolbar.element,
  //     editor.ui.getEditableElement()
  //   );
  // }
}
