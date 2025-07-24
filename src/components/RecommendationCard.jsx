import React from 'react'

function RecommendationCard({ title, priority, description }) {
  return (
    <div className='p-4 border border-gray-200 rounded-lg drop-shadow-xs flex gap-4 justify-center'>
      <div className='bg-green-400 h-fit p-1 rounded-lg'>
        <i className="fa-brands fa-github text-xl text-white"></i>
      </div>
      <div className='flex flex-col gap-2'>
        <p className='font-semibold'>{title}<span className='ml-2 bg-red-500 py-1 px-2 text-sm text-white font-normal rounded-full'>Priority: {priority}</span></p>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default RecommendationCard