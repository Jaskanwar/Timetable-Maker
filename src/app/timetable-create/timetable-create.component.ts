import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../Config.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-timetable-create',
  templateUrl: './timetable-create.component.html',
  styleUrls: ['./timetable-create.component.css'],
})
export class TimetableCreateComponent implements OnInit {
  name = '';
  subject = '';
  arr;
  info = {};
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'my-auth-token',
    }),
  };
  constructor(private config: ConfigService) {}

  ngOnInit(): void {}
  populate() {
    this.config.getAll(this.subject).subscribe((res: any) => {
      this.arr = res;
      console.log(res);
    });
  }
  nameSched() {
    let authObject = {headers: {Authorization: "Bearer " + localStorage.getItem("jwt")}}
    this.config
      .putScheduleName(this.name,JSON.stringify(authObject), this.info)
      .subscribe((res: any) => {
        console.log(res);
      });
  }
  addCourses(courseCode: string) {
    this.config
      .putPairs(
        this.name,
        { subject: this.subject, catalog_nbr: courseCode },
        this.httpOptions
      )
      .subscribe((res: any) => {});
  }
  displaySchedule() {
    this.config.getpairs(this.name.toString()).subscribe((res: any) => {
      document.getElementById('sDisplay').textContent = `Schedule: ${
        this.name
      } Classes: ${JSON.stringify(res)}`;
    });
  }
  deleteSchedName() {
    this.config.deleteName(this.name, this.info).subscribe((res: any) => {
      console.log(res);
    });
  }
  displayAllSchedule(){
    this.config.displayAllSchedules().subscribe((res: any) => {
      document.getElementById("sDisplay").textContent = JSON.stringify(res)
    });
  }
  deleteAllSchedules(){
    this.config.deleteAll(this.info).subscribe();
  }
}
