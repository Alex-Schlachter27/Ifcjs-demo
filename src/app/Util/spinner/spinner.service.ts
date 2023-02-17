import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  public visibility$ = new BehaviorSubject<boolean>(false);
  public label$ = new BehaviorSubject<string>("");

  constructor() { }

  public getVisibility(){
    return this.visibility$.asObservable();
  }

  public setVisibility(status: boolean){
    this.visibility$.next(status);
  }

  public getLabel(){
    return this.label$.asObservable();
  }

  public setLabel(label: string){
    this.label$.next(label);
  }

  public removeLabel(){
    this.label$.next("");
  }

}
