import { Injectable } from '@angular/core';
import {AngularFireDatabase, QueryFn} from '@angular/fire/database';
/*
  Generated class for the TupperProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TupperProvider {

  constructor(public afDB: AngularFireDatabase) {
    console.log('Hello TupperProvider Provider');
  }
  public crearOrden(pedido: any){
    return this.afDB.database.ref('eTupper/' + pedido.id).set(pedido);
  }
  public getOrdenes(){
    return this.afDB.list('eTupper/').valueChanges();

  }
  public getByCampania(){
    return this.afDB.list('/').valueChanges();
  }
  public getOrden(id, campania){
    return this.afDB.object('eTupper/' + id).valueChanges();
  }
  public editOrden(pedido: any){
    return this.afDB.database.ref('eTupper/' +  pedido.id).set(pedido);
  }
  public deleteNote(pedido:any){
    this.afDB.database.ref('eTupper/' + pedido.id ).remove();
  }

}
