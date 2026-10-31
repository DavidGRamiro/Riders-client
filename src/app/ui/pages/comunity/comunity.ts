import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  IMAGE_LOADER,
  ImageLoaderConfig,
  NgOptimizedImage,
} from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideActivity,
  lucideArrowRight,
  lucideBike,
  lucideBookmark,
  lucideCamera,
  lucideCircleDot,
  lucideDownload,
  lucideGlobe,
  lucideHeart,
  lucideImage,
  lucideMap,
  lucideMessageSquare,
  lucideMessagesSquare,
  lucideMoreHorizontal,
  lucideMountain,
  lucidePlus,
  lucideRoute,
  lucideServer,
  lucideShare2,
  lucideShieldCheck,
  lucideSlidersHorizontal,
  lucideTrophy,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';

type CommunityTab = 'feed' | 'routes' | 'gallery' | 'forum' | 'saved';

interface CommunityTabItem {
  readonly id: CommunityTab;
  readonly label: string;
  readonly icon: string;
  readonly count: number | null;
}

interface PostAuthor {
  readonly initials: string;
  readonly name: string;
  readonly handle: string;
  readonly badge: string;
  readonly badgeClass: string;
  readonly moto: string;
  readonly time: string;
}

interface PostTag {
  readonly label: string;
  readonly icon?: string;
  readonly tone?: 'default' | 'success';
}

interface PostImage {
  readonly src: string;
  readonly alt: string;
  readonly caption: string;
}

interface TelemetryMetric {
  readonly label: string;
  readonly value: string;
  readonly progress: number;
}

interface TelemetryReading {
  readonly label: string;
  readonly value: string;
  readonly tone?: 'success';
}

interface PostTelemetry {
  readonly image: PostImage;
  readonly overlay: string;
  readonly title: string;
  readonly subtitle: string;
  readonly metrics: readonly TelemetryMetric[];
  readonly readings: readonly TelemetryReading[];
  readonly action: string;
}

interface PostGpx {
  readonly title: string;
  readonly meta: string;
}

interface PostStats {
  readonly likes: number;
  readonly comments: number;
  readonly saves: number;
}

interface CommunityPost {
  readonly id: string;
  readonly author: PostAuthor;
  readonly tags: readonly PostTag[];
  readonly body: string;
  readonly image?: PostImage;
  readonly telemetry?: PostTelemetry;
  readonly gallery?: readonly PostImage[];
  readonly gpx?: PostGpx;
  readonly stats: PostStats;
}

interface TrendingDebate {
  readonly category: string;
  readonly replies: number;
  readonly title: string;
  readonly author: string;
  readonly active: string;
}

interface GalleryShot {
  readonly src: string;
  readonly alt: string;
  readonly label: string;
}

interface TopRider {
  readonly rank: string;
  readonly initials: string;
  readonly handle: string;
  readonly level: string;
  readonly distance: string;
}

const imageUrl = (id: string, width = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;

@Component({
  selector: 'app-comunity',
  imports: [NgOptimizedImage, NgIcon, HlmButtonImports, HlmCardImports],
  templateUrl: './comunity.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => config.src,
    },
    provideIcons({
      lucideActivity,
      lucideArrowRight,
      lucideBike,
      lucideBookmark,
      lucideCamera,
      lucideCircleDot,
      lucideDownload,
      lucideGlobe,
      lucideHeart,
      lucideImage,
      lucideMap,
      lucideMessageSquare,
      lucideMessagesSquare,
      lucideMoreHorizontal,
      lucideMountain,
      lucidePlus,
      lucideRoute,
      lucideServer,
      lucideShare2,
      lucideShieldCheck,
      lucideSlidersHorizontal,
      lucideTrophy,
    }),
  ],
})
export class Comunity {
  protected readonly tabs: readonly CommunityTabItem[] = [
    { id: 'feed', label: 'Feed Global', icon: 'lucideGlobe', count: null },
    { id: 'routes', label: 'Rutas & Telemetría', icon: 'lucideRoute', count: null },
    { id: 'gallery', label: 'Galería Fotográfica', icon: 'lucideCamera', count: null },
    { id: 'forum', label: 'Foro & Debates', icon: 'lucideMessagesSquare', count: 42 },
    { id: 'saved', label: 'Guardados', icon: 'lucideBookmark', count: null },
  ];
  protected readonly selectedTab = signal<CommunityTab>('feed');

  protected readonly draft = signal('');
  protected readonly searchTerm = signal('');
  protected readonly likedPosts = signal<ReadonlySet<string>>(new Set());
  protected readonly savedPosts = signal<ReadonlySet<string>>(new Set());

  protected readonly posts: readonly CommunityPost[] = [
    {
      id: 'coll-agrell',
      author: {
        initials: 'CM',
        name: 'Carlos Mendoza',
        handle: '@carlos_rider',
        badge: 'Verified Pilot',
        badgeClass: 'border-border/60 bg-white/[0.03] text-muted-foreground',
        moto: 'BMW R1250GS Adventure',
        time: 'hace 3 horas',
      },
      tags: [
        { label: 'Coll Agrell (2.744m)', icon: 'lucideMountain' },
        { label: 'Passo Alpino IT-FR' },
        { label: '3.420 km acumulados' },
        { label: 'Grip Seco 93%', icon: 'lucideCircleDot', tone: 'success' },
      ],
      body: 'Cumbre despejada tras superar el mar de nubes desde Casteldeflino. Asfalto impecable en la vertiente italiana antes de entrar en Queyras. Viento lateral sostenido de 35 km/h arriba, pero la tracción y el paso por horquillas con las Conti TrailAttack 3 ha sido de precisión quirúrgica. Adjunto track limpio con telemetría de frenada y par motor.',
      image: {
        src: imageUrl('1567430104793-f7c9985f2892'),
        alt: 'Grupo de motocicletas de aventura en un puerto de montaña',
        caption: 'Coll Agrell · 2.744m · 18°C',
      },
      gpx: {
        title: 'Track GPX Sincronizado',
        meta: '340 km · 6h 15m · Desnivel +3.120m · 128 WP',
      },
      stats: { likes: 142, comments: 38, saves: 84 },
    },
    {
      id: 'canon-del-sil',
      author: {
        initials: 'LS',
        name: 'Laura Sánchez',
        handle: '@laura_cbr',
        badge: 'Apex Gold',
        badgeClass: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
        moto: 'Ducati Multistrada V4 Pikes Peak',
        time: 'hace 7 horas',
      },
      tags: [
        { label: 'Cañón del Sil · Ribeira Sacra' },
        { label: 'Curvas Encadenadas Rápidas' },
        { label: 'Asfalto Grado A+' },
        { label: 'DataLogger Certificado', icon: 'lucideShieldCheck' },
      ],
      body: 'Sesión de calibración IMU en el sector de Parada de Sil. El motor Granturismo V4 empuja lineal y el chasis monocasco transmite cada milímetro de apoyo en curva. He subido la gráfica de telemetría con los ángulos de inclinación registrados por el sensor inercial: media de 44.5° sostenida en el sector de enlazadas con asfalto húmedo y hojas caídas.',
      telemetry: {
        image: {
          src: imageUrl('1586653202207-c1b691a61aa8'),
          alt: 'Motociclista rodando por una carretera de montaña',
          caption: 'Cañón del Sil · Ribeira Sacra',
        },
        overlay: 'Apex Cockpit Telemetry',
        title: 'Telemetry Feed',
        subtitle: '6-Axis IMU',
        metrics: [
          { label: 'Inclinación Máx.', value: '44.9° L / 42.8° R', progress: 82 },
          { label: 'Vel. Media en Curva', value: '68.4 km/h', progress: 58 },
        ],
        readings: [
          { label: 'Presión Caliente Del.', value: '2.32 BAR' },
          { label: 'Presión Caliente Tras.', value: '2.61 BAR' },
          { label: 'Fuerza G Lateral', value: '1.18 G' },
          { label: 'Sensación Asfalto', value: 'Seco Intermitente', tone: 'success' },
        ],
        action: 'Descargar Dataset CSV',
      },
      stats: { likes: 96, comments: 19, saves: 31 },
    },
    {
      id: 'cabo-ortegal',
      author: {
        initials: 'JG',
        name: 'Javier Gómez',
        handle: '@javi_triumph',
        badge: 'Route Master',
        badgeClass: 'border-border/60 bg-white/[0.03] text-muted-foreground',
        moto: 'Triumph Tiger 1200 Rally Pro',
        time: 'ayer a las 19:40',
      },
      tags: [
        { label: 'Transcantábrica & Ortigueira' },
        { label: 'Costa & Acantilados' },
        { label: '1.869 km total' },
      ],
      body: 'Combinar los desfiladeros interiores con el remate en los acantilados más altos de Europa continental en Cabo Ortegal. El contraste de niebla marina, viento salvaje y el sonido del tricilíndrico es indescriptible. El tramo de curvas sobre el acantilado es de pura concentración.',
      gallery: [
        {
          src: imageUrl('1580640391708-4571b3f366ad'),
          alt: 'Carretera de montaña serpenteante con motociclistas',
          caption: 'Port de la Bonaigua · 2.072m',
        },
        {
          src: imageUrl('1760955728172-137beee89bfc'),
          alt: 'Motocicleta en una carretera costera junto al mar',
          caption: 'Cabo Ortegal · Costa Cantábrica',
        },
      ],
      stats: { likes: 215, comments: 44, saves: 102 },
    },
  ];

  protected readonly trendingDebates: readonly TrendingDebate[] = [
    {
      category: 'Neumáticos',
      replies: 54,
      title: 'Michelin Road 6 GT vs. Pirelli Angel GT II en asfalto frío y lluvia ligera',
      author: '@david_r1200',
      active: 'hace 12 min',
    },
    {
      category: 'Normativa',
      replies: 89,
      title: 'Permisos para pistas forestales en el Pirineo Aragonés (Ley 2025 y tracks TET)',
      author: '@guille_enduro',
      active: 'hace 34 min',
    },
    {
      category: 'Mecánica',
      replies: 31,
      title: 'Intervalo real de reglaje de válvulas en motores Boxer ShiftCam tras 40.000 km',
      author: '@boxer_lab',
      active: 'hace 1 h',
    },
    {
      category: 'Suspensión',
      replies: 42,
      title: 'Ajuste fino de precarga electrónica con acompañante y 35 kg de equipaje de aluminio',
      author: '@alvaro_acer',
      active: 'hace 2 h',
    },
  ];

  protected readonly galleryShots: readonly GalleryShot[] = [
    {
      src: imageUrl('1609202748711-feef2cdc7da3', 700),
      alt: 'Motocicleta frente a un valle iluminado por la noche',
      label: 'Mar de niebla',
    },
    {
      src: imageUrl('1610202926204-c0c9b7d8f112', 700),
      alt: 'Detalle de la rueda delantera de una motocicleta',
      label: 'KTM 890 Duke R',
    },
    {
      src: imageUrl('1563313551-ebfbb10b7e7d', 700),
      alt: 'Motociclista rodando entre árboles al amanecer',
      label: 'Singletrack al amanecer',
    },
    {
      src: imageUrl('1544147145-73305fa184be', 700),
      alt: 'Motocicleta en una pista de tierra con montañas al fondo',
      label: 'Trail en el Alto Aragón',
    },
  ];

  protected readonly topRiders: readonly TopRider[] = [
    {
      rank: '01',
      initials: 'MG',
      handle: '@marcos_gs',
      level: 'Nivel PRO · 18 medallas',
      distance: '1.420 km',
    },
    {
      rank: '02',
      initials: 'SC',
      handle: '@sara_cbr',
      level: 'Apex Gold · 12 trofeos',
      distance: '1.180 km',
    },
    {
      rank: '03',
      initials: 'DN',
      handle: '@david_nord',
      level: 'Apex Silver · 8 trofeos',
      distance: '950 km',
    },
  ];

  protected readonly filteredPosts = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    if (!query) return this.posts;

    return this.posts.filter((post) => {
      const searchable = [
        post.author.name,
        post.author.handle,
        post.author.moto,
        post.body,
        ...post.tags.map((tag) => tag.label),
      ];

      return searchable.some((value) => value.toLowerCase().includes(query));
    });
  });

  protected selectTab(tab: CommunityTab): void {
    this.selectedTab.set(tab);
  }

  protected updateDraft(event: Event): void {
    this.draft.set((event.target as HTMLTextAreaElement).value);
  }

  protected updateSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  protected publishDraft(): void {
    if (!this.draft().trim()) return;
    this.draft.set('');
  }

  protected toggleLike(postId: string): void {
    this.likedPosts.update((liked) => this.toggleId(liked, postId));
  }

  protected toggleSaved(postId: string): void {
    this.savedPosts.update((saved) => this.toggleId(saved, postId));
  }

  protected isLiked(postId: string): boolean {
    return this.likedPosts().has(postId);
  }

  protected isSaved(postId: string): boolean {
    return this.savedPosts().has(postId);
  }

  protected likeCount(post: CommunityPost): number {
    return post.stats.likes + (this.isLiked(post.id) ? 1 : 0);
  }

  protected savedCount(post: CommunityPost): number {
    return post.stats.saves + (this.isSaved(post.id) ? 1 : 0);
  }

  private toggleId(collection: ReadonlySet<string>, id: string): ReadonlySet<string> {
    const next = new Set(collection);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    return next;
  }
}
