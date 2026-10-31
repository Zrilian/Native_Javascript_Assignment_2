import * as queries from "./queries.js";
import * as postHandler from "./postHandler.js";
const postId = new URLSearchParams(window.location.search).get('id');
let posts = JSON.parse(sessionStorage.getItem('posts'))
let post = posts[postId-1]
const userId = sessionStorage.getItem("userId")
const commentForm = document.querySelector("#comment-form")
const commentError = document.querySelector(".comment-error")
const submitBtn = document.querySelector(".submit-btn")
let comments = [];

async function init(){
    if (post){
        updatePost();
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
function updatePost(){
    postHandler.renderPosts(post, null, (postToEdit) =>{
            //Dummyjson does not return views when editing a post so we add the old view count back
            postToEdit.views = post.views
            post = postToEdit
            updatePost();
            posts[postId-1] = post
            sessionStorage.setItem('posts', JSON.stringify(posts))
     })
}


function updateComments (){
    postHandler.renderComments(comments, (toDelete) =>{
        const index = comments.indexOf(toDelete)
        if (index !== -1) comments.splice(index, 1)
        refreshComments();
    }, (toEdit) => {
        const index = comments.indexOf(toEdit)
        if (index !== -1){
            comments[index] = toEdit
        }
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
   
    if (response){
        let newComment = await response.json();
        newComment.local = true
        commentForm.reset();
        commentError.classList.add("hidden")
        //Add the new comment to the array and refresh the comment section
        comments.push(newComment);
        updateComments();
    }
    else{
        commentError.classList.remove("hidden")
        commentError.textContent=("Failed to send comment to server")
    }
    //end loading
    submitBtn.classList.remove("loading")
}


init();

//Refresh Button
const refreshButton = document.querySelector(".refresh-btn")
refreshButton.addEventListener("click", async () => {
    posts = await queries.getPosts(10);
    console.log("fetched posts")
    sessionStorage.setItem("posts", JSON.stringify(posts), )
    post = posts[postId-1]
    updatePost();
    comments = await queries.getComments(postId);
    refreshComments();
})
