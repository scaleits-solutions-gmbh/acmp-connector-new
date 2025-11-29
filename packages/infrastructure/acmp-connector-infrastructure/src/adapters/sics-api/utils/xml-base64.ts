/**
 * Converts an object to an XML string and then to base64.
 *
 * This is required by the SICS API for publish commands.
 *
 * @param obj - The object to convert
 * @returns Base64 encoded XML string
 */
export function objectToBase64Xml(obj: object): string {
  const xml = objectToXml(obj);
  return Buffer.from(xml).toString('base64');
}

/**
 * Converts an object to a simple XML string.
 *
 * @param obj - The object to convert
 * @param rootName - The root element name
 * @returns XML string
 */
function objectToXml(obj: object, rootName = 'root'): string {
  const entries = Object.entries(obj);

  const children = entries
    .map(([key, value]) => {
      if (value === null || value === undefined) {
        return `<${key}></${key}>`;
      }
      if (typeof value === 'object' && !Array.isArray(value)) {
        return `<${key}>${objectToXmlContent(value)}</${key}>`;
      }
      if (Array.isArray(value)) {
        return value.map((item) => `<${key}>${typeof item === 'object' ? objectToXmlContent(item) : escapeXml(String(item))}</${key}>`).join('');
      }
      return `<${key}>${escapeXml(String(value))}</${key}>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?><${rootName}>${children}</${rootName}>`;
}

/**
 * Converts an object to XML content (without declaration and root).
 */
function objectToXmlContent(obj: object): string {
  return Object.entries(obj)
    .map(([key, value]) => {
      if (value === null || value === undefined) {
        return `<${key}></${key}>`;
      }
      if (typeof value === 'object' && !Array.isArray(value)) {
        return `<${key}>${objectToXmlContent(value)}</${key}>`;
      }
      if (Array.isArray(value)) {
        return value.map((item) => `<${key}>${typeof item === 'object' ? objectToXmlContent(item) : escapeXml(String(item))}</${key}>`).join('');
      }
      return `<${key}>${escapeXml(String(value))}</${key}>`;
    })
    .join('');
}

/**
 * Escapes special XML characters.
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

