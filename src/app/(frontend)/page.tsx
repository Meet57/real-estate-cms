import Navbar from './components/Navbar'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <div className="p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Real Estate CMS</h1>
        <p className="mb-6">Browse and manage properties easily.</p>
        <Link href="/properties" className="bg-blue-500 text-white px-4 py-2 rounded">
          View Properties
        </Link>
      </div>
    </>
  )
}
