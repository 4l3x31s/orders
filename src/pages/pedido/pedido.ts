import { Component, OnInit } from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Pedidos} from "../class/pedidos";
import {Marcas} from "../class/marcas";
import {FirebaseProvider} from "../../providers/firebase/firebase";
/**
 * Generated class for the PedidoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-pedido',
  templateUrl: 'pedido.html',
})
export class PedidoPage {


  myForm: FormGroup;
  tc: number = 6.96;
  descuento: number = 12;
  id:any = null;
  campania: any = null;
  public pedidos: Pedidos;
  public marcas: Marcas[] = [];

  public txtPagina: number = 0;
  public txtMarca: string = '';
  public txtCodigo: string = '';
  public txtItem: string = '';
  public txtCantidad: number = 0;

  public txtPrecio: number = 0;

  public txtPrecioDescuento: number = 0;
  public txtPrecioTotalBs: number = 0;

  public txtNombre: string = '';
  public txtObservacion: string= '';
  public txtCampania: number = 0;

  public txtPrecioTotalSinDesc: number = 0;



  public loader: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public fb: FormBuilder,
    public fbService: FirebaseProvider) {

    this.iniciar();
  }

  iniciar(){
    this.id = this.navParams.get('id');
    this.campania = this.navParams.get('campania');
    this.myForm = this.fb.group({
      vmarca: ['', [Validators.required]],
      vcodigo: ['', [Validators.required]],
      vitem: ['', [Validators.required]],
      vcantidad: ['', [Validators.required]],
      vprecio:['', [Validators.required]],
      vnombre:['', [Validators.required]],
      vobservacion: ['', [Validators.required]],
      vcampania: ['', [Validators.required]]
    })
    if(this.id != 0){
      //TODO:EDITAR
      this.fbService.getOrden(this.id, this.campania)
        .subscribe(data => {
          this.pedidos = Object.assign(data);
          console.log(this.pedidos)
          this.txtPagina  = this.pedidos.pagina;
          this.txtMarca = this.pedidos.marca;
          this.txtCodigo = this.pedidos.codigo;
          this.txtItem = this.pedidos.item;
          this.txtCantidad = this.pedidos.cantidad;
          this.txtPrecio = this.pedidos.precio;
          this.txtNombre = this.pedidos.nombre;
          this.txtObservacion = this.pedidos.observacion;
          this.txtCampania = this.pedidos.campania;
        }, error => {
          this.mostrarAlert('Error', 'Error: ' + JSON.stringify(error))
        })
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PedidoPage');

    this.obtenerMarcas();
  }
  registrarPedidos(){
    this.txtPrecioDescuento = this.redondear((this.myForm.value.vprecio - ((this.myForm.value.vprecio * this.descuento)/100)),2);
    this.txtPrecioTotalBs =  this.redondear((this.txtPrecioDescuento * this.myForm.value.vcantidad) * this.tc, 2);
    let id = Date.now();
    this.txtPrecioTotalSinDesc = this.redondear(this.myForm.value.vprecio * this.myForm.value.vcantidad,2);

    if(this.id != 0){
      //TODO:EDITAR
      this.pedidos = new Pedidos(
        this.id,
        this.txtPagina,
        this.myForm.value.vmarca,
        this.myForm.value.vcodigo,
        this.myForm.value.vitem,
        this.myForm.value.vcantidad,
        this.myForm.value.vprecio,
        this.txtPrecioDescuento,
        this.txtPrecioTotalBs,
        this.myForm.value.vnombre,
        this.myForm.value.vobservacion,
        this.id,
        this.myForm.value.vcampania,
        this.txtPrecioTotalSinDesc);
      this.fbService.editOrden(this.pedidos)
        .then(data => {
          this.mostrarAlert('Info', 'La orden se ha editado correctamente.')
          this.navCtrl.pop();
        })
        .catch(error => {
          this.mostrarAlert('Error', 'Error: ' + JSON.stringify(error))
        });;
    }else {
      this.pedidos = new Pedidos(
        Date.now(),
        this.txtPagina,
        this.myForm.value.vmarca,
        this.myForm.value.vcodigo,
        this.myForm.value.vitem,
        this.myForm.value.vcantidad,
        this.myForm.value.vprecio,
        this.txtPrecioDescuento,
        this.txtPrecioTotalBs,
        this.myForm.value.vnombre,
        this.myForm.value.vobservacion,
        id + '',
        this.myForm.value.vcampania,
        this.txtPrecioTotalSinDesc);
      this.fbService.crearOrden(this.pedidos)
        .then(data => {
          this.mostrarAlert('Info', 'La orden se ha registrado correctamente.');
          this.navCtrl.pop();
        })
        .catch(error => {
          this.mostrarAlert('Error', 'Error: ' + JSON.stringify(error))
        });
    }
  }

  obtenerMarcas(){
    this.marcas = [
      new Marcas('ESIKA',1),
      new Marcas('LEBEL',1),
      new Marcas('CYZONE',1)
    ];
  }

  redondear(value: number, decimals: number){
    var multiplier = Math.pow(10,decimals ||0);
    return Math.round(value * multiplier) / multiplier;
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    this.loader.present();
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
