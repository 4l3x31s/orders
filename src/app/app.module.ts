import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FirebaseProvider } from '../providers/firebase/firebase';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule, AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import {PedidoPage} from "../pages/pedido/pedido";
import { ExcelProvider } from '../providers/excel/excel';
import {TupperPedidoPage} from "../pages/tupper-pedido/tupper-pedido";
import {File} from '@ionic-native/file';

export const firebaseConfig = {
  apiKey: "AIzaSyC1WMsEDhh1UFjxRHDUiOMN8NW7FbfViks",
  authDomain: "ordenes-8aad1.firebaseapp.com",
  databaseURL: "https://ordenes-8aad1.firebaseio.com",
  projectId: "ordenes-8aad1",
  storageBucket: "ordenes-8aad1.appspot.com",
  messagingSenderId: "55102761735"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    PedidoPage,
    TupperPedidoPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    PedidoPage,
    TupperPedidoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FirebaseProvider,
    AngularFireDatabase,
    ExcelProvider,
    File
  ]
})
export class AppModule {}
