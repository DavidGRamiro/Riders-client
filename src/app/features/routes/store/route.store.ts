import { getState, patchState, signalState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { AiResponse } from "../../../shared/interfaces/ai-generator";


const initialState : AiResponse = {
  title: '',
  origin: '',
  destination: '',
  way_points: [],
  route_type: '',
  prefer_curvy_roads: false,
  distance_estimated_km: 0,
  coords: []
}

export const RouteStore = signalStore(
  { providedIn: 'root'},

  withState(initialState),
  withMethods((store) => ({

    // Set de new route generated to the store
    setRoute(route : AiResponse){
      patchState(store, route)
    },

    //Clear to initialState de routes state
    clearRoute(){
      patchState(store, initialState)
    },

    // Get all Route data
    getRoute(): AiResponse {
      return getState(store) as AiResponse
    }
  }))

)