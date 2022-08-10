import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppService } from '../app.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [ AppService ]
})
export class HomeComponent implements OnInit {

  public categories: any = ['web-ifc', 'WIT', 'WIV Demos', 'LDBIM Demos'];
  public selectCategory: any = this.categories[0];
  public demos: any = {};
  public selectedDemo: any = null;

  constructor(
    private _s: AppService
  ) {}

  ngOnInit(): void {
    this.demos = this._s.getDemos();
  }

}
