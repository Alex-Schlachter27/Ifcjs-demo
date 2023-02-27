import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModelLoaderService } from 'src/services/model-loader.service';
import { WebIfcViewerService } from 'src/services/web-ifc-viewer.service';
import { PropertiesService } from '../wiv-services/properties.service';
import { ContextMenuButtons, ElementClickEvent, ModelViewerSettings, PickedObject, XYScreenCoordinate } from '../models';
import { IfcViewerAPI } from 'web-ifc-viewer';
import { DatesRange, RangeSliderService } from '../wiv-services/slider.service';


@Component({
  selector: 'app-wiv-viewer',
  templateUrl: './wiv-viewer.component.html',
  styleUrls: ['./wiv-viewer.component.scss']
})
export class WivViewerComponent implements OnInit {

  // Viewer
  public settings: ModelViewerSettings = new ModelViewerSettings();
  public viewer?: any;
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
    console.log(this.viewer)

  }

  public async onIFCLoad(event: any){
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

    // On Click
    // TO DO
      // See MHRA lbd or component viewer how to use canvas
    window.onclick = async (ev: any) => {
      const result = await this.viewer.IFC.selector.pickIfcItem();
      if (!result) {
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
      console.log(this.elementClickContext)
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

    if(this.elementClickContext == undefined || this.elementClickContext == undefined) return;

    await this._props.getProperties(this.viewer, this.elementClickContext.expressID, this.elementClickContext.modelID);
    // this.showPropertyPanel = true;

  }

  public async initSimulationFromProps() {
    this.properties = await this._load.loadAllProperties(this.viewer, this.model, this.settings.downloadProperties)
    // console.log(JSON.stringify(this.properties).slice(0,100))

    const {simulationList, dates} = this._props.getAllElementsWithStartStopDate(this.properties, "PAA_Baseline Start", "PAA_Baseline Finish");
    console.log(simulationList)

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
  }

  async buildDateInterval(startDate: Date, endDate: Date){
    return await this._s.getDaysBetweenDates(startDate, endDate);
  }

  highlightElementsOnDate(currentDate: Date) {
    console.log(currentDate)

    // get all elements that are currently built

    // get all elements that are already built
  }


  highlightSelection(modelID: number, ids: number[], removePrevious: boolean = false) {
    const viewerApi = this.viewer as IfcViewerAPI
    const highlightedElements = viewerApi.IFC.selector.highlight.newSelection(modelID, ids, removePrevious)
  }

}