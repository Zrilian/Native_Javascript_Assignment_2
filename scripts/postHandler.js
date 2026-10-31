import * as queries from "./queries.js";

export function renderPosts(posts, onDelete, onEdit){
    let postList = []
    const container = document.querySelector(".post-container")
    //Make sure the post-container is empty, then loop through posts
    container.innerHTML = ""
    //If the function is called with a single object rather than an array, put it into a one entry array
    let single = false
    if (posts.constructor !== Array){
        single = true
        posts = [posts];
    }
    posts.forEach(item => {
        const post = document.createElement("div");
        //Base html
        post.id = `post-${item.id}`
        post.classList.add("post")
        //Front Page version
        if(!single){
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
        delBtn.addEventListener("click" , async (e) =>{

            const deleted = await removePost(post, item.id);
            //Callback function so that we can delete the corresponding object form the games array
            if (deleted){
                onDelete?.(item);
            }
        })
    }   //Single post version
        else {
            post.innerHTML += `
            <h3 class="title">${item.title}</h1>
            <p class="post-body">${item.body}</p>
            <button class="post-edit-btn edit-btn">Edit...</button>
            <div class="engagement">
                <img src="assets/views.png" alt="👁" class="views"> <span class="reactions">${item.views}</span>
                <img src="assets/like.png" alt="👍" class="like"> <span class="reactions">${item.reactions.likes}</span>
                <img src="assets/like.png" alt="👎" class="dislike"> <span class="reactions">${item.reactions.dislikes}</span>
            </div>
            
            <form class="post-edit-form hidden">
                <input type="text" name = "title" placeholder="New post title...">
                <textarea name="body" cols="40" rows="4" placeholder="New post body"></textarea>
                <button type="submit" class="submit-btn">Save</button>
                <p class="post-error hidden"></p>
            </form>   
        `;
            //Hook up the edit button
        
            let editForm = post.querySelector(".post-edit-form")
            let editBtn = post.querySelector(".post-edit-btn")
            let postError = post.querySelector(".post-error")
            editBtn.addEventListener("click", async () => {
                editForm.classList.toggle("hidden")
                if(editForm.classList.contains("hidden")){
                    postError.classList.add("hidden")
                    editForm.reset();
                    editBtn.textContent = "Edit..."
                }
                else{
                    editBtn.textContent ="Close"
                }
            })
            editForm.addEventListener("submit", async (e) => {
                e.preventDefault()

                const formData = new FormData(editForm);
                const edit = Object.fromEntries(formData.entries());
                //Make sure there's any text
                if (edit.title.length < 1 && edit.body.length < 1){
                    postError.classList.remove("hidden")
                    postError.textContent=("type something first")
                    return;
                }
                else{
                    postError.classList.add("hidden")
                    postError.textContent= ("")
                }
                const edited = await editPost(item, edit, item.id)
                console.log(edited)
                if(edited){
                    onEdit?.(edited)
                    editForm.reset();
                    editForm.classList.add("hidden")
                }
            })
        }
        //Append the post and add it to the array of posts
        container.appendChild(post);
        postList.push(post)
    });
    // console.log(postList)
    // return postList;
}
async function editPost(post, edit, id) {
   const response = await queries.editPost(edit, id)
    if (!response){
        return false
    }
    return await response
}

async function removePost(post, id){
    const postName = post.firstElementChild.textContent
    console.log(`Removing ${postName}`)
    console.log(post)

    const response = await queries.deletePost(id)
    if (response){
        post.remove();
        return true
    }
    post.innerHTML+= `<p style="color:red;"> Error deleting Comment, see console for details<p>`
    return false
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
                <button type="submit" class="submit-btn"></button>
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
        let submitBtn = editForm.querySelector(".submit-btn")
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
                submitBtn.classList.add("loading")
            }
            const edited = await editComment(item, edit, item.id, item.local)
            if(edited){
                onEdit?.(edited)
                editForm.reset();
                editForm.classList.add("hidden")
            }
            submitBtn.classList.remove("loading")
        })
        //Append the post and add it to the array of posts
        container.appendChild(comment);
    });
}
async function editComment(comment, body, id, isLocal) {
    //Skip API call if local
    if(!isLocal){
        const response = await queries.editComment(body, id)
        if (!response){
            return false
        }
    }
    console.log("go")
    let newComment = comment
    newComment.body = body;
    console.log(newComment)
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