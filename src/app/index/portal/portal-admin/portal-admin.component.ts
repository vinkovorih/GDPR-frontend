import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-portal-admin',
  templateUrl: './portal-admin.component.html',
  styleUrls: ['./portal-admin.component.css']
})
export class PortalAdminComponent implements OnInit {
  constructor(private router:Router) { }

  ngOnInit() {
  }

  goToCatalog(){
    this.router.navigate(['catalog']);
  }

}
