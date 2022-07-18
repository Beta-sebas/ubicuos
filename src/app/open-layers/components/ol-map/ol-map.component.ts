import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { delay, tap } from 'rxjs';

import BaseLayer from 'ol/layer/Base';
import { Coordinate } from 'ol/coordinate';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import Overlay from 'ol/Overlay';
import * as Proj from 'ol/proj'
import TileLayer from 'ol/layer/Tile';
import { toLonLat } from 'ol/proj';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';


import { OpenLayerService } from '../../services/open-layer.service';

export const DEFAULT_HEIGHT = '500px';
export const DEFAULT_WIDTH = '500px';

@Component({
  selector: 'app-ol-map',
  templateUrl: './ol-map.component.html',
  styleUrls: ['./ol-map.component.css']
})
export class OlMapComponent implements OnInit {

  @Input() lat   !: number;
  @Input() lon   !: number;
  @Input() zoom  !: number;
  @Input() width: string | number = DEFAULT_WIDTH;
  @Input() height: string | number = DEFAULT_HEIGHT;

  //Referencia al div contenedor del ol-map
  @ViewChild('divMap') divMap!: ElementRef<HTMLDivElement>

  map!: Map;
  view!: View;
  name: string = '';
  popup!: Overlay;
  popupR!: Overlay;
  divpop!: HTMLElement;
  divpopR!: HTMLElement;
  coordenadas!: Coordinate;
  idmarcador: number = 0;
  cargando: boolean = true;
  status: boolean = false;

  constructor( private openLayerService: OpenLayerService) { }

  ngOnInit(): void {

    //Referencia a el popup
    this.divpop = document.getElementById('popup')!;
    this.divpopR = document.getElementById('popupR')!;

    //Instancia de Overlay
    this.popup = new Overlay({
      element: this.divpop,
      positioning: 'bottom-center',
      stopEvent: false
    });

    //Instancia de Overlay
    this.popupR = new Overlay({
      element: this.divpopR,
      positioning: 'bottom-center',
      stopEvent: false
    });

    this.view = new View({
      center: Proj.fromLonLat([this.lon, this.lat]),
      zoom: this.zoom
    });

  }

  ngAfterViewInit(): void {

    this.setSize();

    //Instancia del mapa
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: this.view
    });

    this.map.addOverlay(this.popup);
    this.map.addOverlay(this.popupR);

    //Evento click Izquierdo
    this.map.on('click', (e) => {
      //console.log(e);
      const feacture = this.map.forEachFeatureAtPixel(e.pixel, (feacture) => {
        return feacture;
      });
      if (feacture) {
        const coor = toLonLat(e.coordinate);
        this.popup.setPosition(e.coordinate);
        this.coordenadas = coor;
      } else {
        this.popup.setPosition(undefined);
      }
    });

    //Evento click Derecho
    this.map.getViewport().addEventListener('contextmenu', (evt) => {
      evt.preventDefault();
      //console.log(this.map.getEventCoordinate(evt));
      const feacture = this.map.forEachFeatureAtPixel(this.map.getEventPixel(evt), (feacture) => {
        return feacture;
      });
      if (feacture) {
        this.popupR.setPosition(this.map.getEventCoordinate(evt));
        //this.divpopR.innerHTML = `<h6 class="card-title">${feacture.get('name')}</h6>`;
        this.cargando = true;
        this.name = feacture.get('name');
        this.openLayerService.getSugerencias(this.name)
          .pipe(
            tap( marcador => {
              this.cargando = false;
              if (marcador[0].status == 1) {
                this.status = true;
              } else {
                this.status = false;
              } 
            })
          ).subscribe( marcador => {
            this.idmarcador = marcador[0].idmarcador;
          });
      } else {
        this.popupR.setPosition(undefined);
      }

    });

    //Evento rueda del mouse
    this.map.getViewport().addEventListener('mouseup', (evt) => {

      if (evt.button == 1) {
        const coordinate = toLonLat(this.map.getEventCoordinate(evt));
        this.popup.setPosition(this.map.getEventCoordinate(evt));
        this.coordenadas = coordinate;
      }
    });

    // cambia el cursor al estar sobre un marker
    this.map.on('pointermove', (e) => {
      if (this.map.hasFeatureAtPixel(e.pixel)) {
        this.map.getViewport().style.cursor = 'pointer';
      } else {
        this.map.getViewport().style.cursor = 'inherit';
      }
    });

    // Cerrar el popup cuando se navega por el map
    this.map.on('movestart', () => {
      this.popupR.setPosition(undefined);
      this.popup.setPosition(undefined);
    });

  }

  //establecer tamaño del div del map
  setSize() {
    if (this.divMap) {
      const style = this.divMap.nativeElement.style;
      style.width = this.width.toString() || DEFAULT_WIDTH;
      style.height = this.height.toString() || DEFAULT_HEIGHT;

    }
  }

  //Agregar marcadores al map
  setMaker(vector: VectorLayer<any>) {
    this.map.addLayer(vector);
  }
  //Obtener marcadores activos
  getMarcadores() {
    return this.map.getLayers().getArray();
  }
  //Eliminar vector del marcador
  deleteLayer(layer: BaseLayer) {
    return this.map.removeLayer(layer);
  }
  //Animación para marcadores
  flyToMarker(lon: number, lat: number) {
    const center = Proj.fromLonLat([lon, lat]);
    const duration = 1500;
    const zoom = this.view.getZoom() || 0;
    let parte = 2;
    let fin = false;

    function animacion(completa: boolean) {
      --parte;
      if (fin) {
        return;
      }
      if (parte === 0 || !completa) {
        fin = true;
      }
    }

    this.view.animate({
      center,
      duration,
    },
      animacion
    );

    this.view.animate(
      {
        zoom: zoom - 1,
        duration
      },
      {
        zoom: zoom + 1,
        duration
      },
      animacion
    );
  }

   /* evento(e: MouseEvent) {
    //console.log(e.button);
  } */

}
