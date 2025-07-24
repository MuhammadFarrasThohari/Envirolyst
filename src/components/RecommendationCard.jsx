import React from 'react'

function RecommendationCard({ title, priority, description, icon: IconComponent }) {
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-600 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-600 border-green-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className='p-4 border border-gray-200 rounded-lg flex flex-col gap-3'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          {IconComponent && <IconComponent className='text-green-600 size-6' />}
          <h4 className='font-semibold text-lg'>{title}</h4>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(priority)}`}>
          {priority}
        </span>
      </div>
      <p className='text-gray-600 text-sm leading-relaxed'>{description}</p>
    </div>
  )
}

export default RecommendationCard