import { Component, Input, OnInit } from '@angular/core';
import { IFCModel } from 'web-ifc-three/IFC/components/IFCModel';
// import { ModelLoaderService, LoadingStatus } from '../model-loader.service';
// import { IFCViewerService } from '../ifc-viewer.service';
import { MenuPanelSettings } from 'src/app/WIV/models';

import { SpinnerService } from '../spinner/spinner.service';

// import { SelectionService } from '../selection.service';
// import { ColorService } from '../color.service';
// import { OverlayService } from '../overlay.service';

@Component({
    selector: 'ifc-viewer-menu',
    templateUrl: 'menu-panel.component.html',
    styleUrls: ['menu-panel.component.scss']
})

export class MenuPanelComponent implements OnInit {

    @Input() modelLoaded: boolean = false;
    @Input() models: IFCModel[] = [];
    @Input() settings: MenuPanelSettings = new MenuPanelSettings();

    // Dim status
    public dimmed: any = {}

    public clippingActive: boolean = false;

    public showSearchByGlobalId: boolean = false;
    public showSearchByExpressId: boolean = false;

    constructor(
        private _mls: ModelLoaderService,
        private _vs: IFCViewerService,
        private _spinnerService: SpinnerService,
        // private _selectionService: SelectionService,
        // private _colorService: ColorService,
        // private _overlayService: OverlayService
    ) { }

    ngOnInit() { }

    showSearchBar(type: string){
        this.cloasSearchBars();
        if(type == "globalId") this.showSearchByGlobalId = true;
        if(type == "expressId") this.showSearchByExpressId = true;
    }

    cloasSearchBars(){
        this.showSearchByGlobalId = false;
        this.showSearchByExpressId = false;
    }

    onFileLoad(event: any) {

        this._spinnerService.setVisibility(true);
        this._spinnerService.setLabel("Loading model");

        if (event.target.files.length == 0) {
            console.log("No file selected!");
            return;
        }
        let file: File = event.target.files[0];

        if (file) {

            let loadedModel: IFCModel;
            this._mls.loadModel(file).subscribe(
                (status: LoadingStatus) => {

                    let msg = "Loading model";

                    if(status.fileLoad && !status.fileProcessing){
                        msg = status.fileLoad != 100 ? `Loaded ${status.fileLoad.toFixed(0)} %` : "Processed 0 %";
                    }
                    if(status.fileLoad && status.fileProcessing){
                        msg = status.fileProcessing != 100 ? `Processed ${status.fileProcessing} %` : "Finalizing the scene";
                    }

                    this._spinnerService.setLabel(msg);

                    if (status.result != undefined) {
                        loadedModel = status.result;

                        // Append model to scene
                        this._vs.appendModel(loadedModel);

                        this._spinnerService.setVisibility(false);

                        const modelID = loadedModel.modelID
                        this.dimmed[modelID] =  false;

                    }
                },
                err => console.log(err))

        }

    }

    async setClippingPlane(){
        // const bot = await this._bs.generateBuildingTopologyTriples();
        console.log("Set clipping plane");
        this.clippingActive = !this.clippingActive;
        // this.ifc.ifcViewer?.toggleClippingPlanes();
    }

    async cleanScene(){
        // Get modelIds
        this._colorService.resetAllColors();
        this._selectionService.removeAllSubsets();
        this._overlayService.clearAllOverlays();
    }

    hideModel(index: number){
        console.log(this.models[index])

        this._selectionService.hideModel(index)
        console.log(this.models[index])
    }

    showModel(index: number){
        console.log(this.models[index])

        this._selectionService.unhideModel(index);
        this._vs.flyToMeshCenter(this.models[index], true);
    }

    flyCameraToModel(index: number) {
        this._vs.flyToMeshCenter(this.models[index], true);
    }

    dimModel(index: number) {
        this._colorService.dimModel(index);
        this.dimmed[index] = true;
    }

    undimModel(index:number) {
        this._colorService.undimModel(index);
        this.dimmed[index] = false;
    }

    findItem(searchTerm: string){
        this._colorService.dimAll();

        if(this.showSearchByGlobalId){
          this._colorService.colorSubsetGlobalIds([searchTerm], "red", searchTerm);
        }
        if(this.showSearchByExpressId){
            // console.log(searchTerm)
          this._colorService.colorSubset([parseInt(searchTerm)], "red", searchTerm);
        }
        this.closeSearchBars();
    }

    closeSearchBars(){
        this.showSearchByGlobalId = false;
        this.showSearchByExpressId = false;
    }


}
