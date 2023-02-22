import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { WivViewerComponent } from './wiv-viewer.component';
import { SpinnerComponent } from 'src/app/Util/spinner/spinner.component';
import { PropertyPanelComponent } from 'src/app/Util/property-panel/property-panel.component';
import { ContextMenuComponent } from 'src/app/Util/context-menu/context-menu.component';
import { DecodeSTEPPipe } from 'src/app/Util/pipes/decode-step.pipe';
import { MatMenuModule } from '@angular/material/menu';
import {MatSliderModule} from '@angular/material/slider';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { SliderModule } from 'src/app/Util/slider/slider.module';



@NgModule({
  declarations: [
    WivViewerComponent,
    ContextMenuComponent,
    PropertyPanelComponent,
    SpinnerComponent,
    DecodeSTEPPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
        {
        path: '',
        component: WivViewerComponent,
        }
    ]),
    MatButtonModule,
    MatSliderModule,
    MatIconModule,
    MatButtonToggleModule,
    FlexLayoutModule,
    MatMenuModule,
    MatSliderModule,
    SliderModule
 ],
exports: [],
providers: [],
})
export class WivViewerModule { }
