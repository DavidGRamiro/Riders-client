import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';



const imageUrl = (id: string, width = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;

@Component({
  selector: 'app-user-bikes',
  imports: [NgOptimizedImage, NgIcon,],
  templateUrl: './user-bikes.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBikes {


  protected readonly bikes = [
    {
      id: 'desertx',
      name: 'Ducati DesertX 937cc',
      model: 'DesertX (2024)',
      year: 2024,
      displacement: '937 cc',
      power: '110 CV',
      vin: 'ZDM14AEW7RB0G291',
      map: 'MAPA // TOURING HIGH · ABS L1',
      odometer: '18.420',
      nextService: '1.580',
      image: imageUrl('1568772585407-9361f9bf3a87'),
      imageAlt: 'Ducati DesertX aparcada en el interior de un garaje',
    },
    {
      id: 'r1250gs',
      name: 'BMW R1250GS Rallye',
      model: 'R1250GS Rallye',
      year: 2023,
      displacement: '1.254 cc',
      power: '136 CV',
      vin: 'WB10J3107MZK45912',
      map: 'MAPA // ENDURO PRO · ABS L1',
      odometer: '42.110',
      nextService: '2.890',
      image: imageUrl('1610202926204-c0c9b7d8f112'),
      imageAlt: 'BMW R1250GS Rallye en una pista de tierra',
    },
  ];

  protected readonly gallery = [
    {
      src: imageUrl('1547549082-6bc09f2049ae', 700),
      alt: 'Detalle del escape y la parte trasera de una motocicleta',
      label: 'ESCAPE TERMIGNONI',
    },
    {
      src: imageUrl('1609630875171-b1321377ee65', 700),
      alt: 'Cuadro de instrumentos y carenado de una motocicleta deportiva',
      label: 'TFT COCKPIT',
    },
    {
      src: imageUrl('1558981403-c5f9899a28bc', 700),
      alt: 'Detalle de la rueda y la horquilla de una motocicleta',
      label: 'KAYABA 250MM',
    },
    {
      src: imageUrl('1544147145-73305fa184be', 700),
      alt: 'Motocicleta con maletas laterales en una pista de montaña',
      label: 'ALU PANNIERS',
    },
  ];


  protected readonly activeBikeId = signal(this.bikes[0].id);
    protected readonly activeBike = computed(
    () => this.bikes.find((bike) => bike.id === this.activeBikeId()) ?? this.bikes[0],
  );

  protected readonly secondaryBike = computed(
    () => this.bikes.find((bike) => bike.id !== this.activeBikeId()) ?? this.bikes[0],
  );

  protected selectBike(bikeId: string): void {
    this.activeBikeId.set(bikeId);
  }



}
