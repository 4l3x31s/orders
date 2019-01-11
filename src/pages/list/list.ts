import { Component } from '@angular/core';
import {AlertController, Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
import {Parametros} from "../class/parametros";
import {PedidoTupper} from "../class/pedidoTupper";
import {ExcelProvider} from "../../providers/excel/excel";
import {TupperProvider} from "../../providers/tupper/tupper";
import {File} from '@ionic-native/file';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import {TupperPedidoPage} from "../tupper-pedido/tupper-pedido";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  parametros: any[] = [];
  public lstPedidos: PedidoTupper[];
  public lstCopiaPedidos: PedidoTupper[];

  public pedidos: PedidoTupper;
  public lstParams: Parametros[];
  public txtTotalPedido: number = 0;
  public txtTotalCDesc: number = 0 ;
  public txtTotalCdescBs: number = 0;
  public txtFiltroFecha: string = '';
  public loader:Loading;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public fbService: TupperProvider,
    public excelService: ExcelProvider,
    public file: File,
    public loadingCtrl: LoadingController) {

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad Pedido Tupper');
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
  }
  dismissLoading(){
    if(this.loader){
      this.loader.dismissAll();
      this.loader = null;
    }
  }
  actualizarPedidos(){
    this.obtenerListaPedidos();
  }
  public obtenerListaPedidos(){
    this.presentLoading();
    this.txtTotalPedido = 0;
    this.txtTotalCDesc = 0;
    this.txtTotalCdescBs = 0;
    this.fbService.getOrdenes()
      .subscribe(data =>{
        this.dismissLoading();

        this.lstPedidos = Object.assign(data);
        this.lstCopiaPedidos = this.lstPedidos;
        this.ordenarPedidos();
        for(let i = 0; i< this.lstPedidos.length; i++) {

          this.txtTotalPedido = this.redondear(parseFloat(this.txtTotalPedido + '') + parseFloat(this.lstPedidos[i].totalBs+ ''),2);
          this.txtTotalCDesc = this.redondear(parseFloat(this.txtTotalCDesc + '') + parseFloat(this.lstPedidos[i].pTotalCons+ ''),2);
          this.txtTotalCdescBs = this.redondear(parseFloat(this.txtTotalCdescBs + '') + parseFloat(this.lstPedidos[i].pTotalConsBs+ ''),2);
        }
      },error => {
        this.dismissLoading();
        this.mostrarAlert('Error', 'No se pudo obtener los datos.')
      })
  }
  setPedidos(){
    this.lstPedidos = this.lstCopiaPedidos;
  }
  filterItems(ev: any) {
    this.setPedidos();
    let val = ev.target.value;

    if (val && val.trim() !== '') {
      this.lstPedidos = this.lstPedidos.filter(function(item) {
        return item.fecha.includes(val.toLowerCase());
      });
    }
  }

  ionViewWillEnter(){
    this.actualizarPedidos();
  }

  ordenarPedidos(){
    this.lstPedidos.sort((a:any,b:any) =>{
      return (b.id - a.id)//ordena de forma descendente
    });
  }
  filterByCampania(item: any){
    this.lstPedidos = this.lstPedidos.filter(pedidos => {
      return pedidos.campania === item.campania
    });
    this.txtTotalPedido = 0;
    this.txtTotalCDesc = 0;
    this.txtTotalCdescBs = 0;
    this.ordenarPedidos();
    for(let i = 0; i< this.lstPedidos.length; i++) {

      this.txtTotalPedido = this.redondear(parseFloat(this.txtTotalPedido + '') + parseFloat(this.lstPedidos[i].totalBs+ ''),2);
      this.txtTotalCDesc = this.redondear(parseFloat(this.txtTotalCDesc + '') + parseFloat(this.lstPedidos[i].pTotalCons+ ''),2);
      this.txtTotalCdescBs = this.redondear(parseFloat(this.txtTotalCdescBs + '') + parseFloat(this.lstPedidos[i].pTotalConsBs+ ''),2);
    }
  }
  filtrarByMes(){
    this.lstPedidos = this.lstPedidos.filter(pedidos => {
      console.log(moment(pedidos.fecha).format('YYYY/MM') + " PEDIDOS");
      console.log(moment(this.txtFiltroFecha).format('YYYY/MM') + " PIK");
      return moment(pedidos.fecha).format('YYYY/MM') == moment(this.txtFiltroFecha).format('YYYY/MM')
    });
    this.txtTotalPedido = 0;
    this.txtTotalCDesc = 0;
    this.txtTotalCdescBs = 0;
    this.ordenarPedidos();
    for(let i = 0; i< this.lstPedidos.length; i++) {

      this.txtTotalPedido = this.redondear(parseFloat(this.txtTotalPedido + '') + parseFloat(this.lstPedidos[i].totalBs+ ''),2);
      this.txtTotalCDesc = this.redondear(parseFloat(this.txtTotalCDesc + '') + parseFloat(this.lstPedidos[i].pTotalCons+ ''),2);
      this.txtTotalCdescBs = this.redondear(parseFloat(this.txtTotalCdescBs + '') + parseFloat(this.lstPedidos[i].pTotalConsBs+ ''),2);
    }
  }
  irModificarPedido(item: PedidoTupper) {
    this.navCtrl.push(TupperPedidoPage, {id:item.id, campania: item.campania});
  }
  irNuevoPedido(){
    this.navCtrl.push(TupperPedidoPage, {id:0});
  }
  mostrarAlert(titulo: string, mensaje: string){
    const alert = this.alertCtrl.create({
      title: titulo,
      subTitle: mensaje,
      buttons: ['Aceptar']
    });
    alert.present();
  }
  exportAsXLSX():void {

    this.excelService.exportAsExcelFile(this.lstPedidos, 'sample');
  }
  redondear(value: number, decimals: number){
    var multiplier = Math.pow(10,decimals ||0);
    return Math.round(value * multiplier) / multiplier;
  }

  getStoragePath()
  {
    let file = this.file;
    return this.file.resolveDirectoryUrl(this.file.externalRootDirectory).then(function (directoryEntry) {
      return file.getDirectory(directoryEntry, "export", {
        create: true,
        exclusive: false
      }).then(function () {
        return directoryEntry.nativeURL + "export/";
      });
    });
  }

  OnExport = function ()
  {
    let sheet = XLSX.utils.json_to_sheet(this.lstPedidos);
    let wb = {
      SheetNames: ["export"],
      Sheets: {
        "export": sheet
      }
    };

    let wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: false,
      type: 'binary'
    });

    function s2ab(s) {
      let buf = new ArrayBuffer(s.length);
      let view = new Uint8Array(buf);
      for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    }

    let blob = new Blob([s2ab(wbout)], {type: 'application/octet-stream'});
    let self = this;
    this.getStoragePath().then(function (url) {
      self.file.writeFile(url, "export_"+new  Date().getTime()+".xlsx", blob, true).then(() => {
        this.mostrarAlert('Info','El archivo se ha creado en: ' + url);

      }).catch(() => {
        this.mostrarAlert('Error','Error al crear archivo: ' + url);
      });
    });
  }

}
