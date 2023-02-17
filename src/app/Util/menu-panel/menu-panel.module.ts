import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';

import { MenuPanelComponent } from './menu-panel.component';
import { SearchBarComponent } from './search-bar/search-bar.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        MatInputModule
    ],
    exports: [MenuPanelComponent],
    declarations: [
        MenuPanelComponent,
        SearchBarComponent
    ],
    providers: [],
})
export class MenuPanelModule { }
