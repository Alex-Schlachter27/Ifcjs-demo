import { Injectable } from '@angular/core';
import { IfcViewerAPI } from 'web-ifc-viewer';
import * as mapboxgl from 'mapbox-gl';
import { environment } from "../../../environments/environment";
import { AmbientLight, Camera, DirectionalLight, Matrix4, Scene, Vector3, WebGLRenderer } from 'three';
import { ModelLoaderService } from 'src/services/model-loader.service';
import { IFCLoader } from "web-ifc-three";


@Injectable({
    providedIn: 'root'
})
export class GISService {

  style = 'mapbox://styles/mapbox/light-v10';
  zoom = 20.5;

  public modelOrigin: mapboxgl.LngLatLike = [13.4453, 52.4910];
  public modelAltitude = 0;
  public modelRotate = [Math.PI / 2, .72, 0];
  public modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(this.modelOrigin, this.modelAltitude);
  public modelTransform: any;


  constructor(
    private _load: ModelLoaderService,
  ) {
    // mapboxgl.accessToken = environment.mapbox.accessToken;
    this.modelTransform = {
      translateX: this.modelAsMercatorCoordinate.x,
      translateY: this.modelAsMercatorCoordinate.y,
      translateZ: this.modelAsMercatorCoordinate.z,
      rotateX: this.modelRotate[0],
      rotateY: this.modelRotate[1],
      rotateZ: this.modelRotate[2],
      scale: this.modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
    };
  }

  buildMap() {
    const map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: this.style,
      zoom: this.zoom,
      center: this.modelOrigin,
      pitch: 75,
      bearing: -80,
      antialias: true
    })
    return map;
  //  this.map.addControl(new mapboxgl.NavigationControl());
  }

  public addCustomLayer(map: mapboxgl.Map, scene: Scene, camera: Camera, renderer: WebGLRenderer, file: File) {

    const modelTransform = this.modelTransform;
    const loaderService = this._load;
    const customLayer: mapboxgl.AnyLayer = {

      id: '3d-model',
      type: 'custom',
      renderingMode: '3d',

      onAdd: function (map, gl) {
        console.log(modelTransform.translateX)
        // Load the file
        console.log(file)
        // const model = loaderService.loadFileWIT(scene, file);
        const ifcLoader = new IFCLoader();
        ifcLoader.ifcManager.setWasmPath( 'assets/ifcjs/' );
        const fileURL = URL.createObjectURL(file);
        ifcLoader.load(fileURL, function ( model ) {
          scene.add( model );
        });

        const directionalLight = new DirectionalLight(0x404040);
        const directionalLight2 = new DirectionalLight(0x404040);
        const ambientLight = new AmbientLight( 0x404040, 3 );

        directionalLight.position.set(0, -70, 100).normalize();
        directionalLight2.position.set(0, 70, 100).normalize();

        scene.add(directionalLight, directionalLight2, ambientLight);
      },

      render(gl: any, matrix: any) {
        const rotationX = new Matrix4().makeRotationAxis(
        new Vector3(1, 0, 0), modelTransform.rotateX);
        const rotationY = new Matrix4().makeRotationAxis(
        new Vector3(0, 1, 0), modelTransform.rotateY);
        const rotationZ = new Matrix4().makeRotationAxis(
        new Vector3(0, 0, 1), modelTransform.rotateZ);

        const m = new Matrix4().fromArray(matrix);
        const l = new Matrix4()
        .makeTranslation(
        modelTransform.translateX,
        modelTransform.translateY,
        modelTransform.translateZ
        )
        .scale(
        new Vector3(
        modelTransform.scale,
        -modelTransform.scale,
        modelTransform.scale)
        )
        .multiply(rotationX)
        .multiply(rotationY)
        .multiply(rotationZ);

        camera.projectionMatrix = m.multiply(l);
        renderer.resetState();
        renderer.render(scene, camera);
        map.triggerRepaint();
      }
    }
    map.on('style.load', () => {
      // console.log("add layer")
      map.addLayer(customLayer, 'waterway-label');
    });

    return map;

  };

  public addBuildingLayer(map: mapboxgl.Map) {
    map.on('load', () => {
      // Insert the layer beneath any symbol layer.
        const layers = map.getStyle().layers;
        const labelLayer = layers.find(
            (layer) => layer.type === 'symbol' && layer.layout!['text-field']
        )
        const labelLayerId = labelLayer!.id;
        // The 'building' layer in the Mapbox Streets
        // vector tileset contains building height data
        // from OpenStreetMap.
        map.addLayer(
          {
            'id': 'add-3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 15,
            'paint': {
              'fill-extrusion-color': '#aaa',

              // Use an 'interpolate' expression to
              // add a smooth transition effect to
              // the buildings as the user zooms in.
              'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'height']
              ],
              'fill-extrusion-base': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'min_height']
              ],
              'fill-extrusion-opacity': 0.6
            }
          },
          labelLayerId
        );
      });
  }


}
