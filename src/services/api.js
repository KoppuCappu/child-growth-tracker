const API_BASE_URL = 'https://9yhyi3cnz81v.manus.space'

export const api = {
  // 認証関連
  auth: {
    me: async () => {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return response.json()
    }
  },

  // 子供情報関連
  child: {
    create: async (childData) => {
      const response = await fetch(`${API_BASE_URL}/api/child`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(childData)
      })
      return response.json()
    },

    get: async () => {
      const response = await fetch(`${API_BASE_URL}/api/child`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return response.json()
    },

    update: async (childData) => {
      const response = await fetch(`${API_BASE_URL}/api/child`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(childData)
      })
      return response.json()
    },

    getSetupStatus: async () => {
      const response = await fetch(`${API_BASE_URL}/api/child/setup-status`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return response.json()
    }
  }
}

