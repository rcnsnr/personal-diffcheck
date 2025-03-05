// pages/diff.js
import { useState } from 'react'
import DiffViewer from '../components/DiffViewer'
import Link from 'next/link'

export default function DiffPage() {
  const [leftText, setLeftText] = useState("")
  const [rightText, setRightText] = useState("")
  const [diffCalculated, setDiffCalculated] = useState(false)

  return (
    <div className="min-h-screen bg-dark-bg text-white p-4">
      <Link href="/">
        <a className="mb-4 inline-block text-pastel-blue">← Ana Sayfa</a>
      </Link>
      <h1 className="text-3xl mb-4">Personal DiffCheck</h1>
      <div className="grid grid-cols-2 gap-4">
        <textarea 
          className="w-full h-64 p-2 bg-gray-800 text-white" 
          placeholder="Yeni Metin (Sol)" 
          value={leftText} 
          onChange={(e) => setLeftText(e.target.value)} />
        <textarea 
          className="w-full h-64 p-2 bg-gray-800 text-white" 
          placeholder="Eski Metin (Sağ)" 
          value={rightText} 
          onChange={(e) => setRightText(e.target.value)} />
      </div>
      <button 
        onClick={() => setDiffCalculated(true)}
        className="mt-4 px-4 py-2 bg-pastel-green text-dark-bg rounded">
        Diff Hesapla
      </button>
      {diffCalculated && <DiffViewer leftText={leftText} rightText={rightText} />}
    </div>
  )
}
