import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { IfcAPI, IFCPROPERTYSET } from 'web-ifc';
import * as WebIFC from "web-ifc/web-ifc-api.js";

@Injectable({
  providedIn: 'root'
})
export class BuildingComponentService {

  private fileContent: string = "";

  public ifcApi: WebIFC.IfcAPI = new WebIFC.IfcAPI();
  public loadedModels: number[] = [];
  

  constructor(
    private _http: HttpClient
  ) { 
    this.instantiateAPI();
  }

    async readFile(): Promise<void>{

      // const fileContent: string = await firstValueFrom(this._http.get("./assets/Duplex.ifc", {responseType: 'text'}));
      const fileContent: string = await firstValueFrom(this._http.get("./assets/IBT_K01_F2_N001.ifc", {responseType: 'text'}));

      this.fileContent = fileContent;
      console.log("Read file content");
      
    }

    private async instantiateAPI(){

      this.ifcApi.SetWasmPath("./assets/ifcjs/");

      // initialize the library
      await this.ifcApi.Init();
    }


    public async loadFile(file: File): Promise<number>{
      // Load model and return model ID

      // Convert file into a Uunit8Array type
      const byteArray = new Uint8Array(await this.readMyFile(file));
      let modelID = this.ifcApi.OpenModel(byteArray);
      this.loadedModels.push(modelID);
      return modelID;

    }

    public async getProps(modelID: number){
      // Get props
      const matches = await this.getPSetByName(this.ifcApi, modelID, "PSet_Revit_Type_Materials and Finishes")

      console.log(matches);
    }

    async getPSetByName(ifcApi: IfcAPI, modelID: number, pSetName: string){
      // Get props
      const allPsets = await ifcApi.properties.getAllItemsOfType(modelID, IFCPROPERTYSET, true);
      // return allPsets.filter(item => item.Name.value == pSetName)
      const name = allPsets.filter(item => item.Name.value == pSetName)
      const globalID = allPsets.filter(item => item)
      return [name, globalID]
    

    }

    private async readMyFile(file: File): Promise<any> {
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
