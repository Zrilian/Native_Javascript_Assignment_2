import * as queries from "./queries.js";
import * as postHandler from "./postHandler.js";
//Dummy userID we save to session storage for usage elsewhere
const userId = 5;
sessionStorage.setItem("userId", userId)
let postsInStorage = JSON.parse(sessionStorage.getItem('posts'));
let posts = [];
const postContainer = document.querySelector(".post-container")

async function init(){
    if(postsInStorage){
        posts = postsInStorage
        console.log("loaded saved posts")
    }
    else{
        posts = await queries.getPosts(10);
        console.log("fetched posts")
        sessionStorage.setItem("posts", JSON.stringify(posts), )
    }
    console.log(posts)
    postHandler.renderPosts(posts)
}

function updatePosts(){
    postHandler.renderPosts(posts, (postToDelete) => {
        //Callback function to allow us to delete the correpsonding game from the games[] array
        const index = posts.indexOf(postToDelete);
        if (index !== -1) posts.splice(index, 1);
        //refreshCatalog();
})
}

init();