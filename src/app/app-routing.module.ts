import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TimetableHomeComponent } from './timetable-home/timetable-home.component';
import { TimtetableSearchComponent } from './timtetable-Search/timtetable-Search.component';
import { TimetableCreateComponent } from './timetable-create/timetable-create.component';
import { TimetableCreateUserComponent } from './timetable-create-user/timetable-create-user.component';
import { TimetableAdminComponent } from './timetable-admin/timetable-admin.component'
import { TimetablePoliciesComponent } from './timetable-policies/timetable-policies.component'

const routes: Routes = [
  { path: '', component: TimetableHomeComponent },
  { path: 'search', component: TimtetableSearchComponent },
  { path: 'createTable', component: TimetableCreateComponent },
  { path: 'createUser', component: TimetableCreateUserComponent},
  { path: 'admin', component: TimetableAdminComponent},
  { path: 'policies', component: TimetablePoliciesComponent}
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
