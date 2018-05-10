import { Injectable } from '@angular/core';
import {
  CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute, Params,
  Router
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {UserService} from "./user.service";
import {DataService} from "./data.service";

@Injectable()
export class GdprGuard implements CanActivate {
  constructor(private route:ActivatedRoute,private data:DataService,private user:UserService, private router:Router){}

  canActivate(next:ActivatedRouteSnapshot, state:RouterStateSnapshot){
    if(this.user.user != null){
      if(this.user.user.role =='admin')return true;
      let id = next.params['idpr'];
      if(id == this.data.process.id){
        return true;
      }
    }
    else{
    if(state.url.toString().startsWith("/process"))
    this.router.navigate(['/process',this.data.process.id]);
    else this.router.navigate(['']);
    return false;
  }}
}
