import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {UserService} from "./user.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router:Router, private user:UserService){}
  canActivate() {
    if(this.user.user != null){
        return true;
    }
    else{
      window.history.back();
      return false;
    }
  }
}
