import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'search-bar',
    templateUrl: 'search-bar.component.html',
    styleUrls: ['search-bar.component.scss']
})

export class SearchBarComponent implements OnInit {

    @Input() label: string = "Search term";
    @Output() close = new EventEmitter<void>();
    @Output() search = new EventEmitter<string>();

    public searchTerm: string = "";

    constructor() { }

    ngOnInit() {
        console.log("aaa")
    }

    onClose(){
        this.close.emit();
    }

    doSearch(){
        console.log(`Search: ${this.searchTerm}`)
        this.search.emit(this.searchTerm);
    }

}