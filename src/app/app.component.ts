import { Component } from '@angular/core';
import { BuildingComponentService } from './building-component.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'bsf_bygningsdelsapp';

  constructor(
    private _s: BuildingComponentService
  ){}

  async getFile(){
    await this._s.readFile();
    await this._s.processFile();
  }

  async onIFCLoad(event: any){
    if (event.target.files.length == 0) {
      console.log("No file selected!");
      return;
    }
    let file: File = event.target.files[0];
    console.log("ready to read new file" + file)

    // file from browser is sent to service
    await this._s.readNewFile(file);
    // this.uploadFile([file]);
    await this._s.processFile();
  }

      

}


