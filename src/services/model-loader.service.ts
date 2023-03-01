import { Injectable } from '@angular/core';
import { IfcAPI } from 'web-ifc';
import { IfcViewerAPI } from 'web-ifc-viewer';
import { IFCLoader } from "web-ifc-three";
// import { IFCModel } from "web-ifc-three/IFC/components/IFCModel";
import { AmbientLight, DirectionalLight, Scene } from 'three';
import { ModelViewerSettings } from 'src/app/WIV/models';

@Injectable({
  providedIn: 'root'
})
export class ModelLoaderService {

  public viewer?: IfcViewerAPI;

  public loadedModelIds: number[] = [];
  public models: any[] = [];

  constructor( ) {}

    public async loadFile(ifcApi: IfcAPI, file: File): Promise<number>{
      // Load model and return model ID

      // Convert file into a Uunit8Array type
      const byteArray = new Uint8Array(await this.readFile(file));
      let modelID = ifcApi.OpenModel(byteArray);
      this.loadedModelIds.push(modelID);
      return modelID;
    }

    public async loadFileWIV(viewer: IfcViewerAPI, file: File, settings?: ModelViewerSettings): Promise<any>{

      this.viewer = viewer;
      this.viewer.IFC.loader.ifcManager.applyWebIfcConfig({
        USE_FAST_BOOLS: true,
        COORDINATE_TO_ORIGIN: true
      });

      // Load model into the current scene
      const model = await viewer.IFC.loadIfc(file, true);
      // Add to array of models
      this.models.push(model);

      // Add shadow
      this.viewer.shadowDropper.renderShadow(model.modelID);

      let properties = undefined;
      if(settings && settings.loadProperties) {
        properties = this.loadAllProperties(viewer, model, settings.downloadProperties)
      }

      return {model, properties}
    }

    public getModels() {
      return this.models;
    }

    public getModelsNumber() {
      return this.models.length;
    }

    public async loadAllProperties(viewer: IfcViewerAPI, model: any, download: boolean = false){

      const propertiesBlob =  await viewer.IFC.properties.serializeAllProperties(model, undefined, this.progressCallback);

      // Doanload properties?
      if(download) this.downloadFile(propertiesBlob)

      // Only one blob, as not split into maxSize-blobs
      const properties = JSON.parse(await propertiesBlob[0].text());
      return properties
    }

    public progressCallback(progress: number, total: number) {
      console.log(`Progress: ${Math.round((progress / total) * 100)}%`);
    }

    downloadFile(jsonBlob: Blob[]) {
      const file = new File(jsonBlob, 'properties');
      const link = document.createElement('a');
      document.body.appendChild(link);
      link.href = URL.createObjectURL(file);
      link.download = 'properties.json';
      link.click();
      link.remove();
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

    loadFileWIT(scene: Scene, file: File){
      console.log(file)
      let model;
      const ifcLoader = new IFCLoader();
      ifcLoader.ifcManager.setWasmPath( 'assets/ifcjs/' );
      ifcLoader.load(file, function ( model ) {
        scene.add( model );
      });
      return model
    }

}
