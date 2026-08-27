import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  readonly menuHighlights = [
    { name: 'Lomito fino', description: 'Uno de los cortes presentes en la carta pública de Mercagán.', image: 'assets/img/dishes/dishes2_1.png', delay: '0.2s' },
    { name: 'Carne oreada', description: 'Preparación vinculada a la tradición gastronómica de Santander.', image: 'assets/img/dishes/dishes2_2.png', delay: '0.3s' },
    { name: 'Chatas', description: 'Corte disponible en distintas preparaciones de la carta.', image: 'assets/img/dishes/dishes2_3.png', delay: '0.4s' },
    { name: 'Pincho mixto', description: 'Preparación de lomito fino y pollo.', image: 'assets/img/dishes/dishes2_4.png', delay: '0.5s' },
    { name: 'Hamburguesa tradicional', description: 'Una de las especialidades reconocidas de Mercagán.', image: 'assets/img/dishes/dishes2_5.png', delay: '0.6s' },
    { name: 'Hamburguesa mexicana', description: 'Opción incluida en la carta pública consultada.', image: 'assets/img/dishes/dishes2_1.png', delay: '0.7s' },
  ] as const;
}
