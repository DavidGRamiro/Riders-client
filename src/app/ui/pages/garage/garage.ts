import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  IMAGE_LOADER,
  ImageLoaderConfig,
  NgOptimizedImage,
} from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideActivity,
  lucideArrowRight,
  lucideArrowRightLeft,
  lucideBatteryCharging,
  lucideBike,
  lucideBookmark,
  lucideCalendarDays,
  lucideCamera,
  lucideCheck,
  lucideCircleDot,
  lucideCloudUpload,
  lucideClock,
  lucideDownload,
  lucideFuel,
  lucideGauge,
  lucideHeart,
  lucideMap,
  lucideMountain,
  lucidePlus,
  lucideRadio,
  lucideRoute,
  lucideShieldCheck,
  lucideSlidersHorizontal,
  lucideWifi,
  lucideWrench,
  lucideX,
} from '@ng-icons/lucide';

type GarageTabId = 'bikes' | 'created' | 'saved' | 'events' | 'maintenance';

interface GarageTab {
  readonly id: GarageTabId;
  readonly label: string;
  readonly icon: string;
  readonly count: number | null;
  readonly target: string;
}

interface GarageBike {
  readonly id: string;
  readonly name: string;
  readonly model: string;
  readonly year: number;
  readonly displacement: string;
  readonly power: string;
  readonly vin: string;
  readonly map: string;
  readonly odometer: string;
  readonly nextService: string;
  readonly image: string;
  readonly imageAlt: string;
}

interface GalleryShot {
  readonly src: string;
  readonly alt: string;
  readonly label: string;
}

interface CreatedRoute {
  readonly id: string;
  readonly tag: string;
  readonly title: string;
  readonly description: string;
  readonly graphPath: string;
  readonly elevationStart: string;
  readonly elevationMax: string;
  readonly elevationEnd: string;
  readonly distance: string;
  readonly duration: string;
  readonly likes: number;
}

interface SavedRoute {
  readonly badge: string;
  readonly author: string;
  readonly difficulty: string;
  readonly title: string;
  readonly description: string;
  readonly distance: string;
  readonly duration: string;
  readonly elevation: string;
  readonly image: string;
  readonly imageAlt: string;
}

interface GarageEvent {
  readonly month: string;
  readonly day: string;
  readonly type: string;
  readonly title: string;
  readonly location: string;
  readonly time: string;
  readonly riders: readonly string[];
  readonly extra: number;
}

interface RideCategory {
  readonly id: string;
  readonly label: string;
}

interface LicenseOption {
  readonly id: string;
  readonly label: string;
}

const imageUrl = (id: string, width = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;

@Component({
  selector: 'app-garage',
  imports: [NgOptimizedImage, NgIcon, ReactiveFormsModule, RouterLink],
  templateUrl: './garage.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => config.src,
    },
    provideIcons({
      lucideActivity,
      lucideArrowRight,
      lucideArrowRightLeft,
      lucideBatteryCharging,
      lucideBike,
      lucideBookmark,
      lucideCalendarDays,
      lucideCamera,
      lucideCheck,
      lucideCircleDot,
      lucideCloudUpload,
      lucideClock,
      lucideDownload,
      lucideFuel,
      lucideGauge,
      lucideHeart,
      lucideMap,
      lucideMountain,
      lucidePlus,
      lucideRadio,
      lucideRoute,
      lucideShieldCheck,
      lucideSlidersHorizontal,
      lucideWifi,
      lucideWrench,
      lucideX,
    }),
  ],
})
export class Garage {
  private readonly formBuilder = inject(FormBuilder);

  protected readonly bikes: readonly GarageBike[] = [
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

  protected readonly gallery: readonly GalleryShot[] = [
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

  protected readonly tabs: readonly GarageTab[] = [
    {
      id: 'bikes',
      label: 'Mis Motos & Ficha Técnica',
      icon: 'lucideBike',
      count: 2,
      target: 'garage-bikes',
    },
    {
      id: 'created',
      label: 'Rutas Creadas',
      icon: 'lucideRoute',
      count: 14,
      target: 'garage-created',
    },
    {
      id: 'saved',
      label: 'Rutas Guardadas & Siguiendo',
      icon: 'lucideBookmark',
      count: 38,
      target: 'garage-saved',
    },
    {
      id: 'events',
      label: 'Próximos Eventos & Kedadas',
      icon: 'lucideCalendarDays',
      count: 3,
      target: 'garage-events',
    },
    {
      id: 'maintenance',
      label: 'Mantenimiento & Logs',
      icon: 'lucideWrench',
      count: null,
      target: 'garage-maintenance',
    },
  ];

  protected readonly createdRoutes: readonly CreatedRoute[] = [
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

  protected readonly savedRoute: SavedRoute = {
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

  protected readonly events: readonly GarageEvent[] = [
    {
      month: 'OCT',
      day: '26',
      type: 'RITMO ALEGRE / EXPERTO',
      title: 'Kedada Trail Montes Universales',
      location: 'Gasolinera Albarracín',
      time: '08:30 AM',
      riders: ['MR', 'AG'],
      extra: 6,
    },
    {
      month: 'NOV',
      day: '09',
      type: 'TRAIL NOCTURNO · ORIENTACIÓN',
      title: 'Raid Sierras del Silencio 2025',
      location: 'Cuenca Camping Caravaning',
      time: '19:00 PM',
      riders: ['DK', 'SL'],
      extra: 14,
    },
  ];

  protected readonly categories: readonly RideCategory[] = [
    { id: 'trail', label: 'Trail / Adv' },
    { id: 'naked', label: 'Naked' },
    { id: 'sport', label: 'Sport / R' },
    { id: 'custom', label: 'Custom / Scrambler' },
  ];

  protected readonly licenses: readonly LicenseOption[] = [
    { id: 'a', label: 'Permiso A (Sin restricción)' },
    { id: 'a2', label: 'Carnet A2 (35 kW)' },
  ];

  protected readonly selectedTab = signal<GarageTabId>('bikes');
  protected readonly activeBikeId = signal(this.bikes[0].id);
  protected readonly registerOpen = signal(true);
  protected readonly syncEnabled = signal(false);

  protected readonly activeBike = computed(
    () => this.bikes.find((bike) => bike.id === this.activeBikeId()) ?? this.bikes[0],
  );

  protected readonly secondaryBike = computed(
    () => this.bikes.find((bike) => bike.id !== this.activeBikeId()) ?? this.bikes[0],
  );

  protected readonly registerForm = this.formBuilder.nonNullable.group({
    model: ['', Validators.required],
    year: ['2024'],
    plate: ['9842-MBZ'],
    displacement: ['889 cc'],
    power: ['105 CV'],
    category: ['trail'],
    license: ['a'],
    obd: [true],
  });

  protected selectTab(tab: GarageTab): void {
    this.selectedTab.set(tab.id);
    const target = document.getElementById(tab.target);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  protected selectBike(bikeId: string): void {
    this.activeBikeId.set(bikeId);
  }

  protected setPrimaryBike(bikeId: string): void {
    this.activeBikeId.set(bikeId);
  }

  protected setCategory(categoryId: string): void {
    this.registerForm.controls.category.setValue(categoryId);
  }

  protected openRegister(): void {
    this.registerOpen.set(true);
  }

  protected closeRegister(): void {
    this.registerOpen.set(false);
  }

  protected toggleSync(): void {
    this.syncEnabled.update((enabled) => !enabled);
  }

  protected registerBike(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.registerForm.reset({
      model: '',
      year: '2024',
      plate: '9842-MBZ',
      displacement: '889 cc',
      power: '105 CV',
      category: 'trail',
      license: 'a',
      obd: true,
    });
    this.registerOpen.set(false);
  }
}
