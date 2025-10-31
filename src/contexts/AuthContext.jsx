import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [setupCompleted, setSetupCompleted] = useState(false)
  const [childInfo, setChildInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  // Google OAuth 2.0 設定
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID'

  // ページ読み込み時にGoogleスクリプトを読み込む
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  // Google ログイン処理
  const handleGoogleLogin = async (response) => {
    const { credential } = response
    if (credential) {
      try {
        // バックエンドにトークンを送信してセッションを確立
        const loginResponse = await fetch('https://9yhyi3cnz81v.manus.space/api/auth/google-login', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token: credential })
        })

        if (loginResponse.ok) {
          const loginData = await loginResponse.json()
          if (loginData.success) {
            const userData = loginData.user
            setUser(userData)
            localStorage.setItem('user', JSON.stringify(userData))
            await checkSetupStatus(userData.id)
            return
          }
        }
        
        // バックエンド送信に失敗した場合、ローカルのみで処理
        const base64Url = credential.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        )
        const decoded = JSON.parse(jsonPayload)
        
        const userData = {
          id: decoded.sub,
          name: decoded.name,
          email: decoded.email,
          picture: decoded.picture
        }
        
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        await checkSetupStatus(decoded.sub)
      } catch (error) {
        console.error('ログイン処理中にエラーが発生しました:', error)
      }
    }
  }

  // 初期設定状態を確認
  const checkSetupStatus = async (userId) => {
    try {
      // バックエンドから初期設定状態を確認
      const response = await fetch('https://9yhyi3cnz81v.manus.space/api/child/setup-status', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.setup_completed) {
          setSetupCompleted(true)
          // 子供情報を取得
          const childResponse = await fetch('https://9yhyi3cnz81v.manus.space/api/child', {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            }
          })
          if (childResponse.ok) {
            const childData = await childResponse.json()
            if (childData.success && childData.child) {
              setChildInfo(childData.child)
            }
          }
        } else {
          setSetupCompleted(false)
        }
      } else {
        // バックエンドが利用できない場合、ローカルストレージを確認
        const savedSetupCompleted = localStorage.getItem('setupCompleted')
        const savedChildInfo = localStorage.getItem('childInfo')
        
        if (savedSetupCompleted === 'true' && savedChildInfo) {
          setSetupCompleted(true)
          setChildInfo(JSON.parse(savedChildInfo))
        } else {
          setSetupCompleted(false)
        }
      }
    } catch (error) {
      console.error('初期設定状態の確認に失敗しました:', error)
      // エラーの場合、ローカルストレージを確認
      const savedSetupCompleted = localStorage.getItem('setupCompleted')
      const savedChildInfo = localStorage.getItem('childInfo')
      
      if (savedSetupCompleted === 'true' && savedChildInfo) {
        setSetupCompleted(true)
        setChildInfo(JSON.parse(savedChildInfo))
      } else {
        setSetupCompleted(false)
      }
    } finally {
      setLoading(false)
    }
  }

  // 初期設定を完了
  const completeSetup = (info) => {
    setChildInfo(info)
    setSetupCompleted(true)
    localStorage.setItem('childInfo', JSON.stringify(info))
    localStorage.setItem('setupCompleted', 'true')
  }

  // ログアウト処理
  const logout = () => {
    setUser(null)
    setSetupCompleted(false)
    setChildInfo(null)
    localStorage.removeItem('user')
    localStorage.removeItem('setupCompleted')
    localStorage.removeItem('childInfo')
  }

  // ページ読み込み時にローカルストレージから復元
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      checkSetupStatus(userData.id)
    } else {
      setLoading(false)
    }
  }, [])

  const value = {
    user,
    setupCompleted,
    childInfo,
    loading,
    handleGoogleLogin,
    completeSetup,
    logout,
    GOOGLE_CLIENT_ID
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

