import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { IfcAPI, IFCPROPERTYSET } from 'web-ifc';
import * as WebIFC from "web-ifc/web-ifc-api.js";
import data from '../../assets/input.json';

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
      const matches = await this.getPSetByName(this.ifcApi, modelID, "PSet_BSF")
      console.log(matches);
    }

    async getPSetByName(ifcApi: IfcAPI, modelID: number, pSetName: string){

      let output: any= [];
      var GlobalId;

      // Get IfcRelDefinesByProperties
      const IFCRELDEFINESBYPROPERTIES = 4186316022;
      const rels = await ifcApi.properties.getAllItemsOfType(modelID, IFCRELDEFINESBYPROPERTIES, false);

      for (let i = 0; i < rels.length; i++) {
    
        const relID = rels[i];
        const relProps = await ifcApi.properties.getItemProperties(modelID, relID);
        // console.log(relProps)

        // Get value of relating property definition 
        const allPSet = relProps.RelatingPropertyDefinition.value;
        // console.log(allPSet)
        // output.push(allPSet)

        // Get property set named PSet_BSS by using variable in input.json file
        const propDef = await ifcApi.properties.getItemProperties(modelID, allPSet, true);
        if (propDef.Name.value == data.psetName) {
          console.log("Pset" + propDef.Name.value)
          // Get single value
          var singleValues = propDef.HasProperties
          for (let a = 0; a < singleValues.length; a++) {

                // Get value of Forvaltningsklasse by using variable in input.json file
                if (singleValues[a].Description.value == data.propNames[0]){
                  var forvaltningsklasse = propDef.HasProperties[a].NominalValue.value
                }
    
                // Get value of DriftsID by using variable in input.json file
                if (singleValues[a].Description.value == data.propNames[1]){
                  var DriftsID = propDef.HasProperties[a].NominalValue.value
                }
              }
              console.log("forvaltningsklasse : " + forvaltningsklasse, "DriftsID : " + DriftsID)
      }
      
        // Get the related object
        const objects = relProps.RelatedObjects;
      
        // // Get globalID of object
        for (let j = 0; j < objects.length; j++) {
          var RelatedObjects = await ifcApi.properties.getItemProperties(modelID, objects[j].value);
          var GlobalId = RelatedObjects.GlobalId.value
        
        }
        console.log("GlobalId : " + GlobalId)
  
      output = [GlobalId, forvaltningsklasse, DriftsID]
    }
    return output
    
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
