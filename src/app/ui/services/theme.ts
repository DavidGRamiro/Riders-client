import { DOCUMENT, inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Theme {

  private readonly document = inject(DOCUMENT)
  public readonly theme = signal<'light' | 'dark'>('dark');

  /** Toggle the theme from NavBar component */
  public toggle(){
    const next = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    this.document.documentElement.classList.toggle('dark', next === 'dark');
    localStorage.setItem('theme', next);
  }

  /** Set icon in the navbar. Note that this icons should be imports in the NavBar componente */
  public get icon(){
    return this.theme() === 'light' ? 'lucideMoon' : 'lucideSunMedium';
  }

/** Read usertheme from other sessions. If not, sets dark by default */
  public userTheme() : void{
    const theme = localStorage.getItem('theme') ?? 'dark'
    this.theme.set(theme as 'light' | 'dark');
    this.document.documentElement.classList.toggle('dark', theme === 'dark');
  }
}
