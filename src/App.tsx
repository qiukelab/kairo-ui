import { Route, Routes } from 'react-router-dom'

import { DocsPage } from '@/pages/docs/docs-page'
import { Landing } from '@/pages/landing'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      {/* One catch-all: DocsPage resolves the slug against the MDX glob and
          renders its own 404 for anything with no matching file. */}
      <Route path="/docs/*" element={<DocsPage />} />
      <Route path="*" element={<DocsPage />} />
    </Routes>
  )
}
