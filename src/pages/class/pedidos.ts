export class Pedidos {
  constructor(
    public id: number,
    public pagina: number,
    public marca: string,
    public codigo: string,
    public item: string,
    public cantidad: number,
    public precio: number,
    public totalDescuento: number,
    public totalDescuentoBs: number,
    public nombre: string,
    public observacion: string,
    public fecha: string,
    public campania: number,
    public precioTotSinDesc: number
    )
    {

  }
}
