import * as queries from "./queries.js";
import * as postHandler from "./postHandler.js";
const postId = new URLSearchParams(window.location.search).get('id');
const post = JSON.parse(sessionStorage.getItem('posts'))[postId-1];
const userId = sessionStorage.getItem("userId")
const container = document.querySelector(".post-container")
const commentForm = document.querySelector("#comment-form")
const commentError = document.querySelector(".comment-error")
const submitBtn = document.querySelector(".submit-btn")
let comments = [];

async function init(){
    if (post){
        postHandler.renderPosts(post)
    }
    else{
      return;
    }
    document.title = post.title

    comments = await queries.getComments(postId);
    refreshComments();
    commentForm.addEventListener("submit", addComment)
}
function refreshComments(){
    updateComments();
    //TODO: Filter stuff
}
function updateComments (){
    postHandler.renderComments(comments, (toDelete) =>{
        const index = comments.indexOf(toDelete)
        if (index !== -1) comments.splice(index, 1)
        refreshComments();
    })
}
async function addComment(event){
    //Grab form data
    event.preventDefault();
    const formData = new FormData(commentForm);
    const comment = Object.fromEntries(formData.entries());

    //Make sure there's any text
    if (comment.body.length < 1){
        commentError.classList.remove("hidden")
        commentError.textContent=("type something first")
        return;
    }
    else{
        commentError.classList.add("hidden")
        commentError.textContent= ("")
    }
    //build the rest of the comment object the server demands
    comment.postId = postId
    comment.userId = userId
    //Start loading
    submitBtn.classList.add("loading")
    //API call
    let response = await queries.addComment(comment);
    //Take the comment from the server since the client doesn't know everythng needed like username
    let newComment = await response.json();
    //end loading
    submitBtn.classList.remove("loading")

    commentForm.reset();
    //Add the new comment to the array and refresh the comment section
    comments.push(newComment);
    updateComments();
}


init();
