import { ModuleWithProviders, NgModule } from '@angular/core';
import { Language } from '../common';
import { TRANSLATION_ASSET_PATHS } from './asset-paths.token';
import { ENABLE_TRANSLATION_LOGGING } from './enable-logging.token';
import { TranslatePipe } from './pipe';
import { DEFAULT_LANGUAGE, LANGUAGES, TranslateService, USE_DEFAULT_LANGUAGE } from './service';
import { TranslationAssetPaths } from './translation-asset-paths.model';

export interface TranslateModuleConfig {
  languages: Language[];
  defaultLanguage: string;
  useDefaultLanguage?: boolean;
  enableLogging?: boolean;
  translationAssetPaths?: TranslationAssetPaths;
}

@NgModule({
  declarations: [TranslatePipe],
  exports: [TranslatePipe],
})
export class TranslateModule {
  public static forRoot(config: TranslateModuleConfig): ModuleWithProviders<TranslateModule> {
    return {
      ngModule: TranslateModule,
      providers: [
        { provide: LANGUAGES, useValue: config.languages },
        { provide: DEFAULT_LANGUAGE, useValue: config.defaultLanguage },
        { provide: USE_DEFAULT_LANGUAGE, useValue: config.useDefaultLanguage },
        { provide: ENABLE_TRANSLATION_LOGGING, useValue: config.enableLogging },
        { provide: TRANSLATION_ASSET_PATHS, useValue: config.translationAssetPaths },
        TranslateService,
      ],
    };
  }
}
