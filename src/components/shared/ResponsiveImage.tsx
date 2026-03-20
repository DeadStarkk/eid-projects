import React from 'react';

/**
 * A component that serves responsive images using the generated srcset.
 * @param {string} src - The original source path (e.g., /grandfather.webp)
 * @param {string} alt - Alt text for the image
 * @param {string} className - Optional CSS classes
 * @param {string} sizes - Optional sizes attribute for responsive switching
 */
function ResponsiveImage({ src, alt, className = '', sizes = '(max-width: 600px) 300px, (max-width: 1200px) 600px, 1200px', ...props }) {
    // Extract the filename without extension and the base path
    const match = src.match(/\/(.+)\.\w+$/);
    if (!match) return <img src={src} alt={alt} className={className} {...props} />;

    const filename = match[1];
    const pathPrefix = '/assets/responsive/';

    // Construct the srcset
    const srcset = [
        `${pathPrefix}${filename}-300w.webp 300w`,
        `${pathPrefix}${filename}-600w.webp 600w`,
        `${pathPrefix}${filename}-1200w.webp 1200w`
    ].join(', ');

    return (
        <img
            src={src}
            srcSet={srcset}
            sizes={sizes}
            alt={alt}
            className={className}
            loading="lazy"
            {...props}
        />
    );
}

export default ResponsiveImage;
