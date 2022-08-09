import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BsfBuildingComponentsComponent } from './bsf-building-components.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    declarations: [BsfBuildingComponentsComponent],
    imports: [ 
        CommonModule,
        RouterModule.forChild([
            {
            path: '',
            component: BsfBuildingComponentsComponent,
            }
        ]),
        MatButtonModule,
        MatIconModule,
     ],
    exports: [],
    providers: [],
})
export class BsfBuildingComponentsModule {}