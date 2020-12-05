import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  rootURL;
  constructor(private http: HttpClient) {
      this.rootURL = 'http://localhost:3000';
  }
  get(address: string){
    address = `${this.rootURL}/${address}`;
    return this.http.get(address).pipe(catchError(this.handleError));
  }
  post(address: string, info: object, options){
    address = `${this.rootURL}/${address}`;
    return this.http.post(address,info,options);
  }
  put(address: string, info: object, options){
    address = `${this.rootURL}/${address}`;
    return this.http.put(address,info,options);
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
  getAll(subject: string){
    return this.get('api/'+subject);
  }
  getAllSubjectCodes(){
    return this.get('api/course');
  }
  getCourseCodes(subject: string, code: string){
    return this.get('api/timetable/'+subject+"/"+code);
  }
  getComponentCodes(subject: string, code: string, comp: string){
    return this.get('api/timetable/'+subject+"/"+code+"/"+comp);
  }
  putScheduleName(name: string, auth: string, info: object){
    return this.put('api/schedule/'+name+'/'+auth,info, {responseType: 'text'});
  }
  putPairs(name: string,auth: string, info: object, options){
    return this.put('api/write/schedule/'+name+'/'+auth, info, {responseType: 'text'});
  }
  getpairs(name: string,auth: string){
    return this.get('api/display/schedule/'+ name+'/'+auth);
  }
  deleteName(name: string,auth: string, info: object){
    return this.post('api/schedule/'+name+'/'+auth, info, {responseType: 'text'});
  }
  displayAllSchedules(auth: string){
    return this.get('api/disp/schedule'+'/'+auth);
  }
  deleteAll(auth: string,info: object){
    return this.post('api/delete/schedules'+'/'+auth,info,{responseType: 'text'})
  }
  postLogin(name: String, info:object){
    return this.post('api/login',info,{responseType: 'text'})
  }
  putUser(name: string, info:object)
  {
    return this.put('api/users',info,{responseType: 'text'})
  }
  getUserList(auth: string){
    return this.get('api/fill/users/'+auth);
  }
  postMakeAdmin(name: String, auth: string, info:object){
    return this.post('api/admin/'+name+'/'+auth, info, {responseType: 'text'})
  }
  postDeactivate(name: String, auth: string, info:object){
    return this.post('api/deactivate/'+name+'/'+auth, info, {responseType: 'text'})
  }
  postActivate(name: String, auth: string, info:object){
    return this.post('api/activate/'+name+'/'+auth, info, {responseType: 'text'})
  }
  getKeywordSearch(keyword: string){
    return this.get('api/keyword/'+keyword)
  }
  postNewPassword(email: string, password: string, auth: string, info: object){
    return this.post('api/change/'+email+'/'+password+'/'+auth,info,{responseType: 'text'});
  }
  putDescription(name: string,auth: string, info: object){
    return this.put('api/description/'+name+'/'+auth,info, {responseType: 'text'});
  }
  postPublic(name: string,auth: string, info: object){
    return this.post('api/public/'+name+'/'+auth,info,{responseType: 'text'});
  }
  getLists(auth: string){
    return this.get('api/show/'+auth);
  }
}
