import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModelLoaderService } from 'src/services/model-loader.service';
import { WebIfcService } from 'src/services/web-ifc.service';
import { IfcAPI } from 'web-ifc';

@Component({
  selector: 'app-ifc-properties',
  templateUrl: './ifc-properties.component.html',
  styleUrls: ['./ifc-properties.component.scss']
})
export class IfcPropertiesComponent implements OnInit {
  
  fileName = '';
  public ifcApi?: IfcAPI;
  public modelId?: number;
  public psets: any[] = [];

  constructor(
    private _s: WebIfcService,
    private _load: ModelLoaderService
  ){}

  async ngOnInit() {
    this.ifcApi = await this._s.instantiateAPI();
  }

  public async onIFCLoad(event: any){
    let file: File = event.target.files[0];
    this.fileName = file.name;

    try{
        // Load the file
        this.modelId = await this._load.loadFile(this.ifcApi as IfcAPI, file);
        console.log(!this.modelId)

    }catch(err){
      console.log(err);
    }
  }

  public async getPSets() {
    this.psets = await this._s.getPsets(this.ifcApi as IfcAPI, this.modelId as number);
    console.log(this.psets)
  }


}
