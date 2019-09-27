import { Component, OnInit, OnDestroy } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../post.services';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../input.model';
import { mimeType } from './mine-validator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css']
})
export class Text implements OnInit,OnDestroy {
   private mode = 'create';
   private postId: string;
    post: Post;
    isloading = false;
    form: FormGroup;
    imgpreview: string;
    private authstatussub: Subscription;
  constructor(public postsService: PostsService, public route: ActivatedRoute,private authservice:AuthService ) {

  }
  ngOnInit() {
    this.authstatussub =this.authservice.getAuthStatusListener().subscribe(
      authStatus=>{
        this.isloading=false;
      }
    );
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}
      ),
      content : new FormControl(null, {validators: [Validators.required, Validators.minLength(5)]}
        ),
        image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if ( paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isloading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isloading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
             creator:postData.creator};
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image:this.post.imagePath
          });
        });

       } else {
          this.mode = 'create';
          this.postId = null;

        }
    });
  }
  onImagePicked(event: Event) {
         const file = (event.target as HTMLInputElement).files[0];
         this.form.patchValue({image: file});
         this.form.get('image').updateValueAndValidity();
         const reader = new FileReader();
         reader.onload = () => {
            this.imgpreview = reader.result as string;
         };
         reader.readAsDataURL(file);
     }
  SavePost() {
    if ( this.form.invalid ) {
      return true;
    }
    this.isloading = true;
    if ( this.mode === 'create') {
    this.postsService.addPost(this.form.value.title , this.form.value.content, this.form.value.image);
   } else {
    this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content,this.form.value.image);
    // this.postsService.addPost(form.value.title , form.value.content);
   }
    this.form.reset();

  }
  ngOnDestroy(){
    this.authstatussub.unsubscribe();
  }

}
