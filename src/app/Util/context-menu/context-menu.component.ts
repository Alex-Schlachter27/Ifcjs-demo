import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ContextMenuButtons, ElementClickEvent, XYScreenCoordinate } from 'src/app/WIV/models';

@Component({
    selector: 'ifc-viewer-context-menu',
    templateUrl: 'context-menu.component.html',
    styleUrls: ['context-menu.component.scss']
})

export class ContextMenuComponent implements OnInit, OnChanges {

    @Input() menuTopLeftPosition: XYScreenCoordinate | undefined;
    @Input() clickContext?: ElementClickEvent;
    @Input() public buttonVisibility: ContextMenuButtons = new ContextMenuButtons();

    @Output() onShowProperties = new EventEmitter<void>();

    // reference to the MatMenuTrigger in the DOM
    @ViewChild(MatMenuTrigger) private menuTrigger?: MatMenuTrigger;
    public menu: any;
    public hoveringMenu: boolean = false;
    public displayMenuTrigger: boolean = false;

    constructor() { }

    ngOnInit(){
        this.menu = document.getElementById('menuBtn');
        this.displayMenuTrigger = false;
        this.menu.style.position = 'fixed';
    }

    ngOnChanges(changes: SimpleChanges): void {

        if(this.menuTopLeftPosition == undefined || this.clickContext == undefined) return;

        // Show menu
        this.menu.style.left = this.menuTopLeftPosition.x;
        this.menu.style.top = this.menuTopLeftPosition.y;
        this.menuTrigger?.openMenu();

    }

    public setItemMenuHover(ev: boolean) {
        this.hoveringMenu = ev;
    }

    clickedItem(ev: string){
        if(ev == "properties") this.onShowProperties.emit();
    }

    public onItemMenuClosed() {
        if (this.menu && this.menu != undefined) {
          this.displayMenuTrigger = false;
        }
    }

}
