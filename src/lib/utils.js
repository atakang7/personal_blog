// src/lib/utils.js
export function formatDate(dateString) {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return 'Date unavailable';
    }
  }
  
  export function truncateDescription(description) {
    if (!description) return '';
    return description.length > 100 ? description.substring(0, 100) + "..." : description;
  }
  
  export function getAuthorName(authorMetadata) {
    if (!authorMetadata) return '';
    return authorMetadata.name === "AItakan" ? 'AI Created' : (authorMetadata.name || authorMetadata.email || '');
  }