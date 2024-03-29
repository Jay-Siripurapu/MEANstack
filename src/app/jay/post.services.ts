import { Post } from './input.model';
import { Injectable } from '@angular/core';
// rxjs is used in routing and sending info
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
const BACKEND_URL = 'http://localhost:3000/api/jay';
@Injectable({providedIn: 'root'})
// it provides this at root level and can use it anywhere like static variables
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postcount: number}>();
  constructor(private  http : HttpClient, private router: Router){

  }

  getPosts(postsPerPage: number, currentPage: number) {
    const query = `?pagesize=${postsPerPage} &page=${currentPage}`;
    // backquotes for dynamic allocation
    this.http.get<{ message: string , posts: any , maxposts: number}>(BACKEND_URL + query)
    .pipe(map((postData) => {
      return{ posts: postData.posts.map(post => {
          return{
          title : post.title,
          content: post.content,
          id : post._id,
          imagePath: post.imagePath,
          creator: post.creator
          };
      }), maxposts: postData.maxposts};
      // this will solve _id problem
    }))
    .subscribe((transformedpostsData) => {
      this.posts = transformedpostsData.posts;
      this.postsUpdated.next({posts: [...this.posts], postcount: transformedpostsData.maxposts});
    });
   }
   getPostUpdateListener(){
     return this.postsUpdated.asObservable();
   }
   getPost(id: string) {
    return this.http.get<{ _id: string, title: string , content: string , imagePath : string, creator: string}>(
      BACKEND_URL + id);
   }
  addPost(title: string , content: string, image : File ) {

   const postData = new FormData();
   postData.append( 'title', title);
   postData.append( 'content', content);
   postData.append( 'image' , image, title);
   this.http.post<{ message : string , post: Post }>(BACKEND_URL, postData)
   .subscribe(responceData => {

     this.router.navigate(['/']);
   });
  }
  updatePost(id: string,  title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof(image) === 'object')
    {
      postData = new FormData();
      postData.append('id', id);
      postData.append( 'title', title);
      postData.append( 'content', content);
      postData.append( 'image' , image, title);
    }
    else
    {
       postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }
    this.http.put(BACKEND_URL + id , postData).subscribe(response => {

    this.router.navigate(['/']);
  });
  }
  deletePost(postId: string) {
  return  this.http.delete(BACKEND_URL + postId);
  }
}
