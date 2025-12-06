import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { dummyUserData } from "../assets/assets";
import { dummyChats } from "../assets/assets";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = `${import.meta.env.VITE_SERVER_URL}/api`;
axios.defaults.headers.post['Content-Type'] = 'application/json';

const AppContext = createContext();
export const AppContextProvider = ({children}) => {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [chats,setChats] = useState([])
    const [selectedChat,setSelectedChat] = useState(null)
    const [theme,setTheme] = useState(localStorage.getItem('theme') || 'light')
    const [token,setToken]=useState(localStorage.getItem('token') || null)
    const [loadingUser,setLoadingUser]=useState(true)

    const fetchUser = useCallback(async () => {
        try {
            console.log('Fetching user with token:', token);
            const { data } = await axios.get('/user/data', { headers: { Authorization: `Bearer ${token}` } })
            console.log('User data received:', data);
            if (data.success) {
                setUser(data.user)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Fetch user error:', error);
            toast.error(error.message)
        } finally {
            setLoadingUser(false)
        }
    }, [token])

    const createNewChat = useCallback(async () => {
        try {
            if (!user) return toast.error('Login to create a new chat')
            navigate('/')
            const { data } = await axios.post('/chat/create', {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                await fetchUserChats()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }, [token, user])

    const fetchUserChats = useCallback(async () => {
        try {
            const { data } = await axios.get('/chat/get', { headers: { Authorization: `Bearer ${token}` } })
            if (data.success) {
                setChats(data.chats)
                if (data.chats.length === 0) {
                    await createNewChat()
                    return fetchUserChats()
                } else {
                    setSelectedChat(data.chats[0])
                }
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }, [token, createNewChat])

    useEffect(() => {
        if (theme==='dark'){
            document.documentElement.classList.add('dark')
        }else{
            document.documentElement.classList.remove('dark')
        }
        localStorage.setItem('theme',theme)
    },[theme])

    useEffect(() => {
        if(user) {
            fetchUserChats()
        } else {
            setChats([])
            setSelectedChat(null)
        }
    }, [user, token])

    useEffect(() => {
        if(token) {
            fetchUser()
        } else {
            setUser(null)
            setLoadingUser(false)
        }
    }, [token, fetchUser])

    const value = {
        navigate,
        user,
        setUser,
        fetchUser,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        theme,
        setTheme,
        createNewChat,
        loadingUser,
        token,
        setToken
    }
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext)
}