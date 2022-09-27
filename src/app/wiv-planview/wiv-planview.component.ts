import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModelLoaderService } from 'src/services/model-loader.service';
import { WebIfcViewerService } from 'src/services/web-ifc-viewer.service';
import { LineBasicMaterial, MeshBasicMaterial } from 'three';
import { IfcAPI } from 'web-ifc';
import { PlanviewService } from './wiv-planview.service';
import Drawing from 'dxf-writer';

@Component({
  selector: 'app-wiv-planview',
  templateUrl: './wiv-planview.component.html',
  styleUrls: ['./wiv-planview.component.scss']
})
export class WivPlanviewerComponent implements OnInit {

  fileName = '';
  public viewer?: any;
  public model: any;
  public plans: any;
  public currentPlan: any;
  public allPlans: any;
  public storeys: any;

  constructor(
    private _viewer: WebIfcViewerService,
    private _load: ModelLoaderService,
    private _vs: PlanviewService
  ){}

  async ngOnInit() {
    const container = document.getElementById('viewer-container');

    this.viewer = await this._viewer.instantiateViewer(container);
    console.log(this.viewer)

  }

  public async onIFCLoad(event: any){
    let file: File = event.target.files[0];
    this.fileName = file.name;

    try{
        // Load the file
        this.model = await this._load.loadFileWIV(this.viewer, file);
        console.log(this.model)


        // Setup camera controls
        const controls = this.viewer.context.ifcCamera.cameraControls;
        controls.setPosition(7.6, 4.3, 24.8, false);
        controls.setTarget(-7.1, -0.3, 2.5, false);

        await this.viewer.plans.computeAllPlanViews(this.model.modelID);

        const lineMaterial = new LineBasicMaterial({ color: 'black' });
        const baseMaterial = new MeshBasicMaterial({
          polygonOffset: true,
          polygonOffsetFactor: 1, // positive value pushes polygon further away
          polygonOffsetUnits: 1,
        });
        await this.viewer.edges.create('example', this.model.modelID, lineMaterial, baseMaterial);

        // Create plans
        await this.getFloorPlans()

        // Get storey to later get all elements of the storey
        const ifcProject = await this.viewer.IFC.getSpatialStructure(this.model.modelID);
        this.storeys = ifcProject.children[0].children[0].children;
        for (let storey of this.storeys) {
          for (let child of storey.children) {
            if (child.children.length) {
              storey.children.push(...child.children);
            }
          }
        }

        // Init DXF
        this.viewer.dxf.initializeJSDXF(Drawing);

    }catch(err){
      console.log(err);
    }
  }

  public async getFloorPlans() {
    this.plans = await this._vs.getFloorPlans(this.viewer, this.model);
  }

  public showPlanView(plan: any) {
    console.log(plan)
    this.viewer.plans.goTo(this.model.modelID, plan.expressID);
	  this.viewer.edges.toggle('example', true);
  }

  public exitPlanView() {
    this.viewer.plans.exitPlanView();
		this.viewer.edges.toggle('example', false);
  }

  public async downloadDXF(plan: any) {

    const storey = this.storeys.find((storey: { expressID: any; }) => storey.expressID === plan.expressID);
    const modelID = plan.modelID;
    const dummySubsetMat = new MeshBasicMaterial({visible: false});

    // Floor plan export
    // Create a new drawing (if it doesn't exist)
	if (!this.viewer.dxf.drawings[plan.name]) this.viewer.dxf.newDrawing(plan.name);

	// Get the IDs of all the items to draw
	const ids = storey.children.map((item: { expressID: any; }) => item.expressID);

	// If no items to draw in this layer in this floor plan, let's continue
	if (!ids.length) return;

	// If there are items, extract its geometry
	const subset = this.viewer.IFC.loader.ifcManager.createSubset({
		modelID,
		ids,
		removePrevious: true,
		customID: 'floor_plan_generation',
		material: dummySubsetMat,
	});

	// Get the projection of the items in this floor plan
	const filteredPoints = [];
	const edges = await this.viewer.edgesProjector.projectEdges(subset);
	const positions = edges.geometry.attributes.position.array;

	// Lines shorter than this won't be rendered
	const tolerance = 0.01;
	for (let i = 0; i < positions.length - 5; i += 6) {

		const a = positions[i] - positions[i + 3];
		// Z coords are multiplied by -1 to match DXF Y coordinate
		const b = -positions[i + 2] + positions[i + 5];

		const distance = Math.sqrt(a * a + b * b);

		if (distance > tolerance) {
			filteredPoints.push([positions[i], -positions[i + 2], positions[i + 3], -positions[i + 5]]);
		}

	}

	// Draw the projection of the items
	this.viewer.dxf.drawEdges(plan.name, filteredPoints, 'Projection', Drawing.ACI.BLUE, 'CONTINUOUS');

	// Clean up
	edges.geometry.dispose();


	// Draw all sectioned items. thick and thin are the default layers created by IFC.js
		this.viewer.dxf.drawNamedLayer(plan.name, plan, 'thick', 'Section', Drawing.ACI.RED, 'CONTINUOUS');
		this.viewer.dxf.drawNamedLayer(plan.name, plan, 'thin', 'Section_Secondary', Drawing.ACI.CYAN, 'CONTINUOUS');

	// Download the generated floorplan
	const result = this.viewer.dxf.exportDXF(plan.name);
	const link = document.createElement('a');
	link.download = 'floorplan.dxf';
	link.href = URL.createObjectURL(result);
	document.body.appendChild(link);
	link.click();
	link.remove();



  }


}
