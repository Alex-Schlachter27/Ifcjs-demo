import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Options, LabelType } from '@angular-slider/ngx-slider';

class DatesRange{
  fromIndex: number = 0;
  toIndex: number;
  labels: string[];
  values: string[];

  constructor(labels: string[], values: string[]){
      this.toIndex = labels.length;
      this.labels = labels;
      this.values = values;
  }
}

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})


export class SliderComponent implements OnInit {

  @Input() datesRange?: DatesRange
  @Output() onChangedDate = new EventEmitter<Date>();;

  // ngx
  public options?: Options;

  public disabled: Boolean = false;
  public min?: number = 0;
  public max?: number = 100;
  public value: number = 0;
  public step = 1;

  constructor() { }

  ngOnInit(): void {
    this.disabled = false;

    if (this.datesRange) {
      this.min = this.datesRange!.fromIndex;
      this.max = this.datesRange!.toIndex;
    }
  }


  rangeSliderChanged(ev: any){
    // console.log(ev)
    const index = ev.from
    const date = new Date(this.datesRange!.values[index])
    // console.log(date)
    this.onChangedDate.emit(date);
  }

  // onInputChange(ev: any) {
  //   console.log(ev)
  // }

  // changedDate(value: any){
  //   console.log(value)

  // }

  // formatLabel(value: number): string {
  //   if (value >= 1000) {
  //     return Math.round(value / 1000) + 'k';
  //   }

  //   return `${value}`;
  // }


  // ngOnInitOld(): void {
  //   var minDate = this.dates[0];
  //   var maxDate = this.dates.slice(-1)[0]
  //   console.log(maxDate)
  //   var timeDiff = Math.abs(maxDate.getTime() - minDate.getTime());
  //   var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));


  //   this.value = this.dates[0].getTime();
  //   this.options = {
  //     stepsArray: this.dates.map((date: Date) => {
  //       return { value: date.getTime() };
  //     }),
  //     translate: (value: number, label: LabelType): string => {
  //       return new Date(value).toDateString();
  //     }
  //   };
  // }

  // createDateRange(): Date[] {
  //   const dates: Date[] = [];
  //   for (let i: number = 1; i <= 31; i++) {
  //     dates.push(new Date(2018, 5, i));
  //   }
  //   return dates;
  // }


}
