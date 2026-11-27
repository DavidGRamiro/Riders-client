import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  IMAGE_LOADER,
  ImageLoaderConfig,
} from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBike,
  lucideBookmark,
  lucideCalendarDays,
  lucidePlus,
  lucideRadio,
  lucideRoute,
  lucideSlidersHorizontal,
  lucideWifi,
  lucideWrench,
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
@Component({
  selector: 'app-garage',
  imports: [NgIcon, UserBikes, UserRoutesSummary, UserEventsSummary, UserBikeForm],
  templateUrl: './garage.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => config.src,
    },
    provideIcons({
      lucideRadio,
      lucideWifi,
      lucideSlidersHorizontal,
      lucidePlus,
      lucideBike,
      lucideRoute,
      lucideBookmark,
      lucideCalendarDays,
      lucideWrench
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
