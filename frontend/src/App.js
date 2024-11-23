import { useContext, Fragment } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthContext, AuthContextProvider } from './utils/auth-context.jsx'
import './styles/app.css'
import Navigation from './components/navigation.jsx'
import HomePage from "./pages/home-page";
import AboutMePage from "./pages-static/about-me-page";
import RegisterPage from "./pages/register-page";
import LoginPage from "./pages/login-page";
import PostListPage from "./pages/post-page-list";
import PostDetailPage from "./pages/post-detail-page";
import UserProfilePage from "./pages/user-profile-page";
import CreatePostPage from "./pages/create-post-page";

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
                    <Route path='/about-me' element={<AboutMePage/>}/>
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
