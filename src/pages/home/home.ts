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
  }
  ionViewDidLoad(){

    this.obtenerParametros();
    this.obtenerListaPedidos();
  }
  actualizarPedidos(){
    this.obtenerListaPedidos();
  }
  obtenerListaPedidos(){
    this.txtTotalPedido = 0;
    this.txtTotalCDesc = 0;
    this.txtTotalCdescBs = 0;
    this.fbService.getOrdenes()
      .subscribe(data =>{

        this.lstPedidos = Object.assign(data);

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

  }

  obtenerParametros(){


  }
  filterByCampania(item: any){
    this.lstPedidos = this.lstPedidos.filter(pedidos => {
      return pedidos.campania === item.campania
    });
    this.txtTotalPedido = 0;
    this.txtTotalCDesc = 0;
    this.txtTotalCdescBs = 0;
    for(let i = 0; i< this.lstPedidos.length; i++) {

      this.txtTotalPedido = parseFloat(this.txtTotalPedido + '') + parseFloat(this.lstPedidos[i].precioTotSinDesc+ '');
      this.txtTotalCDesc = parseFloat(this.txtTotalCDesc + '') + parseFloat(this.lstPedidos[i].totalDescuento+ '');
      this.txtTotalCdescBs = parseFloat(this.txtTotalCdescBs + '') + parseFloat(this.lstPedidos[i].totalDescuentoBs+ '');
    }
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
