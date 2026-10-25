import * as queries from "./queries.js";
import * as postHandler from "./postHandler.js";
const postId = new URLSearchParams(window.location.search).get('id');
const post = JSON.parse(sessionStorage.getItem('posts'))[postId];
const container = document.querySelector(".post-container")
let comments = [];

async function init(){
    if (post){
        postHandler.renderPosts(post)
    }
    else{
      return;
    }
    document.title = post.title
    //remove the comment link since we're already there
    document.querySelector(".post a").remove()
    comments = await queries.getComments(postId);
    let commentContainer = document.createElement("div")
    commentContainer.classList.add("comments-container");
    container.appendChild(commentContainer)
    postHandler.renderComments(comments)
    console.log(comments)
}

init();
