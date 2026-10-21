const basePostsURL = "https://dummyjson.com/posts"

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