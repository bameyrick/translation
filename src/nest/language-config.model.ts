import { TranslationLanguage } from '../common';

export interface LanguageConfig {
  language: string;
  namespace: string;
  values: TranslationLanguage;
}
