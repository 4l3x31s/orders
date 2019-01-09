import { Component, OnInit } from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';


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

  ngOnInit(): void {
    //this.iniciar();
  }


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams) {
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PedidoPage');
  }
}
