// pages/index.js
import { useState, useEffect } from 'react'
import DiffViewer from '../components/DiffViewer'

export default function Home() {
  const [originalText, setOriginalText] = useState('')
  const [changedText, setChangedText] = useState('')

  // Swap the content of both textareas
  const handleSwap = () => {
    const temp = originalText
    setOriginalText(changedText)
    setChangedText(temp)
  }

  // Reset each textarea individually
  const handleResetOriginal = () => {
    setOriginalText('')
  }

  const handleResetChanged = () => {
    setChangedText('')
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white p-4">
      <h1 className="text-3xl mb-4 text-center">Personal DiffCheck</h1>
      
      {/* Textareas and controls */}
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

      {/* Swap Button */}
      <div className="text-center mb-4">
        <button
          onClick={handleSwap}
          className="text-sm bg-pastel-purple text-dark-bg px-4 py-2 rounded hover:bg-pastel-blue"
        >
          Swap ↔
        </button>
      </div>

      {/* Diff Viewer */}
      <DiffViewer originalText={originalText} changedText={changedText} />
    </div>
  )
}
