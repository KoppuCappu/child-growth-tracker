import { useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Baby, Heart } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export const LoginScreen = () => {
  const { handleGoogleLogin, GOOGLE_CLIENT_ID } = useAuth()

  useEffect(() => {
    // Googleスクリプトが読み込まれるまで待つ
    const checkGoogleLoaded = setInterval(() => {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        clearInterval(checkGoogleLoaded)
        
        // Client IDが有効か確認
        if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') {
          console.error('Google Client ID is not set')
          return
        }
        
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleLogin
        })

        // ボタンをレンダリング
        const button = document.getElementById('google-signin-button')
        if (button) {
          window.google.accounts.id.renderButton(
            button,
            {
              theme: 'outline',
              size: 'large',
              width: '100%'
            }
          )
        }
      }
    }, 100)

    return () => clearInterval(checkGoogleLoaded)
  }, [GOOGLE_CLIENT_ID, handleGoogleLogin])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Baby className="h-10 w-10 text-pink-500" />
              <h1 className="text-3xl font-bold text-gray-800">子供の成長記録</h1>
              <Heart className="h-10 w-10 text-pink-500" />
            </div>
            <CardDescription className="text-base">
              お子様の大切な成長を記録しましょう
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Googleアカウントでログインして、お子様の成長記録を始めましょう。
              </p>
              
              <div id="google-signin-button" className="flex justify-center" />
              
              <p className="text-xs text-gray-500 mt-4">
                初回ログイン時は、お子様の基本情報を入力していただきます。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

