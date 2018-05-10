import {Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatPaginator} from "@angular/material";
import {UserService} from "../../../../services/user.service";
import {ConfirmationService, Message} from "primeng/api";
import {DataSource} from "@angular/cdk/collections";
import {Observable} from "rxjs/Rx";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-deps',
  templateUrl: './deps.component.html',
  styleUrls: ['./deps.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DepsComponent implements OnInit {
  dataSource: TableDataSource;
  displayedColumns = ['id','name','short','del'];
  msgs: Message[] = [];
  deps: any[] = [];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('filter') filter: ElementRef;
  constructor(private dialog:MatDialog, private user:UserService, private cs:ConfirmationService) { }

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
  deleteDeps(id){
    this.cs.confirm({
      message: 'Želite li obrisati odabrani odjel?',
      key:'dep',
      accept: () => {
        this.user.deleteDeps(id).subscribe(res=>{
          this.msgs = [];
          this.msgs.push({severity:'info', summary:res});
          this.getDeps();
        });
      }
    });

  }
  addDeps(){
    let dialogRef;
    dialogRef = this.dialog.open(NewDepartment, {
      width: '600px',
      height: '550px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getDeps();
        this.msgs = [];
        this.msgs.push({severity:'info', summary:"Uspješno dodavanje odjela!"});
      }
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
        const searchStr = ((item.name).toLowerCase()+ item.shortname.toLowerCase());
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return this.filteredData.splice(startIndex,this.paginator.pageSize);
    })
  }
  disconnect(){}
}

@Component({
  selector:'new-dep-dialog',
  templateUrl:'newDepDialog.html',
  styleUrls: ['./dialogs.css']
})
export class NewDepartment {
  controller: FormGroup;

  constructor(public fb: FormBuilder,
              private user: UserService,
              public dialogRef: MatDialogRef<NewDepartment>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.createForm();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createForm() {
    this.controller = this.fb.group({
      name: ['', Validators.required],
      shortname: ['', Validators.required],
    });
  }

  add(data) {
    if (this.controller.valid) {
      this.user.addDeps(data).subscribe(res => {});
    }
  }
}
