import { createContext, useContext, useState, useEffect } from 'react'

const Ctx = createContext(null)

export function BookmarkProvider({ children }) {
  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bk') || '[]') } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('bk', JSON.stringify(bookmarks))
  }, [bookmarks])

  const toggle = (id) => setBookmarks(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  )

  return <Ctx.Provider value={{ bookmarks, toggle }}>{children}</Ctx.Provider>
}

export const useBookmarks = () => useContext(Ctx)
