import { Component, OnInit } from '@angular/core';
import { ConfigService } from "../Config.service";
@Component({
  selector: 'app-timtetable-Search',
  templateUrl: './timtetable-Search.component.html',
  styleUrls: ['./timtetable-Search.component.css']
})
export class TimtetableSearchComponent implements OnInit {
  subject = '';
  course = '';
  component = '';
  constructor(private config: ConfigService) { }

  ngOnInit() {
  }

  displaySubjects(){
    this.config.getAllSubjectCodes().subscribe((res : any)=>{
      document.getElementById('Display').textContent = JSON.stringify(res)
    })
  }
  searchCourseCode(){
    this.config.getCourseCodes(this.subject,this.course).subscribe((res : any)=>{
      res = "ClassName: "+ JSON.stringify(res[0].className) +" Description:"+ JSON.stringify(res[0].catalog_description);
      document.getElementById('Display').textContent = JSON.stringify(res)
    })
  }
  searchComponent(){
    this.config.getComponentCodes(this.subject,this.course,this.component).subscribe((res : any)=>{
      res = "ClassName: "+ JSON.stringify(res[0].className) +" Description:"+ JSON.stringify(res[0].catalog_description+ " Component:"+ JSON.stringify(res[0].course_info[0].ssr_component));
      document.getElementById('Display').textContent = JSON.stringify(res)
    })
  }

}
