const basePostsURL = "https://dummyjson.com/posts"
const baseCommentsURL = "https://dummyjson.com/comments"

//Posts
export async function getPosts(noPosts){
    if (!noPosts){
        noPosts=10;
    }
    const url = `${basePostsURL}?limit=${noPosts}`
    let data;
    console.log(url)
    try{
        const response = await fetch (url)
        data = await response.json();
        if(!response.ok){
            throw new Error(response);           
        }
    }
    catch(err){
       console.log("Error:", err) 
    }
    return data.posts
}
export async function editPost (postEdit, id){
    const payload = {};
    if (postEdit.title) payload.title = postEdit.title;
    if (postEdit.body) payload.body = postEdit.body;
    
    const url = `${basePostsURL}/${id}`
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        if(!response.ok){
            throw new Error (response);
        }
        return await response.json();
    }
    catch(err){
        console.log(`Error editing post with request: ${url}`)
        console.log(err) 
        return false
    }
}
export async function deletePost (id){
    const url = `${basePostsURL}/${id}`
    try {
        const response = await fetch(url, {
            method: 'DELETE'
        })
        if(!response.ok){
            throw new Error (response);
        }
        return true
    }
    catch(err){
        console.log(`Error deleting post with request: ${url}`)
        console.log(err) 
        return false
    }
}


//Comments
export async function getComments(postID){
    const url = `${baseCommentsURL}/post/${postID}`
    let data;
    console.log(url)
    try{
        const response = await fetch(url)
        data = await response.json();
        if(!response.ok){
            throw new Error (response);
        }
    }
    catch(err){
       console.log("Error:", err) 
    }
    console.log(data)
    return data.comments
}
export async function addComment (comment){
    const url = `${baseCommentsURL}/add`
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(comment)
        })
        if(!response.ok){
            throw new Error (response);
        }
        return response
    }
    catch(err){
       console.log("Error:", err) 
       return false
    }
    
}



export async function editComment (body, id){
    const url = `${baseCommentsURL}/${id}`
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({body: body})
        })
        if(!response.ok){
            throw new Error (response);
        }
        console.log("Edited the thing")
        return true
    }
    catch(err){
        console.log(`Error editing comment with request: ${url}`)
        console.log(err) 
        return false
    }
}
export async function deleteComment (id){
    console.log("Deleting comment")
    const url = `${baseCommentsURL}/${id}`
    try {
        const response = await fetch(url, {
            method: 'DELETE'
        })
        if(!response.ok){
            throw new Error (response);
        }
        return true
    }
    catch(err){
        console.log(`Error deleting comment with request: ${url}`)
        console.log(err) 
        return false
    }
}
