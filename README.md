# FinGuard-Client
클라이언트
2025-06-19 현재까지의 흐름도

App.tsx
│
├── NavigationContainer (앱 전체 라우팅 설정)
│   ├── Home (→ HomeScreen)
│   └── AccountDetail (→ AccountDetailScreen)
│
├── HomeScreen
│   ├── AccountCard.tsx
│   └── SendMoneyButton.tsx → navigation.navigate('AccountDetail')
│
└── AccountDetailScreen
    ├── BackButton (←)
    ├── 잔액, 계좌번호
    ├── 거래내역
    └── 채우기 / 보내기 버튼
