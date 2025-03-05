// components/DiffViewer.js
import { useState, useEffect } from 'react'
import { diffLines } from 'diff'
import DiffBlock from './DiffBlock'

export default function DiffViewer({ leftText, rightText }) {
  const [diffBlocks, setDiffBlocks] = useState([])

  useEffect(() => {
    // Calculate line-by-line diff between the old text (right) and the new text (left)
    const diff = diffLines(rightText, leftText)
    const blocks = []
    let i = 0
    while (i < diff.length) {
      const part = diff[i]
      if (!part.added && !part.removed) {
        // Equal block
        blocks.push({
          type: 'equal',
          text: part.value
        })
        i++
      } else {
        // Diff block: merge consecutive removed and added parts
        let removed = ""
        let added = ""
        while (i < diff.length && (diff[i].added || diff[i].removed)) {
          if (diff[i].removed) {
            removed += diff[i].value
          }
          if (diff[i].added) {
            added += diff[i].value
          }
          i++
        }
        blocks.push({
          type: 'diff',
          oldText: removed,
          newText: added,
          selection: null
        })
      }
    }
    setDiffBlocks(blocks)
  }, [leftText, rightText])

  // Manage block selection state
  const handleSelection = (index, selection) => {
    setDiffBlocks(prevBlocks => {
      const newBlocks = [...prevBlocks]
      if (newBlocks[index].type === 'diff') {
        newBlocks[index].selection = selection
      }
      return newBlocks
    })
  }

  // Create final text: for equal blocks use the text as is, for diff blocks use the selected version
  const finalText = diffBlocks.map(block => {
    if (block.type === 'equal') return block.text
    if (block.type === 'diff') {
      return block.selection === 'left'
        ? block.newText
        : block.selection === 'right'
          ? block.oldText
          : block.newText
    }
  }).join("")

  return (
    <div className="mt-4">
      <h2 className="text-2xl mb-2">Diff Results</h2>
      {diffBlocks.map((block, idx) => {
        if (block.type === 'equal') {
          return (
            <div key={idx} className="diff-block equal whitespace-pre-wrap">
              {block.text}
            </div>
          )
        } else {
          return (
            <DiffBlock 
              key={idx} 
              block={block} 
              onSelect={(selection) => handleSelection(idx, selection)} 
            />
          )
        }
      })}
      <div className="mt-4 p-4 bg-gray-700">
        <h3 className="text-xl">Final Merged Text:</h3>
        <pre className="whitespace-pre-wrap">{finalText}</pre>
      </div>
    </div>
  )
}
