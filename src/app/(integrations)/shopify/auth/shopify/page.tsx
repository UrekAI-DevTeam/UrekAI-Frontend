"use client";
import React, { useEffect } from 'react';

export default function ShopifyAuthPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shop = params.get('shop');
    const hmac = params.get('hmac');
    const host = params.get('host');
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;
    if (hmac && shop && API_BASE_URL) {
      if (window.top) {
        window.top.location.href = `${API_BASE_URL}/v2/api/integration/auth/shopify?shop=${shop}&host=${host}`;
      }
    }
  }, []);

  return <div className="p-8 text-center">Authenticating with Shopify...</div>;
}


