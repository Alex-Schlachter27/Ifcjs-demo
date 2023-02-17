import { Injectable } from '@angular/core';
import { IfcViewerAPI } from 'web-ifc-viewer';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {

  public loadedModels: number[] = [];

  constructor( ) { }
  async getProperties(viewerApi: IfcViewerAPI, elementID: number, modelID: number = 0, indirect: boolean = true, recursive: boolean = true): Promise<void>{

    // Get properties
    const properties = await viewerApi.IFC.getProperties(modelID, elementID, indirect, recursive);
    console.log(properties)

    // this.properties = properties;
    // this.psetProperties = psetProperties;

    return properties

  }
}
