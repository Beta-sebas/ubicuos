import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styles: [
  ]
})
export class PopupComponent implements OnChanges {

  @Input() coordenadas!: any;
  Lat!: number ;
  Lon!: number ; 

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
     
    if (changes['coordenadas'].currentValue == undefined) {
      this.Lat=0;
      this.Lon=0;
    } else {
      this.Lon = changes['coordenadas'].currentValue[0];
      this.Lat = changes['coordenadas'].currentValue[1];
    }
    
  }

}
