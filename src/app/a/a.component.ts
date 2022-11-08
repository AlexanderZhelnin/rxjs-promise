import { AppComponent } from './../app.component';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TestService } from '../test.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-a',
  templateUrl: './a.component.html',
  styleUrls: ['./a.component.scss']
})
export class AComponent implements OnInit, OnDestroy
{

  static countA = 0;
  index = ++AComponent.countA;

  tService = inject(TestService);
  appComponent = inject(AppComponent);

  tServiceCount?: number;

  //private _subs?: Subscription;


  ngOnInit(): void
  {
    if (!this.appComponent.showFromEvent || !this.appComponent.showComponents) return;

    // this._subs = this.tService.myObservable$
    //   .subscribe(_ =>
    //   {
    //     this.tServiceCount = _;


    //     //console.log('tService.myObservable$', `AComponent${this.index}`);
    //   });

    console.log(this.tService.myObservable$);
  }

  ngOnDestroy(): void
  {
    //this._subs?.unsubscribe();
  }

}
