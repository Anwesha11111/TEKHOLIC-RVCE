import { Routes, Route } from 'react-router-dom'
import { BookmarkProvider } from './hooks/useBookmarks'
import Navbar from './components/Navbar'
import EventFeed from './pages/EventFeed'
import EventDetail from './pages/EventDetail'
import Bookmarks from './pages/Bookmarks'

export default function App() {
  return (
    <BookmarkProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<EventFeed />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
      </Routes>
    </BookmarkProvider>
  )
}
