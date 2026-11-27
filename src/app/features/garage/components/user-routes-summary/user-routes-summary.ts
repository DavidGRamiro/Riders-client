import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';


const imageUrl = (id: string, width = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;

@Component({
  selector: 'app-user-routes-summary',
  imports: [NgIcon, NgOptimizedImage],
  templateUrl: './user-routes-summary.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserRoutesSummary {


    protected readonly createdRoutes = [
    {
      id: 'trans-pirineos',
      tag: 'OFF-ROAD 60% · DIFICULTAD MEDIA',
      title: 'Trans-Pirineos Sección Axial',
      description: 'Puertos de montaña, grava técnica y pistas forestales de altura.',
      graphPath:
        'M0 66 C24 60 44 56 68 50 C92 44 112 32 136 28 C160 24 180 30 204 42 C228 54 248 62 272 56 C296 50 316 34 340 26 C360 20 380 34 400 58',
      elevationStart: '340m',
      elevationMax: '2.180m',
      elevationEnd: '1.940m',
      distance: '342 km',
      duration: '6h 15m',
      likes: 89,
    },
    {
      id: 'coll-de-rates',
      tag: 'ASFALTO PURO · CURVAS RÁPIDAS',
      title: 'Coll de Rates & Puerto de Tudons',
      description: 'Carretera de montaña revirada con asfalto impecable y curvas enlazadas.',
      graphPath:
        'M0 62 C20 60 38 58 58 52 C78 46 98 34 120 30 C142 26 162 34 184 46 C206 58 226 62 248 58 C270 54 288 38 310 28 C330 20 350 30 372 50 C384 58 392 62 400 64',
      elevationStart: '120m',
      elevationMax: '1.020m',
      elevationEnd: '450m',
      distance: '186 km',
      duration: '3h 10m',
      likes: 142,
    },
  ];

  protected readonly savedRoute = {
    badge: 'EXPEDICIÓN ALPINA',
    author: 'Marc RiderPro',
    difficulty: 'EXPERTO',
    title: 'Passo dello Stelvio & Gavia Integral Loop',
    description:
      '48 tornanti históricos, cotas por encima de 2.700 metros sobre el nivel del mar y clima cambiante. Recomendable entre junio y septiembre.',
    distance: '410 km',
    duration: '8h 40m aprox',
    elevation: '+8.450m acumulado',
    image: imageUrl('1580640391708-4571b3f366ad'),
    imageAlt: 'Motociclistas en una carretera de montaña junto a los Alpes',
  };

  protected readonly syncEnabled = signal(false);

  protected toggleSync(): void {
    this.syncEnabled.update((enabled) => !enabled);
  }



}
