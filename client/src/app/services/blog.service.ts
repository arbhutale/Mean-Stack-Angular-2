import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthHttp, AuthConfig, tokenNotExpired } from 'angular2-jwt';





@Injectable()
export class BlogService {
  options;
  domain = this.authService.domain;

  constructor(
    private authService: AuthService,
    private http: Http,
  ) { }

  createAuthenticationHeader() {
    this.authService.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': this.authService.authToken
      })
    })
  }

  newBlog(blog){
    this.createAuthenticationHeader();
    return this.http.post(this.domain + 'blogs/newBlog', blog, this.options).map(res => res.json());
  }
getAllBlogs(){
  this.createAuthenticationHeader();
  return this.http.get(this.domain + 'blogs/allBlogs', this.options).map(res => res.json());
}

getSingleBlog(id){
  this.createAuthenticationHeader();
  return this.http.get(this.domain + 'blogs/singleBlog/' +id, this.options).map(res => res.json());
}
editBlog(blog) {
  this.createAuthenticationHeader(); // Create headers
  return this.http.put(this.domain + 'blogs/updateBlog/', blog, this.options).map(res => res.json());
}
dleteBlog(id){
  this.createAuthenticationHeader();
  return this.http.delete(this.domain + 'blogs/deleteBlog/' + id,this.options).map( res => res.json() );
}

likeBlog(id) {
  const blogData = { id: id };
  return this.http.put(this.domain + 'blogs/likeBlog/', blogData, this.options).map(res => res.json());
}

// Function to dislike a blog post
dislikeBlog(id) {
  const blogData = { id: id };
  return this.http.put(this.domain + 'blogs/dislikeBlog/', blogData, this.options).map(res => res.json());
}

 // Function to post a comment on a blog post
 postComment(id, comment) {
  this.createAuthenticationHeader();// Create headers
  // Create blogData to pass to backend
  const blogData = {
    id: id,
    comment: comment
  }
  return this.http.post(this.domain + 'blogs/comment', blogData, this.options).map(res => res.json());

}

}
