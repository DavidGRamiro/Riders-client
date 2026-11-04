import { inject } from "@angular/core";
import { Auth } from "../features/auth/services/auth";
import { AuthStore } from "../features/auth/store/auth.store";
import { UserStore } from "../shared";
import { firstValueFrom } from "rxjs";



export async function refreshPageInitializer(){

  const _auth = inject(Auth)
  const _authStore = inject(AuthStore)
  const _userStore = inject(UserStore)

  const refresh = localStorage.getItem('refresh');
  if(!refresh) return;

  try {
    const res = await firstValueFrom(_auth.refresh(refresh))
    _authStore.setTokens(res.access, res.refresh)
    _userStore.setUser(res.extra_data)

    localStorage.setItem('refresh', res.refresh)
  } catch {
    localStorage.removeItem('refresh')
  }
}