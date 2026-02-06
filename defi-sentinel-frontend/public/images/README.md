# Images Directory

This directory contains all static images used by the website.

## Folder Structure

- **`logos/`** - Protocol logos, brand logos, and icon images
- **`covers/`** - Article cover images for research pages
- **`avatars/`** - Author and user profile pictures
- **`og/`** - Open Graph images for social media sharing

## Usage in Next.js

Images in the `public` folder can be referenced directly from the root:

```tsx
// Example usage in components
<Image src="/images/logos/ethereum.png" alt="Ethereum" />
<Image src="/images/covers/article-1.jpg" alt="Article cover" />
```

## Image Optimization

- Use Next.js `Image` component for automatic optimization
- Recommended formats: WebP, AVIF for better performance
- Keep file sizes reasonable (< 500KB for covers, < 100KB for logos)
- Use appropriate dimensions (logos: 200x200px, covers: 1200x630px for OG)

