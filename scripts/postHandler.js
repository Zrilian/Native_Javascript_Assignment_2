export function renderPosts(posts, onDelete){
    let postList = []
    const container = document.querySelector(".post-container")
    //Make sure the post-container is empty, then loop through posts
    container.innerHTML = ""
    posts.forEach(item => {
        const post = document.createElement("div");
        //Base html
        post.id = `post-${item.id}`
        post.classList.add("post")
        //TODO: Add image and other info, comments link etc
        post.innerHTML += `
            <h2 class="title">${item.title}</h1>
            <p class="post-body">${item.body}</p>
            <a href="post.html?id=${item.id}">Commments<a>
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


export function removePost(post){
    //TODO: Add API call


    const postName = post.firstElementChild.textContent
    console.log(`Removing ${postName}`)
    console.log(post)
    post.remove();
}