import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../Config.service';

@Component({
  selector: 'app-timetable-admin',
  templateUrl: './timetable-admin.component.html',
  styleUrls: ['./timetable-admin.component.css']
})
export class TimetableAdminComponent implements OnInit {

  constructor(private config: ConfigService) { }

  ngOnInit(): void {
  }
  userList = [];
  fillUsers(){
    console.log("poopoo")
    let authObject = {headers: {Authorization: "Bearer " + localStorage.getItem("jwt")}}
    this.config.getUserList(JSON.stringify(authObject)).subscribe((res: any) =>{
      this.userList = res;
    })
  }
}
