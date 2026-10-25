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
        `;

        //Make the delete button
        const delBtn = document.createElement("button")
        post.appendChild(delBtn)
        delBtn.textContent= "X"
        delBtn.classList.add("post-del-btn") 
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

export function renderComments(comments, onDelete){
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
        //TODO: Add image and other info, comments link etc
        comment.innerHTML += `
            <h2 class="user">${item.user.fullName}</h1>
            <p class="post-body">${item.body}</p>
            <button class="comment-del-btn">X</button>
        `;

        //hook up the delete button
        let delBtn = comment.querySelector(".comment-del-btn")
        delBtn.addEventListener("click" ,(e) =>{
            removePost(comment);
            //Callback function so that we can delete the corresponding object form the games array
            onDelete?.(item);
        })

        //Append the post and add it to the array of posts
        container.appendChild(comment);
    });
}


export function removePost(post){
    //TODO: Add API call
    const postName = post.firstElementChild.textContent
    console.log(`Removing ${postName}`)
    console.log(post)
    post.remove();
}
export function removeComment(comment){
    //TODO: Add API call
    console.log(comment)
    comment.remove();
}