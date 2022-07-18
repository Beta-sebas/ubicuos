import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerMapaComponent } from './pages/ver-mapa/ver-mapa.component';
import { VerMarkersComponent } from './pages/ver-markers/ver-markers.component';
import { VerDatosComponent } from './pages/ver-datos/ver-datos.component';

const routes: Routes = [
  {
    path:'',
    children: [
      {path:'map', component: VerMapaComponent},
      {path: 'markers', component: VerMarkersComponent },
      {path: 'datos/:id', component: VerDatosComponent },
      {path: '**', redirectTo: 'map'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpenLayersRoutingModule { }
