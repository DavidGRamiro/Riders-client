import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  IMAGE_LOADER,
  ImageLoaderConfig,
  NgOptimizedImage,
} from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowRight,
  lucideCalendarDays,
  lucideChevronDown,
  lucideCircleCheck,
  lucideCloudSun,
  lucideCompass,
  lucideDownload,
  lucideFlag,
  lucideMapPin,
  lucideMilestone,
  lucidePlus,
  lucideSearch,
  lucideSun,
  lucideZap,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';

type EventFilter = 'all' | 'weekend' | 'mountain' | 'offroad' | 'mine';

interface EventAuthor {
  readonly initials: string;
  readonly name: string;
  readonly handle: string;
  readonly avatarClass: string;
}

interface EventWeather {
  readonly icon: string;
  readonly temperature: string;
  readonly condition: string;
}

interface EventItem {
  readonly id: string;
  readonly category: string;
  readonly categoryClass: string;
  readonly image: string;
  readonly imageAlt: string;
  readonly weather: EventWeather;
  readonly date: string;
  readonly start: string;
  readonly end: string;
  readonly telemetry: string;
  readonly telemetryClass: string;
  readonly title: string;
  readonly pace: string;
  readonly paceClass: string;
  readonly description: string;
  readonly waypointCount: string;
  readonly waypoints: readonly string[];
  readonly distance: string;
  readonly time: string;
  readonly curves: string;
  readonly elevation: string;
  readonly author: EventAuthor;
  readonly followers: readonly string[];
  readonly extraFollowers: number;
  readonly confirmed: number;
  readonly total: number;
  readonly urgent: boolean;
  readonly urgentLabel?: string;
  readonly ctaLabel: string;
  readonly ctaVariant: 'primary' | 'accent';
  readonly tags: readonly EventFilter[];
}

@Component({
  selector: 'app-events',
  imports: [NgOptimizedImage, NgIcon, HlmButtonImports],
  templateUrl: './events.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => config.src,
    },
    provideIcons({
      lucideArrowRight,
          lucideCalendarDays,
      lucideChevronDown,
      lucideCircleCheck,
      lucideCloudSun,
      lucideCompass,
      lucideDownload,
      lucideFlag,
          lucideMapPin,
      lucideMilestone,
              lucidePlus,
          lucideSearch,
              lucideSun,
                      lucideZap,
    }),
  ],
})
export class Events {
  protected readonly filters: readonly { id: EventFilter; label: string }[] = [
    { id: 'all', label: 'Todas las rutas' },
    { id: 'weekend', label: 'Fin de semana' },
    { id: 'mountain', label: 'Puertos de montaña' },
    { id: 'offroad', label: 'Off-road & Trail' },
    { id: 'mine', label: 'Mis kedadas inscritas' },
  ];

  protected readonly selectedFilter = signal<EventFilter>('all');
  protected readonly searchTerm = signal('');
  protected readonly sortOrder = signal<'date' | 'seats'>('date');

  protected readonly events: readonly EventItem[] = [
    {
      id: 'trans-guadarrama',
      category: 'Curvas Técnicas',
      categoryClass: 'border-white/10 bg-black/55 text-white',
      image:
        'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Carretera de montaña con curvas entre rocas al atardecer',
      weather: { icon: 'lucideSun', temperature: '19°C', condition: 'Seco' },
      date: 'Sáb, 18 May · 08:30h',
      start: 'Puerto Navacerrada',
      end: 'Morcuera',
      telemetry: '42° APEX PEAK',
      telemetryClass: 'text-amber-400',
      title: 'Ruta Trans-Guadarrama: 3 Puertos Míticos',
      pace: 'Ritmo Deportivo',
      paceClass: 'border-white/10 bg-white/[0.06] text-white/80',
      description:
        'Salida técnica a primera hora para evitar tráfico dominical. Curvatura encadenada con parada de telemetría en el mirador de La Morcuera.',
      waypointCount: '3 Paradas',
      waypoints: [
        'Repsol A-6',
        'Pto. Navacerrada',
        'Mirador Robledo',
        'Canencia',
      ],
      distance: '215 km',
      time: '3h 40m',
      curves: '85% Agres.',
      elevation: '+2.350m',
      author: {
        initials: 'AR',
        name: '@alex_rider',
        handle: 'Yamaha Tracer 9 GT',
        avatarClass: 'bg-white/10 text-white',
      },
      followers: ['MK', 'JD'],
      extraFollowers: 12,
      confirmed: 14,
      total: 20,
      urgent: false,
      ctaLabel: 'Ver Detalles & Inscribirme',
      ctaVariant: 'primary',
      tags: ['weekend', 'mountain', 'mine'],
    },
    {
      id: 'serrania-cuenca',
      category: 'Trail Aventura',
      categoryClass: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
      image:
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Valle de montaña con pistas de tierra entre cumbres',
      weather: { icon: 'lucideCloudSun', temperature: '16°C', condition: 'Viento Calmo' },
      date: 'Dom, 19 May · 07:45h',
      start: 'Serranía',
      end: 'Nacimiento del Cuerpo',
      telemetry: 'GRAVEL 30% · ASFALTO 70%',
      telemetryClass: 'text-white/70',
      title: 'Desafío Serranía de Cuenca & Hoces',
      pace: 'Ritmo Mixto',
      paceClass: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
      description:
        'Secciones mixtas de curvas fluidas y cañones kársticos. Apta para maxitrail y motos touring con neumáticos mixtos.',
      waypointCount: '4 Paradas',
      waypoints: [
        'Tarancon',
        'Ciudad Encantada',
        'Nacimiento Cuevo',
        'Huélamo',
      ],
      distance: '310 km',
      time: '4h 50m',
      curves: '62% Fluido',
      elevation: '+1.820m',
      author: {
        initials: 'MN',
        name: '@marcos_gs',
        handle: 'BMW R 1250 GS Adv',
        avatarClass: 'bg-white/10 text-white',
      },
      followers: ['PG', 'TL'],
      extraFollowers: 9,
      confirmed: 11,
      total: 12,
      urgent: true,
      urgentLabel: '¡Última plaza disponible!',
      ctaLabel: 'Reservar Última Plaza',
      ctaVariant: 'accent',
      tags: ['weekend', 'mountain', 'offroad'],
    },
    {
      id: 'trans-pirenaica',
      category: 'Paso Panorámico',
      categoryClass: 'border-white/10 bg-black/55 text-white',
      image:
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Carretera panorámica de montaña entre bosques y niebla',
      weather: { icon: 'lucideSun', temperature: '14°C', condition: 'Grip Óptimo' },
      date: 'Sáb, 25 May · 06:15h',
      start: 'Coll de Nargó',
      end: 'Port del Comte',
      telemetry: 'GRIP A+ · 100% ASFALTO',
      telemetryClass: 'text-emerald-400',
      title: 'Trans-Pirenaica Express: Curvas & Asfalto Pro',
      pace: 'Ritmo Ágil',
      paceClass: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
      description:
        'Trazado puro de enlace pirenaico sobre firme impecable. Grupos reducidos con telemetría compartida por intercom.',
      waypointCount: '5 Paradas',
      waypoints: [
        'Oliana',
        'Coll de Nargó',
        'Port del Comte',
        'Berga',
        'Ripoll',
      ],
      distance: '420 km',
      time: '6h 15m',
      curves: '92% Técn.',
      elevation: '+4.100m',
      author: {
        initials: 'SC',
        name: '@sara_cbr',
        handle: 'Honda CBR1000RR-R',
        avatarClass: 'bg-white/10 text-white',
      },
      followers: ['AL', 'VR'],
      extraFollowers: 4,
      confirmed: 6,
      total: 15,
      urgent: false,
      ctaLabel: 'Ver Detalles & Inscribirme',
      ctaVariant: 'primary',
      tags: ['weekend', 'mountain', 'mine'],
    },
  ];

  protected readonly filteredEvents = computed(() => {
    const filter = this.selectedFilter();
    const term = this.searchTerm().trim().toLowerCase();
    const order = this.sortOrder();

    let result = [...this.events];

    if (filter !== 'all') {
      result = result.filter((event) => event.tags.includes(filter));
    }

    if (term.length > 0) {
      result = result.filter((event) => {
        const searchable = [
          event.title,
          event.start,
          event.end,
          event.category,
          ...event.waypoints,
        ]
          .join(' ')
          .toLowerCase();
        return searchable.includes(term);
      });
    }

    if (order === 'seats') {
      result.sort((a, b) => b.total - b.confirmed - (a.total - a.confirmed));
    }

    return result;
  });

  protected selectFilter(filter: EventFilter): void {
    this.selectedFilter.set(filter);
  }

  protected updateSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  protected updateSort(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.sortOrder.set(target.value === 'seats' ? 'seats' : 'date');
  }

  protected occupancy(event: EventItem): number {
    return Math.round((event.confirmed / event.total) * 100);
  }
}
