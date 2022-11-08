import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from 'app/services/users/users.service';


@Component({
  selector: 'app-code-lang-drop-down',
  templateUrl: './code-lang-drop-down.component.html',
  styleUrls: ['./code-lang-drop-down.component.scss']
})
export class CodeLangDropDownComponent implements OnInit {

  langCodes: Array<any>;
  @Output() selectedLangCodeEvent = new EventEmitter();

  selectedLangCode: string;
  constructor(private _translateSvc: TranslateService, private _userSvc: UsersService) {

    const storedLang = this._userSvc.getLanguage();

    if (!(storedLang)) {
      const browserLang = this._translateSvc.getBrowserLang();
      this.selectedLangCode = browserLang.match(/en|tr|fr|mk|ru|es|sl|it|hu/) ? browserLang : 'en';
    } else {
      this.selectedLangCode = storedLang.match(/en|tr|fr|mk|ru|es|sl|it|hu/) ? storedLang : 'en';
    }

    this._translateSvc.use(this.selectedLangCode);
    this. _userSvc.setLanguage(this.selectedLangCode);
  }


  ngOnInit() {
    this.langCodes = [
      {label: 'ENGLISH', value: 'en'},
      {label: 'ESPAÑOL', value: 'es'},
      {label: 'ITALIANO', value: 'it'},
      {label: 'FRANÇAIS', value: 'fr'},
      {label: 'МАКЕДОНСКИ', value: 'mk'},
      {label: 'MAGYAR', value: 'hu'},
      {label: 'РУССКИЙ', value: 'ru'},
      {label: 'SLOVENIJA', value: 'sl'},
      {label: 'TURKCE', value: 'tr'},
    ];
  }

//setting item as local storage

  onChangeLangCode() {
    this.selectedLangCodeEvent.next(this.selectedLangCode);
    this._userSvc.setLanguage(this.selectedLangCode);
    // document.location.reload();
    this._translateSvc.use(this.selectedLangCode);
  }

}
