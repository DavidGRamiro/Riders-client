import { getState, patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { RouteResponse } from "../../../shared/interfaces/ai-generator";


const initialState : RouteResponse = {
  ollama : {
    avoid_motorways: false,
    destination: '',
    distance_estimated_km: 0,
    origin: '',
    prefer_curvy_roads: false,
    route_type: '',
    title: '',
    way_points: [],
  },
  route_engine: {
    distance: 0,
    duration: 0,
    coordinates: [],
  }
}

export const RouteStore = signalStore(
  { providedIn: 'root'},

  withState(initialState),
  withMethods((store) => ({

    // Set de new route generated to the store
    setRoute(route : RouteResponse){
      patchState(store, route)
    },

    //Clear to initialState de routes state
    clearRoute(){
      patchState(store, initialState)
    },

    // Get all Route data
    getRoute(): RouteResponse {
      return getState(store)
    }
  }))

)