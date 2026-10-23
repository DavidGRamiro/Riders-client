import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";


interface UserState {
    username : string;
    is_active: boolean;
    email: string;  
    authenticated : boolean; 
}

const initialState : UserState = {
    username : '',
    is_active: false,
    email: '',
    authenticated : false
}

export const UserStore = signalStore(
  { providedIn: 'root' },
  
  withState(initialState),
  withMethods((store) => ({
    
    setUser(data: UserState){
      patchState(store, data)
    },

    clearUser(){
      patchState(store, initialState)
    }
  }))
  




)