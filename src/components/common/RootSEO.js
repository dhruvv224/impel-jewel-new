import React from 'react';
import { Helmet } from 'react-helmet-async';

const RootSEO = () => {
  return (
    <Helmet>
      {/* Default meta tags that will be overridden by specific pages */}
      <title>Impel Store - Jewelry Store</title>
      <meta name="description" content="Discover exquisite jewelry at Impel Store. Browse our collection of certified gold jewelry." />
      
      {/* Necessary meta tags for proper rendering */}
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Preconnect to important domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      
      {/* Open Graph default tags */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Impel Store" />
      
      {/* Twitter default tags */}
      <meta name="twitter:card" content="summary_large_image" />
      
      {/* Robots meta */}
      <meta name="robots" content="index, follow" />
      
      {/* PWA meta tags */}
      <meta name="theme-color" content="#c9b290" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Impel Store" />
      
      {/* Verification tags if needed */}
      {/* <meta name="google-site-verification" content="your-verification-code" /> */}
    </Helmet>
  );
};

export default RootSEO;
