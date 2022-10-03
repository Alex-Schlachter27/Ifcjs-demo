import { Component, OnInit } from '@angular/core';
import { ModelLoaderService } from 'src/services/model-loader.service';
import { WebIfcViewerService } from 'src/services/web-ifc-viewer.service';
import { GISService } from './wiv-gis.service';
import * as mapboxgl from 'mapbox-gl';

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

  public map?: mapboxgl.Map;
  public scene?: Scene;
  public camera?: PerspectiveCamera;
  public renderer?: WebGLRenderer;
  fileName = '';

  constructor(
    private _viewer: WebIfcViewerService,
    private _load: ModelLoaderService,
    private _gis: GISService
  ){  }

  async ngOnInit() {
    // checkout https://medium.com/@aitahtman.salaheddine/using-mapbox-gl-with-angular-8-41f2c586655e
  }

  public onIFCLoad(event: any){
    let file: File = event.target.files[0];
    this.fileName = file.name;

    this.map = this._gis.buildMap();

    const gl = this.map.getCanvas().getContext('webgl')
    this.renderer = new WebGLRenderer({
      canvas: this.map.getCanvas(),
      context: gl!,
      antialias: true,
    });
    this.renderer.autoClear = false;
    this.scene = new Scene();
    this.camera = new PerspectiveCamera();

    console.log(this.renderer)

    if(this.map != undefined && this.renderer != undefined) {
      console.log("load model")
      this._gis.addCustomLayer(this.map, this.scene, this.camera, this.renderer, file);
      this._gis.addBuildingLayer(this.map)

    }

  }




}
