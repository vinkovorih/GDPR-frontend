import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Observable} from "rxjs/Rx";
import {UserService} from "../../../services/user.service";
import {MatDialog, MatPaginator} from "@angular/material";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {DataSource} from "@angular/cdk/collections";
import {ConfirmationService, Message} from "primeng/api";
import {DataService} from "../../../services/data.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit {
  dataSource: TableDataSource;
  displayedColumns = ['id','name','short'];
  msgs: Message[] = [];
  deps: any[] = [];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('filter') filter: ElementRef;
  constructor(private dialog:MatDialog, private user:UserService, private cs:ConfirmationService, private data:DataService, private router:Router) { }

  ngOnInit() {
    this.getDeps();
  }

  getDeps(){
    this.user.getDeps().subscribe(res => {
      this.deps = res;
      this.dataSource = new TableDataSource(this.deps, this.paginator);
      Observable.fromEvent(this.filter.nativeElement, 'keyup')
        .debounceTime(150)
        .distinctUntilChanged()
        .subscribe(() => {
          if (!this.dataSource) {
            return;
          }
          this.dataSource.filter = this.filter.nativeElement.value;
        });
    });
  }

  selectdep(row){
    this.data.dep = row.id;
    this.router.navigate(['process',this.data.dep]);
  }

}


export class TableDataSource extends DataSource<any>{
  _filterChange = new BehaviorSubject('');
  get filter(): string {
    return this._filterChange.value;
  }
  set filter(filter: string) {
    this._filterChange.next(filter);
  }
  filteredData: any =[];

  constructor(private data: any, private paginator: MatPaginator){
    super();
  }
  connect(): Observable<any[]>{
    const displayDataChanges = [
      this.data,
      this._filterChange,
      this.paginator.page
    ];
    return Observable.merge(...displayDataChanges).map(() => {
      this.filteredData = this.data.slice().filter((item: any) => {
        const searchStr = ((item.name).toLowerCase()+ item.shortname.toLowerCase());
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return this.filteredData.splice(startIndex,this.paginator.pageSize);
    })
  }
  disconnect(){}
}
