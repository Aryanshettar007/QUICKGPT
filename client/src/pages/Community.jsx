import React, { useEffect, useState } from 'react'
import { dummyPublishedImages } from '../assets/assets'
import Loading from './Loading'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import axios from 'axios' 

const Community = () => {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const { /* no axios here */ } = useAppContext()

  const fetchImages = async () => {
    try {
      const { data } = await axios.get('/user/published-images')
      if (data.success) {
        setImages(data.images || [])
      } else {
        toast.error(data.message || 'Failed to fetch images')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to fetch images')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  if (loading) return <Loading />

  return (
    <div className='p-6 pt-12 xl:px-12 2xl:px-20 w-full mx-auto h-full overflow-y-scroll bg-white dark:bg-[#1a102b]'>
      <h2 className='text-xl font-semibold mb-6 text-gray-800 dark:text-purple-100'>Community Images</h2>
      {images.length > 0 ? (
        <div className='flex flex-wrap max-sm:justify-center gap-5'>
          {images.map((item, index) => (
            <a
              key={item._id || index}
              href={item.imageUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='relative group block rounded-lg overflow-hidden border border-gray-200 dark:border-purple-700 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white dark:bg-[#2c1850]'
            >
              <img
                src={item.imageUrl}
                alt={item.alt || `Community image ${index + 1}`}
                className='w-full h-40 md:h-50 2xl:h-62 object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out'
              />
              <p className='absolute bottom-0 right-0 text-xs bg-black/50 dark:bg-purple-900/70 backdrop-blur text-white px-4 py-1 rounded-tl-xl opacity-0 group-hover:opacity-100 transition duration-300'>
                Created By {item.userName}
              </p>
            </a>
          ))}
        </div>
      ) : (
        <p className='text-center text-gray-600 dark:text-purple-200 mt-10'>No Images Available.</p>
      )}
    </div>
  )
}

export default Community
