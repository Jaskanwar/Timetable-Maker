import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../Config.service';

@Component({
  selector: 'app-timetable-create-user',
  templateUrl: './timetable-create-user.component.html',
  styleUrls: ['./timetable-create-user.component.css'],
})
export class TimetableCreateUserComponent implements OnInit {
  constructor(private config: ConfigService) {}

  ngOnInit(): void {}

  firstName = '';
  lastName = '';
  email = '';
  password = '';
  loadUser() {
    this.config
      .putUser('users/', {
        name: this.firstName + ' ' + this.lastName,
        emailAddress: this.email,
        passCode: this.password,
      })
      .subscribe((res: any) => {
        document.getElementById('display').textContent = 'You Account Has Been Created!';
      });
  }
}
