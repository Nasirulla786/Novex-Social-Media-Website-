import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setStoryData } from '../redux/storySlice';
import axios from 'axios';
import { ServelURL } from '../App';
import StoryCard from '../components/StoryCard';

const StoryPage = () => {
      const {username} = useParams()
    const dispatch = useDispatch();
    const {storyData} = useSelector(state=>state.story)


      const handleStroy = async()=>{
        try {
           dispatch(setStoryData(null));
            const res = await axios.get(`${ServelURL}/api/story/getbyusername/${username}` ,{withCredentials:true})
            // console.log("this is res",res.data[0]);
         if (res.data.length > 0) {
  dispatch(setStoryData(res.data[res.data.length - 1])); // latest story
}
            // console.log(res.data[0]._id);

        } catch (error) {
            console.log(error)

        }
    }

    useEffect(()=>{
        if(username){
            handleStroy();
        }

    },[username])

    useEffect(() => {
      if (storyData?._id && typeof window !== 'undefined') {
        const existing = JSON.parse(localStorage.getItem('seenStories') || '[]');
        const updated = Array.from(new Set([...existing, storyData._id]));
        localStorage.setItem('seenStories', JSON.stringify(updated));
      }
    }, [storyData]);

    // console.log(storyData)
  return (
    <div>
      <StoryCard story={storyData} username="your story" />
    </div>
  )
}

export default StoryPage
