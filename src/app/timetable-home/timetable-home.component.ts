import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../Config.service';
import { Router, RouterModule, Routes, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'app-timetable-home',
  templateUrl: './timetable-home.component.html',
  styleUrls: ['./timetable-home.component.css']
})
export class TimetableHomeComponent implements OnInit {

  constructor(private config: ConfigService, private router: Router) { }

  ngOnInit(): void {
  }

  email = '';
  password = '';

  verify() {
    this.config
      .postLogin('/login', { emailAddy: this.email, pass: this.password })
      .subscribe((res: any) => {
        console.log(res);
        let temp = JSON.parse(res);

        if (temp.message == 'success') {
          localStorage.setItem('jwt', temp.accessToken);
          this.router.navigate(['createTable']);
        }
      });
  }
}
