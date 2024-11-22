import { useContext, Fragment } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthContext, AuthContextProvider } from './Utils/auth-context.jsx'
import './Styles/App.css'
import Navigation from './Components/navigation.jsx'
import HomePage from "./Pages/home-page";
import RegisterPage from "./Pages/register-page";
import LoginPage from "./Pages/login-page";
import PostListPage from "./Pages/post-page-list";
import PostDetailPage from "./Pages/post-detail-page";
import UserProfilePage from "./Pages/user-profile-page";
import CreatePostPage from "./Pages/create-post-page";

const App = () => {
  const {user} = useContext(AuthContext)

  return (
      <AuthContextProvider>
        <Router>
          {/* nav bar */}
          <Navigation/>

          {/* content */}
          <Routes>
            <Route path='/' element={<HomePage/>}/>
            <Route path='/register' element={<RegisterPage/>}/>
            <Route path='/login' element={<LoginPage/>}/>

            <Route path='/posts' element={<PostListPage/>}/>
            <Route path='/post/:id' element={<PostDetailPage/>}/>

            {/* requires being logged in */}
            {user && (
                <Route path='/myprofile' element={<UserProfilePage/>}/>
            )}
            {/* requires being logged in as admin */}
            {user && user.role === 'admin' && (
                <Route path='/post/new' element={<CreatePostPage/>}/>
            )}
          </Routes>
        </Router>
      </AuthContextProvider>
  )
}

export default App
