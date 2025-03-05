// components/DiffViewer.js
import { useEffect, useState } from 'react'
import { diffLines, diffChars } from 'diff'

export default function DiffViewer({ originalText, changedText }) {
  const [diffResult, setDiffResult] = useState([])

  useEffect(() => {
    // Whenever originalText or changedText changes, recalculate the diff
    const lineDiffs = diffLines(originalText, changedText, {
      newlineIsToken: true,
      ignoreWhitespace: false
    })

    setDiffResult(lineDiffs)
  }, [originalText, changedText])

  // For each line that is added or removed, do a character diff to highlight
  // the changed parts inside the line.
  const mapLineDifferences = (value = '', added, removed) => {
    // Split the chunk by newlines to handle multi-line in the chunk
    const lines = value.split('\n')
    // The last split may be an empty string if there's a trailing newline,
    // we filter out blank lines from the trailing part to avoid extra empty lines.
    const cleanedLines = lines[lines.length - 1] === '' ? lines.slice(0, -1) : lines

    return cleanedLines.map((line, index) => {
      // If it's an unchanged block, just render normally
      if (!added && !removed) {
        return (
          <div key={index} className="diff-line">
            {line}
          </div>
        )
      }

      // For lines that are added or removed, we do a char diff with empty string
      // if we truly want to highlight each character as changed.
      // However, to highlight partial changes, we would need to compare to a matching line from the other text,
      // which is more complex. For simplicity, we'll just highlight the entire line
      // and do a secondary char-level approach comparing each line with an empty string.
      
      // Example approach: highlight the entire line
      // For a more advanced approach, you could pair each removed line with an added line if lengths match, etc.
      const charDiff = diffChars('', line)
      return (
        <div
          key={index}
          className={`diff-line ${added ? 'added' : ''} ${removed ? 'removed' : ''}`}
        >
          {charDiff.map((part, i) => {
            // part.added || part.removed => highlight
            const className = part.added
              ? 'diff-char added'
              : part.removed
              ? 'diff-char removed'
              : ''
            return (
              <span key={i} className={className}>
                {part.value}
              </span>
            )
          })}
        </div>
      )
    })
  }

  return (
    <div>
      <h2 className="text-2xl mb-2 text-center">Diff Results</h2>
      <div className="bg-gray-700 p-4 rounded">
        {diffResult.map((part, idx) => {
          return (
            <div key={idx}>
              {mapLineDifferences(part.value, part.added, part.removed)}
            </div>
          )
        })}
      </div>
    </div>
  )
}
