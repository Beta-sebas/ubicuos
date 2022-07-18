import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

import { OpenLayerService } from '../../services/open-layer.service';
import { DatosResponse } from '../../interfaces/marcador.interface';


@Component({
  selector: 'app-ver-datos',
  templateUrl: './ver-datos.component.html',
  styles: [
  ]
})
export class VerDatosComponent implements OnInit {

  datos: DatosResponse[] = [];
  nombre: string = '';

  constructor( private openLayerService: OpenLayerService, private activeRouter: ActivatedRoute) { }

  ngOnInit(): void {
    this.activeRouter.params
      .pipe(
        switchMap( ({id}) => this.openLayerService.getDatosMarcador(id))
      )
    .subscribe( datos => {
      this.datos = datos;
      this.nombre = this.datos[0].nombre; 
    })
  }

}
