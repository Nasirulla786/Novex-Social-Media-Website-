import axios from 'axios'
import React, { useEffect } from 'react'
import { ServelURL } from '../App'
import { useDispatch } from 'react-redux'
import { setPostData } from '../redux/postSlice'

const useGetAllPosts = () => {
    const dispatch = useDispatch();
    // const {postData} = useSelector(state=>state.post);
    useEffect(()=>{
            const fetchAllPosts = async()=>{
            try {
                const res = await axios.get(`${ServelURL}/api/post/getallposts`,{withCredentials:true});
                // console.log(res.data);
                if(res){
                    dispatch(setPostData(res.data));
                }

            } catch (error) {
                console.log(error)

            }
           }
           fetchAllPosts();



    },[dispatch ])

}

export default useGetAllPosts;
