// components/DiffBlock.js
import { useState } from 'react'

export default function DiffBlock({ block, onSelect }) {
  const [selected, setSelected] = useState(null)

  const handleSelect = (side) => {
    setSelected(side)
    onSelect(side)
  }

  return (
    <div className="diff-block diff">
      <div className="grid grid-cols-2 gap-2">
        <div className={`p-2 border ${selected === 'left' ? 'bg-pastel-green text-dark-bg' : 'bg-gray-800'}`}>
          <h4 className="font-bold text-sm mb-1">New (Left)</h4>
          <pre className="whitespace-pre-wrap">{block.newText}</pre>
          <button onClick={() => handleSelect('left')} className="mt-2 px-2 py-1 bg-pastel-purple text-dark-bg rounded text-xs">
            Select Left
          </button>
        </div>
        <div className={`p-2 border ${selected === 'right' ? 'bg-pastel-green text-dark-bg' : 'bg-gray-800'}`}>
          <h4 className="font-bold text-sm mb-1">Old (Right)</h4>
          <pre className="whitespace-pre-wrap">{block.oldText}</pre>
          <button onClick={() => handleSelect('right')} className="mt-2 px-2 py-1 bg-pastel-purple text-dark-bg rounded text-xs">
            Select Right
          </button>
        </div>
      </div>
    </div>
  )
}
