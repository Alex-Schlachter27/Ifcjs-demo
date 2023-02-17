import { Component, Input, OnChanges } from '@angular/core';
import { IfcDatatypes, IfcLabels } from './IfcDatatypesMap';
import {IfcElements} from './IfcElementsMap';

@Component({
    selector: 'property-panel',
    templateUrl: 'property-panel.component.html',
    styleUrls: ['property-panel.component.scss']
})

export class PropertyPanelComponent implements OnChanges {

    @Input() properties: any;
    @Input() psetProperties: any;

    public propertyKeys: string[] = [];
    public psetNames: string[] = [];

    public propertiesSimple: any = {};
    public propertySetsSimple: any = {};

    constructor() { }

    ngOnChanges() {
        if(this.properties != undefined){
            this.simplifyPropertiesObject();
        }
        if(this.psetProperties != undefined){
            this.buildPsetObject();
        }
    }

    simplifyPropertiesObject(){

        const { expressID, type, Name, GlobalId, Description } = this.properties;

        this.propertiesSimple.expressID = this.toJSONLDValue(expressID);
        this.propertiesSimple.type = this.toJSONLDValue(IfcElements[type]);
        this.propertiesSimple.name = this.toJSONLDValue(Name);
        this.propertiesSimple.globalID = this.toJSONLDValue(GlobalId);
        this.propertiesSimple.description = this.toJSONLDValue(Description);

        this.propertyKeys = Object.keys(this.propertiesSimple);
    }

    buildPsetObject(){
        this.psetProperties.forEach((pset: any) => {

            // Deconstruct object
            const { expressID, type, Name, GlobalId, Description, HasProperties } = pset;

            // Build pset object
            let psetObj: any = {};

            psetObj.name = this.toJSONLDValue(Name);
            psetObj.expressID = this.toJSONLDValue(expressID);
            psetObj.GlobalId = this.toJSONLDValue(GlobalId);

            psetObj.properties = HasProperties.map((prop: any) => {
                const propObj: any = {};

                propObj.name = prop.Name.value;
                propObj.value = this.nominalValueToJSONLD(prop.NominalValue)

                return propObj;
            })
            
            // Add pset name to array containing the pset names
            this.psetNames.push(psetObj.name["@value"]);

            this.propertySetsSimple[psetObj.name["@value"]] = psetObj;

        })
    }

    private toJSONLDValue(val: any){

        if(!val) return {'@value': '', '@type': 'string'};

        if(typeof val == "string"){
            return {'@value': val, '@type': 'xsd:string'}
        }
        if(typeof val == "number"){
            return {'@value': val.toString(), '@type': 'xsd:decimal'}
        }
        if('value' in val){
            return {'@value': val.value, '@type': IfcDatatypes[val.type]}
        }
        return val;
    }

    private nominalValueToJSONLD(val: any){

        if(IfcLabels[val.label] == "xsd:boolean"){
            if(val.value == "F") val.value = false;
            if(val.value == "T") val.value = true;
        }

        return {'@value': val.value, '@type': IfcLabels[val.label]}
    }

}