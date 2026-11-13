import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmCardImports } from "@spartan-ng/helm/card";
import { HlmButtonImports } from "@spartan-ng/helm/button";
import { lucideSignpost } from '@ng-icons/lucide';
import { formatTime } from '../../../../../shared/utils';

@Component({
  selector: 'app-route-title',
  imports: [NgIcon, HlmCardImports, HlmButtonImports],
  templateUrl: './route-title.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ lucideSignpost })]
})
/** Encabezado con el título, puntos, distancia y tiempo de la ruta. */
export class RouteTitle {

  /** Título de la ruta. */
  public title = input.required<string>()
  /** Puntos de la ruta ya formateados. */
  public pointsOfRoutes = input.required<string>()
  /** Distancia estimada en kilómetros. */
  public distance = input.required<number>()
  /** Tiempo estimado de la ruta. */
  public time = input.required<number>()

  /** Formateo del tipo de milisegundos a hh/mm */
  public getTime(time: number){
    if(time > 0){
      return formatTime(time)
    }else{
      return '0 h'
    }
  }


}
