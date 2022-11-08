import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TestService
{

  //myObservable$ = new BehaviorSubject(1);
  myObservable$ = new Subject<number>();
  count = 0;
  constructor() { }


  next(): void
  {
    this.myObservable$.next(++this.count);
  }

}
