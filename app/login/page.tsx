'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Package, Mail, ArrowLeft, Loader2, Shield, User, Phone, MapPin, SkipForward } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { useStore } from '@/lib/store'
import { toast } from 'sonner'

type Step = 'email' | 'otp' | 'profile'

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useStore()
  
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<Step>('email')
  const [isLoading, setIsLoading] = useState(false)
  
  // Profile data
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    address: ''
  })

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('الرجاء إدخال البريد الإلكتروني')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('الرجاء إدخال بريد إلكتروني صحيح')
      return
    }

    setIsLoading(true)
    
    // Mock sending OTP email
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setStep('otp')
    toast.success('تم إرسال رمز التحقق إلى بريدك الإلكتروني')
    setIsLoading(false)
  }

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error('الرجاء إدخال رمز التحقق كاملاً')
      return
    }

    setIsLoading(true)
    
    // Mock OTP verification (accept any 6 digits)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Check if admin email
    if (email === 'admin@jomlah.com') {
      setUser({
        id: 'admin-1',
        name: 'مدير النظام',
        email,
        phone: '',
        isAdmin: true,
      })
      toast.success('تم تسجيل الدخول كمدير')
      router.push('/admin')
    } else {
      // For regular users, show profile completion step
      setStep('profile')
      toast.success('تم التحقق بنجاح')
    }
    
    setIsLoading(false)
  }

  const handleCompleteProfile = async () => {
    if (!profileData.name) {
      toast.error('الرجاء إدخال الاسم')
      return
    }

    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setUser({
      id: 'user-' + Date.now(),
      name: profileData.name,
      email,
      phone: profileData.phone,
      isAdmin: false,
    })
    
    toast.success('تم تسجيل الدخول بنجاح')
    router.push('/')
    setIsLoading(false)
  }

  const handleSkipProfile = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    setUser({
      id: 'user-' + Date.now(),
      name: 'عميل',
      email,
      phone: '',
      isAdmin: false,
    })
    
    toast.success('مرحباً بك في العم ضامن للجملة والعروض')
    router.push('/')
    setIsLoading(false)
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
              {step === 'profile' ? (
                <User className="h-8 w-8 text-accent" />
              ) : (
                <Shield className="h-8 w-8 text-accent" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {step === 'email' && 'تسجيل الدخول'}
              {step === 'otp' && 'التحقق من البريد'}
              {step === 'profile' && 'أكمل بياناتك'}
            </CardTitle>
            <CardDescription>
              {step === 'email' && 'أدخل بريدك الإلكتروني للتسجيل أو تسجيل الدخول'}
              {step === 'otp' && 'أدخل رمز التحقق المرسل إلى بريدك'}
              {step === 'profile' && 'أدخل بياناتك أو تخطى للتسوق'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Email Input */}
            {step === 'email' && (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@email.com"
                      dir="ltr"
                      className="text-left pr-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    سنرسل لك رمز تحقق على هذا البريد
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  disabled={isLoading || !email}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    'إرسال رمز التحقق'
                  )}
                </Button>
              </form>
            )}

            {/* Step 2: OTP Verification */}
            {step === 'otp' && (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    تم إرسال رمز التحقق إلى
                  </p>
                  <p className="font-medium" dir="ltr">{email}</p>
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
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                      جاري التحقق...
                    </>
                  ) : (
                    'تأكيد'
                  )}
                </Button>

                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    className="text-accent hover:underline"
                    onClick={() => {
                      setStep('email')
                      setOtp('')
                    }}
                  >
                    تغيير البريد الإلكتروني
                  </button>
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={handleSendOTP}
                    disabled={isLoading}
                  >
                    إعادة إرسال الرمز
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Profile Completion */}
            {step === 'profile' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم</Label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      placeholder="الاسم الكامل"
                      className="pr-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">رقم التواصل (اختياري)</Label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="+967 XXX XXX XXX"
                      dir="ltr"
                      className="text-left pr-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">العنوان (اختياري)</Label>
                  <div className="relative">
                    <MapPin className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      placeholder="المدينة، الحي، الشارع"
                      className="pr-10"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={handleCompleteProfile}
                    disabled={isLoading || !profileData.name}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                        جاري الحفظ...
                      </>
                    ) : (
                      'حفظ والمتابعة'
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSkipProfile}
                    disabled={isLoading}
                  >
                    <SkipForward className="h-4 w-4 ml-1" />
                    تخطي
                  </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  يمكنك إضافة بياناتك لاحقاً من صفحة حسابك
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
