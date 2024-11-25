import { useContext, Fragment } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthContext, AuthContextProvider } from './utils/auth-context.jsx'
import './styles/app.css'
import Navigation from './components/navigation.jsx'
import HomePage from "./pages/home-page";
import AboutMePage from "./pages-static/about-me-page";
import OperationsPage from "./pages-static/operations-page";
import RegisterPage from "./pages/register-page";
import LoginPage from "./pages/login-page";
import PostListPage from "./pages/post-list-page";
import PostDetailPage from "./pages/post-detail-page";
import UserProfilePage from "./pages/user-profile-page";
import CreatePostPage from "./pages/create-post-page";
import ShortListPage from "./pages/short-list-page";
import AddShortPage from "./pages/add-short-page";
import EndoscopyPage from "./pages-static/endoscopy-page";
import LaparoscopyPage from "./pages-static/laparoscopy-page";
import SkinProceduresPage from "./pages-static/skin-procedures-page";

const App = () => {
    const {user} = useContext(AuthContext)

    return (
        <AuthContextProvider>
            <Router>
                {/* nav bar */}
                <Navigation/>

                {/* content */}
                <Routes>
                    <Route path={`/`} element={<HomePage/>}/>
                    <Route path={`/about-me`} element={<AboutMePage/>}/>
                    <Route path={`/operations`} element={<OperationsPage/>}/>
                    <Route path={`/operations/endoscopy`} element={<EndoscopyPage/>}/>
                    <Route path={`/operations/laparoscopy`} element={<LaparoscopyPage/>}/>
                    <Route path={`/operations/skin-procedures`} element={<SkinProceduresPage/>}/>

                    <Route path={`/register`} element={<RegisterPage/>}/>
                    <Route path={`/login`} element={<LoginPage/>}/>

                    <Route path={`/posts`} element={<PostListPage/>}/>
                    <Route path={`/post/:id`} element={<PostDetailPage/>}/>
                    <Route path={`/shorts`} element={<ShortListPage/>}/>
                    {/* clicking on the short (embed) should take to original source */}
                    {/*<Route path={'/short/:id'} element={<ShortDetailPage/>}/>*/}

                    {/* requires being logged in */}
                    {user && (
                        <Route path={`/my-profile`} element={<UserProfilePage/>}/>
                    )}
                    {/* requires being logged in as admin */}
                    {user && user.role === 'admin' && (
                        <>
                            <Route path={`/post/new`} element={<CreatePostPage/>}/>
                            <Route path={`/short/new`} element={<AddShortPage/>}/>
                        </>
                    )}
                </Routes>
            </Router>
        </AuthContextProvider>
    )
}

export default App
