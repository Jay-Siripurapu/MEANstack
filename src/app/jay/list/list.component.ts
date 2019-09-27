import {  Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../input.model';
import { Subscription } from 'rxjs';
import { PostsService } from '../post.services';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-list',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.css']
})

export class List implements OnInit,OnDestroy {
 posts: Post[] = [];
 isloading = false;
 totalposts =0;
 postperpage = 2;
 userId: string;
 currentpage=1; userIsAuthenticated = false;
 pagesizeopp =[1, 2, 5, 10 ];
 private authStatusSub: Subscription;
private postsSub : Subscription;
  constructor(public postsService: PostsService,private authService: AuthService) {
  }
  ngOnInit(){
      this.isloading = true;
      this.postsService.getPosts(this.postperpage,this.currentpage);
      this.userId= this.authService.getuserId();
      this.postsSub = this.postsService.getPostUpdateListener().
      subscribe(( postData:{posts: Post[],postcount:number}) => {
           this.isloading = false;
           this.totalposts =postData.postcount;
           this.posts = postData.posts;
      });
      //3 args for subscribe  function ,error,final
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authStatusSub = this.authService
        .getAuthStatusListener()
        .subscribe(isAuthenticated => {
          this.userIsAuthenticated = isAuthenticated;
          this.userId= this.authService.getuserId();
        });

  }
  onchangepage(pageData: PageEvent){
    this.isloading=true;
    this.currentpage = pageData.pageIndex + 1;
    this.postperpage=pageData.pageSize;
    this.postsService.getPosts(this.postperpage, this.currentpage);
  }
  onDelete(postId: string) {
    this.isloading=true;
    this.postsService.deletePost(postId).subscribe(() => {
         this.postsService.getPosts(this.postperpage, this.currentpage);
    },() => {
      this.isloading= false;
    });
  }
  ngOnDestroy(){
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
