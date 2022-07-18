import { Component, Input, OnInit } from '@angular/core';

import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import * as Proj from 'ol/proj';
import { Icon, Style } from 'ol/style';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';

import { OlMapComponent } from '../ol-map/ol-map.component';

export const DEFAULT_LAT = 2.441692;
export const DEFAULT_LON = -76.606411;
export const DEFAULT_ANCHOR = [0.5, 1];
export const DEFAULT_ICON = './assets/map.png';
export const DEFAULT_TEXT = '';

@Component({
  selector: 'app-ol-maker',
  templateUrl: './ol-maker.component.html',
  styles: [
  ]
})
export class OlMakerComponent implements OnInit {

  @Input() lat: number = DEFAULT_LAT;
  @Input() lon: number = DEFAULT_LON;
  @Input() anchor: number[] = DEFAULT_ANCHOR;
  @Input() icon: string = DEFAULT_ICON;
  @Input() text: string = DEFAULT_TEXT;

  constructor(private map: OlMapComponent) { }

  ngOnInit(): void {

    const maker = new Feature({
      geometry: new Point(Proj.fromLonLat([this.lon, this.lat])),
      name: this.text
    });

    maker.setStyle(
      new Style({
        image: new Icon({
          anchor: this.anchor,
          crossOrigin: 'anonymous',
          src: this.icon
        })
      })
    );

    const vectorSource = new VectorSource({
      features: [maker]
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource
    });

    if (this.map.map) {
      this.map.setMaker( vectorLayer );
    }
    else {
      setTimeout( () => {
        this.ngOnInit();
      }, 100 )
    }
  }
}
