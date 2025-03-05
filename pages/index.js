// pages/index.js
import { useState, useEffect } from 'react'
import DiffViewer from '../components/DiffViewer'
import LZString from 'lz-string'

export default function Home() {
  const [originalText, setOriginalText] = useState('')
  const [changedText, setChangedText] = useState('')

  // Load from localStorage on mount
  useEffect(() => {
    const savedOriginal = localStorage.getItem('originalText')
    const savedChanged = localStorage.getItem('changedText')
    if (savedOriginal !== null) setOriginalText(savedOriginal)
    if (savedChanged !== null) setChangedText(savedChanged)

    // Check if there's a shareable URL param
    const params = new URLSearchParams(window.location.search)
    const o = params.get('o')
    const c = params.get('c')
    if (o && c) {
      // Decompress from URL
      const decodedOriginal = LZString.decompressFromEncodedURIComponent(o) || ''
      const decodedChanged = LZString.decompressFromEncodedURIComponent(c) || ''
      setOriginalText(decodedOriginal)
      setChangedText(decodedChanged)
    }
  }, [])

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem('originalText', originalText)
    localStorage.setItem('changedText', changedText)
  }, [originalText, changedText])

  // Swap the content of both textareas
  const handleSwap = () => {
    const temp = originalText
    setOriginalText(changedText)
    setChangedText(temp)
  }

  // Reset each textarea
  const handleResetOriginal = () => setOriginalText('')
  const handleResetChanged = () => setChangedText('')

  // Generate a shareable URL with compressed text
  const handleShareUrl = () => {
    const encodedOriginal = LZString.compressToEncodedURIComponent(originalText)
    const encodedChanged = LZString.compressToEncodedURIComponent(changedText)
    const shareUrl = `${window.location.origin}?o=${encodedOriginal}&c=${encodedChanged}`
    // Copy to clipboard or just alert
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Share URL copied to clipboard!')
    }, () => {
      alert('Failed to copy URL. Here it is:\n' + shareUrl)
    })
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white p-4">
      <h1 className="text-3xl mb-4 text-center">Personal DiffCheck</h1>

      {/* Textareas */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Original */}
        <div className="flex flex-col">
          <div className="mb-2 flex justify-between">
            <span className="font-bold">Original</span>
            <button 
              onClick={handleResetOriginal} 
              className="text-sm bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
            >
              Reset
            </button>
          </div>
          <textarea
            className="w-full h-64 p-2 bg-gray-800 text-white focus:outline-none"
            placeholder="Enter original text here..."
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
          />
        </div>
        
        {/* Changed */}
        <div className="flex flex-col">
          <div className="mb-2 flex justify-between">
            <span className="font-bold">Changed</span>
            <button 
              onClick={handleResetChanged} 
              className="text-sm bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
            >
              Reset
            </button>
          </div>
          <textarea
            className="w-full h-64 p-2 bg-gray-800 text-white focus:outline-none"
            placeholder="Enter changed text here..."
            value={changedText}
            onChange={(e) => setChangedText(e.target.value)}
          />
        </div>
      </div>

      {/* Swap + Share */}
      <div className="text-center mb-4 space-x-2">
        <button
          onClick={handleSwap}
          className="text-sm bg-pastel-purple text-dark-bg px-4 py-2 rounded hover:bg-pastel-blue"
        >
          Swap ↔
        </button>
        <button
          onClick={handleShareUrl}
          className="text-sm bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
        >
          Share URL
        </button>
      </div>

      {/* Diff Viewer */}
      <DiffViewer originalText={originalText} changedText={changedText} />
    </div>
  )
}
