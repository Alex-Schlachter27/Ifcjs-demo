import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Options, LabelType } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {

  @Input() dates: Date[] = [];
  @Output() onChangedDate = new EventEmitter<number>();;

  // ngx
  public options?: Options;


  // mat slider
  disabled = false;
  max = 100;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = false;
  value = 0;

  constructor() { }

  ngOnInit(): void {
    var minDate = this.dates[0];
    var maxDate = this.dates.slice(-1)[0]
    console.log(maxDate)
    var timeDiff = Math.abs(maxDate.getTime() - minDate.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));


    this.value = this.dates[0].getTime();
    this.options = {
      stepsArray: this.dates.map((date: Date) => {
        return { value: date.getTime() };
      }),
      translate: (value: number, label: LabelType): string => {
        return new Date(value).toDateString();
      }
    };
  }

  createDateRange(): Date[] {
    const dates: Date[] = [];
    for (let i: number = 1; i <= 31; i++) {
      dates.push(new Date(2018, 5, i));
    }
    return dates;
  }

  changedDate(value: number){
    this.onChangedDate.emit(value);
  }


}
