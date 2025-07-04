"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Plane, Calendar, Users, ArrowUpDown, Search } from "lucide-react"

interface StarPosition {
  id: number
  top: number
  left: number
  found: boolean
}

const coupons = [
  { id: 1, name: "50% 할인 쿠폰", description: "항공료 50% 할인", type: "discount" },
  { id: 2, name: "좌석 업그레이드", description: "이코노미 → 비즈니스 업그레이드", type: "upgrade" },
  {
    id: 3,
    name: "무료 항공 티켓",
    description: "원하는 여행지, 시간 자유롭게 사용 가능(단, 비성수기만)",
    type: "ticket",
  },
]

export default function MainPage() {
  const [stars, setStars] = useState<StarPosition[]>([])
  const [foundStars, setFoundStars] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState("")
  const [showCoupon, setShowCoupon] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("항공")
  const router = useRouter()
  const [clickedStars, setClickedStars] = useState<Set<number>>(new Set())

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/")
      return
    }

    // Generate random star positions
    const generateStars = () => {
      const newStars: StarPosition[] = []
      for (let i = 0; i < 2; i++) {
        newStars.push({
          id: i + 1,
          top: Math.random() * 60 + 20, // 20% to 80% from top
          left: Math.random() * 80 + 10, // 10% to 90% from left
          found: false,
        })
      }
      setStars(newStars)
    }

    generateStars()
  }, [router])

  const handleStarClick = (starId: number) => {
    // 클릭 애니메이션 트리거
    setClickedStars((prev) => new Set(prev).add(starId))

    // 1초 후 별을 찾음 상태로 변경하고 모달 표시
    setTimeout(() => {
      setStars((prev) => prev.map((star) => (star.id === starId ? { ...star, found: true } : star)))

      const newFoundCount = foundStars + 1
      setFoundStars(newFoundCount)

      if (newFoundCount === 1) {
        setModalContent("축하합니다~!!\n숨겨진 Star를 찾으셨습니다.\n찾은 Star 개수: 1/2")
        setShowModal(true)
      } else if (newFoundCount === 2) {
        setModalContent("축하합니다~!!\n숨겨진 Star를 '모두' 찾으셨습니다.\n찾은 Star 개수: 2/2")
        setShowModal(true)
      }
    }, 1000)
  }

  const handleCouponCheck = () => {
    const randomCoupon = coupons[Math.floor(Math.random() * coupons.length)]
    setSelectedCoupon(randomCoupon)
    setShowCoupon(true)

    // Save coupon to localStorage
    const existingCoupons = JSON.parse(localStorage.getItem("myCoupons") || "[]")
    const couponWithDate = {
      ...randomCoupon,
      obtainedAt: new Date().toISOString(),
      id: Date.now(),
    }
    existingCoupons.push(couponWithDate)
    localStorage.setItem("myCoupons", JSON.stringify(existingCoupons))
  }

  const handleGoToCoupons = () => {
    router.push("/coupons")
  }

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    router.push("/")
  }

  return (
      <div className="min-h-screen bg-gray-50 relative">
        {/* Header */}
        <header className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4 md:space-x-8">
                <div className="text-red-600 text-xl md:text-2xl font-bold">EASTAR JET</div>
                <nav className="hidden lg:flex space-x-8">
                  <a href="#" className="text-gray-700 hover:text-red-600 font-medium">
                    항공권 예매
                  </a>
                  <a href="#" className="text-gray-700 hover:text-red-600 font-medium">
                    나의 예매
                  </a>
                  <a href="#" className="text-gray-700 hover:text-red-600 font-medium">
                    서비스 안내
                  </a>
                  <a href="#" className="text-gray-700 hover:text-red-600 font-medium">
                    이벤트
                  </a>
                  <a href="#" className="text-gray-700 hover:text-red-600 font-medium">
                    제휴상품
                  </a>
                </nav>
              </div>
              <div className="flex items-center space-x-2 md:space-x-4">
                <div className="hidden md:flex items-center space-x-4">
                  <span className="text-sm text-gray-600">온라인체크인</span>
                  <span className="text-sm text-gray-600">마이페이지</span>
                  <span className="text-sm text-gray-600">고객센터</span>
                  <span className="text-sm text-gray-600">한국어</span>
                </div>
                <Button
                    onClick={() => router.push("/coupons")}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-600 hover:bg-red-50 text-xs md:text-sm"
                >
                  쿠폰함
                </Button>
                <Button onClick={handleLogout} variant="outline" size="sm" className="text-xs md:text-sm">
                  로그아웃
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="relative">
          {/* Hero Section */}
          <div className="bg-white py-8 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0">
                <div className="w-full lg:flex-1">
                  {/* Flight Search Form */}
                  <Card className="w-full max-w-4xl shadow-lg">
                    <CardContent className="p-4 md:p-6">
                      {/* Tabs */}
                      <div className="flex space-x-1 mb-4 md:mb-6">
                        {["항공", "렌트", "다구간"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 px-3 md:px-6 py-2 rounded-t-lg font-medium text-sm md:text-base ${
                                    activeTab === tab ? "bg-blue-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                              {tab}
                            </button>
                        ))}
                      </div>

                      {/* Search Form */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="space-y-2 md:col-span-1">
                          <label className="text-sm font-medium text-gray-700">출발지</label>
                          <div className="relative">
                            <Input
                                placeholder="서울(모든 공항)"
                                className="h-10 md:h-12 text-base md:text-lg font-medium"
                                defaultValue="서울(모든 공항)"
                            />
                          </div>
                        </div>

                        <div className="flex justify-center md:col-span-1">
                          <Button variant="ghost" size="sm" className="p-2">
                            <ArrowUpDown className="w-4 md:w-5 h-4 md:h-5 text-gray-400" />
                          </Button>
                        </div>

                        <div className="space-y-2 md:col-span-1">
                          <label className="text-sm font-medium text-gray-700">도착지</label>
                          <div className="relative">
                            <Input placeholder="도착지" className="h-10 md:h-12 text-base md:text-lg" />
                          </div>
                        </div>

                        <div className="space-y-2 md:col-span-1">
                          <label className="text-sm font-medium text-gray-700">날짜</label>
                          <Button variant="outline" className="w-full h-10 md:h-12 justify-start text-left">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span className="text-sm md:text-base">날짜 선택</span>
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row items-center justify-between mt-4 md:mt-6 space-y-4 md:space-y-0">
                        <div className="flex items-center space-x-4">
                          <Button variant="outline" className="h-8 md:h-10">
                            <Users className="w-4 h-4 mr-2" />
                            <span className="text-sm md:text-base">승객</span>
                          </Button>
                        </div>
                        <Button className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-6 md:px-8 h-10 md:h-12">
                          <Search className="w-4 h-4 mr-2" />
                          <span className="text-sm md:text-base">항공편 검색</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right side content - 모바일에서 숨김 */}
                <div className="hidden xl:block ml-8">
                  <div className="text-right mb-4">
                    <p className="text-gray-600 text-sm">지금 이스타항공에서는</p>
                    <p className="text-gray-800 font-semibold">해외여행 날씨 변경 수수료 무료</p>
                  </div>
                  <div className="w-48 h-32 bg-gradient-to-r from-red-100 to-red-50 rounded-lg flex items-center justify-center">
                    <Plane className="w-16 h-16 text-red-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Events Section */}
          <div className="bg-white py-8 md:py-12 border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8">진행 중인 이벤트</h2>
              <div className="text-center py-12 md:py-16 text-gray-500">
                <p className="text-base md:text-lg">별을 찾아서 특별한 이벤트에 참여하세요!</p>
                <p className="text-sm mt-2">화면에 숨겨진 별 2개를 찾으면 놀라운 선물이 기다려요 ⭐</p>
              </div>
            </div>
          </div>

          {/* Interactive Stars */}
          {stars.map(
              (star) =>
                  !star.found && (
                      <div
                          key={star.id}
                          className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
                          style={{
                            top: `${star.top}%`,
                            left: `${star.left}%`,
                          }}
                      >
                        <button
                            onClick={() => handleStarClick(star.id)}
                            className={`relative transition-all duration-300 ${
                                clickedStars.has(star.id) ? "animate-bounce scale-150" : "hover:scale-110 animate-pulse"
                            }`}
                            disabled={clickedStars.has(star.id)}
                        >
                          <Star
                              className={`w-6 h-6 text-yellow-500 fill-yellow-400 cursor-pointer drop-shadow-lg transition-all duration-500 ${
                                  clickedStars.has(star.id) ? "animate-spin scale-150 opacity-50" : ""
                              }`}
                          />

                          {/* 클릭 시 반짝이는 효과 */}
                          {clickedStars.has(star.id) && (
                              <>
                                {/* 중앙 폭발 효과 */}
                                <div className="absolute inset-0 animate-ping">
                                  <Star className="w-6 h-6 text-yellow-300 fill-yellow-200 opacity-75" />
                                </div>

                                {/* 파티클 효과 */}
                                <div className="absolute inset-0 pointer-events-none">
                                  {[...Array(12)].map((_, i) => (
                                      <div
                                          key={i}
                                          className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-ping"
                                          style={{
                                            top: "50%",
                                            left: "50%",
                                            transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-${20 + i * 2}px)`,
                                            animationDelay: `${i * 0.05}s`,
                                            animationDuration: "0.8s",
                                          }}
                                      />
                                  ))}
                                </div>

                                {/* 원형 확산 효과 */}
                                <div className="absolute inset-0 animate-ping opacity-30">
                                  <div className="w-12 h-12 border-2 border-yellow-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2"></div>
                                </div>
                              </>
                          )}
                        </button>
                      </div>
                  ),
          )}
        </div>

        {/* Right Sidebar - 데스크톱에서만 표시 */}
        <div className="hidden lg:block fixed right-4 top-1/2 transform -translate-y-1/2 space-y-2 z-10">
          <div className="bg-white rounded-lg shadow-lg p-2 space-y-2">
            <Button variant="ghost" size="sm" className="w-full text-xs flex flex-col items-center p-2">
              <Search className="w-4 h-4 mb-1" />
              부가서비스
            </Button>
            <Button variant="ghost" size="sm" className="w-full text-xs flex flex-col items-center p-2">
              <Plane className="w-4 h-4 mb-1" />
              예약조회
            </Button>
            <Button variant="ghost" size="sm" className="w-full text-xs flex flex-col items-center p-2">
              <Calendar className="w-4 h-4 mb-1" />
              체크인
            </Button>
            <Button variant="ghost" size="sm" className="w-full text-xs flex flex-col items-center p-2">
              <Users className="w-4 h-4 mb-1" />
              공항이용팁
            </Button>
          </div>
        </div>

        {/* Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="sm:max-w-md bg-red-50 border-red-200">
            <DialogHeader>
              <DialogTitle className="text-center text-xl leading-relaxed whitespace-pre-line text-red-800">
                {modalContent}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-4 py-4">
              {foundStars === 2 && !showCoupon && (
                  <Button
                      onClick={handleCouponCheck}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 shadow-lg"
                  >
                    별똥별 확인하기
                  </Button>
              )}

              {showCoupon && selectedCoupon && (
                  <div className="text-center space-y-4">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-lg">
                      <h3 className="text-xl font-bold mb-2">{selectedCoupon.name}</h3>
                      <p className="text-sm">{selectedCoupon.description}</p>
                    </div>
                    <Button
                        onClick={handleGoToCoupons}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 shadow-lg"
                    >
                      별 주으러 가기
                    </Button>
                  </div>
              )}

              {foundStars < 2 && (
                  <Button
                      onClick={() => setShowModal(false)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold border-0"
                  >
                    닫기
                  </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
  )
}
