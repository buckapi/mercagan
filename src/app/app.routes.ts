import { Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { HomeComponent } from './pages/home/home.component';
import { MenuShopComponent } from './pages/menu-shop/menu-shop.component';
import { LocationsComponent } from './pages/locations/locations.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Mercagan' },
  { path: 'about', component: AboutComponent, title: 'Quienes somos' },
  { path: 'menu', component: MenuShopComponent, title: 'Menu' },
  { path: 'ubicaciones', component: LocationsComponent, title: 'Ubicaciones | Mercagan' },
  { path: 'cart', component: CartComponent, title: 'Carrito | Mercagan' },
  { path: 'checkout', component: CheckoutComponent, title: 'Finalizar pedido | Mercagan' },
  { path: 'login', component: LoginComponent, title: 'Iniciar sesión | Mercagan' },
  { path: '**', redirectTo: '' },
];
