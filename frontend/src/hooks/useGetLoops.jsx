import axios from 'axios'
import React, { useEffect } from 'react'
import { ServelURL } from '../App'
import { useDispatch } from 'react-redux'
// import { setPostData } from '../redux/postSlice'
import { setLoopData } from '../redux/loopSlice'

const useGetAllLoops = () => {
    const dispatch = useDispatch();
    // const {postData} = useSelector(state=>state.post);
    useEffect(()=>{
            const fetchAllLoops = async()=>{
            try {
                const res = await axios.get(`${ServelURL}/api/loop/getloops`,{withCredentials:true});
                // console.log("th is is respons",res.data);
                if(res){
                    dispatch(setLoopData(res.data));
                }

            } catch (error) {
                console.log(error)

            }
           }
           fetchAllLoops();



    },[dispatch ])

}

export default useGetAllLoops;
