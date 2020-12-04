import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../Config.service';
import { HttpHeaders } from '@angular/common/http';
import { Router, RouterModule, Routes, RoutesRecognized } from '@angular/router';

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
  constructor(private config: ConfigService, private router: Router) {}

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
        let temp = JSON.parse(res)
        console.log(temp);
        if(temp.message == "failed"){
          this.router.navigate([''])
        }
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
