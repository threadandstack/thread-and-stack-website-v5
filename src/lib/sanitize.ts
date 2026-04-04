import DOMPurify from "dompurify";

const ALLOWED_TAGS = [
  "p", "br", "strong", "em", "u", "s", "code", "a",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li", "blockquote", "pre", "img",
  "figure", "figcaption", "hr", "div", "span", "table",
  "thead", "tbody", "tr", "th", "td", "sup", "sub",
  "video", "source", "iframe",
];

const ALLOWED_ATTR = [
  "href", "src", "alt", "class", "target", "rel",
  "data-equation", "width", "height", "loading",
  "controls", "preload", "type", "frameborder",
  "allowfullscreen", "style",
];

/**
 * Sanitize HTML content to prevent XSS attacks.
 * Allows only safe tags/attributes and blocks javascript: URIs.
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP:
      /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  });
}
