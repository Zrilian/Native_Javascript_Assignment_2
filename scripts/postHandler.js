import * as queries from "./queries.js";

export function renderPosts(posts, onDelete){
    let postList = []
    const container = document.querySelector(".post-container")
    //Make sure the post-container is empty, then loop through posts
    container.innerHTML = ""
    //If the function is called with a single object rather than an array, put it into a one entry array
    if (posts.constructor !== Array){
        posts = [posts];
    }
    posts.forEach(item => {
        const post = document.createElement("div");
        //Base html
        post.id = `post-${item.id}`
        post.classList.add("post")
        //TODO: Add image and other info, comments link etc
        post.innerHTML += `
            <h3 class="title">${item.title}</h1>
            <p class="post-body">${item.body}</p>
            <a href="post.html?id=${item.id}">Comments</a>
            <div class="engagement">
                <img src="assets/views.png" alt="👁" class="views"> <span class="reactions">${item.views}</span>
                <img src="assets/like.png" alt="👍" class="like"> <span class="reactions">${item.reactions.likes}</span>
                <img src="assets/like.png" alt="👎" class="dislike"> <span class="reactions">${item.reactions.dislikes}</span>
            </div>
            <button class="post-del-btn del-btn">X</button>
        `;

        //Hook up the delete button
        const delBtn = post.querySelector(".post-del-btn");
        delBtn.addEventListener("click" ,(e) =>{
            removePost(post);
            //Callback function so that we can delete the corresponding object form the games array
            onDelete?.(item);
        })

        //Append the post and add it to the array of posts
        container.appendChild(post);
        postList.push(post)
    });
    // console.log(postList)
    // return postList;
}
export function removePost(post){
    //Add API call
    const postName = post.firstElementChild.textContent
    console.log(`Removing ${postName}`)
    console.log(post)
    post.remove();
}


//Comments
export function renderComments(comments, onDelete, onEdit){
    const container = document.querySelector(".comments-container")
    //Make sure the comments-container is empty, then loop through comments
    container.innerHTML = ""
    //If the function is called with a single object rather than an array, put it into a one entry array
    if (comments.constructor !== Array){
        comments = [comments];
    }
    comments.forEach(item => {
        const comment = document.createElement("div");
        //Base html
        comment.id = `comment-${item.id}`
        comment.classList.add("comment")
        comment.innerHTML += `
            <h2 class="user">${item.user.fullName}</h1>
            <p class="post-body">${item.body}</p>
            <button class="comment-del-btn del-btn">X</button>
            <button class="comment-edit-btn edit-btn">Edit...</button>
            <form class="comment-edit-form hidden">
                <textarea name="edit" cols="40" rows="4"></textarea>
                <button type="submit" class="submit-btn">Save</button>
                <p class="comment-error hidden"></p>
            </form>
            
        `;

        //hook up the delete button
        let delBtn = comment.querySelector(".comment-del-btn")
        delBtn.addEventListener("click" ,async () =>{
            const deleted = await removeComment(comment, item.id, item.local);
            //Callback function so that we can delete the corresponding object form the games array
            if (deleted){
                onDelete?.(item);
            }
        })
        //Hook up the edit button
        let editForm = comment.querySelector(".comment-edit-form")
        let editBtn = comment.querySelector(".comment-edit-btn")
        let commentError = comment.querySelector(".comment-error")
        editBtn.addEventListener("click", async () => {
            editForm.classList.toggle("hidden")
            if(editForm.classList.contains("hidden")){
                commentError.classList.add("hidden")
                editForm.reset();
                editBtn.textContent = "Edit..."
            }
            else{
                editBtn.textContent ="Close"
            }
        })
        editForm.addEventListener("submit", async (e) => {
            e.preventDefault()
            const edit = new FormData(editForm).get("edit")
             //Make sure there's any text
            if (edit.length < 1){
                commentError.classList.remove("hidden")
                commentError.textContent=("type something first")
                return;
            }
            else{
                commentError.classList.add("hidden")
                commentError.textContent= ("")
            }
            const edited = await editComment(item, edit, item.id, item.local)
            if(edited){
                onEdit?.(edited)
                editForm.reset();
                editForm.classList.add("hidden")
            }
        })
        //Append the post and add it to the array of posts
        container.appendChild(comment);
    });
}
async function editComment(comment, body, id, isLocal) {
    //Skip API call if local
    if(!isLocal){
        const response = await queries.editComment(body, id)
        if (!response.ok){
            return false
        }
    }
    let newComment = comment
    newComment.body = body;
    return newComment
}


async function removeComment(comment, id, isLocal){
    //Skip API call for local comments as dummyjson will just return 404
    if (isLocal) {
        comment.remove();
        return true;
    }
    const response = await queries.deleteComment(id)
    if (response){
        comment.remove();
        return true
    }

    comment.innerHTML+= `<p style="color:red;"> Error deleting Comment, see console for details<p>`
    return false
}