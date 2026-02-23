import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Header, Footer],
  template: `
    <app-header />
    <p>layout works!</p>
    <router-outlet />
    <app-footer />
  `,
  styles: ``,
})
export class Layout {}
