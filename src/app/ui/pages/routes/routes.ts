import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowRight,
  lucideBookmark,
  lucideCar,
  lucideCloudSun,
  lucideDownload,
  lucideEraser,
  lucideLayers,
  lucideMap,
  lucideMapPin,
  lucideMinus,
  lucideMountainSnow,
  lucidePlus,
  lucideRefreshCw,
  lucideRotateCcw,
  lucideSignpost,
  lucideSparkles,
  lucideZap,
} from '@ng-icons/lucide';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmChartImports } from '@spartan-ng/helm/chart';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSliderImports } from '@spartan-ng/helm/slider';
import { HlmSwitchImports } from '@spartan-ng/helm/switch';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { areaY, defineChart, dot, lineY } from '@tanstack/charts';
import { scaleLinear } from '@tanstack/charts/scales/linear';
import { tooltip } from '@tanstack/charts/tooltip';

interface ElevationPoint {
  km: number;
  elevation: number;
}

@Component({
  selector: 'app-routes',
  imports: [
    NgIcon,
    HlmBadgeImports,
    HlmButtonImports,
    HlmCardImports,
    HlmChartImports,
    HlmSeparatorImports,
    HlmSliderImports,
    HlmSwitchImports,
    HlmTabsImports,
    HlmTextareaImports,
  ],
  templateUrl: './routes.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({
      lucideArrowRight,
      lucideBookmark,
      lucideCar,
      lucideCloudSun,
      lucideDownload,
      lucideEraser,
      lucideLayers,
      lucideMap,
      lucideMapPin,
      lucideMinus,
      lucideMountainSnow,
      lucidePlus,
      lucideRefreshCw,
      lucideRotateCcw,
      lucideSignpost,
      lucideSparkles,
      lucideZap,
    }),
  ],
})
export class Routes {
  private readonly initialDescription =
    'Ruta revirada por la Sierra de Guadarrama, asfalto impecable, puertos con desnivel técnico y parada en un asador panorámico. Evitar tramos urbanos y autovías. Máximo 220 km. Ideal para deportivas.';

  protected readonly description = signal(this.initialDescription);
  protected readonly descriptionLength = computed(() => this.description().length);

  protected readonly presets = [
    'Curvas Técnicas',
    'Panorámica Vistas',
    'Rápida & Fluida',
    'Trail Mixto',
  ];
  protected readonly selectedPreset = signal(this.presets[0]);

  protected readonly curveDensity = signal(88);
  protected readonly estimatedDistance = signal(218);

  protected readonly asphalt = signal(true);
  protected readonly avoidTraffic = signal(true);

  protected readonly mapZoom = signal(1);
  protected readonly mapTransform = computed(
    () =>
      `translate(500 300) scale(${this.mapZoom()}) translate(-500 -300)`,
  );
  protected readonly showRelief = signal(true);
  protected readonly activeWaypoint = signal(0);
  protected readonly stops = [
    { number: '01', label: 'Dehesas' },
    { number: '02', label: 'Navacerrada' },
    { number: '03', label: 'Rascafría' },
    { number: '04', label: 'Lozoya' },
  ];

  private readonly elevationData: readonly ElevationPoint[] = [
    { km: 0, elevation: 1450 },
    { km: 18, elevation: 1510 },
    { km: 32, elevation: 1610 },
    { km: 55, elevation: 1858 },
    { km: 74, elevation: 1680 },
    { km: 96, elevation: 1520 },
    { km: 118, elevation: 1580 },
    { km: 140, elevation: 1710 },
    { km: 160, elevation: 1900 },
    { km: 181, elevation: 1770 },
    { km: 198, elevation: 1560 },
    { km: 210, elevation: 1470 },
    { km: 218, elevation: 1420 },
  ];

  private readonly peak = this.elevationData.reduce((highest, point) =>
    point.elevation > highest.elevation ? point : highest,
  );

  protected readonly elevationChart = {
    definition: defineChart({
      marks: [
        areaY(this.elevationData, {
          x: 'km',
          y: 'elevation',
          y1: 1000,
          fill: '#f59e0b',
          fillOpacity: 0.16,
        }),
        lineY(this.elevationData, {
          x: 'km',
          y: 'elevation',
          stroke: '#f59e0b',
          strokeWidth: 2,
        }),
        dot([this.peak], {
          x: 'km',
          y: 'elevation',
          r: 4,
          fill: '#22d3ee',
          stroke: '#0e7490',
          strokeWidth: 2,
        }),
      ],
      scales: {
        x: {
          scale: scaleLinear,
          axis: {
            line: false,
            ticks: {
              values: [0, 55, 100, 160, 218],
              size: 0,
              format: (value: number) => {
                if (value === 0) return '0 km';
                if (value === 55) return '55 km';
                if (value === 100) return 'Navacerrada (1.858m)';
                if (value === 160) return '160 km';
                return '218 km';
              },
            },
            tickLabels: { fontSize: 10 },
          },
        },
        y: {
          scale: scaleLinear().domain([1000, 2000]),
          grid: true,
          axis: {
            line: false,
            ticks: {
              values: [1000, 1500, 2000],
              size: 0,
              format: (value: number) => `${value.toLocaleString('es-ES')}m`,
            },
            tickLabels: { fontSize: 10 },
          },
        },
      },
      margin: { top: 10, right: 12, bottom: 26, left: 46 },
      theme: {
        foreground: 'var(--foreground)',
        muted: 'var(--muted-foreground)',
        grid: 'var(--border)',
        background: 'transparent',
        palette: ['#f59e0b', '#22d3ee'],
      },
      svgAnimation: false,
      tooltip,
    }),
    height: 200,
    ariaLabel: 'Perfil altimétrico de la ruta Trans-Sierra Curves Express',
  };

  protected updateDescription(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.description.set(target.value.slice(0, 400));
  }

  protected clearDescription(): void {
    this.description.set('');
  }

  protected selectPreset(preset: string): void {
    this.selectedPreset.set(preset);
  }

  protected updateCurveDensity(values: number[]): void {
    this.curveDensity.set(values[0] ?? this.curveDensity());
  }

  protected updateEstimatedDistance(values: number[]): void {
    this.estimatedDistance.set(values[0] ?? this.estimatedDistance());
  }

  protected selectWaypoint(index: number): void {
    this.activeWaypoint.set(index);
  }

  protected toggleRelief(): void {
    this.showRelief.update((value) => !value);
  }

  protected zoomIn(): void {
    this.mapZoom.update((value) => Math.min(1.3, Number((value + 0.1).toFixed(2))));
  }

  protected zoomOut(): void {
    this.mapZoom.update((value) => Math.max(1, Number((value - 0.1).toFixed(2))));
  }

  protected reset(): void {
    this.description.set(this.initialDescription);
    this.selectedPreset.set(this.presets[0]);
    this.curveDensity.set(88);
    this.estimatedDistance.set(218);
    this.asphalt.set(true);
    this.avoidTraffic.set(true);
    this.mapZoom.set(1);
    this.showRelief.set(true);
    this.activeWaypoint.set(0);
  }
}
