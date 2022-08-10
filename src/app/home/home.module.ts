import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [HomeComponent],
    imports: [ 
        CommonModule,
        FormsModule,
        RouterModule.forChild([
            {
            path: '',
            component: HomeComponent,
            }
        ]),
        FlexLayoutModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatIconModule,
     ],
    exports: [],
    providers: [],
})
export class HomeModule {}