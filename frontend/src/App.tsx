import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainPage from './pages/MainPage'
import ServiceTestPage from './pages/ServiceTestPage'
import QueueTestPage from './pages/QueueTestPage'
import SoloQueuePage from './pages/SoloQueuePage'
import SoloSeatPage from './pages/SoloSeatPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/service-test" element={<ServiceTestPage />} />
        <Route path="/queue-test" element={<QueueTestPage />} />
        <Route path="/solo-queue" element={<SoloQueuePage />} />
        <Route path="/solo-seat" element={<SoloSeatPage />} />
      </Routes>
    </BrowserRouter>
  )
}
