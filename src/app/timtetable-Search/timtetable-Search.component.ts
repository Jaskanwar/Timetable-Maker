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
  keyword = '';
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
      //res = "ClassName: "+ JSON.stringify(res[0].className) +" Description:"+ JSON.stringify(res[0].catalog_description);
      document.getElementById('subject').textContent = "Subject" + JSON.stringify(res[0].subject)
      document.getElementById("catalog_nbr").textContent = "Course Code: " + JSON.stringify(res[0].catalog_nbr);
      document.getElementById("className").textContent = "Class: " + JSON.stringify(res[0].className);
      document.getElementById("class_section").textContent = "Section: " + JSON.stringify(res[0].course_info[0].class_section);
      document.getElementById("ssr_component").textContent = "Class Component(s): " + JSON.stringify(res[0].course_info[0].ssr_component);
    })
  }
  searchComponent(){
    this.config.getComponentCodes(this.subject,this.course,this.component).subscribe((res : any)=>{
      //res = "ClassName: "+ JSON.stringify(res[0].className) +" Description:"+ JSON.stringify(res[0].catalog_description+ " Component:"+ JSON.stringify(res[0].course_info[0].ssr_component));
      document.getElementById('subject').textContent = "Subject" + JSON.stringify(res[0].subject)
      document.getElementById("catalog_nbr").textContent = "Course Code: " + JSON.stringify(res[0].catalog_nbr);
      document.getElementById("className").textContent = "Class: " + JSON.stringify(res[0].className);
      document.getElementById("class_section").textContent = "Section: " + JSON.stringify(res[0].course_info[0].class_section);
      document.getElementById("ssr_component").textContent = "Class Component(s): " + JSON.stringify(res[0].course_info[0].ssr_component);
    })
  }
  keywordSearch(){
    this.config.getKeywordSearch(this.keyword).subscribe((res: any) =>{
      if(this.keyword.length <4){
        document.getElementById('Display').textContent = "Search must contain 4 characters";
        return;
      }
      let list = document.createElement('ol');
      for (let i = 0; i < res.length; i++) {
        let course = document.createElement('li');
        course.appendChild((document.createTextNode("Subject: " + JSON.stringify(res[i].subject)+ "\t\t")));
        course.appendChild((document.createTextNode("Course Code: " + JSON.stringify(res[i].catalog_nbr)+ "\t\t")));
        course.appendChild((document.createTextNode("Class: " + JSON.stringify(res[i].className)+ "\t\t")));
        course.appendChild((document.createTextNode("Section: " + JSON.stringify(res[i].course_info[0].class_section)+ "\t\t")));
        course.appendChild((document.createTextNode("Class Component: " + JSON.stringify(res[i].course_info[0].ssr_component)+ "\t\t")));
        list.appendChild(course);
      }
      document.getElementById("Display").appendChild(list)
    })
  }
}
