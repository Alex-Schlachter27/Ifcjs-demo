import { Component, OnInit } from '@angular/core';
import { ModelLoaderService } from 'src/services/model-loader.service';
import { WebIfcViewerService } from 'src/services/web-ifc-viewer.service';
import { GISService } from './wiv-gis.service';

import { Matrix4, Vector3,
  PerspectiveCamera,
  DirectionalLight,
  AmbientLight,
  Scene, WebGLRenderer,
} from "three";

import { IFCLoader } from "web-ifc-three";

@Component({
  selector: 'app-wiv-gis',
  templateUrl: './wiv-gis.component.html',
  styleUrls: ['./wiv-gis.component.scss']
})
export class WivGISComponent implements OnInit {

  fileName = '';
  public viewer?: any;
  public model: any;
  public plans: any;
  public currentPlan: any;
  public allPlans: any;
  public storeys: any;

  constructor(
    private _viewer: WebIfcViewerService,
    private _load: ModelLoaderService,
    private _vs: GISService
  ){}

  async ngOnInit() {
  }

  // checkout https://medium.com/@aitahtman.salaheddine/using-mapbox-gl-with-angular-8-41f2c586655e




}
