import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PortalService} from "../../../services/portal.service";
import {UserService} from "../../../services/user.service";
import {Router} from "@angular/router";
import {Message} from "primeng/api";

@Component({
  selector: 'app-bugreport',
  templateUrl: './bugreport.component.html',
  styleUrls: ['./bugreport.component.css']
})
export class BugreportComponent implements OnInit {
  msgs: Message[] = [];
  error: any = {
    title: '',
    content: '',
    author: this.user.user.username
  };
  loading: boolean = false;
  controller: FormGroup;

  constructor(private fb: FormBuilder, private portal: PortalService, private user: UserService, private router: Router) {
    this.createForm();
    this.loading = false;
  }

  ngOnInit() {
  }

  backToPortal() {
    this.router.navigate(['']);
  }

  createForm() {
    this.controller = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  report() {
    this.loading = true;
    this.portal.reportBug(this.error).subscribe(res=>{
      this.msgs = [];
      this.msgs.push({severity: 'info', summary:res});
      this.loading = false;
    })
  }
}

