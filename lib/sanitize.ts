import DOMPurify from "isomorphic-dompurify"

// HTML içeriğini temizle
export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "a",
      "ul",
      "ol",
      "li",
      "b",
      "i",
      "strong",
      "em",
      "mark",
      "small",
      "del",
      "ins",
      "sub",
      "sup",
      "blockquote",
      "pre",
      "code",
      "hr",
      "br",
      "div",
      "span",
      "img",
      "figure",
      "figcaption",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "src", "alt", "class", "id", "style", "width", "height", "title"],
    FORBID_TAGS: ["script", "iframe", "object", "embed", "form", "input", "button", "textarea", "select", "option"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
    ADD_ATTR: ["target"],
    WHOLE_DOCUMENT: false,
    SANITIZE_DOM: true,
    ALLOW_DATA_ATTR: false,
  })
}

// Markdown içeriğini temizle
export function sanitizeMarkdown(markdown: string): string {
  // Markdown'da potansiyel XSS vektörlerini temizle
  return markdown
    .replace(/javascript:/gi, "")
    .replace(/data:/gi, "")
    .replace(/vbscript:/gi, "")
    .replace(/on\w+=/gi, "")
}
