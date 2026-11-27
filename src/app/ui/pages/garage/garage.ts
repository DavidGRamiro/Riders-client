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
import { UserBikes, UserRoutesSummary, UserEventsSummary, UserBikeForm } from '../../../features/garage/components';

type GarageTabId = 'bikes' | 'created' | 'saved' | 'events' | 'maintenance';

interface GarageTab {
  readonly id: GarageTabId;
  readonly label: string;
  readonly icon: string;
  readonly count: number | null;
  readonly target: string;
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
@Component({
  selector: 'app-garage',
  imports: [NgOptimizedImage, NgIcon, ReactiveFormsModule, RouterLink, UserBikes, UserRoutesSummary, UserEventsSummary, UserBikeForm],
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

  protected readonly selectedTab = signal<GarageTabId>('bikes');

  protected selectTab(tab: GarageTab): void {
    this.selectedTab.set(tab.id);
    const target = document.getElementById(tab.target);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
