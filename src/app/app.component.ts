import { Component } from '@angular/core';
import { BuildingComponentService } from './building-component.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'bsf_bygningsdelsapp';
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


