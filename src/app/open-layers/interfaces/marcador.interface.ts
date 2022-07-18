export interface Marcador {
    idmarcador: number;
    nombre: string;
    lat: number;
    log: number;
    status: number;
}

export interface DatosResponse {
    nombre:      string;
    humedad:     string;
    temperatura: string;
    datecreated: Date;
}
