import { ChangeDetectionStrategy, Component, inject, resource, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { HlmNavigationMenuImports } from '@spartan-ng/helm/navigation-menu';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmAutocompleteImports } from '@spartan-ng/helm/autocomplete';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSunMedium } from '@ng-icons/lucide';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { lucideMoon } from '@ng-icons/lucide';
import { Theme } from '../../services';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-navbar',
  imports: [HlmNavigationMenuImports, HlmButtonImports, NgOptimizedImage, HlmAutocompleteImports, HlmSpinnerImports, NgIcon, HlmTooltipImports, HlmAvatarImports, HlmDropdownMenuImports, RouterLink],
  templateUrl: './navbar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ lucideSunMedium, lucideMoon })],
})
export class Navbar {

  // Config of the theme and switch betweeen dark/light
  public theme = inject(Theme)

  // Configuraciones para la busqueda diferefida del autocomplete
  public readonly search = signal('');
  
  // TODO: Llamada a servidor para recuperar rutas existentes
  public options = resource({
    defaultValue: [],
    params: () => ({ search: this.search() }),
    loader: async ({ params }) => {
      const search = params.search;
      if (search.length === 0) {
        return [];
      }
      // return await this.searchMovies(search.toLowerCase());
      return [{ title: 'Prueba', year: 2025}]
    },
  });
}
