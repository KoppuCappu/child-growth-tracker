import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Calendar, Plus, TrendingUp, Baby, Heart, Syringe, BookOpen } from 'lucide-react'
import './App.css'

function App() {
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ja-JP')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Baby className="h-8 w-8 text-pink-500" />
            <h1 className="text-4xl font-bold text-gray-800">子供の成長記録</h1>
            <Heart className="h-8 w-8 text-pink-500" />
          </div>
          <p className="text-gray-600 text-lg">お子様の大切な成長を記録しましょう</p>
        </header>

        <Tabs defaultValue="growth" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
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
                    予防接種記録を追加
                  </CardTitle>
                  <CardDescription>予防接種の記録を追加してください</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="vac-date">接種日</Label>
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
                      placeholder="例: BCG、四種混合など"
                      value={newVaccination.vaccine}
                      onChange={(e) => setNewVaccination({...newVaccination, vaccine: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="vac-notes">メモ</Label>
                    <Textarea
                      id="vac-notes"
                      placeholder="副反応や医師からの指示など"
                      value={newVaccination.notes}
                      onChange={(e) => setNewVaccination({...newVaccination, notes: e.target.value})}
                    />
                  </div>
                  <Button onClick={addVaccination} className="w-full">
                    記録を追加
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>予防接種履歴</CardTitle>
                  <CardDescription>これまでの予防接種記録</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {vaccinations.slice().reverse().map((vaccination) => (
                      <div key={vaccination.id} className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                        <div className="flex items-center gap-2 mb-2">
                          <Syringe className="h-4 w-4 text-green-600" />
                          <span className="font-medium">{formatDate(vaccination.date)}</span>
                        </div>
                        <div className="font-medium text-green-800 mb-1">{vaccination.vaccine}</div>
                        {vaccination.notes && (
                          <p className="text-sm text-gray-600">{vaccination.notes}</p>
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
                    成長日記を書く
                  </CardTitle>
                  <CardDescription>お子様の成長の様子を記録してください</CardDescription>
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
                      placeholder="例: 初めて歩いた日"
                      value={newDiary.title}
                      onChange={(e) => setNewDiary({...newDiary, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="diary-content">内容</Label>
                    <Textarea
                      id="diary-content"
                      placeholder="今日の出来事や成長の様子を書いてください"
                      className="min-h-32"
                      value={newDiary.content}
                      onChange={(e) => setNewDiary({...newDiary, content: e.target.value})}
                    />
                  </div>
                  <Button onClick={addDiaryEntry} className="w-full">
                    日記を保存
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>成長日記</CardTitle>
                  <CardDescription>これまでの日記エントリー</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {diaryEntries.map((diary) => (
                      <div key={diary.id} className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-blue-600">{formatDate(diary.date)}</span>
                        </div>
                        <h3 className="font-medium text-blue-800 mb-2">{diary.title}</h3>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{diary.content}</p>
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
            <div className="space-y-6">
              {growthData.length > 0 ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>身長の推移</CardTitle>
                      <CardDescription>時系列での身長変化</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={growthData.filter(d => d.height)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={(date) => new Date(date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                          />
                          <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                          <Tooltip 
                            labelFormatter={(date) => formatDate(date)}
                            formatter={(value) => [`${value} cm`, '身長']}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="height" 
                            stroke="#8884d8" 
                            strokeWidth={2}
                            dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                            name="身長 (cm)"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>体重の推移</CardTitle>
                      <CardDescription>時系列での体重変化</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={growthData.filter(d => d.weight)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={(date) => new Date(date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                          />
                          <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                          <Tooltip 
                            labelFormatter={(date) => formatDate(date)}
                            formatter={(value) => [`${value} kg`, '体重']}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="weight" 
                            stroke="#82ca9d" 
                            strokeWidth={2}
                            dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
                            name="体重 (kg)"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">グラフを表示するには</h3>
                    <p className="text-gray-500">成長記録タブで身長・体重のデータを追加してください</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App
