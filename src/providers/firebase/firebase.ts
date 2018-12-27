
import { Injectable } from '@angular/core';
import {AngularFireDatabase, QueryFn} from '@angular/fire/database';
import {Pedidos} from "../../pages/class/pedidos";
/*
  Generated class for the FirebaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseProvider {
  constructor(public afDB: AngularFireDatabase) {
    console.log('Hello FirebaseProvider Provider');
  }
  public crearOrden(pedido: any){
    return this.afDB.database.ref('ePedidos/' + pedido.id).set(pedido);
  }
  public getOrdenes(){
    return this.afDB.list('ePedidos/').valueChanges();

  }
  public getByCampania(){
    return this.afDB.list('/').valueChanges();
  }
  public getOrden(id, campania){
    return this.afDB.object('ePedidos/' + id).valueChanges();
  }
  public editOrden(pedido: any){
    return this.afDB.database.ref('ePedidos/' +  pedido.id).set(pedido);
  }
  public deleteNote(pedido:any){
    this.afDB.database.ref('ePedidos/' + pedido.id ).remove();
  }

}
