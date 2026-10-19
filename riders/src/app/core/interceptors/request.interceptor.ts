import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment as env} from "../../../environments/environment.development";
import { inject } from "@angular/core";
import { UserStore } from "../../features/auth/store/user.store";


export function requestInterceptor(
  req : HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {  

  const _userStore = inject(UserStore)
  const token = _userStore.accessToken();
  
  const isLoginUrl = req.url.includes('login')
  const BASE_URL = `${env.URL_BACKEND}${req.url}` 
  
  let request = req;

  if(isLoginUrl){
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