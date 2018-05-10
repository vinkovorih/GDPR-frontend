import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {UserService} from "./user.service";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private router:Router, private user:UserService){}
  canActivate() {
    if(this.user.user != null){
      if(this.user.user.role == 'admin')
      return true;
    }
    else{
      this.router.navigate(['']);
      return false;
    }
  }
}
