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
export async function editPost (title, body, id){
    //TODO
}
export async function deletePost (id){
    //TODO
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
        return response
    }
    catch(err){
       console.log("Error:", err) 
    }
}
export async function deleteComment (id){
    const url = `${baseCommentsURL}/${id}`
    try {
        const response = await fetch(url, {
            method: 'DELETE'
        })
        if(!response.ok){
            throw new Error (response);
        }
        return response
    }
    catch(err){
       console.log("Error:", err) 
    }
}
