import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {

  constructor(private router: Router, public user:UserService,private data:DataService) { }

  ngOnInit() {
      if(this.user.user.role == 'admin'){
        this.router.navigate(['department'])
      }
      else{
        this.data.dep = this.user.user.dep;
        this.router.navigate(['process',this.data.dep]);
      }
  }

}
