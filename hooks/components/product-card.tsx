'use client'

import Image from 'next/image'
import { ShoppingCart, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatPrice, useStore, type Product } from '@/lib/store'
import { toast } from 'sonner'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useStore()

  const handleAddToCart = () => {
    addToCart(product, product.minQuantity)
    toast.success(`تمت إضافة ${product.nameAr} إلى السلة`)
  }

  const savings = product.retailPrice - product.wholesalePrice
  const savingsPercent = Math.round((savings / product.retailPrice) * 100)

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-secondary">
        <Image
          src={product.image}
          alt={product.nameAr}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {savingsPercent > 0 && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-accent text-accent-foreground text-xs font-bold rounded">
            وفر {savingsPercent}%
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="text-xs text-accent font-medium mb-1">
          {product.categoryAr}
        </div>
        <h3 className="font-bold text-card-foreground mb-2 line-clamp-2">
          {product.nameAr}
        </h3>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-accent">
            {formatPrice(product.wholesalePrice)}
          </span>
          <span className="text-sm text-muted-foreground line-through">
            {formatPrice(product.retailPrice)}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
          <Package className="h-3 w-3" />
          <span>الحد الأدنى: {product.minQuantity} {product.unitAr}</span>
        </div>

        <Button
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 ml-2" />
          أضف للسلة
        </Button>
      </CardContent>
    </Card>
  )
}
