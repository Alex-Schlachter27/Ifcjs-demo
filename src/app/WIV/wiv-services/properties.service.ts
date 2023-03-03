import { Injectable } from '@angular/core';
import { decodeString } from 'src/app/Util/pipes/character-decode';
import { IfcViewerAPI } from 'web-ifc-viewer';
import { schedulePropClass, SchedulePropNames } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {

  public loadedModels: number[] = [];

  constructor( ) { }
  async getProperties(viewerApi: IfcViewerAPI, elementID: number, modelID: number = 0, indirect: boolean = true, recursive: boolean = true): Promise<void>{

    // Get properties
    const properties = await viewerApi.IFC.getProperties(modelID, elementID, indirect, recursive);
    console.log(properties)

    // this.properties = properties;
    // this.psetProperties = psetProperties;

    return properties

  }

  getPropertySets(ifcJsonProps: any, ids: number[]) {
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      let props = ifcJsonProps[id];
      const propertyValues = Object.values(ifcJsonProps);
      const allPsetsRels = propertyValues.filter((item:any) => item.type === 'IFCRELDEFINESBYPROPERTIES');
      const relatedPsetsRels = allPsetsRels.filter((item:any) => item.RelatedObjects.includes(id));
      const psets = relatedPsetsRels.map((item:any) => ifcJsonProps[item.RelatingPropertyDefinition]);
      console.log(psets)
      // Properties
      for(let pset of psets) {
        if(pset.HasProperties) {
          pset.HasProperty = pset.HasProperties.map((id:any) => ifcJsonProps[id]);
        }
        else if (pset.Quantities) {
          pset.HasQuantity = pset.Quantities.map((id:any) => ifcJsonProps[id]);
        }
        else console.log("Pset has no property or quantity values", pset)
      }

      // Quantities
      props.psets = psets;
      console.log(props)
    }
  }

  getAllElementsWithStartStopDate(ifcJsonProps: any, startPropName: string, stopPropName: string, modelID: number) {
      console.time("processSimulationProps")
      const propValues = Object.values(ifcJsonProps);
      const allSingleValueProps = []
      const allPsets = [];
      const allPsetsRels = [];
      const startProps = [];
      for (let i = 0; i < propValues.length; i++) {
        const propValue: any = propValues[i];
        if(propValue.type === 'IFCPROPERTYSINGLEVALUE') {
          allSingleValueProps.push(propValue);
          if(propValue.Name === startPropName) startProps.push(propValue);
        }
        if(propValue.type === 'IFCPROPERTYSET') allPsets.push(propValue);
        if(propValue.type === 'IFCRELDEFINESBYPROPERTIES') allPsetsRels.push(propValue);
      }

      let simulationList: any[] = [];
      let dates: Date[] = [];

      // Go thorugh all start props
      for (let i = 0; i < startProps.length; i++) {
        const startProp = startProps[i];
        let relatedPsets = allPsets.filter((item:any) => item.HasProperties.includes(startProp.expressID));
        if (relatedPsets.length > 1) console.log("related psets count (should only be one): ", relatedPsets.length)
        let relatedPset = relatedPsets[0];

        // relatedPsetsRels
        const relatedPsetRel = allPsetsRels.filter((item:any) => item.RelatingPropertyDefinition === relatedPset.expressID)[0];
        // Probably always array of length 1
        const relatedObjects = relatedPsetRel.RelatedObjects;

        // Get 4D props
        let finishProp: any;
        let activityName: any;
        for (let propId of relatedPset.HasProperties) {
          if(ifcJsonProps[propId].Name === stopPropName) finishProp = ifcJsonProps[propId];
          if(ifcJsonProps[propId].Name === "PAA_4D-Name") activityName = decodeString(ifcJsonProps[propId].NominalValue)
        }
        // console.log(startProp.NominalValue, finishProp.NominalValue)
        const startDate = new Date(startProp.NominalValue)
        const finishDate = new Date(finishProp.NominalValue)

        // console.log(relatedObjects, startDate, finishDate);
        for (let el of relatedObjects) {
          simulationList.push({expressID: el, startDate, finishDate, activityName, modelID})
          dates.push(startDate)
          dates.push(finishDate)
        }

      }

      dates.sort((date1, date2) => date1.valueOf() - date2.valueOf()); // See https://stackoverflow.com/questions/36560806/the-left-hand-side-of-an-arithmetic-operation-must-be-of-type-any-number-or

      console.timeEnd("processSimulationProps")
      return {simulationList, dates}
    }

    getAllElementsWithScheduleProps(ifcJsonProps: any, scheduleProperties: schedulePropClass[], modelID: number) {

      const searchPropName = scheduleProperties[0].Name; // "PAA_4D-Name"

      console.time("processSimulationProps")
      const propValues = Object.values(ifcJsonProps);
      const allSingleValueProps = []
      const allPsets = [];
      const allPsetsRels = [];
      const searchProps = [];

      // Prep
      for (let i = 0; i < propValues.length; i++) {
        const propValue: any = propValues[i];
        if(propValue.type === 'IFCPROPERTYSINGLEVALUE') {
          allSingleValueProps.push(propValue);
          if(propValue.Name === searchPropName) searchProps.push(propValue);
        }
        if(propValue.type === 'IFCPROPERTYSET') allPsets.push(propValue);
        if(propValue.type === 'IFCRELDEFINESBYPROPERTIES') allPsetsRels.push(propValue);
      }

      let simulationList: any[] = [];
      let dates: Date[] = [];

      // Go thorugh all search props and get Pset
      for (let i = 0; i < searchProps.length; i++) {
        const searchProp = searchProps[i];
        let relatedPsets = allPsets.filter((item:any) => item.HasProperties.includes(searchProp.expressID));
        if (relatedPsets.length > 1) console.log("related psets count (should only be one): ", relatedPsets.length);
        let relatedPset = relatedPsets[0]; // Pset with all schedule data

        // relatedPsetsRels
        const relatedPsetRel = allPsetsRels.filter((item:any) => item.RelatingPropertyDefinition === relatedPset.expressID)[0];
        // Probably always array of length 1
        const relatedObjects = relatedPsetRel.RelatedObjects;

        // properties per element
        let filledScheduleProperties: schedulePropClass[] = [];

        // Get all 4D props
        for (let propId of relatedPset.HasProperties) {
          for (let scheduleProperty of scheduleProperties) {

            // console.log(scheduleProperty.Name)
            // if(ifcJsonProps[propId].Name === scheduleProperty.Name) console.log(scheduleProperty.Name, ifcJsonProps[propId].Name, decodeString(ifcJsonProps[propId].NominalValue))

            // Get property from ifc-property-list and write values to scheduleProperties
            if(ifcJsonProps[propId].Name === scheduleProperty.Name) {
              // Set expressId
              scheduleProperty.expressID = propId;

              // Set value
              if (scheduleProperty.type === "DATE") {
                scheduleProperty.value = new Date(ifcJsonProps[propId].NominalValue);
                dates.push(scheduleProperty.value)
              }
              if (scheduleProperty.type === "STRING") scheduleProperty.value = decodeString(ifcJsonProps[propId].NominalValue);
              if (scheduleProperty.type === "ANY") scheduleProperty.value = ifcJsonProps[propId].NominalValue;

              const copiedProperty = {...scheduleProperty}; // OR JSON.parse(JSON.stringify(scheduleProperty))
              filledScheduleProperties.push(copiedProperty)
              // console.log(scheduleProperty) // Gets overwritten by the last value of the loop somehow!
            }
          }
        }

        // let activityName: any;
        // for (let propId of relatedPset.HasProperties) {
        //   if(ifcJsonProps[propId].Name === "PAA_4D-Name") activityName = decodeString(ifcJsonProps[propId].NominalValue)
        // }

        // console.log(filledScheduleProperties)
        // console.log(relatedObjects, startDate, finishDate);
        // console.log(scheduleProperties)
        for (let el of relatedObjects) {
          simulationList.push({expressID: el, modelID, scheduleProperties: filledScheduleProperties})
        }

      }

      dates.sort((date1, date2) => date1.valueOf() - date2.valueOf()); // See https://stackoverflow.com/questions/36560806/the-left-hand-side-of-an-arithmetic-operation-must-be-of-type-any-number-or

      console.timeEnd("processSimulationProps")
      return {simulationList, dates}
    }
}
