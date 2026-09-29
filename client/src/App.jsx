import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Blog from './pages/Blog'
import Layout from './pages/admin/Layout'
import Dashboard from './pages/admin/Dashboard'
import AddBlog from './pages/admin/AddBlog'
import ListBlog from './pages/admin/ListBlog'
import Comments from './pages/admin/Comments'
import Login from './components/admin/Login'
import 'quill/dist/quill.snow.css'
import { Toaster } from 'react-hot-toast'
import { useAppContext } from './context/AppContext'
import Register from './pages/Register'
import UserLogin from './pages/UserLogin'
import Profile from './pages/Profile'
import Bookmarks from './pages/Bookmarks'
import Subscribers from './pages/admin/Subscribers'
import InfoPage from './pages/InfoPage'
import VerifyEmail from './pages/VerifyEmail'

const App = () => {

  const { token } = useAppContext()

  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path='/blog/:id' element={<Blog />} />
        <Route path="/profile" element={<Profile />} />
        <Route path='/bookmarks' element={<Bookmarks />} />
        <Route path='/best-sellers' element={<InfoPage />} />
        <Route path='/offers' element={<InfoPage />} />
        <Route path='/contact' element={<InfoPage />} />
        <Route path='/faqs' element={<InfoPage />} />

        {/* footer */}
        <Route path='/delivery-information' element={<InfoPage />} />
        <Route path='/return-refund' element={<InfoPage />} />
        <Route path='/payment-methods' element={<InfoPage />} />
        <Route path='/track-order' element={<InfoPage />} />

        <Route path='/admin' element={token ? <Layout /> : <Login />}>
          <Route index element={<Dashboard />} />
          <Route path='addBlog' element={<AddBlog />} />
          <Route path='listBlog' element={<ListBlog />} />
          <Route path='comments' element={<Comments />} />
          <Route path='subscribers' element={<Subscribers />} />

        </Route>
      </Routes>
    </div>
  )
}



export default App
