import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit,OnDestroy {
  isLoading = false;
  private authstatussub :Subscription;
ngOnInit(){
 this.authstatussub =this.authService.getAuthStatusListener().subscribe(
   authStatus=>{
     this.isLoading=false;
   }
 );
}
  constructor(public authService: AuthService) {}

  Signup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading=true;
    this.authService.createUser(form.value.email, form.value.password);
  }
  ngOnDestroy(){
    this.authstatussub.unsubscribe();
  }
}
