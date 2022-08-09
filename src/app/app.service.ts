import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private http: HttpClient) {}

  public demos: any = {
    "web-ifc": [
      {
        text: 'Buildng Comp.',
        route: '/bsf-building-components'
      },
      {
        text: 'IFC Props',
        route: '/ifc-properties'
      },
    ],
    "WIT": [
      {
        text: 'Test',
        route: '/test'
      },
    ],
    "WIV Demos": [
      {
        text: 'Test',
        route: '/test'
      },
    ],
    "LDBIM Demos": [
      {
        text: 'Test',
        route: '/test'
      },
    ],
  };

  // Returns demos in alphabetic order
  public getDemos(){
    const keys = Object.keys(this.demos);
    const demoObject: any = {};

    keys.forEach((key: any) => {
      demoObject[key] = this.demos[key].sort((a: any, b: any) => a.text.localeCompare(b.text));
    });
    
    return demoObject;
  }
}
