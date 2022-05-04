import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {BankComponent} from './bank/bank.component';
import {PedidoComponent} from './pedido/pedido.component';


const routes: Routes = [
  { path: 'home', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'bank', component: BankComponent},
  { path: 'pedido', component: PedidoComponent},

];

@NgModule({
  imports: [],
  exports: [RouterModule]
})
export class AppRoutingModule { }
