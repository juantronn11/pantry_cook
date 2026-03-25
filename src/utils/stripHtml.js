// SCRUM-115: Convert HTML instruction strings into readable plain text.
// Uses the browser's built-in DOMParser to safely parse the HTML,
// then walks through the elements and converts them into formatted text.
// No external libraries needed.
//
// Example:
//   stripHtml('<ol><li>Preheat oven.</li><li>Mix ingredients.</li></ol>')
//   → "1. Preheat oven.\n2. Mix ingredients."

export function stripHtml(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return walkNode(doc.body).trim()
}

function walkNode(node) {
  let text = ''

  for (const child of node.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      text += child.textContent
      continue
    }

    if (child.nodeType === Node.ELEMENT_NODE) {
      const tag = child.tagName.toLowerCase()

      if (tag === 'br') {
        text += '\n'
      } else if (tag === 'li') {
        const parent = child.parentElement?.tagName?.toLowerCase()
        if (parent === 'ol') {
          const index = Array.from(child.parentElement.children).indexOf(child) + 1
          text += '\n' + index + '. ' + walkNode(child).trim()
        } else {
          text += '\n- ' + walkNode(child).trim()
        }
      } else if (tag === 'p') {
        text += '\n\n' + walkNode(child).trim()
      } else if (tag === 'ol' || tag === 'ul') {
        text += walkNode(child)
      } else if (tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'h4') {
        text += '\n\n' + walkNode(child).trim() + '\n'
      } else {
        text += walkNode(child)
      }
    }
  }

  return text
}
