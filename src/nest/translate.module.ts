import { Module } from '@nestjs/common';
import { NestTranslateService } from './translate.service';

@Module({
  providers: [NestTranslateService],
  exports: [NestTranslateService],
})
export class NestTranslateModule {}
