import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../Config.service';
import { HttpHeaders } from '@angular/common/http';
import {
  Router,
  RouterModule,
  Routes,
  RoutesRecognized,
} from '@angular/router';

@Component({
  selector: 'app-timetable-create',
  templateUrl: './timetable-create.component.html',
  styleUrls: ['./timetable-create.component.css'],
})
export class TimetableCreateComponent implements OnInit {
  name = '';
  description = '';
  subject = '';
  email = '';
  password = '';
  newpassword = '';
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
    let authObject = {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('jwt') },
    };
    if(this.name ==""){
      document.getElementById('sDisplay').textContent = "Please Enter a name";
      return;
    }
    this.config
      .putScheduleName(this.name, JSON.stringify(authObject), this.info)
      .subscribe((res: any) => {
        let temp = JSON.parse(res);
        console.log(temp);
        if (temp.message == 'failed') {
          this.router.navigate(['']);
        }
      });
  }
  addDescription(){
    let authObject = {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('jwt') },
    };
    this.config.putDescription(this.name,JSON.stringify(authObject),{"description": this.description}).subscribe((res: any)=>{
      let temp = JSON.parse(res);
      if (temp.message == 'failed') {
        this.router.navigate(['']);
      }
    })
  }
  addCourses(courseCode: string) {
    let authObject = {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('jwt') },
    };
    this.config
      .putPairs(
        this.name,
        JSON.stringify(authObject),
        { subject: this.subject, catalog_nbr: courseCode },
        this.httpOptions
      )
      .subscribe((res: any) => {
        let temp = JSON.parse(res);
        if (temp.message == 'failed') {
          this.router.navigate(['']);
        }
      });
  }
  displaySchedule() {
    let authObject = {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('jwt') },
    };
    this.config
      .getpairs(this.name.toString(), JSON.stringify(authObject))
      .subscribe((res: any) => {
        document.getElementById('sDisplay').textContent = `Schedule: ${
          this.name
        } Classes: ${JSON.stringify(res)}`;
        let temp = JSON.parse(res);
        if (temp.message == 'failed') {
          this.router.navigate(['']);
        }
      });
  }
  deleteSchedName() {
    let authObject = {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('jwt') },
    };
    this.config
      .deleteName(this.name, JSON.stringify(authObject), this.info)
      .subscribe((res: any) => {
        console.log(res);
        let temp = JSON.parse(res);
        if (temp.message == 'failed') {
          this.router.navigate(['']);
        }
      });
  }
  displayAllSchedule() {
    let authObject = {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('jwt') },
    };
    this.config
      .displayAllSchedules(JSON.stringify(authObject))
      .subscribe((res: any) => {
        document.getElementById('sDisplay').textContent = JSON.stringify(res);
        let temp = JSON.parse(res);
        if (temp.message == 'failed') {
          this.router.navigate(['']);
        }
      });
  }
  deleteAllSchedules() {
    let authObject = {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('jwt') },
    };
    this.config
      .deleteAll(JSON.stringify(authObject), this.info)
      .subscribe((res: any) => {
        let temp = JSON.parse(res);
        if (temp.message == 'failed') {
          this.router.navigate(['']);
        }
      });
  }

  changePassword() {
    let authObject = {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('jwt') },
    };
    this.config
      .postNewPassword(this.email, this.password, JSON.stringify(authObject), {
        password: this.newpassword,
      })
      .subscribe((res: any) => {
        let temp = JSON.parse(res);
        if (temp.message == 'failed') {
          this.router.navigate(['']);
        }
      });
  }
}
