'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Search, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatPrice, type Product } from '@/lib/store'
import { products as initialProducts, categories } from '@/lib/data'
import { toast } from 'sonner'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const [formData, setFormData] = useState({
    nameAr: '',
    descriptionAr: '',
    wholesalePrice: '',
    retailPrice: '',
    minQuantity: '',
    category: '',
    image: '',
    stock: '',
    unitAr: '',
  })

  const filteredProducts = products.filter(
    (product) =>
      product.nameAr.includes(searchQuery) ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const resetForm = () => {
    setFormData({
      nameAr: '',
      descriptionAr: '',
      wholesalePrice: '',
      retailPrice: '',
      minQuantity: '',
      category: '',
      image: '',
      stock: '',
      unitAr: '',
    })
  }

  const handleAdd = () => {
    if (!formData.nameAr || !formData.wholesalePrice || !formData.category) {
      toast.error('الرجاء ملء جميع الحقول المطلوبة')
      return
    }

    const category = categories.find(c => c.id === formData.category)
    const newProduct: Product = {
      id: `product-${Date.now()}`,
      name: formData.nameAr,
      nameAr: formData.nameAr,
      description: formData.descriptionAr,
      descriptionAr: formData.descriptionAr,
      wholesalePrice: Number(formData.wholesalePrice),
      retailPrice: Number(formData.retailPrice),
      minQuantity: Number(formData.minQuantity) || 1,
      category: formData.category,
      categoryAr: category?.nameAr || '',
      image: formData.image || 'https://via.placeholder.com/400',
      stock: Number(formData.stock) || 0,
      unit: formData.unitAr,
      unitAr: formData.unitAr,
    }

    setProducts([...products, newProduct])
    resetForm()
    setIsAddDialogOpen(false)
    toast.success('تم إضافة المنتج بنجاح')
  }

  const handleEdit = () => {
    if (!editingProduct) return

    const category = categories.find(c => c.id === formData.category)
    const updatedProducts = products.map((p) =>
      p.id === editingProduct.id
        ? {
            ...p,
            nameAr: formData.nameAr,
            name: formData.nameAr,
            descriptionAr: formData.descriptionAr,
            description: formData.descriptionAr,
            wholesalePrice: Number(formData.wholesalePrice),
            retailPrice: Number(formData.retailPrice),
            minQuantity: Number(formData.minQuantity),
            category: formData.category,
            categoryAr: category?.nameAr || '',
            image: formData.image,
            stock: Number(formData.stock),
            unitAr: formData.unitAr,
            unit: formData.unitAr,
          }
        : p
    )

    setProducts(updatedProducts)
    setEditingProduct(null)
    resetForm()
    toast.success('تم تحديث المنتج بنجاح')
  }

  const handleDelete = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId))
    toast.success('تم حذف المنتج بنجاح')
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      nameAr: product.nameAr,
      descriptionAr: product.descriptionAr,
      wholesalePrice: product.wholesalePrice.toString(),
      retailPrice: product.retailPrice.toString(),
      minQuantity: product.minQuantity.toString(),
      category: product.category,
      image: product.image,
      stock: product.stock.toString(),
      unitAr: product.unitAr,
    })
  }

  const ProductForm = () => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nameAr">اسم المنتج *</Label>
          <Input
            id="nameAr"
            value={formData.nameAr}
            onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
            placeholder="أرز بسمتي ٢٥ كيلو"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">القسم *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر القسم" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.nameAr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descriptionAr">الوصف</Label>
        <Input
          id="descriptionAr"
          value={formData.descriptionAr}
          onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
          placeholder="وصف المنتج"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="wholesalePrice">سعر الجملة (ر.ي) *</Label>
          <Input
            id="wholesalePrice"
            type="number"
            value={formData.wholesalePrice}
            onChange={(e) => setFormData({ ...formData, wholesalePrice: e.target.value })}
            placeholder="45000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="retailPrice">سعر التجزئة (ر.ي)</Label>
          <Input
            id="retailPrice"
            type="number"
            value={formData.retailPrice}
            onChange={(e) => setFormData({ ...formData, retailPrice: e.target.value })}
            placeholder="52000"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="minQuantity">الحد الأدنى</Label>
          <Input
            id="minQuantity"
            type="number"
            value={formData.minQuantity}
            onChange={(e) => setFormData({ ...formData, minQuantity: e.target.value })}
            placeholder="10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">المخزون</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            placeholder="500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="unitAr">الوحدة</Label>
          <Input
            id="unitAr"
            value={formData.unitAr}
            onChange={(e) => setFormData({ ...formData, unitAr: e.target.value })}
            placeholder="كيس"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">رابط الصورة</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="https://..."
          dir="ltr"
        />
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">المنتجات</h1>
          <p className="text-muted-foreground">إدارة منتجات المتجر</p>
        </div>

        {/* Add Product Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="h-4 w-4 ml-2" />
              إضافة منتج
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>إضافة منتج جديد</DialogTitle>
              <DialogDescription>
                أدخل بيانات المنتج الجديد
              </DialogDescription>
            </DialogHeader>
            <ProductForm />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleAdd} className="bg-accent text-accent-foreground hover:bg-accent/90">
                إضافة
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ابحث عن منتج..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            قائمة المنتجات ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">الصورة</TableHead>
                  <TableHead>المنتج</TableHead>
                  <TableHead>القسم</TableHead>
                  <TableHead>سعر الجملة</TableHead>
                  <TableHead>المخزون</TableHead>
                  <TableHead className="w-[100px]">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="relative w-12 h-12 rounded overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.nameAr}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.nameAr}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {product.descriptionAr}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{product.categoryAr}</TableCell>
                    <TableCell className="font-bold text-accent">
                      {formatPrice(product.wholesalePrice)}
                    </TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {/* Edit Dialog */}
                        <Dialog
                          open={editingProduct?.id === product.id}
                          onOpenChange={(open) => {
                            if (!open) {
                              setEditingProduct(null)
                              resetForm()
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(product)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>تعديل المنتج</DialogTitle>
                              <DialogDescription>
                                تحديث بيانات المنتج
                              </DialogDescription>
                            </DialogHeader>
                            <ProductForm />
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setEditingProduct(null)
                                  resetForm()
                                }}
                              >
                                إلغاء
                              </Button>
                              <Button onClick={handleEdit} className="bg-accent text-accent-foreground hover:bg-accent/90">
                                حفظ التغييرات
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {/* Delete Dialog */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                              <AlertDialogDescription>
                                هل أنت متأكد من حذف المنتج &quot;{product.nameAr}&quot;؟
                                لا يمكن التراجع عن هذا الإجراء.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>إلغاء</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(product.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                حذف
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
