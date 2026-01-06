'use client'
import { useQuery,useMutation,useQueryClient } from "@tanstack/react-query";
const POSTS =[
  {id:1,title:"Post 1"},
  {id:2,title:"Post 2"},
  {id:3,title:"Post 3"},
]
const page = () => {
  const queryClient = useQueryClient()
 const postQuery =  useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      await wait(1000)
      return POSTS
    }
  })

  // const newPostMutation = useMutation({
  //   mutationKey: ['newPost'],
  //   mutationFn: async (newPost:{id:number,title:string}) => {
  //     await wait(500)
  //     POSTS.push(newPost)
  //     return newPost
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({queryKey:['posts']})
  //   }
  // })

  if(postQuery.isLoading){
    return <div>Loading...</div>
  }
  if(postQuery.isError){
    return <div>Error: {(postQuery.error as Error).message}</div>
  }

  return (
    <div className="h-full">
      {postQuery.data?.map((post)=>(
        <div key={post.id} className="p-4 border-b">
          {post.title}
        </div>
      ))}
      {/* <button disabled={newPostMutation.isPending || postQuery.isLoading}
        className="m-4 p-2 bg-blue-500 text-white rounded"
        onClick={() => {
          const newPost = {
            id: POSTS.length + 1,
            title: `Post ${POSTS.length + 1}`
          }
          newPostMutation.mutate(newPost)
        }}
      >
        { 'Add New Post'}
      </button> */}
    </div>
  )
}

export default page

function wait (duration: number) { 
  
}