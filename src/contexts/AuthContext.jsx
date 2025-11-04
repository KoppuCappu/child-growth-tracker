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
    // Googleスクリプトがすでに読み込まれているか確認
    if (window.google && window.google.accounts && window.google.accounts.id) {
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  // Google ログイン処理
  const handleGoogleLogin = async (response) => {
    const { credential } = response
    if (credential) {
      try {
        // JWTトークンをデコード
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
        setLoading(false)
      } catch (error) {
        console.error('ログイン処理中にエラーが発生しました:', error)
        setLoading(false)
      }
    }
  }

  // ローカルストレージから初期設定状態を確認
  const loadSetupStatus = () => {
    const savedSetupCompleted = localStorage.getItem('setupCompleted')
    const savedChildInfo = localStorage.getItem('childInfo')
    
    if (savedSetupCompleted === 'true' && savedChildInfo) {
      setSetupCompleted(true)
      setChildInfo(JSON.parse(savedChildInfo))
    } else {
      setSetupCompleted(false)
    }
    setLoading(false)
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
      loadSetupStatus()
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

