import React from 'react';
import { useParams } from 'react-router-dom';
import SEO from '../components/common/SEO';

const ShopDetails = ({ product }) => {
  // Example product data structure
  const productData = {
    name: "18K Gold Diamond Ring",
    description: "Elegant 18K gold ring with certified diamonds. Perfect for special occasions.",
    price: "₹50,000",
    image: "https://example.com/ring-image.jpg",
    category: "Rings"
  };

  return (
    <>
      <SEO
        title={productData.name}
        description={`Buy ${productData.name}. ${productData.description}`}
        keywords={`${productData.name}, ${productData.category}, gold jewelry, diamond jewelry`}
        ogImage={productData.image}
        ogType="product"
        canonicalUrl={`https://impelstore.com/shopdetails/${productData.id}`}
      />

      {/* Rest of your product details component */}
    </>
  );
};

export default ShopDetails;
