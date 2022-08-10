import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('src/app/home/home.module').then(m => m.HomeModule)
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  // Add not found component later on
  //{path: '**', },
  // Components
  {
    path: 'bsf-building-components',
    loadChildren: () => import('src/app/bsf-building-components/bsf-building-components.module').then(m => m.BsfBuildingComponentsModule)
  },
  {
    path: 'ifc-properties',
    loadChildren: () => import('src/app/ifc-properties/ifc-properties.module').then(m => m.IfcPropertiesModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
