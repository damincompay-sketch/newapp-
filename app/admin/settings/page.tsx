'use client'

import { useState } from 'react'
import { Save, Store, Phone, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    storeName: 'جملة العم للتسوق',
    storePhone: '+967772652212',
    whatsappNumber: '967772652212',
    storeEmail: 'info@jomlah-alaam.com',
    storeAddress: 'صنعاء، اليمن',
  })

  const handleSave = () => {
    // Mock save
    toast.success('تم حفظ الإعدادات بنجاح')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">الإعدادات</h1>
        <p className="text-muted-foreground">إعدادات المتجر العامة</p>
      </div>

      <div className="grid gap-6">
        {/* Store Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              معلومات المتجر
            </CardTitle>
            <CardDescription>
              المعلومات الأساسية للمتجر
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">اسم المتجر</Label>
                <Input
                  id="storeName"
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeEmail">البريد الإلكتروني</Label>
                <Input
                  id="storeEmail"
                  type="email"
                  value={settings.storeEmail}
                  onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                  dir="ltr"
                  className="text-left"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeAddress">العنوان</Label>
              <Input
                id="storeAddress"
                value={settings.storeAddress}
                onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              معلومات الاتصال
            </CardTitle>
            <CardDescription>
              أرقام التواصل مع العملاء
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="storePhone">رقم الهاتف</Label>
                <Input
                  id="storePhone"
                  value={settings.storePhone}
                  onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                  dir="ltr"
                  className="text-left"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsappNumber">رقم واتساب (للطلبات)</Label>
                <Input
                  id="whatsappNumber"
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  dir="ltr"
                  className="text-left"
                />
                <p className="text-xs text-muted-foreground">
                  بدون علامة + أو مسافات
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Discount Codes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              أكواد الخصم الفعالة
            </CardTitle>
            <CardDescription>
              قائمة أكواد الخصم المتاحة للعملاء
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <div>
                  <p className="font-medium">JOMLAH10</p>
                  <p className="text-sm text-muted-foreground">خصم 10%</p>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-500">فعال</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <div>
                  <p className="font-medium">WELCOME15</p>
                  <p className="text-sm text-muted-foreground">خصم 15%</p>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-500">فعال</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <div>
                  <p className="font-medium">BULK20</p>
                  <p className="text-sm text-muted-foreground">خصم 20%</p>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-500">فعال</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className="flex justify-end">
          <Button onClick={handleSave} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Save className="h-4 w-4 ml-2" />
            حفظ الإعدادات
          </Button>
        </div>
      </div>
    </div>
  )
}
