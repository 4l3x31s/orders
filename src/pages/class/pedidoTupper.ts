export class PedidoTupper {
  constructor(
    public id: number,
    public pagina: number,
    public codigo: number,
    public item: string,
    public cantidad: number,
    public precio: number,
    public total: number,
    public totalBs: number,
    public pTotalCons: number,
    public pTotalConsBs: number,
    public pVendido: number,
    public ganancia: number,
    public nombre: string,
    public observacion: string,
    public campania: string,
    public fecha:string
  ){

  }
}
