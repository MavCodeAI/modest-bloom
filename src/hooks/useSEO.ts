import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  type?: 'website' | 'product';
  productData?: {
    name: string;
    price: number;
    availability: string;
    image: string;
    description: string;
  };
}

export const useSEO = (seoData: SEOData) => {
  const location = useLocation();

  useEffect(() => {
    // Update page title
    document.title = seoData.title;

    // Update or create meta description
    updateMetaTag('description', seoData.description);
    
    // Update keywords
    if (seoData.keywords) {
      updateMetaTag('keywords', seoData.keywords);
    }

    // Update Open Graph tags
    updateMetaProperty('og:title', seoData.title);
    updateMetaProperty('og:description', seoData.description);
    updateMetaProperty('og:type', seoData.type || 'website');
    updateMetaProperty('og:url', `https://modestwayfashion.com${location.pathname}`);
    
    if (seoData.ogImage) {
      updateMetaProperty('og:image', seoData.ogImage);
      updateMetaProperty('og:image:alt', seoData.title);
    }

    // Update Twitter Card tags
    updateMetaName('twitter:card', 'summary_large_image');
    updateMetaName('twitter:title', seoData.title);
    updateMetaName('twitter:description', seoData.description);
    
    if (seoData.ogImage) {
      updateMetaName('twitter:image', seoData.ogImage);
    }

    // Update canonical URL
    const canonicalUrl = seoData.canonical || `https://modestwayfashion.com${location.pathname}`;
    updateLinkTag('canonical', canonicalUrl);

    // Add structured data for products
    if (seoData.type === 'product' && seoData.productData) {
      addProductStructuredData(seoData.productData);
    } else {
      removeStructuredData('product');
    }

    // Add breadcrumb structured data
    addBreadcrumbStructuredData(location.pathname);

  }, [seoData, location.pathname]);
};

const updateMetaTag = (name: string, content: string) => {
  let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!tag) {
    tag = document.createElement('meta');
    tag.name = name;
    document.head.appendChild(tag);
  }
  tag.content = content;
};

const updateMetaProperty = (property: string, content: string) => {
  let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('property', property);
    document.head.appendChild(tag);
  }
  tag.content = content;
};

const updateMetaName = (name: string, content: string) => {
  let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!tag) {
    tag = document.createElement('meta');
    tag.name = name;
    document.head.appendChild(tag);
  }
  tag.content = content;
};

const updateLinkTag = (rel: string, href: string) => {
  let tag = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  if (!tag) {
    tag = document.createElement('link');
    tag.rel = rel;
    document.head.appendChild(tag);
  }
  tag.href = href;
};

const addProductStructuredData = (product: SEOData['productData']) => {
  if (!product) return;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "AED",
      "availability": `https://schema.org/${product.availability}`,
      "seller": {
        "@type": "Organization",
        "name": "Modest Way Fashion",
        "url": "https://modestwayfashion.com"
      }
    },
    "brand": {
      "@type": "Brand",
      "name": "Modest Way Fashion"
    },
    "category": "Clothing",
    "material": "Luxury Fabrics"
  };

  addStructuredDataScript('product', structuredData);
};

const addBreadcrumbStructuredData = (pathname: string) => {
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://modestwayfashion.com/"
    }
  ];

  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
    
    breadcrumbs.push({
      "@type": "ListItem",
      "position": index + 2,
      "name": name,
      "item": `https://modestwayfashion.com${currentPath}`
    });
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs
  };

  addStructuredDataScript('breadcrumbs', structuredData);
};

const addStructuredDataScript = (id: string, data: object) => {
  // Remove existing script if any
  removeStructuredData(id);

  // Create and add new script
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = `structured-data-${id}`;
  script.textContent = JSON.stringify(data, null, 2);
  document.head.appendChild(script);
};

const removeStructuredData = (id: string) => {
  const existingScript = document.getElementById(`structured-data-${id}`);
  if (existingScript) {
    existingScript.remove();
  }
};
