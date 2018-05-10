import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {UserService} from "./user.service";

@Injectable()
export class ProcessGuard implements CanActivate {
  constructor(private user:UserService, private router:Router){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(this.user.user != null){
      if(this.user.user.role == 'admin')return true;
      if(next.params['id'] == this.user.user.dep){
        return true;
      }
    }
    this.router.navigate(['']);
    return false;
  }
}
