import { Inject, Injectable } from '@nestjs/common';
import { TranslationKeyStore } from '../common';
import { LanguageConfig } from './language-config.model';
import { NEST_DEFAULT_LANGUAGE_TOKEN, NEST_LANGUAGES } from './tokens';

@Injectable()
export class NestTranslateService {
  /**
   * The dictionary for the known languages
   */
  private readonly store = new TranslationKeyStore();

  constructor(
    @Inject(NEST_DEFAULT_LANGUAGE_TOKEN) private readonly defaultLanguage = 'en',
    @Inject(NEST_LANGUAGES) readonly languages: LanguageConfig[]
  ) {
    languages.forEach(({ language, namespace, values }) => this.store.addLanguageNamespace(language, namespace, values));
  }

  public translate(language: string, key: string, params?: Record<string, unknown>): string {
    // Attempt to get the translation key value
    let result = this.store.getTranslationValue(key, language);

    // If the translation key value is not found and the language is not the same as the default language
    if (!result && language !== this.defaultLanguage) {
      result = this.store.getTranslationValue(key, this.defaultLanguage);
    }

    if (result) {
      return result(params);
    }

    return key;
  }
}
