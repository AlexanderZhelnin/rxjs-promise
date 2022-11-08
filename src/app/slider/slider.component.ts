import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges, AfterViewInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Item } from './models';


@Component({
  selector: 'app-slider[items]',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderComponent implements AfterViewInit, OnDestroy
{
  @Input() items!: Item[];
  item?: Item;
  isPaused = false;
  private intervalRef: any = 0;
  private index = 0;

  constructor(private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void { this.start(); }

  ngOnDestroy(): void { clearInterval(this.intervalRef); }

  start(): void
  {
    this.intervalRef = setInterval(() =>
    {
      this.item = this.items[this.index];
      this.cdr.markForCheck();

      //if (this.index >= this.items.length - 1) clearInterval(this.intervalRef);
      if (this.index >= this.items.length - 1) this.index = -1;
      this.index++;
    }, 2000);
  }

  pause(): void
  {
    this.isPaused = true;
    clearInterval(this.intervalRef);
  }
}
