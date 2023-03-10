import { Component, OnInit } from '@angular/core';
import { BuildingComponentService } from './building-components.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-bsf-building-components',
  templateUrl: './bsf-building-components.component.html',
  styleUrls: ['./bsf-building-components.component.scss']
})
export class BsfBuildingComponentsComponent {

  title = 'web_ifc_sandbox';
  fileName = '';

  constructor(
    private _s: BuildingComponentService,
    private _http: HttpClient
  ){}

  public async onIFCLoad(event: any){
    let file: File = event.target.files[0];
    this.fileName = file.name;

    try{

      // Load the file
      const modelId = await this._s.loadFile(file);

      // Get the properties
      await this._s.getProps(modelId);

    }catch(err){
      console.log(err);
    }
  }


}
