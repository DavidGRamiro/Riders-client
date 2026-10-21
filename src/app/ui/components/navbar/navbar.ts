import { ChangeDetectionStrategy, Component, resource, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { HlmNavigationMenuImports } from '@spartan-ng/helm/navigation-menu';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmAutocompleteImports } from '@spartan-ng/helm/autocomplete';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
  selector: 'app-navbar',
  imports: [HlmNavigationMenuImports, HlmButtonImports, NgOptimizedImage, HlmAutocompleteImports, HlmSpinnerImports],
  templateUrl: './navbar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {

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
