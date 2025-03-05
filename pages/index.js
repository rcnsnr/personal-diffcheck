// pages/index.js
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-bg text-white">
      <h1 className="text-4xl mb-4">Personal DiffCheck</h1>
      <Link href="/diff">
        <a className="px-4 py-2 bg-pastel-purple text-dark-bg rounded">Start Diff</a>
      </Link>
    </div>
  )
}
