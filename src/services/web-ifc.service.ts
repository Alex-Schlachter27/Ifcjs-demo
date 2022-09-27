import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { IfcAPI, IFCPROPERTYSET } from 'web-ifc';

@Injectable({
  providedIn: 'root'
})
export class WebIfcService {
  
  public ifcApi: IfcAPI = new IfcAPI();
  public loadedModels: number[] = [];
  

  constructor(
  ) { }

    public async instantiateAPI(){

      this.ifcApi.SetWasmPath("./assets/ifcjs/");

      // initialize the library
      await this.ifcApi.Init();
      return this.ifcApi;
    }

  public async getPsets(ifcAPi: IfcAPI, modelID: number){
      
    let psets = ifcAPi.GetLineIDsWithType(modelID, IFCPROPERTYSET);
    const psetNames = [];
    for (let i = 0; i < psets.size(); i++)
    {
        let expressID = psets.get(i);
        const psetObj = ifcAPi.GetLine(modelID, expressID);
        const name = psetObj.Name.value;
        if(psetNames.indexOf(name) == -1) psetNames.push(name);
    }

    return psetNames;

  }

}
