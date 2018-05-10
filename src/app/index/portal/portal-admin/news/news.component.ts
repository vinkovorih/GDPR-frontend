import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PortalService} from "../../../../services/portal.service";
import {MatPaginator} from "@angular/material";
import {ConfirmationService, Message} from "primeng/api";
import {Observable} from "rxjs/Rx";
import {DataSource} from "@angular/cdk/collections";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  dataSource: TableDataSource;
  displayedColumns = ['id','author','title','date','del'];
  msgs: Message[] = [];
  news: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('filter') filter: ElementRef;

  constructor(private portal:PortalService,private cs:ConfirmationService) { }

  ngOnInit() {
    this.getNews();
  }


  getNews(){
    this.portal.getPosts().subscribe(res => {
        this.news = res;
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
  colsNews = [
    { field: 'id', header: 'Id' },
    { field: 'author', header: 'Korisnik' },
    { field: 'title', header: 'naslov' },
    { field: 'date', header: 'Datum' },
  ];
  deleteNews(id){
    this.cs.confirm({
      message: 'Želite li obrisati odabrani post?',
      key: 'news',
      accept: () => {
        this.portal.deletePost(id).subscribe(res=>{
          this.msgs = [];
          this.msgs.push({severity:'info', summary:res});
          this.getNews();
        });
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
        const searchStr = ((item.author).toLowerCase()+ item.title.toLowerCase());
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return this.filteredData.splice(startIndex,this.paginator.pageSize);
    })
  }
  disconnect(){}
}
