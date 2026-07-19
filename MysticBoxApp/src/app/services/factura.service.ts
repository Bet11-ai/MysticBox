import { Injectable } from "@angular/core"; 
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

export interface CrearFacturaRequest{
    idPedido: number;
    fechaFactura: string | null;
    subtotal: number;
    descuento: number;
    total: number; 
}

export interface FacturaCreada{
    idFactura: number;
    idPedido: number;
    numeroFactura: string;
    fechaFactura: string;
    subtotal: number;
    descuento: number;
    total: number; 
}

@Injectable({providedIn: 'root'})

export class FacturaService{

    private apiUrl =
    `${environment.apiUrl}/Facturas`;

    constructor ( private http: HttpClient){}

    crearFactura(
        factura: CrearFacturaRequest):
        Observable<FacturaCreada>{
            return this.http.post<FacturaCreada>(
                this.apiUrl, factura
            );
        }
obtenerFacturas(): Observable<FacturaCreada[]> {
    return this.http.get<FacturaCreada[]>(
      this.apiUrl
    );
  }

  obtenerFacturaPorId(
    idFactura: number
  ): Observable<FacturaCreada> {

    return this.http.get<FacturaCreada>(
      `${this.apiUrl}/${idFactura}`
    );
  }
}
