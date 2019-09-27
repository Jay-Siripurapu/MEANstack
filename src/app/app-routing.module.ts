import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { List } from './jay/list/list.component';
import { Text } from './jay/text/text.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';
const routes: Routes = [
  {path : '', component: List},
  {path : 'create', component: Text, canActivate: [AuthGuard]},
  {path : 'edit/:postId', component: Text, canActivate: [AuthGuard]},
  {path : 'login', component: LoginComponent },
  {path : 'signup', component: SignupComponent }
];
@NgModule({
imports: [RouterModule.forRoot(routes)],
exports: [RouterModule],
providers: [AuthGuard]
})
export class AppRoutingModule {}
