import { Injectable } from '@angular/core';
import { IfcAPI } from 'web-ifc';
import { IfcViewerAPI } from 'web-ifc-viewer';

@Injectable({
  providedIn: 'root'
})
export class ModelLoaderService {

  public loadedModels: number[] = [];
  

  constructor( ) { }

    public async loadFile(ifcApi: IfcAPI, file: File): Promise<number>{
      // Load model and return model ID

      // Convert file into a Uunit8Array type
      const byteArray = new Uint8Array(await this.readFile(file));
      let modelID = ifcApi.OpenModel(byteArray);
      this.loadedModels.push(modelID);
      return modelID;
    }

    public async loadFileWIV(viewer: IfcViewerAPI, file: File): Promise<any>{
      // Load model into the current scene
      return viewer.IFC.loadIfc(file)
    }



    private async readFile(file: File): Promise<any> {
      return new Promise((resolve, reject) => {
        // Create file reader
        let reader = new FileReader()
    
        // Register event listeners
        reader.addEventListener("loadend", (e: any) => resolve(e.target.result))
        reader.addEventListener("error", reject)
    
        // Read file
        reader.readAsArrayBuffer(file)
      })
    }

}
