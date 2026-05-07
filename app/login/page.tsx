'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Package, Mail, Phone, ArrowLeft, Loader2, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { useStore } from '@/lib/store'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useStore()
  
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('phone')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  // OTP state
  const [showOTP, setShowOTP] = useState(false)
  const [otp, setOtp] = useState('')
  const [isSendingOTP, setIsSendingOTP] = useState(false)
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('الرجاء إدخال البريد الإلكتروني وكلمة المرور')
      return
    }

    setIsLoading(true)
    
    // Mock login
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const isAdmin = email === 'admin@jomlah.com' && password === 'admin123'
    
    setUser({
      id: 'user-1',
      name: isAdmin ? 'مدير النظام' : 'محمد أحمد',
      email,
      phone: '',
      isAdmin,
    })
    
    toast.success('تم تسجيل الدخول بنجاح')
    
    if (isAdmin) {
      router.push('/admin')
    } else {
      router.push('/')
    }
    setIsLoading(false)
  }

  const handleSendOTP = async () => {
    if (!phone || phone.length < 9) {
      toast.error('الرجاء إدخال رقم هاتف يمني صحيح')
      return
    }

    setIsSendingOTP(true)
    
    // Mock OTP sending
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setShowOTP(true)
    toast.success('تم إرسال رمز التحقق إلى هاتفك')
    setIsSendingOTP(false)
  }

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error('الرجاء إدخال رمز التحقق كاملاً')
      return
    }

    setIsVerifyingOTP(true)
    
    // Mock OTP verification (accept any 6 digits)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock successful verification
    setUser({
      id: 'user-' + phone,
      name: 'مستخدم جديد',
      email: '',
      phone: '+967' + phone,
      isAdmin: false,
    })
    
    toast.success('تم تسجيل الدخول بنجاح')
    router.push('/')
    setIsVerifyingOTP(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Package className="h-8 w-8 text-accent" />
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-tight">جملة العم</span>
              <span className="text-xs text-primary-foreground/70">للتسوق</span>
            </div>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
              <ArrowLeft className="h-4 w-4 ml-2" />
              العودة للرئيسية
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
              <Shield className="h-8 w-8 text-accent" />
            </div>
            <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
            <CardDescription>
              سجل دخولك للاستمتاع بتجربة تسوق مميزة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={loginMethod} onValueChange={(v) => setLoginMethod(v as 'email' | 'phone')}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  رقم الهاتف
                </TabsTrigger>
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  البريد الإلكتروني
                </TabsTrigger>
              </TabsList>

              {/* Phone Login */}
              <TabsContent value="phone">
                {!showOTP ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">رقم الهاتف (اليمن)</Label>
                      <div className="flex gap-2">
                        <div className="flex items-center px-3 bg-secondary rounded-md border border-input">
                          <span className="text-sm text-muted-foreground" dir="ltr">+967</span>
                        </div>
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                          placeholder="7XX XXX XXX"
                          dir="ltr"
                          className="flex-1 text-left"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        أدخل رقم هاتفك بدون رمز الدولة
                      </p>
                    </div>
                    <Button
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                      onClick={handleSendOTP}
                      disabled={isSendingOTP || phone.length < 9}
                    >
                      {isSendingOTP ? (
                        <>
                          <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                          جاري إرسال رمز التحقق...
                        </>
                      ) : (
                        'إرسال رمز التحقق'
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        تم إرسال رمز التحقق إلى
                      </p>
                      <p className="font-medium" dir="ltr">+967 {phone}</p>
                    </div>
                    
                    <div className="flex justify-center">
                      <InputOTP
                        value={otp}
                        onChange={setOtp}
                        maxLength={6}
                      >
                        <InputOTPGroup className="gap-2" dir="ltr">
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    <Button
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                      onClick={handleVerifyOTP}
                      disabled={isVerifyingOTP || otp.length !== 6}
                    >
                      {isVerifyingOTP ? (
                        <>
                          <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                          جاري التحقق...
                        </>
                      ) : (
                        'تأكيد'
                      )}
                    </Button>

                    <div className="text-center">
                      <button
                        type="button"
                        className="text-sm text-accent hover:underline"
                        onClick={() => {
                          setShowOTP(false)
                          setOtp('')
                        }}
                      >
                        تغيير رقم الهاتف
                      </button>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Email Login */}
              <TabsContent value="email">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@email.com"
                      dir="ltr"
                      className="text-left"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">كلمة المرور</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                        جاري تسجيل الدخول...
                      </>
                    ) : (
                      'تسجيل الدخول'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Admin Hint */}
            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-xs text-center text-muted-foreground">
                للدخول كمدير: admin@jomlah.com
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
