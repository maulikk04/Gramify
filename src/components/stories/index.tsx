import * as React from 'react';
import image1 from '@/assets/images/image1.png';
interface IStoriesProps {}

const Stories: React.FunctionComponent<IStoriesProps> = () => {
    return (
        <div className='flex justify-between'>
            <img src={image1} className='w-20 h-20 rounded-full border-4 border-slate-800 object-cover'/>
            <img src={image1} className='w-20 h-20 rounded-full border-4 border-slate-800 object-cover'/>
            <img src={image1} className='w-20 h-20 rounded-full border-4 border-slate-800 object-cover'/>
            <img src={image1} className='w-20 h-20 rounded-full border-4 border-slate-800 object-cover'/>
            <img src={image1} className='w-20 h-20 rounded-full border-4 border-slate-800 object-cover'/>

        </div>
    )
}

export default Stories