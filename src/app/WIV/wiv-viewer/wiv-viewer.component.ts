import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModelLoaderService } from 'src/services/model-loader.service';
import { WebIfcViewerService } from 'src/services/web-ifc-viewer.service';
import { PropertiesService } from '../wiv-services/properties.service';
import { ContextMenuButtons, ElementClickEvent, ModelViewerSettings, PickedObject, XYScreenCoordinate } from '../models';
import { IfcViewerAPI } from 'web-ifc-viewer';
import { DatesRange, RangeSliderService } from '../wiv-services/slider.service';
import { Color, DoubleSide, MeshLambertMaterial } from 'three';

class SimulationEl {
  expressID: number;
  startDate: Date;
  finishDate: Date;
  activityName: string;

  constructor(expressID: number, startDate: Date, finishDate: Date, activityName: string){
    this.expressID = expressID;
    this.startDate = startDate;
    this.finishDate = finishDate;
    this.activityName = activityName;
}
}
@Component({
  selector: 'app-wiv-viewer',
  templateUrl: './wiv-viewer.component.html',
  styleUrls: ['./wiv-viewer.component.scss']
})
export class WivViewerComponent implements OnInit {

  // Viewer
  public settings: ModelViewerSettings = new ModelViewerSettings();
  public viewer?: IfcViewerAPI;
  // @Output() elementClick = new EventEmitter<ElementClickEvent>();
  // @Output() canvasClick = new EventEmitter<MouseEvent>();

  public contextMenuPosition?: XYScreenCoordinate;
  public elementClickContext?: ElementClickEvent;
  public pickingMode?: boolean;

  // Models
  public models: any = [];

  // Model
  fileName = '';
  public model: any;
  public modelId?: number;

  // Properties
  public contextMenuButtons: ContextMenuButtons
  public properties?: any[] = undefined;
  public showPropertyPanel: boolean = false;

  // Slider
  public dateRangeSettings?: DatesRange;
  public startDate?: Date;
  public endDate?: Date;

  // range slider
  public sliderChangeRes: string = "";

  // Simulation
  public simulationList?: SimulationEl[];
  public currentElements: number[] = [];
  public existingElements: number[] = [];
  public hiddenElements: number[] = [];
  // public selection = [284470, 284669, 284822, 284954, 300200, 300332, 300464, 300596, 300728, 300860, 300992, 301124, 301256, 301378, 320806, 340208, 359746, 434140, 447974, 461808, 475642, 489476, 503310, 518393, 533435, 533565, 548607, 563644, 578681, 593718, 608755, 629296, 629426, 644480, 659527, 659657, 674697]


  constructor(
    private _viewer: WebIfcViewerService,
    private _load: ModelLoaderService,
    private _props: PropertiesService,
    private _s: RangeSliderService,
    ) {
      this.contextMenuButtons = new ContextMenuButtons()
      this.contextMenuButtons.showProperties = true;
      this.settings.loadProperties = false;
    }

  async ngOnInit() {
    const container = document.getElementById('viewer-canvas');
    this.viewer = await this._viewer.instantiateViewer(container);
  }

  public async onIFCLoad(event: any){
    if(!this.viewer) return
    //TODO
      // Only allow IFC files!

    let file: File = event.target.files[0];
    console.log(file)
    this.fileName = file.name;

    // Load the file
    const { model, properties } = await this._load.loadFileWIV(this.viewer, file, this.settings);
    this.models.push(model)
    this.model = model;
    if (properties != undefined) this.properties = properties;
    console.log(this.model)

    this.pickingMode = true

    // Set viewer behavior
    // const el = this.highlightSelection(0, this.selection, true);
    // console.log(el)

    // On Click
    // TO DO
      // See MHRA lbd or component viewer how to use canvas
    // window.onclick = async (ev: any) => {
    //   if(!this.viewer) return
    //   const result = await this.viewer.IFC.selector.pickIfcItem();
    //   if (!result) {
    //     console.log("unhighlight!!")
    //     // Canvas click
    //     this.closeContextMenu();
    //     this.viewer.IFC.selector.unpickIfcItems();
    //     this.viewer.IFC.selector.unHighlightIfcItems();
    //     this.pickingMode = true;
    //     return
    //   };

    //   const { modelID, id } = result;

    //   this.openContextMenu(ev);

    //   this.elementClickContext = {expressID: id, modelID: modelID, mouseEvent: ev};
    //   // console.log(this.elementClickContext)
    // }

    // On Mouseover
    // window.onmousemove = async (ev: any) => {
    //   if(!this.pickingMode) return
    //   const result = await this.viewer.IFC.selector.prePickIfcItem();
    //   console.log(result)
    // }

    // On DoubleClick
    // window.ondblclick = () => {
    //   this.closeContextMenu();
    //   this.pickingMode = false;
    //   this.viewer.IFC.selector.highlightIfcItem(true)
    // }

  }

  public openContextMenu(ev: any){
    const x = ev.clientX + 'px';
    const y = ev.clientY + 'px';
    this.contextMenuPosition = {x, y};
  }

  public closeContextMenu(){
    this.contextMenuPosition = undefined;
  }

  async showPropertiesPanel(){
    if(!this.viewer || this.elementClickContext == undefined || this.elementClickContext == undefined) return;

    await this._props.getProperties(this.viewer, this.elementClickContext.expressID, this.elementClickContext.modelID);
    // this.showPropertyPanel = true;

  }

  public async initSimulationFromProps() {
    if(!this.viewer) return
    this.properties = await this._load.loadAllProperties(this.viewer, this.model, this.settings.downloadProperties)
    // console.log(JSON.stringify(this.properties).slice(0,100))

    // TODO: For different models
    const {simulationList, dates} = this._props.getAllElementsWithStartStopDate(this.properties, "PAA_Baseline Start", "PAA_Baseline Finish");
    console.log(simulationList)

    this.simulationList = simulationList as SimulationEl[];

    this.startDate = dates[0];
    this.endDate = dates.slice(-1)[0];
    console.log(this.startDate, this.endDate)

    if(this.endDate && this.startDate) {
      this.dateRangeSettings = await this.buildDateInterval(this.startDate, this.endDate);
      console.log(this.dateRangeSettings)
    }
    else {
      console.log("dates are not correct")
    }

    // Hide model, so subsets can be shown
    // this.hideModel(0);
    this.dimModel(0);
    this.viewer.shadowDropper.deleteShadow("0");
  }

  async buildDateInterval(startDate: Date, endDate: Date){
    return await this._s.getDaysBetweenDates(startDate, endDate);
  }

  highlightElementsOnDate(currentDate: Date) {
    // console.log(currentDate)
    if(!this.simulationList || !this.viewer) return

    const scene = this.viewer.context.getScene();

    // get all elements that are currently built and already built
    this.currentElements = []
    this.existingElements = []

    for (let i = 0; i < this.simulationList.length; i++) {
      const item = this.simulationList[i];

      if (item.startDate <= currentDate && currentDate <= item.finishDate) {
        // currently built
        this.currentElements.push(item.expressID);
      } else if (item.finishDate < currentDate) {
        // already built
        this.existingElements.push(item.expressID);
      }
      else {
        // built in future
        this.hiddenElements.push(item.expressID);
      }
    }

    // Show existing with grey color?
    const existingElements = this.createSubsetOfIds(0, this.existingElements, "existing elements", "grey");
    if(existingElements) scene.add(existingElements);

    // highlight
    const highlightedElements = this.createSubsetOfIds(0, this.currentElements, "current elements", "yellow");
    // console.log(highlightedElements)
    if(highlightedElements) scene.add(highlightedElements);
  }


  highlightSelection(modelID: number, ids: number[], removePrevious: boolean = false) {
    const viewerApi = this.viewer as IfcViewerAPI
    // console.log("highlight:", ids)
    return viewerApi.IFC.selector.highlight.newSelection(modelID, ids, removePrevious)
  }

  createSubsetOfIds(modelID: number, ids: number[], name: string, color?: string) {
    if(!this.viewer) return

    let material = undefined
    if(color != undefined) {
      material = new MeshLambertMaterial({
        color: new Color(color),
        depthTest: true,
        side: DoubleSide
      });
    }


    const scene = this.viewer.context.getScene()
    const subset = this.viewer.IFC.loader.ifcManager.createSubset({
      modelID,
      scene,
      ids,
      removePrevious: true,
      material,
      customID: name,
    });
    return subset
  }

  public hideModel(modelID: number){
    if(!this.viewer) return
    const scene = this.viewer.context.getScene();

    for (let i = 0; i < scene.children.length; i++) {
      const child: any = scene.children[i];
      if(Object.keys(child).includes("modelID")) {
        if(child["modelID"] == modelID) {
          child.visible = false;
          // this.pickingService.makeModelUnpickable(modelID)
        }
        // this.viewerService.scene.remove(child);
        // if (subset.mesh.parent) subset.mesh.removeFromParent();
      }
    }
  }


  public dimModel(modelID: number){

    // Get model
    const model = this.models[modelID];

    if(model == undefined) return;

    // Set new transparency settings
    if(Array.isArray(model.material)){
      model.material.forEach((mat: any) => {
        mat.transparent = true;
        mat.opacity = 0.05;
        mat.color = "grey"
      });
    }else{
      model.material.transparent = true;
      model.material.opacity = 0.05;
      model.material.color = "grey"
    }
  }

}
