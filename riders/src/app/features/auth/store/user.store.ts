import { computed } from '@angular/core'
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals'

type LoginStore = {
  accessToken: string,
  refreshToken: string
}

const initialState : LoginStore = {
  accessToken: '',
  refreshToken: ''
}

export const UserStore = signalStore( 
  { providedIn: 'root' },
  
  withState(initialState),
  withComputed(( { accessToken }) => ({
    isAuthenticate: computed(() => accessToken() !== '')
  })),


  withMethods((store) => ({
    // Setear el nuevo token en cada Login
    setAccessToken(newToken:string){
      patchState(store, { accessToken: newToken }); 
    },

    // Setear el token de refresco en casa Login.
    setRefreshToken( newRefresh : string){
      patchState(store, { refreshToken: newRefresh }); 
    }
  }))





)