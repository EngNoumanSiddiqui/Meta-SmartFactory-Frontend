/**
 * Created by seva on 7/10/17.
 */
import {MissingTranslationHandler, MissingTranslationHandlerParams} from '@ngx-translate/core';
import { Injectable } from "@angular/core";

@Injectable()
export class AppMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    return  params.key;
  }
}
