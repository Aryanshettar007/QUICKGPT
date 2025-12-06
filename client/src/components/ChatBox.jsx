import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import Message from './Message'
import toast from 'react-hot-toast'

const ChatBox = () => {
  const containerRef = useRef(null)
  const { selectedChat, theme, user, token, setUser } = useAppContext()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('text')
  const [prompt, setPrompt] = useState('')
  const [isPublished, setIsPublished] = useState(false)

  const onSubmit = async (e) => {
    let promptCopy = prompt
    try {
      e.preventDefault()
      if (!user) return toast('login to send message')
      if (!selectedChat?._id) return toast.error('Please select or create a chat first')

      setLoading(true)
      setMessages(prev => [...prev, { role: 'user', content: prompt, timestamp: Date.now(), isImage: false }])
      setPrompt('')

      const authHeader = token ? (token.startsWith('Bearer ') ? token : `Bearer ${token}`) : ''

      const { data } = await axios.post(
        `/message/${mode}`,
        { chatId: selectedChat._id, prompt: promptCopy, isPublished },
        { headers: { Authorization: authHeader, 'Content-Type': 'application/json' } }
      )

      if (data.success) {
        setMessages(prev => [...prev, data.reply])
        setUser(prev => {
          if (!prev) return prev
          return mode === 'image' ? { ...prev, credits: prev.credits - 2 } : { ...prev, credits: prev.credits - 1 }
        })
      } else {
        toast.error(data.message || 'Request failed')
        setPrompt(promptCopy)
        setMessages(prev => prev.slice(0, -1))
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Something went wrong')
      setPrompt(promptCopy)
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [messages])

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages)
    }
  }, [selectedChat])

  return (
    <div className='flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40'>
      {/* Chat Messages */}
      <div ref={containerRef} className='flex-1 mb-5 overflow-y-scroll'>
        {messages.length === 0 && (
          <div className='h-full flex flex-col items-center justify-center gap-2 text-primary'>
            <img src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark} alt="" className='w-full max-w-56 sm:max-w-68' />
            <p className='mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white'>Ask me anything</p>
          </div>
        )}

        {messages.map((message, index) => <Message key={index} message={message} />)}
        
        {/* Three Dot Loading */}
        {
          loading && <div className='loader flex items-center gap-1.5'>
            <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
            <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
            <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
          </div>
        }
      </div>

      {mode === 'image' && (
        <label className='inline-flex items-center gap-2 mb-3 text-sm mx-auto'>
          <p className='text-xs'>Publish Generated Image to Community</p>
          <input type="checkbox" className='cursor-pointer' checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
        </label>
      )}
      
      {/* Prompt Input Box */}
      <form onSubmit={onSubmit} className='bg-primary/20 dark:bg-[#583C79]/30 border border-primary dark:border-[#80609F]/30 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center'>
        <select onChange={(e) => setMode(e.target.value)} value={mode} className='text-sm pl-3 pr-2 outline-none'>
          <option className='dark:bg-purple-900' value="text">Text</option>
          <option className='dark:bg-purple-900' value="image">Image</option>
        </select>
        <input value={prompt} onChange={(e) => setPrompt(e.target.value)} type="text" placeholder='Type your prompt here...' className='flex-1 w-full text-sm outline-none' required />
        <button type="submit" disabled={loading}>
          <img src={loading ? assets.stop_icon : assets.send_icon} alt="" className='w-8 cursor-pointer' />
        </button>
      </form>
    </div>
  )
}

export default ChatBox