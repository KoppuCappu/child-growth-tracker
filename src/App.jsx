import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.jsx'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Calendar, Plus, TrendingUp, Baby, Heart, Syringe, BookOpen, LogOut, Settings } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { LoginScreen } from '@/components/LoginScreen'
import './App.css'

function App() {
  const { user, childInfo, loading, logout, completeSetup } = useAuth()
  const [growthData, setGrowthData] = useState([])
  const [vaccinations, setVaccinations] = useState([])
  const [diaryEntries, setDiaryEntries] = useState([])
  const [newEntry, setNewEntry] = useState({
    date: '',
    height: '',
    weight: '',
    notes: ''
  })
  const [newVaccination, setNewVaccination] = useState({
    date: '',
    vaccine: '',
    notes: ''
  })
  const [newDiary, setNewDiary] = useState({
    date: '',
    title: '',
    content: ''
  })
  const [settingsData, setSettingsData] = useState({
    childName: childInfo?.childName || '',
    birthDate: childInfo?.birthDate || '',
    gender: childInfo?.gender || '',
    birthHeight: childInfo?.birthHeight || '',
    birthWeight: childInfo?.birthWeight || ''
  })
  const [settingsError, setSettingsError] = useState('')
  const [settingsSaved, setSettingsSaved] = useState(false)

  // ローカルストレージからデータを読み込み
  useEffect(() => {
    const savedGrowthData = localStorage.getItem('growthData')
    const savedVaccinations = localStorage.getItem('vaccinations')
    const savedDiaryEntries = localStorage.getItem('diaryEntries')
    
    if (savedGrowthData) {
      setGrowthData(JSON.parse(savedGrowthData))
    }
    if (savedVaccinations) {
      setVaccinations(JSON.parse(savedVaccinations))
    }
    if (savedDiaryEntries) {
      setDiaryEntries(JSON.parse(savedDiaryEntries))
    }
  }, [])

  // 設定データを更新
  useEffect(() => {
    if (childInfo) {
      setSettingsData({
        childName: childInfo.childName || '',
        birthDate: childInfo.birthDate || '',
        gender: childInfo.gender || '',
        birthHeight: childInfo.birthHeight || '',
        birthWeight: childInfo.birthWeight || ''
      })
    }
  }, [childInfo])

  // データをローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('growthData', JSON.stringify(growthData))
  }, [growthData])

  useEffect(() => {
    localStorage.setItem('vaccinations', JSON.stringify(vaccinations))
  }, [vaccinations])

  useEffect(() => {
    localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries))
  }, [diaryEntries])

  const addGrowthEntry = () => {
    if (newEntry.date && (newEntry.height || newEntry.weight)) {
      const entry = {
        id: Date.now(),
        date: newEntry.date,
        height: parseFloat(newEntry.height) || null,
        weight: parseFloat(newEntry.weight) || null,
        notes: newEntry.notes
      }
      setGrowthData([...growthData, entry].sort((a, b) => new Date(a.date) - new Date(b.date)))
      setNewEntry({ date: '', height: '', weight: '', notes: '' })
    }
  }

  const addVaccination = () => {
    if (newVaccination.date && newVaccination.vaccine) {
      const vaccination = {
        id: Date.now(),
        date: newVaccination.date,
        vaccine: newVaccination.vaccine,
        notes: newVaccination.notes
      }
      setVaccinations([...vaccinations, vaccination].sort((a, b) => new Date(a.date) - new Date(b.date)))
      setNewVaccination({ date: '', vaccine: '', notes: '' })
    }
  }

  const addDiaryEntry = () => {
    if (newDiary.date && newDiary.title && newDiary.content) {
      const diary = {
        id: Date.now(),
        date: newDiary.date,
        title: newDiary.title,
        content: newDiary.content
      }
      setDiaryEntries([...diaryEntries, diary].sort((a, b) => new Date(b.date) - new Date(a.date)))
      setNewDiary({ date: '', title: '', content: '' })
    }
  }

  const handleSettingsSave = () => {
    setSettingsError('')
    setSettingsSaved(false)

    if (!settingsData.childName.trim()) {
      setSettingsError('お子様の名前を入力してください')
      return
    }
    if (!settingsData.birthDate) {
      setSettingsError('生年月日を入力してください')
      return
    }
    if (!settingsData.gender) {
      setSettingsError('性別を選択してください')
      return
    }
    if (!settingsData.birthHeight || !settingsData.birthWeight) {
      setSettingsError('出生時の身長と体重を入力してください')
      return
    }

    // 設定を保存
    completeSetup(settingsData)
    setSettingsSaved(true)
    setTimeout(() => setSettingsSaved(false), 3000)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ja-JP')
  }

  // ローディング中
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  // ログインしていない場合
  if (!user) {
    return <LoginScreen />
  }

  // メインアプリケーション
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Baby className="h-8 w-8 text-pink-500" />
              <div>
                <h1 className="text-4xl font-bold text-gray-800">子供の成長記録</h1>
                <p className="text-gray-600">{settingsData.childName}の成長を記録</p>
              </div>
              <Heart className="h-8 w-8 text-pink-500" />
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                ログアウト
              </Button>
            </div>
          </div>
          <p className="text-gray-600 text-lg">お子様の大切な成長を記録しましょう</p>
        </header>

        <Tabs defaultValue="growth" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="growth" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              成長記録
            </TabsTrigger>
            <TabsTrigger value="vaccination" className="flex items-center gap-2">
              <Syringe className="h-4 w-4" />
              予防接種
            </TabsTrigger>
            <TabsTrigger value="diary" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              成長日記
            </TabsTrigger>
            <TabsTrigger value="charts" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              グラフ
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              設定
            </TabsTrigger>
          </TabsList>

          <TabsContent value="growth">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    新しい記録を追加
                  </CardTitle>
                  <CardDescription>身長・体重の記録を追加してください</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="date">日付</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newEntry.date}
                      onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="height">身長 (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        step="0.1"
                        placeholder="例: 75.5"
                        value={newEntry.height}
                        onChange={(e) => setNewEntry({...newEntry, height: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight">体重 (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        placeholder="例: 10.2"
                        value={newEntry.weight}
                        onChange={(e) => setNewEntry({...newEntry, weight: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="notes">メモ</Label>
                    <Textarea
                      id="notes"
                      placeholder="その他の記録やメモ"
                      value={newEntry.notes}
                      onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                    />
                  </div>
                  <Button onClick={addGrowthEntry} className="w-full">
                    記録を追加
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>最近の記録</CardTitle>
                  <CardDescription>過去の成長記録一覧</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {growthData.slice(-10).reverse().map((entry) => (
                      <div key={entry.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{formatDate(entry.date)}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {entry.height && (
                            <div>身長: <span className="font-medium">{entry.height} cm</span></div>
                          )}
                          {entry.weight && (
                            <div>体重: <span className="font-medium">{entry.weight} kg</span></div>
                          )}
                        </div>
                        {entry.notes && (
                          <p className="text-sm text-gray-600 mt-2">{entry.notes}</p>
                        )}
                      </div>
                    ))}
                    {growthData.length === 0 && (
                      <p className="text-gray-500 text-center py-8">まだ記録がありません</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vaccination">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    予防接種を追加
                  </CardTitle>
                  <CardDescription>予防接種の記録を追加してください</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="vac-date">日付</Label>
                    <Input
                      id="vac-date"
                      type="date"
                      value={newVaccination.date}
                      onChange={(e) => setNewVaccination({...newVaccination, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="vaccine">ワクチン名</Label>
                    <Input
                      id="vaccine"
                      placeholder="例: BCG、ポリオ"
                      value={newVaccination.vaccine}
                      onChange={(e) => setNewVaccination({...newVaccination, vaccine: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="vac-notes">メモ</Label>
                    <Textarea
                      id="vac-notes"
                      placeholder="その他の記録やメモ"
                      value={newVaccination.notes}
                      onChange={(e) => setNewVaccination({...newVaccination, notes: e.target.value})}
                    />
                  </div>
                  <Button onClick={addVaccination} className="w-full">
                    予防接種を追加
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>予防接種履歴</CardTitle>
                  <CardDescription>過去の予防接種一覧</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {vaccinations.slice(-10).reverse().map((vac) => (
                      <div key={vac.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Syringe className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">{vac.vaccine}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {formatDate(vac.date)}
                        </div>
                        {vac.notes && (
                          <p className="text-sm text-gray-600 mt-2">{vac.notes}</p>
                        )}
                      </div>
                    ))}
                    {vaccinations.length === 0 && (
                      <p className="text-gray-500 text-center py-8">まだ記録がありません</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="diary">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    日記を追加
                  </CardTitle>
                  <CardDescription>成長の思い出を記録してください</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="diary-date">日付</Label>
                    <Input
                      id="diary-date"
                      type="date"
                      value={newDiary.date}
                      onChange={(e) => setNewDiary({...newDiary, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="diary-title">タイトル</Label>
                    <Input
                      id="diary-title"
                      placeholder="例: 初めての笑顔"
                      value={newDiary.title}
                      onChange={(e) => setNewDiary({...newDiary, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="diary-content">内容</Label>
                    <Textarea
                      id="diary-content"
                      placeholder="今日のできごとや思い出を記録してください"
                      value={newDiary.content}
                      onChange={(e) => setNewDiary({...newDiary, content: e.target.value})}
                      rows={4}
                    />
                  </div>
                  <Button onClick={addDiaryEntry} className="w-full">
                    日記を追加
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>最近の日記</CardTitle>
                  <CardDescription>過去の日記一覧</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {diaryEntries.slice(-10).map((entry) => (
                      <div key={entry.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="h-4 w-4 text-green-500" />
                          <span className="font-medium">{entry.title}</span>
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          {formatDate(entry.date)}
                        </div>
                        <p className="text-sm text-gray-600">{entry.content}</p>
                      </div>
                    ))}
                    {diaryEntries.length === 0 && (
                      <p className="text-gray-500 text-center py-8">まだ日記がありません</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="charts">
            <Card>
              <CardHeader>
                <CardTitle>成長グラフ</CardTitle>
                <CardDescription>身長と体重の推移を表示します</CardDescription>
              </CardHeader>
              <CardContent>
                {growthData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={growthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(date) => new Date(date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip 
                        formatter={(value) => value ? value.toFixed(1) : '-'}
                        labelFormatter={(date) => new Date(date).toLocaleDateString('ja-JP')}
                      />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="height" stroke="#ec4899" name="身長 (cm)" />
                      <Line yAxisId="right" type="monotone" dataKey="weight" stroke="#3b82f6" name="体重 (kg)" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">グラフを表示するには、成長記録を追加してください</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  お子様の情報設定
                </CardTitle>
                <CardDescription>お子様の基本情報を設定・編集してください</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="settings-name">お子様の名前</Label>
                  <Input
                    id="settings-name"
                    placeholder="例: 太郎"
                    value={settingsData.childName}
                    onChange={(e) => setSettingsData({...settingsData, childName: e.target.value})}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="settings-birthdate">生年月日</Label>
                  <Input
                    id="settings-birthdate"
                    type="date"
                    value={settingsData.birthDate}
                    onChange={(e) => setSettingsData({...settingsData, birthDate: e.target.value})}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className="mb-3 block">性別</Label>
                  <RadioGroup value={settingsData.gender} onValueChange={(value) => setSettingsData({...settingsData, gender: value})}>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="male" id="settings-male" />
                      <Label htmlFor="settings-male" className="flex-1 cursor-pointer">
                        男の子
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="female" id="settings-female" />
                      <Label htmlFor="settings-female" className="flex-1 cursor-pointer">
                        女の子
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="settings-height">出生時身長 (cm)</Label>
                    <Input
                      id="settings-height"
                      type="number"
                      step="0.1"
                      placeholder="例: 50.0"
                      value={settingsData.birthHeight}
                      onChange={(e) => setSettingsData({...settingsData, birthHeight: e.target.value})}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="settings-weight">出生時体重 (kg)</Label>
                    <Input
                      id="settings-weight"
                      type="number"
                      step="0.1"
                      placeholder="例: 3.2"
                      value={settingsData.birthWeight}
                      onChange={(e) => setSettingsData({...settingsData, birthWeight: e.target.value})}
                      className="mt-2"
                    />
                  </div>
                </div>

                {settingsError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {settingsError}
                  </div>
                )}

                {settingsSaved && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                    設定を保存しました
                  </div>
                )}

                <Button onClick={handleSettingsSave} className="w-full bg-pink-500 hover:bg-pink-600">
                  設定を保存
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App

