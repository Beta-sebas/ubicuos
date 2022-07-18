import { Component, ViewChild } from '@angular/core';
import { tap } from 'rxjs';
import { Marcador } from "../../interfaces/marcador.interface";
import { OpenLayerService } from "../../services/open-layer.service";
import { OlMapComponent } from '../ol-map/ol-map.component';

@Component({
  selector: 'app-ol-map-search',
  templateUrl: './ol-map-search.component.html',
  styles: [
  ]
})
export class OlMapSearchComponent {

  @ViewChild(OlMapComponent) mapa!: OlMapComponent;
  mostrarSugerencias: boolean = false;
  limpiar: boolean = false;
  termino: string = "";
  marcadores: Marcador[] = [];
  marcadoresSugeridos: Marcador[] = [];
  sinSugerencias: boolean = false;
  pintarMarcador: boolean = false;
  consulta: boolean = false;


  constructor(private openLayerService: OpenLayerService) { }

  animacion(lat: number, lon: number) {
    this.mapa.flyToMarker(lon, lat);
  }

  getMarcadores(indice: number) {
    //console.log(indice);

    const MarcadoresActivos = this.mapa.getMarcadores();
    this.mapa.deleteLayer(MarcadoresActivos[indice + 1]);
    this.marcadores.splice(indice, 1);

    if (this.marcadores.length == 0) {
      this.pintarMarcador = false;
    }
  }

  mostrarMarcador(termino: number) {
    this.limpiar = true;
    this.mostrarSugerencias = false;
    this.consulta = false;
    this.openLayerService.getMarcador(termino)
      .pipe(
        tap((_) => {
          //console.log(this.marcadores);
        })
      )
      .subscribe((marcador) => {
        this.marcadores.push(marcador);
        this.pintarMarcador = true;

      })
  }

  sugerencias(busqueda: string | null) {

    if (busqueda == null) {
      this.termino == "";
    } else {
      this.termino = busqueda;
      this.consulta = true;
      this.openLayerService.getSugerencias(busqueda)
        .pipe(
          tap((marcadores) => {
            if (this.termino.length == 0) {
              this.mostrarSugerencias = false;
              this.consulta = false;
              return;
            }
            if (marcadores.length == 0) {
              this.mostrarSugerencias = false;
            } else {
              this.mostrarSugerencias = true; 
            }
          })
        )
        .subscribe((marcadores) => {
          //this.marcadores = marcadores;
          this.marcadoresSugeridos = marcadores.slice(0, 5);
        })
      this.limpiar = false;
    }

  }

}
