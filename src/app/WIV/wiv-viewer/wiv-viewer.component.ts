import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModelLoaderService } from 'src/services/model-loader.service';
import { WebIfcViewerService } from 'src/services/web-ifc-viewer.service';
import { PropertiesService } from '../wiv-services/properties.service';
import { activityType, ContextMenuButtons, ElementClickEvent, ModelViewerSettings, PickedObject, propType, schedulePropClass, SimulationEl, XYScreenCoordinate } from '../models';
import { IfcViewerAPI } from 'web-ifc-viewer';
import { DatesRange, RangeSliderService } from '../wiv-services/slider.service';
import { Color, DoubleSide, MeshLambertMaterial } from 'three';

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
  public propertyModelList: {[key: number]: {model: any, properties: any[]}} = {};
  public propertyList: any[] = [];
  public properties = [];
  public showPropertyPanel: boolean = false;

  // Slider
  public dateRangeSettings?: DatesRange;
  public dates: Date[] = [];
  public startDate?: Date;
  public endDate?: Date;

  // range slider
  public sliderChangeRes: string = "";

  // Simulation
  // public simulationList: SimulationEl[] = [];
  public simulationList: {[key: number]: SimulationEl[]} = {};
  public currentElements: any[] = [];
  public existingElements: any[] = [];
  public hiddenElements: any[] = [];


  public scheduleProperties = [
    {expressID: undefined, Name: "PAA_4D-Name", value: undefined, type: propType.STRING, activityType: activityType.CONSTRUCT},
    {expressID: undefined, Name: "PAA_4D", value: undefined, type: propType.STRING, activityType: activityType.CONSTRUCT},
    {expressID: undefined, Name: "PAA_4D_Actual Start", value: undefined, type: propType.DATE, activityType: activityType.CONSTRUCT},
    {expressID: undefined, Name: "PAA_4D_Actual Finish", value: undefined, type: propType.DATE, activityType: activityType.CONSTRUCT},
    {expressID: undefined, Name: "PAA_4D_Baseline Start", value: undefined, type: propType.DATE, activityType: activityType.CONSTRUCT},
    {expressID: undefined, Name: "PAA_4D_Baseline Finish", value: undefined, type: propType.DATE, activityType: activityType.CONSTRUCT},
    {expressID: undefined, Name: "PAA_4D_Demolish-Name", value: undefined, type: propType.STRING, activityType: activityType.DEMOLISH},
    {expressID: undefined, Name: "PAA_4D_Demolish", value: undefined, type: propType.STRING, activityType: activityType.DEMOLISH},
    {expressID: undefined, Name: "PAA_4D_Actual Start Demolish", value: undefined, type: propType.DATE, activityType: activityType.DEMOLISH},
    {expressID: undefined, Name: "PAA_4D_Actual Finish Demolish", value: undefined, type: propType.DATE, activityType: activityType.DEMOLISH},
    {expressID: undefined, Name: "PAA_4D_Baseline Start Demolish", value: undefined, type: propType.DATE, activityType: activityType.DEMOLISH},
    {expressID: undefined, Name: "PAA_4D_Baseline Finish Demolish", value: undefined, type: propType.DATE, activityType: activityType.DEMOLISH},
  ]

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

    let files: File[] = event.target.files;
    // console.log(files)

    // Load the file
    for (let file of files) {
      const { model, properties } = await this._load.loadFileWIV(this.viewer, file, this.settings);
      this.models.push(model)
    }


    this.pickingMode = true

    // Set viewer behavior
    // const el = this.highlightSelection(0, this.selection, true);
    // console.log(el)

    // On Click
    // TO DO
      // See MHRA lbd or component viewer how to use canvas
    window.onclick = async (ev: any) => {
      if(!this.viewer || !this.pickingMode) return
      const result = await this.viewer.IFC.selector.pickIfcItem();
      if (!result) {
        console.log("unhighlight!!")
        // Canvas click
        this.closeContextMenu();
        this.viewer.IFC.selector.unpickIfcItems();
        this.viewer.IFC.selector.unHighlightIfcItems();
        this.pickingMode = true;
        return
      };

      const { modelID, id } = result;

      this.openContextMenu(ev);

      this.elementClickContext = {expressID: id, modelID: modelID, mouseEvent: ev};
      // console.log(this.elementClickContext)
    }

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
    this.pickingMode = false;

    if(!this.viewer) return
    for (let i = 0; i < this.models.length; i++) {

      const model = this.models[i]
      const properties = await this._load.loadAllProperties(this.viewer, model, this.settings.downloadProperties)
      if (properties != undefined) {
        // this.propertyModelList[model.modelID] = { model, properties };
        this.propertyList.push(properties)
      }

      // const {simulationList, dates} = this._props.getAllElementsWithStartStopDate(properties, "PAA_4D_Baseline Start", "PAA_4D_Baseline Finish", model.modelID);
      const {simulationList, dates} = this._props.getAllElementsWithScheduleProps(properties, this.scheduleProperties, model.modelID);

      // concat
      this.simulationList[model.modelID] = simulationList as SimulationEl[];
      this.dates = [...this.dates, ...dates];
      this.dates.sort((date1, date2) => date1.valueOf() - date2.valueOf());
    }

    console.log(this.simulationList)

    this.startDate = this.dates[0];
    this.endDate = this.dates.slice(-1)[0];
    console.log(this.startDate, this.endDate)

    if(this.endDate && this.startDate) {
      this.dateRangeSettings = await this.buildDateInterval(this.startDate, this.endDate);
      // console.log(this.dateRangeSettings)
    }
    else {
      console.log("dates are not correct")
    }

    // Hide model, so subsets can be shown
    for (let i = 0; i < this.models.length; i++) {
      // this.hideModel(0);
      this.dimModel(i);
      this.viewer.shadowDropper.deleteShadow(i.toString());
    }
  }

  async buildDateInterval(startDate: Date, endDate: Date){
    return await this._s.getDaysBetweenDates(startDate, endDate);
  }

  highlightElementsOnDate(currentDate: Date) {
    // console.log(currentDate)
    if(!this.simulationList || !this.viewer) return

    const scene = this.viewer.context.getScene();

    // To DO:
    // Improve to only loop over models once --> Strucutre simulationList also by models and then create subsets for each model after and add it to scene within the loop

    // create empty arrays for each model for current and existing elements --> Set empty when slider changes!
    this.currentElements = Array(this.models.length).fill([]);
    this.existingElements = Array(this.models.length).fill([]);

    for (let i = 0; i < this.models.length; i++) {

      // Dim model
      // this.dimModel(i);

      // To DO
      // To DO
      // To DO
      // Rather check current and new elements from before and from now and remove or add from subset!

      let currentElements = [];
      let existingElements = [];

      const simulationList = this.simulationList[i];
      for (let j = 0; j < simulationList.length; j++) {
        const item = simulationList[j];
        const modelID = item.modelID;
        const scheduleProps = item.scheduleProperties as schedulePropClass[];

        const startDate = scheduleProps?.filter((item:any) => item.Name === 'PAA_4D_Actual Start')[0].value as Date;
        const finishDate = scheduleProps?.filter((item:any) => item.Name === 'PAA_4D_Actual Finish')[0].value as Date;
        // console.log(startDate, finishDate, currentDate)

        if (startDate <= currentDate && currentDate <= finishDate) {
          // currently built
          currentElements.push(item.expressID);
          this.currentElements[modelID].push(item.expressID);
          // console.log(currentDate, item, this.currentElements, this.currentElements[modelID])
        } else if (finishDate < currentDate) {
          // already built
          existingElements.push(item.expressID);
          this.existingElements[modelID].push(item.expressID);
        }
        else {
          // built in future
          // this.hiddenElements.push(item.expressID);
        }
      }

      const modelID = i;
      // Show existing with grey color?
      let exName = JSON.stringify(i) + "_existing elements";
      const existingElementssubset = this.createSubsetOfIds(modelID, existingElements, exName, "#fcfcfc");
      // console.log(existingElementssubset)
      if(existingElementssubset) scene.add(existingElementssubset);

      // highlight
      let curName = JSON.stringify(i) + "_current elements";
      // const highlightedElementsSubset = this.createSubsetOfIds(modelID, currentElements, curName, "yellow", 0.5);
      const highlightedElementsSubset = this.createSubsetOfIds(modelID, currentElements, curName, "yellow");
      // console.log(highlightedElementsSubset)
      if(highlightedElementsSubset) scene.add(highlightedElementsSubset);
    }
  }


  highlightSelection(modelID: number, ids: number[], removePrevious: boolean = false) {
    const viewerApi = this.viewer as IfcViewerAPI
    // console.log("highlight:", ids)
    return viewerApi.IFC.selector.highlight.newSelection(modelID, ids, removePrevious)
  }

  createSubsetOfIds(modelID: number, ids: number[], name: string, color?: string, opacity?: number) {
    if(!this.viewer) return

    let material = undefined
    if(color != undefined) {
      material = new MeshLambertMaterial({
        color: new Color(color),
        depthTest: true,
        side: DoubleSide
      });
      if(material && opacity) {
        material.transparent = true;
        material.opacity = opacity;
      }
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
