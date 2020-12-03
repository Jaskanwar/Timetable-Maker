import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { TimtetableSearchComponent } from './timtetable-Search/timtetable-Search.component';
import { FormsModule } from '@angular/forms';
import { TimetableCreateComponent } from './timetable-create/timetable-create.component';
import { AppRoutingModule } from './app-routing.module';
import { TimetableHomeComponent } from './timetable-home/timetable-home.component';

@NgModule({
  declarations: [AppComponent, TimtetableSearchComponent, TimetableCreateComponent, TimetableHomeComponent],
  imports: [BrowserModule, HttpClientModule, FormsModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
