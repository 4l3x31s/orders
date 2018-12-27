import {Pedidos} from "./pedidos";

export class LisPedidos {
  constructor(
    public campania: number,
    public lstPedidos: Pedidos[],
    public total: number,
    public totalDesc: number,
    public totalDescBs: number
  ){

  }
}
