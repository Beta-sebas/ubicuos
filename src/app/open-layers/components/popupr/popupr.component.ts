import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'app-popupr',
  templateUrl: './popupr.component.html',
  styles: [
  ]
})
export class PopuprComponent implements OnChanges {

  @Input() nombre!: string;
  @Input() cargando!: boolean;
  @Input() status!: boolean;
  @Input() idmarcador: number = 0;

  name: string = '';
  espera: boolean = true;
  datos: boolean = false;
  id: number = 0;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['nombre']?.currentValue == undefined) {
      if (changes['nombre']?.firstChange) {
        this.name = '';
      }

    } else {
      this.name = changes['nombre']?.currentValue;
    }

    if (changes['cargando']?.currentValue == undefined) {
      if (changes['cargando']?.firstChange) {
        this.espera = true;
      }

    } else {
      this.espera = changes['cargando'].currentValue;
    }

    if (changes['status']?.currentValue == undefined) {
      if (changes['status']) {
        this.datos = false;
      }

    } else {
      this.datos = changes['status'].currentValue;
    }

    if (changes['idmarcador']?.currentValue == undefined) {
      if (changes['idmarcador']) {
        this.id = 0;
      }

    } else {
      this.id = changes['idmarcador'].currentValue;
    }

  }

}
