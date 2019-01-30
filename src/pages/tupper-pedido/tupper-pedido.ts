import { Component, OnInit } from '@angular/core';
import {AlertController, IonicPage, Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PedidoTupper} from "../class/pedidoTupper";
import {Marcas} from "../class/marcas";
import {TupperProvider} from "../../providers/tupper/tupper";
import * as moment from 'moment';

/**
 * Generated class for the TupperPedidoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tupper-pedido',
  templateUrl: 'tupper-pedido.html',
})
export class TupperPedidoPage implements OnInit {
  myForm: FormGroup;
  eliminar: boolean = false;
  tc: number = 6.96;
  descuento: number = 12;
  id: any = null;
  campania: any = null;

  public pedidosTupper: PedidoTupper;
  public marcas:Marcas[] = [];

  public txtPagina: number = 0;
  public txtCodigo: number = 0;
  public txtItem: string = '';
  public txtCantidad: number = 0;
  public txtPrecio: number = 0;
  public txtTotal: number = 0;
  public txtTotalBs: number = 0;
  public txtTotalCons: number = 0;
  public txtTotalConsBs: number = 0;
  public txtVendido: number = 0;
  public txtGanancia: number = 0;
  public txtNombre: string = '';
  public txtObservacion: string = '';
  public txtCampania: string = '';
  public txtMarca: string;

  public loader: Loading;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public fb: FormBuilder,
    public fbService: TupperProvider) {
  }
  ionViewDidLoad() {
    this.obtenerMarcas();
  }
  ngOnInit(): void {
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
      vcampania: ['', [Validators.required]],
      vpvendido: ['', [Validators.required]],
      vganancia: ['', [Validators.required]]
    })
    if(this.id != 0){
      //TODO:EDITAR
      this.presentLoading();
      this.fbService.getOrden(this.id, this.campania)
        .subscribe(data => {
          this.dismissLoading();
          if(data!=null) {
            this.pedidosTupper = Object.assign(data);
            console.log(this.pedidosTupper)
            this.txtPagina = this.pedidosTupper.pagina;
            this.txtMarca = 'TUPPERWARE';
            this.txtCodigo = this.pedidosTupper.codigo;
            this.txtItem = this.pedidosTupper.item;
            this.txtCantidad = this.pedidosTupper.cantidad;
            this.txtPrecio = this.pedidosTupper.precio;
            this.txtVendido = this.pedidosTupper.pVendido;
            this.txtGanancia = this.pedidosTupper.ganancia;
            this.txtNombre = this.pedidosTupper.nombre;
            this.txtObservacion = this.pedidosTupper.observacion;
            this.txtCampania = this.pedidosTupper.campania;
          }
        }, error => {
          this.dismissLoading();
          this.mostrarAlert('Error', 'Error: ' + JSON.stringify(error))
        })
    }
  }
  obtenerMarcas(){
    this.marcas = [
      new Marcas('TUPPERWARE',1)
    ];
  }
  redondear(value: number, decimals: number){
    var multiplier = Math.pow(10,decimals ||0);
    return Math.round(value * multiplier) / multiplier;
  }
  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Obteniendo los datos..."
    });
    this.loader.present();
  }
  dismissLoading(){
    if(this.loader){
      this.loader.dismissAll();
      this.loader = null;
    }
  }
  mostrarAlert(titulo:string, mensaje:string) {
    let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: mensaje,
      buttons: ['Aceptar']
    });
    alert.present();
  }
  public eliminarPedido(){
    this.presentLoading();
    this.eliminar = true;
    if(this.id != 0){
      this.fbService.deleteNote(this.pedidosTupper);
      this.dismissLoading();
      this.mostrarAlert('Info', 'La orden se ha eliminado correctamente.')
      this.navCtrl.pop();

    }else{
      this.dismissLoading();
      alert('No se puede eliminar la nota');
    }

  }

  registrarPedidos(){
    this.presentLoading();
    if(!this.eliminar) {

      this.txtTotal = this.redondear(this.myForm.value.vprecio * this.myForm.value.vcantidad,2);
      this.txtTotalBs = this.redondear((this.txtTotal * this.tc),2);
      this.txtTotalCons = this.redondear((this.txtTotal - ((this.txtTotal * this.descuento) / 100)),2);
      this.txtTotalCons = this.redondear((this.txtTotalBs - ((this.txtTotalBs * this.descuento) / 100)),2);
      let id = Date.now();
      const fechaActual = moment(id).format("YYYY/MM/DD");
      if (this.id != 0) {
        //TODO:EDITAR
        this.pedidosTupper = new PedidoTupper(
          this.id,
          this.txtPagina,
          this.myForm.value.vcodigo,
          this.myForm.value.vitem,
          this.myForm.value.vcantidad,
          this.myForm.value.vprecio,
          this.txtTotal,
          this.txtTotalBs,
          this.txtTotalCons,
          this.txtTotalConsBs,
          this.myForm.value.vpvendido,
          this.myForm.value.vganancia,
          this.myForm.value.vnombre,
          this.myForm.value.vobservacion,
          this.myForm.value.vcampania,
          fechaActual);

        this.fbService.editOrden(this.pedidosTupper)
          .then(data => {
            this.dismissLoading();
            this.mostrarAlert('Info', 'La orden se ha editado correctamente.')
            this.navCtrl.pop();
          })
          .catch(error => {
            this.dismissLoading();
            this.mostrarAlert('Error', 'Error: ' + JSON.stringify(error));
            this.navCtrl.pop();
          });
      } else {
        this.pedidosTupper = new PedidoTupper(
          Date.now(),
          this.txtPagina,
          this.myForm.value.vcodigo,
          this.myForm.value.vitem,
          this.myForm.value.vcantidad,
          this.myForm.value.vprecio,
          this.txtTotal,
          this.txtTotalBs,
          this.txtTotalCons,
          this.txtTotalConsBs,
          this.myForm.value.vpvendido,
          this.myForm.value.vganancia,
          this.myForm.value.vnombre,
          this.myForm.value.vobservacion,
          this.myForm.value.vcampania,
          fechaActual);
        this.fbService.crearOrden(this.pedidosTupper)
          .then(data => {
            this.dismissLoading();
            this.mostrarAlert('Info', 'La orden se ha registrado correctamente.');
            this.navCtrl.pop();
          })
          .catch(error => {
            this.dismissLoading();
            this.mostrarAlert('Error', 'Error: ' + JSON.stringify(error));
            this.navCtrl.pop();
          });
      }
    }
  }

}
