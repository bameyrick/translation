import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { isEqual, isNullOrUndefined, isObject, isString } from '@qntm-code/utils';
import { Subject, Subscription, distinctUntilChanged } from 'rxjs';
import { TranslateService } from '../service';

@Pipe({ name: 'translate', pure: false })
export class TranslatePipe implements PipeTransform, OnDestroy {
  /**
   * The value to return
   */
  private value?: string;

  /**
   * Subscription to the translation, this might change if the user changes their language or the default language is changed
   */
  private translationSubscription?: Subscription;

  /**
   * An observable of the params provided from the transform
   */
  private readonly params$ = new Subject<{ key?: string | null; interpolateParams?: Record<string, unknown> }>();

  /**
   * Handle the params being updated
   */
  private readonly paramsSubscription = this.params$
    .pipe(distinctUntilChanged((previous, next) => isEqual(previous, next)))
    .subscribe(({ key, interpolateParams }) => {
      this.unsubscribe();

      this.translationSubscription = this.translateService.translate(key, interpolateParams).subscribe(value => {
        this.value = value;

        this.changeDetectorRef.detectChanges();
      });
    });

  constructor(
    private readonly translateService: TranslateService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  public ngOnDestroy(): void {
    this.unsubscribe();

    this.paramsSubscription.unsubscribe();
  }

  public transform(key?: string | null, ...args: Array<Record<string, unknown> | string>): string | undefined {
    let interpolateParams: Record<string, unknown> | undefined;

    if (!isNullOrUndefined(args[0])) {
      if (isString(args[0])) {
        /** We accept objects written in the template such as {n:1}, {'n':1}, {n:'v'} which is why we might need to change it to real JSON
         * objects such as {"n":1} or {"n":"v"}
         */
        const validArgs: string = args[0].replace(/(')?([a-zA-Z0-9_]+)(')?(\s)?:/g, '"$2":').replace(/:(\s)?(')(.*?)(')/g, ':"$3"');

        try {
          interpolateParams = JSON.parse(validArgs) as Record<string, unknown>;
        } catch (error) {
          throw new SyntaxError(`Incorrect parameter in TranslatePipe. Expected a valid Object, received: ${args[0]}`);
        }
      } else if (isObject(args[0]) && !Array.isArray(args[0])) {
        interpolateParams = args[0];
      }
    }

    this.params$.next({ key, interpolateParams });

    return this.value;
  }

  private unsubscribe(): void {
    if (this.translationSubscription) {
      this.translationSubscription.unsubscribe();
    }
  }
}
