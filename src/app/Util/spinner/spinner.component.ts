import { Component, Inject, OnInit } from '@angular/core';
import { SpinnerService } from './spinner.service';

@Component({
  selector: 'fullpage-spinner',
  template: `
  <div id="container" [class.visible]="showSpinner">
    <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    <div class="label" *ngIf="label">
      {{label}}
    </div>
  </div>
  `,
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {

  public showSpinner: boolean = true;
  public label: string = "";

  constructor(
    private _s: SpinnerService
  ) { }

  ngOnInit(): void {
    this._s.getVisibility().subscribe(visibility => this.showSpinner = visibility);
    this._s.getLabel().subscribe(label => {
      this.label = label
      console.log(label)
    });
  }

}
