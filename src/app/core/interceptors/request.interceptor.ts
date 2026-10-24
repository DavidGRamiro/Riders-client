import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment as env} from "../../../environments/environment.development";
import { inject } from "@angular/core";
import { AuthStore } from "../../features/auth/store/auth.store";


export function requestInterceptor(
  req : HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {  

  const _authStore = inject(AuthStore)
  const token = _authStore.accessToken();
  
  const isLoginUrl = req.url.includes('login');
  const isNewUser = req.url.includes('/user') && req.method === 'POST';
  const BASE_URL = `${env.URL_BACKEND}${req.url}` 
  
  let request = req;

  if(isLoginUrl || isNewUser){
    request = req.clone({ url: BASE_URL })
  }else{
    request = req.clone({
      url: BASE_URL,
      setHeaders : {
        "Authorization" : `Bearer ${token}`
      }
    })
  }
  
  return next(request)
}