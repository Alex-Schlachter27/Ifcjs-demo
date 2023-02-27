import { Injectable } from '@angular/core';

export class DatesRange{
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

@Injectable({
    providedIn: 'root'
})
export class RangeSliderService {

    getDaysBetweenDates(start: Date, end: Date): Promise<DatesRange> {
        return new Promise((resolve, reject) => {
            let isoValues = [];
            for(var arr=[],dt=new Date(start); dt<=end; dt.setDate(dt.getDate()+1)){
                const date = new Date(dt);
                const iso = date.toISOString().substring(0, 10);
                const year = iso.substring(0,4);
                const month = iso.substring(5,7);
                const day = iso.substring(8,10);
                const label = `${day}/${month}-${year}`;
                arr.push(label);
                isoValues.push(date.toISOString());
                // console.log(label, date.toISOString())
            }
            resolve(new DatesRange(arr, isoValues));
        });
    }

}
