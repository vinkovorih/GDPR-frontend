import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Observable} from "rxjs/Rx";
import {MatPaginator} from "@angular/material";
import {ConfirmationService, Message} from "primeng/api";
import {UserService} from "../../../../services/user.service";
import {DataSource} from "@angular/cdk/collections";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  dataSource: TableDataSource;
  displayedColumns = ['id','username','first','last','authority','del'];
  msgs: Message[] = [];
  users: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('filter') filter: ElementRef;
  constructor(private user:UserService, private cs:ConfirmationService) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers(){
    this.user.getUsers().subscribe(res=> {
      this.users = res;
      this.dataSource = new TableDataSource(res, this.paginator);
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
  colsUsers = [
    { field: 'username', header: 'Korisničko ime' },
    { field: 'firstName', header: 'Ime' },
    { field: 'lastName', header: 'Prezime' },
  ];
  deleteUser(id){
    this.cs.confirm({
      key: 'warn',
      message: 'Želite li obrisati odabranog korisnika?',
      accept: () => {
        this.user.deleteUser(id).subscribe(res=>{
            this.msgs = [];
            this.msgs.push({severity:'info', summary:res});
            this.getUsers();
          }
        )}
    });
  }
  changeAuthorities(id){
    this.user.changeAuthorities(id).subscribe(res => {
      this.msgs = [];
      this.msgs.push({severity:'info', summary:res});
      this.getUsers();
    });
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
        const searchStr = ((item.username).toLowerCase()+ item.firstName.toLowerCase());
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return this.filteredData.splice(startIndex,this.paginator.pageSize);
    })
  }
  disconnect(){}
}
