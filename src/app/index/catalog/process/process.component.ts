import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {Observable} from "rxjs/Rx";
import {DataSource} from "@angular/cdk/collections";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatPaginator} from "@angular/material";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Message} from "primeng/api";
import {DataService} from "../../../services/data.service";
import {UserService} from "../../../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.css']
})
export class ProcessComponent implements OnInit {
  msgs: Message[] = [];
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  dataSource: TableDataSource;
  processes: any[] = [];
  displayedColumns = ['id', 'name', 'desc'];
  constructor(private data:DataService,private user:UserService, private dialog:MatDialog, private router:Router) { }

  ngOnInit() {
    this.getProcesses();
  }

  private getProcesses() {
    this.data.getProcessesOfDep(this.data.dep).subscribe(res => {
      this.processes = res;
      this.dataSource = new TableDataSource(this.processes, this.paginator);
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

  addRow(){
    let dialogRef;
    dialogRef = this.dialog.open(NewProcessDialog, {
      width: '600px',
      height: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.msgs = [];
        this.msgs.push({severity:'info', summary:'Uspješno dodavanje procesa!'});
        this.getProcesses();
      }
    });
  }

  select(row){
    this.data.process = row;
    this.router.navigate(['role',row.id]);
  }

  isAdmin(){
    return this.user.user.role == 'admin';
  }

  backToDepartments(){
    this.data.dep = null;
    this.router.navigate(['department']);

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
        const searchStr = ((item.name).toLowerCase()+ item.desc.toLowerCase());
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return this.filteredData.splice(startIndex,this.paginator.pageSize);
    })
  }
  disconnect(){}
}

@Component({
  selector:'new-process-dialog',
  templateUrl:'newProcessDialog.html',
  styleUrls: ['./dialogs.css']
})
export class NewProcessDialog {
  controllerA: FormGroup;
  constructor(
    public fb: FormBuilder,
    public save:DataService,
    private user: UserService,
    public dialogRef: MatDialogRef<NewProcessDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.createAddForm();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  createAddForm(){
    this.controllerA = this.fb.group({
      name: ['',Validators.required],
      desc: ['',Validators.required],
    });
  }
  add(data){
    if(this.controllerA.valid){
      data.fkdep = this.save.dep;
      this.save.newProcess(data).subscribe(res=>{});
      setTimeout(()=> {
      },2500);
    }
  }
}
