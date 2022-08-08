import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { IfcAPI } from 'web-ifc';
import * as WebIFC from "web-ifc/web-ifc-api.js";
import { IFCPROPERTYSET } from 'web-ifc/web-ifc-api.js';

@Injectable({
  providedIn: 'root'
})
export class BuildingComponentService {

  private fileContent: string = "";

  constructor(
    private _http: HttpClient
  ) { }

    async readFile(): Promise<void>{

      // const fileContent: string = await firstValueFrom(this._http.get("./assets/Duplex.ifc", {responseType: 'text'}));
      const fileContent: string = await firstValueFrom(this._http.get("./assets/IBT_K01_F2_N001.ifc", {responseType: 'text'}));

      this.fileContent = fileContent;
      console.log("Read file content");
      
    }

    async readNewFile(NewFile: any): Promise<void>{

      const fileContent: string = await firstValueFrom(this._http.get(NewFile, {responseType: 'text'}));

      this.fileContent = fileContent;
      console.log("Read file content + NewFile");
      
    }


    async processFile(): Promise<void>{
      
      // initialize the API
      const ifcApi = new WebIFC.IfcAPI();

      ifcApi.SetWasmPath("./assets/ifcjs/");

      // initialize the library
      await ifcApi.Init();

      let modelID = ifcApi.OpenModel(new TextEncoder().encode(this.fileContent));

      // Get props
      const matches = await this.getPSetByName(ifcApi, modelID, "PSet_Revit_Type_Materials and Finishes")

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

}
