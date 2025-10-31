import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.jsx'
import { Baby, Heart } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/services/api'

export const OnboardingScreen = () => {
  const { user, completeSetup } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    childName: '',
    birthDate: '',
    gender: '',
    birthHeight: '',
    birthWeight: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleGenderChange = (value) => {
    setFormData(prev => ({
      ...prev,
      gender: value
    }))
    setError('')
  }

  const validateStep = (step) => {
    if (step === 1) {
      if (!formData.childName.trim()) {
        setError('お子様の名前を入力してください')
        return false
      }
    } else if (step === 2) {
      if (!formData.birthDate) {
        setError('生年月日を入力してください')
        return false
      }
    } else if (step === 3) {
      if (!formData.gender) {
        setError('性別を選択してください')
        return false
      }
    } else if (step === 4) {
      if (!formData.birthHeight || !formData.birthWeight) {
        setError('出生時の身長と体重を入力してください')
        return false
      }
      if (isNaN(parseFloat(formData.birthHeight)) || isNaN(parseFloat(formData.birthWeight))) {
        setError('身長と体重は数値で入力してください')
        return false
      }
    }
    return true
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    if (!validateStep(4)) {
      return
    }

    setIsLoading(true)
    try {
      // バックエンドに送信するデータフォーマット
      const setupData = {
        name: formData.childName,
        birth_date: formData.birthDate,
        gender: formData.gender === 'male' ? 'boy' : 'girl',
        birth_height: formData.birthHeight ? parseFloat(formData.birthHeight) : null,
        birth_weight: formData.birthWeight ? parseFloat(formData.birthWeight) : null
      }

      // バックエンドAPIに送信
      const response = await api.child.create(setupData)

      if (response.success) {
        // ローカルストレージに保存
        const localData = {
          childName: formData.childName,
          birthDate: formData.birthDate,
          gender: formData.gender,
          birthHeight: formData.birthHeight,
          birthWeight: formData.birthWeight
        }
        localStorage.setItem('childInfo', JSON.stringify(localData))
        
        // 初期設定を完了
        completeSetup(localData)
      } else {
        setError(response.error || '初期設定の保存に失敗しました。もう一度お試しください。')
      }
    } catch (err) {
      setError('初期設定の保存に失敗しました。もう一度お試しください。')
      console.error('初期設定エラー:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Baby className="h-8 w-8 text-pink-500" />
              <h1 className="text-3xl font-bold text-gray-800">初期設定</h1>
              <Heart className="h-8 w-8 text-pink-500" />
            </div>
            <CardDescription>
              お子様の情報を入力してください
            </CardDescription>
            <div className="mt-4 flex justify-center gap-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    step <= currentStep ? 'bg-pink-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* ステップ1: 名前 */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="childName" className="text-base">
                    お子様の名前
                  </Label>
                  <Input
                    id="childName"
                    name="childName"
                    placeholder="例: 太郎"
                    value={formData.childName}
                    onChange={handleInputChange}
                    className="mt-2"
                  />
                </div>
              </div>
            )}

            {/* ステップ2: 生年月日 */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="birthDate" className="text-base">
                    生年月日
                  </Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className="mt-2"
                  />
                </div>
              </div>
            )}

            {/* ステップ3: 性別 */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <Label className="text-base">性別</Label>
                <RadioGroup value={formData.gender} onValueChange={handleGenderChange}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="flex-1 cursor-pointer">
                      男の子
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="flex-1 cursor-pointer">
                      女の子
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* ステップ4: 出生時の身長・体重 */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="birthHeight" className="text-base">
                    出生時身長 (cm)
                  </Label>
                  <Input
                    id="birthHeight"
                    name="birthHeight"
                    type="number"
                    step="0.1"
                    placeholder="例: 50.0"
                    value={formData.birthHeight}
                    onChange={handleInputChange}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="birthWeight" className="text-base">
                    出生時体重 (kg)
                  </Label>
                  <Input
                    id="birthWeight"
                    name="birthWeight"
                    type="number"
                    step="0.1"
                    placeholder="例: 3.2"
                    value={formData.birthWeight}
                    onChange={handleInputChange}
                    className="mt-2"
                  />
                </div>
              </div>
            )}

            {/* エラーメッセージ */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* ナビゲーションボタン */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex-1"
              >
                戻る
              </Button>
              {currentStep < 4 ? (
                <Button
                  onClick={handleNext}
                  className="flex-1 bg-pink-500 hover:bg-pink-600"
                >
                  次へ
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  disabled={isLoading}
                  className="flex-1 bg-pink-500 hover:bg-pink-600"
                >
                  {isLoading ? '保存中...' : '完了'}
                </Button>
              )}
            </div>

            {/* ステップ表示 */}
            <div className="text-center text-sm text-gray-500 pt-2">
              ステップ {currentStep}/4
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

