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
    let mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(this.email ==""){
      document.getElementById('status').textContent = "Enter in Email"
      return;
    }else if(this.password ==""){
      document.getElementById('status').textContent = "Enter in password"
      return;
    }
    if(!(this.email.match(mailformat))){
      document.getElementById('status').textContent = "invalid email"
      return;
    }

    this.config
      .postLogin('/login', { emailAddy: this.email, pass: this.password })
      .subscribe((res: any) => {
        console.log(res);
        let temp = JSON.parse(res);

        if (temp.message == 'success') {
          localStorage.setItem('jwt', temp.accessToken);
          this.router.navigate(['createTable']);
        }else if(temp.message == 'deactivated'){
          document.getElementById('status').textContent = "Account has been deactivated contact administrator"
        }else if(temp.message == 'admin'){
          localStorage.setItem('jwt', temp.accessToken);
          this.router.navigate(['admin']);
        }else{
          document.getElementById('status').textContent = "Email or password is incorrect"
        }
      });
  }
  displayPublic(){
    this.config.getPublic().subscribe((res: any)=> {
      document.getElementById("mandem").textContent = res
    })
  }
}
