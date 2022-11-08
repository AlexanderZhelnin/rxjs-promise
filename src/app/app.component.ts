import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, HostBinding, inject, ViewChild } from '@angular/core';
import { debounceTime, defer, map, Observable, of, Subject, tap, BehaviorSubject, firstValueFrom, fromEvent, filter, takeUntil } from 'rxjs';
import { TestService } from './test.service';

type TPromiseLike<T> = T | PromiseLike<T>;
type UnSet = null | undefined;
class MyPromise<T> implements PromiseLike<T>
{
  onfulfilled?: ((value: TPromiseLike<T>) => TPromiseLike<T>) | UnSet;
  onrejected?: ((reason: any) => TPromiseLike<never>) | UnSet
  constructor(executor: (resolve: (value: TPromiseLike<T>) => void, reject: (reason?: any) => void) => void)
  {
    executor(
      (value) =>
      {
        setTimeout(() =>
        {
          this.onfulfilled?.(value);
        });
      },
      () => { });
  }
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TPromiseLike<TResult1>) | UnSet,
    onrejected?: ((reason: any) => TPromiseLike<TResult2>) | UnSet): PromiseLike<TResult1 | TResult2>
  {
    this.onfulfilled = onfulfilled as any;
    this.onrejected = onrejected as any;

    return Promise.resolve() as any
  }
}

export function myMap<T, R>(translate: (x: T) => R)
{
  return (src$: Observable<T>): Observable<R> =>
  {
    return new Observable(subscriber =>
    {
      const subscription = src$
        .subscribe(_ => subscriber.next(translate(_)));

      return subscription;
    });
  }
}

export function myFilter<T>(predicate: (x: T) => boolean)
{
  return (src$: Observable<T>): Observable<T> =>
  {
    return new Observable(subscriber =>
    {
      const subscription = src$
        .subscribe(_ =>
        {
          if (predicate(_)) subscriber.next(_);
        });

      return subscription;
    });
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit
{
  //#region свойства
  showComponents = true;
  showSlider = false;
  showFromEvent = true;


  @ViewChild('button') private button!: ElementRef;
  @ViewChild('input') private input!: ElementRef;

  click$!: Observable<unknown>;

  tService = inject(TestService);
  httpClient = inject(HttpClient);

  @HostBinding('class.hide')
  get isHide(): boolean { return !this.showComponents; }


  // Для кнопок
  isShowA1 = true;
  isShowA2 = true;
  //#endregion

  ngAfterViewInit(): void
  {
    const o1$ = new Subject<number>();

    o1$.subscribe(_ =>
    {
      console.log(`1  ${_}`);

    });

    o1$.subscribe(_ =>
    {
      console.log(`2  ${_}`);

    });

    setTimeout(() => o1$.next(1), 3000);



    //this.promiseTest();
    //this.promiseAsyncTest();
    // this.promiseLikeTestAsync();

    //this.observableTest();
    //this.observablePipeTest();
    // this.observableMyPipeTest();
    //this.httpTest();
    //this.fromEventExample();
  }

  //#region promise

  getPromiseAsync(): Promise<number>
  {
    return new Promise<number>(resolve =>
    {
      console.log('Promise work');
      resolve(1);
    });
  }
  promiseTest(): void
  {
    const p = this.getPromiseAsync();

    p.then(_ =>
    {
      console.log(`Promise then ${_}`);
    });
    p.catch(_ =>
    {
      console.log('promise catch');
    });

    console.log('Promise execute function end');
  }

  //#region promiseAsync
  async promiseAsync()
  {
    console.log('Promise work');
    return 1;
  }
  async promiseAsyncRun()
  {
    const _ = await this.promiseAsync();
    console.log(`Promise then ${_}`);
  }

  promiseAsyncTest()
  {
    this.promiseAsyncRun();
    console.log('Promise execute function end');
  }
  //#endregion

  //#region promiseLike
  getPromiseLikeAsync(): MyPromise<number>
  {
    return new MyPromise<number>(resolve =>
    {
      console.log('PromiseLike work');
      resolve(1);
    });
  }

  promiseLikeTest(): void
  {
    const p = this.getPromiseLikeAsync();

    p.then(_ =>
    {
      console.log(`PromiseLike then ${_}`);
    });

    console.log('PromiseLike execute function end');
  }

  async promiseLikeTestAsync()
  {
    const _ = await this.getPromiseLikeAsync();

    console.log(`PromiseLike then ${_}`);
  }

  //#endregion

  //#endregion

  //#region observable

  getObservable(): Observable<number>
  {
    return of(1, 2, 3);
  }

  observableTest(): void
  {
    const o$ = this.getObservable();

    o$.subscribe({
      next: _ =>
      {
        console.log(`Observable next1 ${_}`);
      },
      error: er =>
      {
        console.log('Observable error1');
      },
      complete: () =>
      {
        console.log('Observable complete1');
      }
    });

    o$.subscribe({
      next: _ =>
      {
        console.log(`Observable next2 ${_}`);
      },
      error: er =>
      {
        console.log('Observable error2');
      },
      complete: () =>
      {
        console.log('Observable complete2');
      }
    });

    console.log('Observable execute function end');
  }

  observablePipeTest(): void
  {
    //this.getObservable()
    const bs$ = this.getObservable();//new BehaviorSubject(1);

    const bs1$ = bs$.pipe(
      map(id =>
      {
        return { id, name: `Александр ${id}` };
      }),
      filter(o => o.id !== 2),
    );

    bs1$.subscribe({
      next: _ =>
      {
        console.log('Observable next', _);
      },
      error: er =>
      {
        console.log('Observable error');
      },
      complete: () =>
      {
        console.log('Observable complete');
      }
    });

    console.log('Observable execute function end');
  }

  observableMyPipeTest(): void
  {
    const src$ = new BehaviorSubject(1); //this.getObservable();
    console.log('src$', src$);
    const oPipe$ = src$.pipe(
      myMap(id =>
      {
        return { id, name: `Александр ${id}` };
      })
    );

    const subscription1 = oPipe$.subscribe({
      next: _ =>
      {
        console.log('Observable next1', _);

        setTimeout(() =>
        {
          //subscription1.unsubscribe();
          console.log('src$', src$);
        });

      },
      error: er =>
      {
        console.log('Observable error1');
      },
      complete: () =>
      {
        console.log('Observable complete1');
      }
    });

    const subscription2 = oPipe$.subscribe({
      next: _ =>
      {
        console.log('Observable next2', _);

        setTimeout(() =>
        {
          //subscription2.unsubscribe();
          console.log('src$', src$);
        });

      },
      error: er =>
      {
        console.log('Observable error2');
      },
      complete: () =>
      {
        console.log('Observable complete2');
      }
    });

    console.log('Observable execute function end');
  }

  async observableToPromise()
  {
    await this.getObservable().forEach(_ => console.log(_));


    const result = await firstValueFrom(this.getObservable());

    // что-то делаем после получения значения
    return result;

  }
  //#endregion

  //#region fromEventExample
  private fromEventExample()
  {
    if (!this.showComponents) return;

    this.click$ = fromEvent(this.button.nativeElement, 'click');
    this.click$.subscribe(_ => this.tService.next());

    fromEvent<InputEvent>(this.input.nativeElement, 'input')
      .pipe(
        map(_ => (_.target as HTMLInputElement).value),
        debounceTime(1000))
      .subscribe(text =>
      {
        console.log('Text input (rxjs): ', text);
      });

    this.debounceTimeWithoutRXJS();
  }

  debounceTimeWithoutRXJS()
  {
    let timeout: any = 0;
    (this.input.nativeElement as HTMLInputElement)
      .addEventListener('input', (ev: Event) =>
      {
        clearTimeout(timeout);
        const text = (ev.target as HTMLInputElement).value;
        timeout = setTimeout(() =>
        {
          console.log('Text input (without rxjs): ', text);
        }, 1000);
      });
  }


  //#endregion

  //#region httpTest
  httpTest(): void
  {
    this.httpClient.get<IPrimitive[]>('/assets/primitives.json')
      .pipe(tap(_ => console.log('httpClient.tap', _)))
    // .subscribe({
    //   next: gs =>
    //   {
    //     //console.log(gs);
    //   }
    // });
  }
  //#endregion
}

//#region
enum GrTypeEnum
{
  line = 1,
  polygon = 2,
}
interface IRect
{
  left: number;
  right: number;
  top: number;
  bottom: number;
}
interface IPoint { x: number; y: number; }
interface IPrimitive
{
  coords: IPoint[];
  rect: IRect;
  name: string,
  type: GrTypeEnum
}
//#endregion
