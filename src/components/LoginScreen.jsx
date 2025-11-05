import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Baby, Heart } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export const LoginScreen = () => {
  const { handleGoogleLogin, GOOGLE_CLIENT_ID } = useAuth()
  const [googleLoaded, setGoogleLoaded] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    console.log('LoginScreen mounted, GOOGLE_CLIENT_ID:', GOOGLE_CLIENT_ID)
    
    // Googleスクリプトが読み込まれるまで待つ
    let attempts = 0
    const checkGoogleLoaded = setInterval(() => {
      attempts++
      console.log(`Checking Google API (attempt ${attempts})...`)
      
      if (window.google && window.google.accounts && window.google.accounts.id) {
        console.log('Google API loaded successfully')
        clearInterval(checkGoogleLoaded)
        
        // Client IDが有効か確認
        if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') {
          console.error('Google Client ID is not set')
          setError('Google Client IDが設定されていません')
          return
        }
        
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleLogin
          })
          console.log('Google API initialized')

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
            console.log('Google signin button rendered')
            setGoogleLoaded(true)
          } else {
            console.error('google-signin-button element not found')
          }
        } catch (err) {
          console.error('Error initializing Google API:', err)
          setError(`Google API初期化エラー: ${err.message}`)
        }
      } else if (attempts > 50) {
        // 5秒以上待機してもGoogle APIが読み込まれない場合
        clearInterval(checkGoogleLoaded)
        console.error('Google API failed to load after 5 seconds')
        setError('Google認証サービスが読み込まれていません。ページをリロードしてください。')
      }
    }, 100)

    return () => clearInterval(checkGoogleLoaded)
  }, [GOOGLE_CLIENT_ID, handleGoogleLogin])

  const handleManualLogin = () => {
    // テスト用のマニュアルログイン（開発環境用）
    const testUser = {
      id: 'test-user-' + Date.now(),
      name: 'テストユーザー',
      email: 'test@example.com',
      picture: 'https://via.placeholder.com/40'
    }
    
    // AuthContextのhandleGoogleLoginをシミュレート
    handleGoogleLogin({
      credential: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjExIn0.eyJzdWIiOiJ0ZXN0LXVzZXItMTczMDYwNDAwMDAwMCIsIm5hbWUiOiJ0ZXN0IiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIn0.test'
    })
  }

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
              
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {googleLoaded ? (
                <div id="google-signin-button" className="flex justify-center" />
              ) : (
                <div className="space-y-3">
                  <div id="google-signin-button" className="flex justify-center" />
                  <p className="text-xs text-gray-500">
                    Google認証サービスを読み込み中...
                  </p>
                </div>
              )}
              
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

