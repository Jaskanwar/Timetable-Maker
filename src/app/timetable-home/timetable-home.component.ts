import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-timetable-home',
  templateUrl: './timetable-home.component.html',
  styleUrls: ['./timetable-home.component.css']
})
export class TimetableHomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  email = '';
  password = '';
}
