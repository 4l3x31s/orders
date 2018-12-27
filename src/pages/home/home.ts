import { Component } from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {Parametros} from "../class/parametros";
import {Pedidos} from "../class/pedidos";
import {PedidoPage} from "../pedido/pedido";
import {FirebaseProvider} from "../../providers/firebase/firebase";
import {LisPedidos} from "../class/lisPedidos";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  parametros: any[] = [];
  public lstPedidos: Pedidos[];
  public lstFilterPedidos: LisPedidos[];
  public pedidos: Pedidos;
  public lstParams: Parametros[];
  public txtTotalPedido: number = 0;
  public txtTotalCDesc: number = 0 ;
  public txtTotalCdescBs: number = 0;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public fbService: FirebaseProvider) {
    this.listarProductos();
  }
  ionViewDidLoad(){

    this.obtenerParametros();
    this.obtenerListaPedidos();
  }
  actualizarPedidos(){
    this.obtenerListaPedidos();
  }
  obtenerListaPedidos(){
    this.fbService.getOrdenes()
      .subscribe(data =>{

        this.lstPedidos = Object.assign(data);
        var groupBy = function (miarray, prop) {
          var miArray = [];
          return miarray.reduce((groups, item) => {
            console.log("*********************")
            console.log(groups)
            var val = item[prop];
            groups[val] = item;
            miArray.push(groups[val]);
            return groups;
          }, {});

        }
        console.log("-----------------------------------")
        console.log(groupBy(this.lstPedidos,'campania'));

        for(let i = 0; i< this.lstPedidos.length; i++) {

          this.txtTotalPedido = parseFloat(this.txtTotalPedido + '') + parseFloat(this.lstPedidos[i].precioTotSinDesc+ '');
          this.txtTotalCDesc = parseFloat(this.txtTotalCDesc + '') + parseFloat(this.lstPedidos[i].totalDescuento+ '');
          this.txtTotalCdescBs = parseFloat(this.txtTotalCdescBs + '') + parseFloat(this.lstPedidos[i].totalDescuentoBs+ '');
        }
      },error => {
        this.mostrarAlert('Error', 'No se pudo obtener los datos.')
      })
  }
  ionViewWillEnter(){
    this.listarProductos();
  }
  listarProductos(){

  }
  obtenerParametros(){


  }
  filterByCampania(item: any){
    this.lstPedidos = this.lstPedidos.filter(pedidos => {
      console.log("pedidos")
      console.log(pedidos)
      console.log("item")
      console.log(item)
      console.log(pedidos.campania === item.campania)
      pedidos.campania === item.campania
    })

  }
  irModificarPedido(item: Pedidos) {
    this.navCtrl.push(PedidoPage, {id:item.id, campania: item.campania});
  }
  irNuevoPedido(){
    this.navCtrl.push(PedidoPage, {id:0});
  }
  mostrarAlert(titulo: string, mensaje: string){
    const alert = this.alertCtrl.create({
      title: titulo,
      subTitle: mensaje,
      buttons: ['Aceptar']
    });
    alert.present();
  }
}
