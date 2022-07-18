import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';


const routes: Routes = [
  {
    path: '', 
    children: [
      {path: 'home', component: MainPageComponent},
      {path: '**', redirectTo: 'home'}
  ] }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class MainRoutingModule { }
