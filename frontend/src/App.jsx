import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Dashboard from './pages/Dashboard'
import ProjectPage from './pages/ProjectPage'
import { me } from './features/me'
import { setUserData } from './redux/userSlice'
import Plan from './pages/Plan'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await me()
      dispatch(setUserData(data))
    }
    fetchUserData()
  }, [dispatch])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/project/:id" element={<ProjectPage />} />
        <Route path="/plan" element={<Plan />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App