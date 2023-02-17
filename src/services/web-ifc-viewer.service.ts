import { HttpClient } from '@angular/common/http';
import { Color } from 'three';
import { Injectable } from '@angular/core';
import { IfcViewerAPI } from 'web-ifc-viewer';

@Injectable({
  providedIn: 'root'
})
export class WebIfcViewerService {

  public loadedModels: number[] = [];


  constructor(
  ) { }

    public async instantiateViewer(container: any){

      const viewer: IfcViewerAPI = new IfcViewerAPI({ container, backgroundColor: new Color("rgb(259, 240, 240)") });

      // viewer.grid.setGrid();
      viewer.axes.setAxes();

      viewer.IFC.setWasmPath("./assets/ifcjs/");

      viewer.clipper.active = true;

      return viewer;
    }


}
