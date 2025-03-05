// components/DiffViewer.js
import { useState, useEffect, useRef } from 'react'
import { diffLines } from 'diff'

export default function DiffViewer({ originalText, changedText }) {
  const [diffResult, setDiffResult] = useState([])
  const [viewMode, setViewMode] = useState("unified") // "unified" or "split"
  const [expanded, setExpanded] = useState({}) // track collapsed/expanded blocks
  const blockRefs = useRef([])
  const [currentDiffIndex, setCurrentDiffIndex] = useState(0)

  const CONTEXT_THRESHOLD = 5 // number of lines to show before collapsing

  useEffect(() => {
    // Recalculate diff whenever the input changes
    const result = diffLines(originalText, changedText, { newlineIsToken: true })
    setDiffResult(result)
    setCurrentDiffIndex(0)
    blockRefs.current = []
    setExpanded({})
  }, [originalText, changedText])

  const toggleViewMode = () => {
    setViewMode(viewMode === "unified" ? "split" : "unified")
  }

  // For toggling collapse/expand
  const toggleExpand = (idx) => {
    setExpanded(prev => ({ ...prev, [idx]: !prev[idx] }))
  }

  // Gather indices for changed blocks (added/removed)
  const diffIndices = diffResult
    .map((block, idx) => (block.added || block.removed) ? idx : null)
    .filter(idx => idx !== null)

  const scrollToDiff = (index) => {
    if (blockRefs.current[index]) {
      blockRefs.current[index].scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  const handleNextDiff = () => {
    if (diffIndices.length === 0) return
    let nextIndex = currentDiffIndex + 1
    if (nextIndex >= diffIndices.length) nextIndex = 0
    setCurrentDiffIndex(nextIndex)
    scrollToDiff(diffIndices[nextIndex])
  }

  const handlePrevDiff = () => {
    if (diffIndices.length === 0) return
    let prevIndex = currentDiffIndex - 1
    if (prevIndex < 0) prevIndex = diffIndices.length - 1
    setCurrentDiffIndex(prevIndex)
    scrollToDiff(diffIndices[prevIndex])
  }

  // Render for unified view
  const renderUnifiedBlock = (block, idx) => {
    if (!block.added && !block.removed) {
      // Unchanged block with potential collapse
      const lines = block.value.split('\n').filter(l => l !== "")
      if (lines.length > CONTEXT_THRESHOLD && !expanded[idx]) {
        const partial = lines.slice(0, 2).join('\n')
        return (
          <div key={idx} className="diff-block equal whitespace-pre-wrap">
            {partial}
            <div className="text-center">
              <button onClick={() => toggleExpand(idx)} className="text-xs text-pastel-blue mt-1">
                Show More
              </button>
            </div>
          </div>
        )
      } else if (lines.length > CONTEXT_THRESHOLD && expanded[idx]) {
        return (
          <div key={idx} className="diff-block equal whitespace-pre-wrap">
            {block.value}
            <div className="text-center">
              <button onClick={() => toggleExpand(idx)} className="text-xs text-pastel-blue mt-1">
                Show Less
              </button>
            </div>
          </div>
        )
      } else {
        // If not big enough to collapse
        return (
          <div key={idx} className="diff-block equal whitespace-pre-wrap">
            {block.value}
          </div>
        )
      }
    } else {
      // added or removed block
      return (
        <div
          key={idx}
          ref={el => blockRefs.current[idx] = el}
          className="diff-block diff whitespace-pre-wrap"
          style={{ backgroundColor: block.added ? 'rgba(0,255,0,0.2)' : 'rgba(255,0,0,0.2)' }}
        >
          {block.value}
        </div>
      )
    }
  }

  // Render for split view
  const renderSplitBlock = (block, idx) => {
    if (!block.added && !block.removed) {
      // Unchanged block
      const lines = block.value.split('\n').filter(l => l !== "")
      if (lines.length > CONTEXT_THRESHOLD && !expanded[idx]) {
        const partial = lines.slice(0, 2).join('\n')
        return (
          <div key={idx} className="grid grid-cols-2 gap-2 border p-2 mb-2">
            <div className="whitespace-pre-wrap">{partial}</div>
            <div className="whitespace-pre-wrap">{partial}</div>
            <div className="col-span-2 text-center">
              <button onClick={() => toggleExpand(idx)} className="text-xs text-pastel-blue mt-1">
                Show More
              </button>
            </div>
          </div>
        )
      } else if (lines.length > CONTEXT_THRESHOLD && expanded[idx]) {
        return (
          <div key={idx} className="grid grid-cols-2 gap-2 border p-2 mb-2">
            <div className="whitespace-pre-wrap">{block.value}</div>
            <div className="whitespace-pre-wrap">{block.value}</div>
            <div className="col-span-2 text-center">
              <button onClick={() => toggleExpand(idx)} className="text-xs text-pastel-blue mt-1">
                Show Less
              </button>
            </div>
          </div>
        )
      } else {
        return (
          <div key={idx} className="grid grid-cols-2 gap-2 border p-2 mb-2">
            <div className="whitespace-pre-wrap">{block.value}</div>
            <div className="whitespace-pre-wrap">{block.value}</div>
          </div>
        )
      }
    } else if (block.removed) {
      // Removed => highlight in left column
      return (
        <div
          key={idx}
          ref={el => blockRefs.current[idx] = el}
          className="grid grid-cols-2 gap-2 border p-2 mb-2"
          style={{ backgroundColor: 'rgba(255,0,0,0.2)' }}
        >
          <div className="whitespace-pre-wrap">{block.value}</div>
          <div className="whitespace-pre-wrap"></div>
        </div>
      )
    } else if (block.added) {
      // Added => highlight in right column
      return (
        <div
          key={idx}
          ref={el => blockRefs.current[idx] = el}
          className="grid grid-cols-2 gap-2 border p-2 mb-2"
          style={{ backgroundColor: 'rgba(0,255,0,0.2)' }}
        >
          <div className="whitespace-pre-wrap"></div>
          <div className="whitespace-pre-wrap">{block.value}</div>
        </div>
      )
    }
  }

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        {/* Navigation Buttons */}
        <div>
          <button
            onClick={handlePrevDiff}
            className="px-3 py-1 bg-gray-700 rounded mr-2 text-xs"
          >
            Previous Diff
          </button>
          <button
            onClick={handleNextDiff}
            className="px-3 py-1 bg-gray-700 rounded text-xs"
          >
            Next Diff
          </button>
        </div>
        {/* View Mode Toggle */}
        <div>
          <button
            onClick={toggleViewMode}
            className="px-3 py-1 bg-gray-700 rounded text-xs"
          >
            {viewMode === "unified" ? "Switch to Split View" : "Switch to Unified View"}
          </button>
        </div>
      </div>

      {/* Render Diff Blocks */}
      {viewMode === "unified"
        ? diffResult.map((block, idx) => renderUnifiedBlock(block, idx))
        : diffResult.map((block, idx) => renderSplitBlock(block, idx))
      }
    </div>
  )
}
