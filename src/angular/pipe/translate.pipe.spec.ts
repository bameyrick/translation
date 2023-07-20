import { ChangeDetectorRef } from '@angular/core';
import { createMock } from '@golevelup/ts-jest';
import { of } from 'rxjs';
import { TranslateService } from '../service';
import { TranslatePipe } from './translate.pipe';

describe(`TranslatePipe`, () => {
  let pipe: TranslatePipe;

  beforeEach(() => {
    pipe = new TranslatePipe(
      createMock<TranslateService>({ translate: (key?: string | null, _interpolateParams?: Record<string, unknown>) => of(`${key}`) }),
      createMock<ChangeDetectorRef>()
    );
  });

  it(`creates an instance`, () => {
    expect(pipe).toBeTruthy();
  });

  describe(`paramsSubscription`, () => {
    it(`should unsubscribe when params change`, () => {
      const unsubscribeSpy = jest.spyOn(pipe as any, 'unsubscribe');

      pipe.transform('test', { test: 'test' });

      expect(unsubscribeSpy).toHaveBeenCalled();
    });

    it(`should create a new translateSubscription`, () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect((pipe as any).translationSubscription).toBeUndefined();

      pipe.transform('test');

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect((pipe as any).translationSubscription).toBeDefined();
    });
  });

  describe(`transform`, () => {
    it(`should update the params$ observable with the key and interpolateParams`, () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const paramsSpy = jest.spyOn((pipe as any).params$, 'next');

      pipe.transform('test', `{ test: 'test' }`);

      expect(paramsSpy).toHaveBeenCalledWith({ key: 'test', interpolateParams: { test: 'test' } });
    });

    it(`should throw a syntax error if the interpolateParams are not valid`, () => {
      expect(() => pipe.transform('test', `{ test: 'test'`)).toThrowError(SyntaxError);
    });
  });
});
