import { BehaviorSubject, timer, switchMap, from, concatMap, of, delayWhen, repeat, repeatWhen, retry, flatMap, mergeMap, interval, map } from 'rxjs';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Item } from './models';

@Component({
  selector: 'app-slider-rxjs[items]',
  templateUrl: './slider-rxjs.component.html',
  styleUrls: ['./slider-rxjs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderRXJSComponent
{
  @Input() set items(value: Item[]) { this.items$.next(value); }

  paused$ = new BehaviorSubject(false);
  delay$ = this.paused$
    .pipe(switchMap(isPaused => timer(isPaused ? 200000 : 2000)));

  items$ = new BehaviorSubject<Item[]>([]);
  item$ = interval().pipe(
    switchMap(_ => this.items$),
    switchMap(items => from(items)),
    concatMap(item => of(item).pipe(delayWhen(() => this.delay$)))
  );
}
