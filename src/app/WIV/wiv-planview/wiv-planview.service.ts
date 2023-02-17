import { Injectable } from '@angular/core';
import { IfcViewerAPI } from 'web-ifc-viewer';

@Injectable({
    providedIn: 'root'
})
export class PlanviewService {

    constructor(
      ) {
      }

    public async getFloorPlans(viewer: IfcViewerAPI, model: any) {
        const allPlans = viewer.plans.getAll(model.modelID);
        let plans = []

        for (const plan of allPlans) {
            const currentPlan = viewer.plans.planLists[model.modelID][plan];
            plans.push(currentPlan)
            console.log(currentPlan);
          }
        return plans
    }
}