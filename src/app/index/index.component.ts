import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {PortalComponent} from "./portal/portal.component";
import {PortalService} from "../services/portal.service";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  @Output() data = new EventEmitter<any>();
  constructor(private portal: PortalService) { }

  ngOnInit() {
  }

  getLikes() {
    this.portal.getLikes().subscribe(res => {
        this.data.emit(res);
    });
  }

}
