import { Injectable } from '@angular/core';
import {
  CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute,
  Params
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {DataService} from "./data.service";
import {UserService} from "./user.service";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private route:ActivatedRoute,private data:DataService,private user:UserService, private router:Router){}

  canActivate(next:ActivatedRouteSnapshot){
    if(this.user.user != null){
      if(this.user.user.role =='admin')return true;
        let id = next.params['id'];
        if(id){
          return true;
        }
    }
    else{
    this.router.navigate(['']);
    return false;
    }
  }
}
