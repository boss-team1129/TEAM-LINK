const TEAM_LINK_PRODUCTION_API_URL = "https://script.google.com/macros/s/AKfycby4CcCqDlANs3iq3E0dX7e9DRiCsYLXr5M3ntz-IPw5i2HlOVtogLu78MPCw8Sjz1-b/exec";
const TEAM_LINK_API_URL = window.TEAM_LINK_API_URL || TEAM_LINK_PRODUCTION_API_URL;
const TEAM_LINK_DATA_MODE = window.TEAM_LINK_DATA_MODE || "production";
const TEAM_LINK_FRONTEND_BUILD = "20260825-booking-response-2";
const TEAM_LINK_FORTUNE_API_URL = window.TEAM_LINK_FORTUNE_API_URL || "https://script.google.com/macros/s/AKfycbwR9K2SUXP5iNuA672g8keF--fMKDChRXTqwh47Q0_MXTZ5c6lfcYozrsaBdxlwDv99eA/exec";
const TEAM_LINK_FORTUNE_DB_ID = window.TEAM_LINK_FORTUNE_DB_ID || (typeof localStorage !== "undefined" ? localStorage.getItem("teamLinkFortuneDbId") : "") || "1zV8nf3lkRqe9blmpg_3ozPkY5C98MwbB8F1PQJQuA-8";
const TEAM_LINK_DATA_SPREADSHEET_ID = window.TEAM_LINK_DATA_SPREADSHEET_ID || "1jMH8hnW1hoqXjgL984Mgw3IJKaW8aOfbI90hzbiLKQM";
const LOUNGE_RELEASE_DATE = "2026-10-01";
const ASSET_VERSION = "20260801-character-hires-1";
const gachaRevealAssetCache = new Map();
const LEGACY_FIXED_PROFILE = Object.freeze({
  memberId: "TL-000001",
  lineUserId: "U-demo-1"
});
const RETIRED_DEVELOPMENT_DRAW_IDS = new Set([
  "GACHA-DRAW-20260804175458-34781B9E"
]);

const STORAGE_KEYS = {
  profile: "teamLinkMemberProfile",
  guestId: "teamLinkGuestId",
  birthDate: "teamLinkBirthDate",
  monthlyGachaDraws: "teamLinkMonthlyGachaDraws",
  monthlyGachaSettings: "teamLinkMonthlyGachaSettings",
  gachaCharacters: "teamLinkGachaCharacters",
  gachaPrizes: "teamLinkGachaPrizes",
  gachaCardHistory: "teamLinkGachaCardHistory",
  gachaTestLog: "teamLinkGachaTestLog",
  gachaAdminRewards: "teamLinkGachaAdminRewards",
  collectionRewards: "teamLinkCollectionRewards",
  myCoupons: "teamLinkMyCoupons",
  mySelections: "teamLinkMySelections",
  loungeEntries: "teamLinkLoungeEntries",
  bookings: "teamLinkBookingRequests",
  bookingConsultations: "teamLinkBookingConsultations",
  fortuneHistory: "teamLinkFortuneHistory",
  adminSession: "teamLinkAdminSession",
  members: "teamLinkAdminMembers",
  visitReceptions: "teamLinkVisitReceptions",
  adminNotices: "teamLinkAdminNotices",
  adminCoupons: "teamLinkAdminCoupons",
  adminCouponUsageHistory: "teamLinkAdminCouponUsageHistory",
  adminFortunes: "teamLinkAdminFortunes",
  adminLogs: "teamLinkAdminAuditLogs",
  storeSettings: "teamLinkStoreSettings",
  reservationMenus: "teamLinkReservationMenus"
};

const viewMap = {
  home: "homeView",
  reservation: "reservationView",
  booking: "bookingView",
  bookingDone: "bookingDoneView",
  fortune: "fortuneView",
  coupons: "couponsView",
  gacha: "gachaView",
  mycards: "myCardsView",
  collectionRewards: "collectionRewardsView",
  gachaHistory: "gachaHistoryView",
  lounge: "loungeView",
  loungeRegister: "loungeRegisterView",
  extension: "extensionView",
  products: "productsView",
  mypage: "mypageView",
  admin: "adminView"
};

const appState = {
  currentView: "homeView",
  previousView: "homeView",
  couponCategory: "クーポン",
  lineCouponCategory: "すべて",
  adminCouponFilter: "LINEクーポン",
  todayFortune: null,
  fortuneLoading: false,
  adminTab: "dashboard",
  adminMemberFilter: "all",
  adminMemberQuery: "",
  adminVisitShowHistory: false,
  adminMemberDetailId: "",
  memberChartTab: "basic",
  bookingMenuMode: "regular",
  bookingMenuCategory: "",
  bookingSelectedMenuIds: null,
  bookingSelectedCouponIds: null,
  bookingLineCouponsExpanded: false,
  bookingLineCouponCategory: "すべて",
  bookingValidationVisible: false,
  bookingDraft: null,
  bookingSubmitBusy: false,
  bookingPendingRequestId: "",
  bookingConsultationOpenId: "",
  bookingConsultationBusy: false,
  adminBookingActionBusyId: "",
  adminBookingResponseRequestId: "",
  adminBookingResponseMode: "",
  adminFocusedBookingRequestId: "",
  lineNotificationSettings: null,
  lineNotificationSettingsStatus: "pending",
  lineNotificationSettingsBusy: false,
  bookingNotificationSettings: null,
  bookingNotificationSettingsStatus: "pending",
  bookingNotificationSettingsBusy: false,
  menuMasterSyncStatus: "pending",
  couponMasterSyncStatus: "pending",
  memberCouponSyncStatus: "pending",
  gachaCharacterEditId: "",
  gachaPreviewMode: "card",
  gachaTestRarity: "",
  gachaTestCardId: "",
  gachaChoiceInProgress: false,
  gachaUseConfirmId: "",
  gachaUseConfirmBusy: false,
  gachaTestUseConfirmId: "",
  customerCheckInOpen: false,
  customerCheckInBusy: false,
  gachaBinderYear: null,
  adminDataStatus: {
    members: "pending",
    bookings: "pending",
    visits: "pending",
    coupons: "pending",
    gacha: "pending"
  }
};

const LINE_COUPON_CATEGORY_ORDER = ["すべて", "カット", "カラー", "ストレート", "トリートメント", "ヘッドスパ", "エクステ", "その他"];
const LINE_COUPON_CATEGORY_RULES = [
  { category: "ストレート", keywords: ["酸性ストレート", "縮毛矯正", "ストレート", "縮毛"], primary: true },
  { category: "エクステ", keywords: ["エクステ"], primary: true },
  { category: "ヘッドスパ", keywords: ["ヘッドスパ", "スパ"], primary: true },
  { category: "トリートメント", keywords: ["トリートメント", "髪質改善", "ケラチン"] },
  { category: "カラー", keywords: ["白髪染め", "ハイライト", "カラー", "染め"] },
  { category: "カット", keywords: ["カット"] }
];

const memberChartTabs = [
  { key: "basic", label: "基本情報" },
  { key: "visits", label: "来店履歴" },
  { key: "bookings", label: "予約履歴" },
  { key: "coupons", label: "クーポン" },
  { key: "gacha", label: "ガチャ" },
  { key: "lounge", label: "ご縁ラウンジ" },
  { key: "memos", label: "管理メモ" },
  { key: "logs", label: "操作履歴" }
];

const defaultProfile = {
  memberId: "",
  guestId: "",
  identityType: "guest",
  lineUserId: "",
  memberToken: "",
  nickname: "お客様",
  lastVisitDate: "",
  visitCount: 0,
  nextReservation: null,
  preferredStaff: "boss-muramatsu",
  rank: "PRIVATE"
};

const defaultStoreSettings = {
  shopName: "TEAM hair",
  hotpepperReservationUrl: "https://beauty.hotpepper.jp/slnH000373243/",
  businessHours: {
    start: "09:00",
    end: "18:00"
  },
  bookingTimeInterval: 30,
  closedWeekdays: [1],
  staff: [
    { staffId: "boss-muramatsu", name: "村松剛好", isReservable: true, sortOrder: 1 },
    { staffId: "kanda-kana", name: "神田加奈", isReservable: true, sortOrder: 2 },
    { staffId: "matsumoto-ai", name: "松本藍", isReservable: true, sortOrder: 3 },
    { staffId: "no-preference", name: "指名なし", isReservable: true, sortOrder: 90 },
    { staffId: "consult", name: "相談したい", isReservable: true, sortOrder: 99 }
  ],
  reservationSources: ["Hot Pepper", "TEAM LINK相談", "LINEチャット", "電話", "店頭次回予約", "その他"]
};

const defaultReservationMenus = [
  {
    menuId: "regular-cut",
    type: "通常メニュー",
    title: "カット",
    description: "似合わせと扱いやすさを整えます。",
    regularPrice: 5500,
    couponPrice: 0,
    durationMinutes: 60,
    targetStaff: ["boss-muramatsu", "kanda-kana", "matsumoto-ai", "no-preference"],
    targetWeekdays: [0, 2, 3, 4, 5, 6],
    condition: "",
    publishStartAt: "2026-07-01",
    publishEndAt: "",
    isPublic: true,
    sortOrder: 10,
    isRecommended: false,
    imageUrl: "",
    updatedAt: "2026-07-30"
  },
  {
    menuId: "regular-color",
    type: "通常メニュー",
    title: "カラー",
    description: "透明感カラー、白髪ぼかしなど相談できます。",
    regularPrice: 8800,
    couponPrice: 0,
    durationMinutes: 120,
    targetStaff: ["boss-muramatsu", "kanda-kana", "matsumoto-ai", "no-preference"],
    targetWeekdays: [0, 2, 3, 4, 5, 6],
    condition: "ロング料金は店舗確認後に確定します",
    publishStartAt: "2026-07-01",
    publishEndAt: "",
    isPublic: true,
    sortOrder: 20,
    isRecommended: true,
    imageUrl: "",
    updatedAt: "2026-07-30"
  },
  {
    menuId: "regular-treatment",
    type: "通常メニュー",
    title: "トリートメント",
    description: "髪の状態に合わせて質感を整えます。",
    regularPrice: 6600,
    couponPrice: 0,
    durationMinutes: 60,
    targetStaff: ["boss-muramatsu", "kanda-kana", "matsumoto-ai", "no-preference"],
    targetWeekdays: [0, 2, 3, 4, 5, 6],
    condition: "",
    publishStartAt: "2026-07-01",
    publishEndAt: "",
    isPublic: true,
    sortOrder: 30,
    isRecommended: false,
    imageUrl: "",
    updatedAt: "2026-07-30"
  },
  {
    menuId: "regular-acid-straight",
    type: "通常メニュー",
    title: "酸性ストレート",
    description: "クセや広がりを自然に整えたい方へ。",
    regularPrice: 22000,
    couponPrice: 0,
    durationMinutes: 210,
    targetStaff: ["boss-muramatsu", "no-preference", "consult"],
    targetWeekdays: [0, 2, 3, 4, 5, 6],
    condition: "髪の状態により施術できない場合があります",
    publishStartAt: "2026-07-01",
    publishEndAt: "",
    isPublic: true,
    sortOrder: 40,
    isRecommended: false,
    imageUrl: "",
    updatedAt: "2026-07-30"
  }
];

const defaultManagedCoupons = [
  {
    couponId: "COUPON-500-OFF",
    title: "500円OFF",
    description: "施術会計で使える基本クーポンです。",
    imageUrl: "",
    couponType: "全会員向けクーポン",
    category: "おすすめ",
    regularPrice: 0,
    couponPrice: 0,
    discountAmount: 500,
    discountRate: 0,
    targetMenu: "全メニュー",
    targetStaff: ["all"],
    targetWeekdays: [0, 2, 3, 4, 5, 6],
    condition: "1会計につき1枚利用できます",
    publishStartAt: "2026-07-01",
    publishEndAt: "2026-12-31",
    validStartAt: "2026-07-01",
    validUntil: "2026-12-31",
    perUserLimit: 1,
    canCombine: false,
    selectableOnBooking: true,
    isRecommended: true,
    isPublic: true,
    sortOrder: 10,
    source: "Console作成",
    autoGrantCondition: "",
    status: "公開",
    createdAt: "2026-07-30T00:00:00+09:00",
    updatedAt: "2026-07-30T00:00:00+09:00"
  },
  {
    couponId: "COUPON-1000-OFF",
    title: "1,000円OFF",
    description: "特別なご案内時に使える割引クーポンです。",
    imageUrl: "",
    couponType: "LINE限定クーポン",
    category: "LINE限定",
    regularPrice: 0,
    couponPrice: 0,
    discountAmount: 1000,
    discountRate: 0,
    targetMenu: "全メニュー",
    targetStaff: ["all"],
    targetWeekdays: [0, 2, 3, 4, 5, 6],
    condition: "LINE画面提示で利用できます",
    publishStartAt: "2026-07-01",
    publishEndAt: "2026-12-31",
    validStartAt: "2026-07-01",
    validUntil: "2026-12-31",
    perUserLimit: 1,
    canCombine: false,
    selectableOnBooking: true,
    isRecommended: false,
    isPublic: true,
    sortOrder: 20,
    source: "Console作成",
    autoGrantCondition: "",
    status: "公開",
    createdAt: "2026-07-30T00:00:00+09:00",
    updatedAt: "2026-07-30T00:00:00+09:00"
  },
  {
    couponId: "COUPON-TREATMENT-UPGRADE",
    title: "トリートメントアップグレード",
    description: "通常トリートメントをワンランク上の質感へ。",
    imageUrl: "",
    couponType: "ガチャ当選クーポン",
    category: "ガチャ当選",
    regularPrice: 3300,
    couponPrice: 0,
    discountAmount: 3300,
    discountRate: 0,
    targetMenu: "トリートメント",
    targetStaff: ["all"],
    targetWeekdays: [0, 2, 3, 4, 5, 6],
    condition: "施術メニューと併用",
    publishStartAt: "2026-07-01",
    publishEndAt: "",
    validStartAt: "2026-07-01",
    validUntil: endOfMonthDateKey(),
    perUserLimit: 1,
    canCombine: false,
    selectableOnBooking: true,
    isRecommended: true,
    isPublic: true,
    sortOrder: 30,
    source: "ガチャ",
    autoGrantCondition: "ガチャ景品当選時",
    status: "公開",
    createdAt: "2026-07-30T00:00:00+09:00",
    updatedAt: "2026-07-30T00:00:00+09:00"
  },
  {
    couponId: "COUPON-HAIR-REPAIR-FREE",
    title: "髪質改善トリートメント無料",
    description: "今月の特賞として使える上質ケアクーポンです。",
    imageUrl: "",
    couponType: "ガチャ当選クーポン",
    category: "ガチャ当選",
    regularPrice: 8800,
    couponPrice: 0,
    discountAmount: 8800,
    discountRate: 0,
    targetMenu: "髪質改善",
    targetStaff: ["all"],
    targetWeekdays: [0, 2, 3, 4, 5, 6],
    condition: "施術予約時にスタッフへ提示",
    publishStartAt: "2026-07-01",
    publishEndAt: "",
    validStartAt: "2026-07-01",
    validUntil: endOfMonthDateKey(),
    perUserLimit: 1,
    canCombine: false,
    selectableOnBooking: true,
    isRecommended: true,
    isPublic: true,
    sortOrder: 40,
    source: "ガチャ",
    autoGrantCondition: "SSRカード当選時",
    status: "公開",
    createdAt: "2026-07-30T00:00:00+09:00",
    updatedAt: "2026-07-30T00:00:00+09:00"
  },
  {
    couponId: "COUPON-BIRTHDAY-500",
    title: "誕生日500円OFF",
    description: "お誕生日月に使えるお祝いクーポンです。",
    imageUrl: "",
    couponType: "誕生日クーポン",
    category: "誕生日",
    regularPrice: 0,
    couponPrice: 0,
    discountAmount: 500,
    discountRate: 0,
    targetMenu: "全メニュー",
    targetStaff: ["all"],
    targetWeekdays: [0, 2, 3, 4, 5, 6],
    condition: "誕生日月のみ利用できます",
    publishStartAt: "2026-07-01",
    publishEndAt: "",
    validStartAt: "2026-07-01",
    validUntil: "2026-12-31",
    perUserLimit: 1,
    canCombine: false,
    selectableOnBooking: true,
    isRecommended: false,
    isPublic: true,
    sortOrder: 50,
    source: "誕生日",
    autoGrantCondition: "誕生日月",
    status: "公開",
    createdAt: "2026-07-30T00:00:00+09:00",
    updatedAt: "2026-07-30T00:00:00+09:00"
  },
  {
    couponId: "COUPON-WED-THU-COLOR-TREATMENT",
    title: "水木カラー＆トリートメント",
    description: "水曜・木曜限定でカラーとケアをゆっくり相談できます。",
    imageUrl: "",
    couponType: "全会員向けクーポン",
    category: "カラー",
    regularPrice: 14300,
    couponPrice: 11800,
    discountAmount: 2500,
    discountRate: 0,
    targetMenu: "カラー",
    targetStaff: ["all"],
    targetWeekdays: [3, 4],
    condition: "水曜・木曜限定",
    publishStartAt: "2026-07-01",
    publishEndAt: "2026-12-31",
    validStartAt: "2026-07-01",
    validUntil: "2026-12-31",
    perUserLimit: 3,
    canCombine: false,
    selectableOnBooking: true,
    isRecommended: true,
    isPublic: true,
    sortOrder: 60,
    source: "Console作成",
    autoGrantCondition: "",
    status: "公開",
    createdAt: "2026-07-30T00:00:00+09:00",
    updatedAt: "2026-07-30T00:00:00+09:00"
  },
  {
    couponId: "COUPON-COLLECTION-6-500",
    title: "年間6枚達成クーポン",
    description: "年間カードを6枚集めた方への達成特典です。",
    imageUrl: "",
    couponType: "年間カードコレクション特典",
    category: "年間特典",
    regularPrice: 0,
    couponPrice: 0,
    discountAmount: 500,
    discountRate: 0,
    targetMenu: "全メニュー",
    targetStaff: ["all"],
    targetWeekdays: [0, 2, 3, 4, 5, 6],
    condition: "年間6枚達成者限定",
    publishStartAt: "2026-07-01",
    publishEndAt: "",
    validStartAt: "2026-07-01",
    validUntil: `${currentYear()}-12-31`,
    perUserLimit: 1,
    canCombine: false,
    selectableOnBooking: true,
    isRecommended: true,
    isPublic: true,
    sortOrder: 70,
    source: "年間特典",
    autoGrantCondition: "年間カード6枚達成",
    status: "公開",
    createdAt: "2026-07-30T00:00:00+09:00",
    updatedAt: "2026-07-30T00:00:00+09:00"
  }
];

const rarityMeta = {
  UR: { label: "アルティメットレア", icon: "✺", tone: "ur" },
  SSR: { label: "激レア", icon: "✦", tone: "ssr" },
  SR: { label: "超レア", icon: "◆", tone: "sr" },
  R: { label: "レア", icon: "◇", tone: "r" },
  N: { label: "ノーマル", icon: "○", tone: "n" }
};

const defaultGachaRarityRates = { UR: 1, SSR: 4, SR: 10, R: 25, N: 60 };

const defaultGachaCharacters = [
  ["character-01", "01", "リンクキング", "UR", "TEAM LINKの王様。ご縁のすべてをつなぐ最強の存在。", "全運UP", "奇跡を起こす／最強運"],
  ["character-02", "02", "縁狐（えにしぎつね）", "SSR", "ご縁を運ぶ白狐", "来店運UP", "良い出会い／幸運"],
  ["character-03", "03", "鳳凰アカリ", "SSR", "新しい人生のスタート", "飛躍運UP", "チャンス到来／再生"],
  ["character-04", "04", "水晶龍ルミア", "SR", "夢を叶える小さな龍", "成功運UP", "夢実現／願望成就"],
  ["character-05", "05", "月うさぎ モチ", "SR", "月から幸運を運ぶうさぎ", "恋愛運UP", "人間関係運UP／癒し"],
  ["character-06", "06", "桜の妖精サクラ", "SR", "出会いと別れを見守る妖精", "縁結び", "新しい出会い／魅力UP"],
  ["character-07", "07", "太陽の精霊ソル", "SR", "元気と勇気をくれる精霊", "活力UP", "ポジティブ運UP／勇気"],
  ["character-08", "08", "クローバー精霊クロ", "R", "幸せを運ぶ四つ葉の精霊", "幸運UP", "全運UP／願い事成就"],
  ["character-09", "09", "星の案内人ステラ", "R", "未来を照らす星の使者", "直感力UP", "願いサポート／希望"],
  ["character-10", "10", "月の精霊ルナ", "R", "心を癒す月の精霊", "癒し", "安心／直感力UP"],
  ["character-11", "11", "愛結びリリー", "R", "恋愛を結ぶ精霊", "恋愛運UP", "良縁／愛情運UP"],
  ["character-12", "12", "宝石の妖精ジュエル", "R", "美しさを引き出す妖精", "魅力UP", "自信UP／美容運UP"],
  ["character-13", "13", "幸運の天使エル", "R", "幸せを届ける天使", "全体運UP", "守護／幸福"],
  ["character-14", "14", "願い龍カナタ", "R", "願いを届けるドラゴン", "願望成就", "サポート／成長"],
  ["character-15", "15", "風の子フウ", "N", "自由を運ぶ子", "行動力UP", "自由運／リフレッシュ"],
  ["character-16", "16", "森のこもりん", "N", "森に住むこぐま", "癒し", "安心／健康運UP"],
  ["character-17", "17", "花のミミィ", "N", "花畑に住むうさぎ", "優しさUP", "愛され運"],
  ["character-18", "18", "みつばちハッチ", "N", "一生懸命な働き者", "努力運UP", "仕事運UP"],
  ["character-19", "19", "しずくん", "N", "涙を幸せに変える", "浄化", "リラックス／癒し"],
  ["character-20", "20", "雲のモコ", "N", "ふわふわの癒し", "癒し", "安心／安定運UP"],
  ["character-21", "21", "ひかりちゃん", "N", "小さな光の精", "希望", "直感力UP／運気上昇"],
  ["character-22", "22", "リボンちゃん", "N", "縁を結ぶリボン", "縁結び", "仲良し運UP"],
  ["character-23", "23", "風船プカ", "N", "夢を運ぶ風船", "希望UP", "ワクワク／想像力UP"],
  ["character-24", "24", "木の実クルミ", "N", "実りを運ぶリス", "豊かさ", "実り／金運UP"],
  ["character-25", "25", "音符ノン", "N", "音楽を届ける妖精", "楽しさ", "表現力UP"],
  ["character-26", "26", "ゆきんこユキ", "N", "雪のように純粋", "純粋さUP", "浄化／リセット"],
  ["character-27", "27", "ほしぴょん", "N", "星を集めるうさぎ", "願いサポート", "チャンス運UP"],
  ["character-28", "28", "まもりん", "N", "みんなを守る守護精霊", "守護", "安心／安全運UP"],
  ["character-29", "29", "福まる", "N", "福を呼ぶまんまる精霊", "福運UP", "開運／幸運"],
  ["character-30", "30", "えがおちゃん", "N", "笑顔を増やす妖精", "笑顔運UP", "ポジティブ／人間関係UP"]
].map(([characterId, cardNo, name, rarity, intro, effectName, effectDescription], index) => ({
  characterId,
  cardNo,
  name,
  rarity,
  imagePath: `images/gacha/characters/${characterId}.png`,
  imageUrl: "",
  intro,
  effectName,
  effectDescription,
  currentPrizeId: index === 0 ? "prize-1000-off" : index < 3 ? "prize-treatment-ticket" : index < 7 ? "prize-500-off" : index < 14 ? "prize-carbonated-spa" : "prize-100-off",
  isDrawable: true,
  isPublic: true,
  sortOrder: index + 1,
  weight: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}));

const defaultGachaPrizes = [
  { prizeId: "prize-1000-off", title: "1,000円OFF", description: "施術会計で使える特別クーポンです。", discountAmount: 1000, discountRate: 0, targetMenu: "全メニュー", minimumAmount: 0, validDays: 35, condition: "1会計につき1枚。現金交換不可。", canCombine: false, usageLimit: 1, requiresUseConfirmation: true, isPublic: true, sortOrder: 1 },
  { prizeId: "prize-treatment-ticket", title: "トリートメントチケット", description: "髪の質感を整えるケア特典です。", discountAmount: 3300, discountRate: 0, targetMenu: "トリートメント", minimumAmount: 0, validDays: 35, condition: "施術メニューと併用できます。", canCombine: false, usageLimit: 1, requiresUseConfirmation: true, isPublic: true, sortOrder: 2 },
  { prizeId: "prize-500-off", title: "500円OFF", description: "次回施術で使えるベーシック特典です。", discountAmount: 500, discountRate: 0, targetMenu: "全メニュー", minimumAmount: 0, validDays: 35, condition: "1会計につき1枚。", canCombine: false, usageLimit: 1, requiresUseConfirmation: true, isPublic: true, sortOrder: 3 },
  { prizeId: "prize-carbonated-spa", title: "炭酸泉無料", description: "頭皮と髪をすっきり整える人気ケアです。", discountAmount: 1100, discountRate: 0, targetMenu: "炭酸泉", minimumAmount: 0, validDays: 35, condition: "施術予約時に利用できます。", canCombine: true, usageLimit: 1, requiresUseConfirmation: true, isPublic: true, sortOrder: 4 },
  { prizeId: "prize-bang-cut", title: "前髪カット無料", description: "次回来店時の前髪メンテナンスに使えます。", discountAmount: 1100, discountRate: 0, targetMenu: "前髪カット", minimumAmount: 0, validDays: 35, condition: "前髪カットのみ対象。", canCombine: false, usageLimit: 1, requiresUseConfirmation: true, isPublic: true, sortOrder: 5 },
  { prizeId: "prize-product-5", title: "店販商品5％OFF", description: "ホームケア商品を少しお得に選べます。", discountAmount: 0, discountRate: 5, targetMenu: "店販商品", minimumAmount: 0, validDays: 35, condition: "一部商品対象外。", canCombine: false, usageLimit: 1, requiresUseConfirmation: true, isPublic: true, sortOrder: 6 },
  { prizeId: "prize-100-off", title: "100円OFF", description: "小さなラッキーとして使える参加特典です。", discountAmount: 100, discountRate: 0, targetMenu: "全メニュー", minimumAmount: 0, validDays: 35, condition: "1会計につき1枚。", canCombine: false, usageLimit: 1, requiresUseConfirmation: true, isPublic: true, sortOrder: 7 },
  { prizeId: "prize-advice", title: "美容アドバイス", description: "今日の髪に合わせたワンポイントアドバイスです。", discountAmount: 0, discountRate: 0, targetMenu: "なし", minimumAmount: 0, validDays: 35, condition: "コレクション用カードです。", canCombine: true, usageLimit: 1, requiresUseConfirmation: false, isPublic: true, sortOrder: 8 }
];

const defaultMonthlyGachaSettings = [
  {
    issueMonth: currentMonthKey(),
    title: `${formatMonthLabel(currentMonthKey())}レアキャラクターガチャ`,
    description: "月に1枚、TEAM LINKのキャラクターカードを獲得できます。",
    status: "公開",
    startAt: `${currentMonthKey()}-01`,
    endAt: endOfMonthDateKey(),
    isTestMode: true,
    rarityRates: { ...defaultGachaRarityRates },
    cards: buildDefaultMonthlyGachaCards()
  }
];

const defaultCollectionRewards = [
  { rewardId: "reward-n-5", year: currentYear(), requiredCount: 5, requiredRarity: "N", title: "Nカード5枚特典", description: "Nを5枚集めた方への小さなケア特典。", imageUrl: "", validUntil: `${currentYear()}-12-31`, targetMembers: "全会員", isPublic: true, autoGrant: false, issueAsCoupon: false, handoffAtShop: true, repeatable: false, status: "公開" },
  { rewardId: "reward-r-5", year: currentYear(), requiredCount: 5, requiredRarity: "R", title: "Rカード5枚特典", description: "Rを5枚集めた方への500円クーポン。", imageUrl: "", validUntil: `${currentYear()}-12-31`, targetMembers: "全会員", isPublic: true, autoGrant: true, issueAsCoupon: true, handoffAtShop: false, repeatable: false, status: "公開" },
  { rewardId: "reward-sr-3", year: currentYear(), requiredCount: 3, requiredRarity: "SR", title: "SRカード3枚特典", description: "SRを3枚集めた方への集中ケア特典。", imageUrl: "", validUntil: `${currentYear()}-12-31`, targetMembers: "全会員", isPublic: true, autoGrant: false, issueAsCoupon: false, handoffAtShop: true, repeatable: false, status: "公開" },
  { rewardId: "reward-ssr-2", year: currentYear(), requiredCount: 2, requiredRarity: "SSR", title: "SSRカード2枚特典", description: "SSRを2枚集めた方への特別クーポン。", imageUrl: "", validUntil: `${currentYear()}-12-31`, targetMembers: "全会員", isPublic: true, autoGrant: true, issueAsCoupon: true, handoffAtShop: false, repeatable: false, status: "公開" },
  { rewardId: "reward-ur-1", year: currentYear(), requiredCount: 1, requiredRarity: "UR", title: "UR獲得特典", description: "URを1枚獲得した方へのプレミアム特典。", imageUrl: "", validUntil: `${currentYear()}-12-31`, targetMembers: "全会員", isPublic: true, autoGrant: false, issueAsCoupon: false, handoffAtShop: true, repeatable: false, status: "公開" },
  { rewardId: "reward-all-rarity", year: currentYear(), requiredCount: 1, requiredRarity: "ALL_RARITY", title: "全レアリティ達成特典", description: "UR・SSR・SR・R・Nを1枚以上集めた方への記念特典。", imageUrl: "", validUntil: `${currentYear()}-12-31`, targetMembers: "全会員", isPublic: true, autoGrant: false, issueAsCoupon: false, handoffAtShop: true, repeatable: false, status: "公開" },
  { rewardId: "reward-complete-30", year: currentYear(), requiredCount: 30, requiredRarity: "COMPLETE", title: "30種類コンプリート特典", description: "30種類すべてを集めた方へのスペシャルケア。", imageUrl: "", validUntil: `${currentYear()}-12-31`, targetMembers: "全会員", isPublic: true, autoGrant: false, issueAsCoupon: false, handoffAtShop: true, repeatable: false, status: "公開" }
];

const fortuneTypes = ["土星人", "金星人", "火星人", "天王星人", "木星人", "水星人"];
const luckyColors = ["シャンパンベージュ", "モカブラウン", "パールホワイト", "ローズピンク", "グレージュ", "ディープブラック"];
const fortuneMessages = [
  "焦らず整えるほど、自然に流れが良くなる日。",
  "会話のきっかけを少し増やすと、嬉しい予定につながりそう。",
  "新しいものを試すより、今ある魅力を磨くと吉。",
  "小さな決断が一日を軽くしてくれる日。",
  "予定を詰めすぎず、余白を残すと運が整います。",
  "自分の気分を大切にすると、人にも優しくできる日。"
];

const TEAM_FORTUNE_LUCK_LABELS = {
  1: { internal: "種子", title: "芽吹き", theme: "新しい流れが静かに始まるとき", todayMessage: "小さな一歩が、これからの流れを変えていく日。気になっていたことを始めたり、新しい選択をするのに向いています。完璧を求めず、まず動いてみることを大切に。", monthMessage: "新しい流れが芽を出し始める月。新しい出会いや挑戦に目を向けることで、未来につながるきっかけが生まれそうです。小さな変化を楽しみながら進んでみて。", yearMessage: "新しい12の流れが始まる一年。これまでとは違う道を選んだり、新しいことを始めることで運が動き始めます。すぐに結果を求めず、未来の種を蒔く気持ちで進みましょう。", recommendedAction: "新しいことを始める・出会いを広げる・目標を決める", caution: "最初から大きな結果を求めすぎない" },
  2: { internal: "緑生", title: "若葉", theme: "芽生えた可能性をゆっくり育てるとき", todayMessage: "今あるものを少しずつ育てていく日。新しいことを増やすより、始めたことを丁寧に続けることで流れが整います。小さな成長を見逃さないで。", monthMessage: "これまで始めたことが少しずつ形になっていく月。人とのつながりや新しい習慣を大切に育てることで、未来の可能性が広がっていきます。", yearMessage: "未来につながる土台を育てる一年。仕事も恋も人間関係も、焦らず時間をかけるほど大きな力になっていきます。結果より成長を楽しむことが運を育てます。", recommendedAction: "継続する・学ぶ・人との縁を育てる", caution: "結果を急いで途中で投げ出さない" },
  3: { internal: "立花", title: "花開き", theme: "自分らしい魅力が表へ現れるとき", todayMessage: "あなたの魅力が自然と伝わりやすい日。遠慮せず、自分の考えや個性を表に出してみて。人との会話から嬉しい展開が生まれることも。", monthMessage: "自分らしさを外へ表現することで運が広がる月。仕事でも恋愛でも、あなた自身の魅力を隠さないことが大切です。人前に出ることにも追い風があります。", yearMessage: "これまで育ててきたものが花開き始める一年。自分の才能や魅力を周囲に見せることで、新しい評価や縁につながります。遠慮せず自分らしく輝いて。", recommendedAction: "発信する・人に会う・自分を表現する", caution: "周囲に合わせすぎて自分らしさを失わない" },
  4: { internal: "健弱", title: "月隠れ", theme: "少し速度を落として自分を整えるとき", todayMessage: "今日は頑張りすぎないことも大切。いつもより疲れを感じたら、無理に進まず自分をいたわって。静かな時間が心と流れを整えてくれます。", monthMessage: "心と身体のメンテナンスを意識したい月。予定を詰め込みすぎず、休む時間も大切な予定のひとつとして考えてみて。整えることで次の流れが軽くなります。", yearMessage: "自分自身を整えながら進む一年。無理を重ねるより、生活・体調・気持ちのバランスを見直すことで運の流れが安定します。休むことも前進のひとつです。", recommendedAction: "休息・生活を整える・自分の時間をつくる", caution: "無理を重ねて頑張りすぎない" },
  5: { internal: "達成", title: "満月", theme: "積み重ねてきたものが実りやすいとき", todayMessage: "これまでの努力が形になりやすい日。自信を持って一歩前へ出てみて。迷っていたことにも答えが見つかりやすくなりそうです。", monthMessage: "大きく動くチャンスが訪れやすい月。仕事・恋愛・人間関係など、これまで積み重ねてきたものに結果が現れる可能性があります。思い切った行動も吉。", yearMessage: "12の流れの中でも大きな実りを受け取りやすい一年。努力してきたことに結果が現れ、新しいステージへ進む機会も増えていきます。チャンスが来たら自信を持って掴んで。", recommendedAction: "挑戦する・決断する・チャンスを掴む", caution: "勢いだけで周囲への配慮を忘れない" },
  6: { internal: "乱気", title: "揺らぎ", theme: "心の波を整えながら進むとき", todayMessage: "気持ちが揺れやすい日。今日は無理に答えを決めなくても大丈夫です。少し時間を置くことで、本当に大切なものが見えてきそう。", monthMessage: "予定や気持ちに変化が起こりやすい月。思い通りにならないときほど、無理に流れを変えようとせず柔軟に。心に余白をつくることを意識して。", yearMessage: "変化の波と上手につき合うことがテーマの一年。感情だけで大きな決断をせず、一度立ち止まって考える時間を持つことで流れを整えられます。", recommendedAction: "余白をつくる・冷静に考える・予定に余裕を持つ", caution: "感情だけで大きな決断をしない" },
  7: { internal: "再会", title: "巡り逢い", theme: "過去と未来の縁が再びつながるとき", todayMessage: "人との縁から新しい流れが生まれそうな日。久しぶりの人に連絡したり、以前諦めたことにもう一度向き合うのもおすすめです。", monthMessage: "懐かしい人や過去の経験が、今のあなたにつながってくる月。一度離れたものとの再接続が、新しい可能性を運んでくれるかもしれません。", yearMessage: "縁が巡り、再びつながっていく一年。過去に出会った人、諦めた夢、途中になっていたことが新しい形で戻ってくる可能性があります。二度目のチャンスを大切に。", recommendedAction: "再挑戦・連絡する・昔の縁を大切にする", caution: "過去に執着しすぎない" },
  8: { internal: "財成", title: "豊穣", theme: "積み重ねが豊かさへ変わるとき", todayMessage: "努力が目に見える形につながりやすい日。仕事やお金に関することを整理したり、未来のための計画を立てるのにも向いています。", monthMessage: "成果や豊かさを受け取りやすい月。これまで積み重ねてきたことが、評価・収入・仕事など現実的な形につながる可能性があります。", yearMessage: "努力してきたものを豊かさへ変えていく一年。仕事やお金だけでなく、人との縁や経験も大きな財産になっていきます。得たものを上手に育てる意識を持って。", recommendedAction: "仕事を進める・貯蓄・将来への投資・成果を受け取る", caution: "目先の利益だけを追いかけない" },
  9: { internal: "安定", title: "凪", theme: "穏やかな流れの中で幸せを味わうとき", todayMessage: "心穏やかに過ごせそうな日。無理に何かを変えようとせず、今ある幸せや人との時間を楽しんで。自然体でいるほど流れが整います。", monthMessage: "生活や人間関係が落ち着きやすい月。大きな刺激を求めるより、今ある環境を大切にすることで心地よい時間が増えていきます。", yearMessage: "これまで築いてきたものをゆっくり味わう一年。仕事・恋愛・生活などが安定しやすく、穏やかな幸せを感じる時間が増えていきます。今あるものへの感謝が次の運を育てます。", recommendedAction: "大切な人と過ごす・生活を楽しむ・感謝する", caution: "安定に慣れて変化を恐れすぎない" },
  10: { internal: "陰影", title: "宵闇", theme: "静かに流れを見つめ、自分の内側を整えるとき", todayMessage: "今日は無理に答えを出そうとせず、少し静かに流れを見る日。大きな決断より、整理や見直しに向いています。焦らず自分のペースを大切に。", monthMessage: "前へ進むことより、足元を整えることを大切にしたい月。予定や人間関係を見直すことで、次の流れが少しずつ見えてきます。", yearMessage: "表立って大きく動くより、内側を整える一年。焦らず準備を重ねることで、この先に訪れる変化に強くなれます。今は未来のための静かな準備期間です。", recommendedAction: "整理・見直し・休息・準備", caution: "焦って大きな結論を出さない" },
  11: { internal: "停止", title: "冬籠り", theme: "動くより力を蓄え、守りを大切にするとき", todayMessage: "今日は無理に前へ進もうとしなくて大丈夫。予定を詰め込みすぎず、自分の時間と心を守ることを優先して。静かに過ごすほど気持ちが整います。", monthMessage: "大きく広げるより、守ることを意識したい月。新しい挑戦を増やすより、今あるものを整えながら力を蓄えていきましょう。", yearMessage: "一度立ち止まり、自分の土台を守る一年。無理に結果を求めるより、生活・仕事・人間関係を整理しながら次の季節への力を蓄えることが大切です。", recommendedAction: "休む・守る・整理する・無理を減らす", caution: "無理な拡大・衝動的な決断を避ける" },
  12: { internal: "減退", title: "夜明け前", theme: "長い夜を越え、次の始まりを迎える準備のとき", todayMessage: "まだ少し流れが重く感じても、出口は近づいています。今日は焦って動くより、不要なものを手放しながら次への準備を。小さな希望を大切にして。", monthMessage: "ひとつの流れが終わり、新しい始まりへ向かう準備の月。人間関係や習慣、考え方など、もう必要のないものを整理すると次の流れが入りやすくなります。", yearMessage: "古い流れを手放し、新しい12の流れへ向かう一年。すぐに答えが見えなくても、少しずつ夜は明けていきます。不要なものを整理しながら、次の「芽吹き」を迎える準備をしましょう。", recommendedAction: "手放す・整理する・振り返る・次の準備をする", caution: "終わったことに執着しすぎない" }
};

// LuckCycle.starRating に基づく表示専用評価。占い計算には使用しない。
const TEAM_FORTUNE_RATING_BY_INTERNAL = Object.freeze({
  "種子": { rating: 4, ratingLabel: "好調" },
  "緑生": { rating: 4, ratingLabel: "好調" },
  "立花": { rating: 5, ratingLabel: "絶好調" },
  "健弱": { rating: 2, ratingLabel: "慎重" },
  "達成": { rating: 5, ratingLabel: "絶好調" },
  "乱気": { rating: 2, ratingLabel: "慎重" },
  "再会": { rating: 4, ratingLabel: "好調" },
  "財成": { rating: 5, ratingLabel: "絶好調" },
  "安定": { rating: 5, ratingLabel: "絶好調" },
  "陰影": { rating: 1, ratingLabel: "低調" },
  "停止": { rating: 1, ratingLabel: "低調" },
  "減退": { rating: 2, ratingLabel: "慎重" }
});

const TEAM_FORTUNE_LUCK_BY_CYCLE = Object.entries(TEAM_FORTUNE_LUCK_LABELS).reduce((map, [cycleIndex, item]) => {
  map[cycleIndex] = { ...item, ...(TEAM_FORTUNE_RATING_BY_INTERNAL[item.internal] || {}) };
  return map;
}, {});

const TEAM_FORTUNE_LUCK_BY_INTERNAL = Object.values(TEAM_FORTUNE_LUCK_BY_CYCLE).reduce((map, item) => {
  map[item.internal] = item;
  return map;
}, {});

const teamFortuneSessionCache = new Map();
const teamFortuneCompatibilitySessionCache = new Map();
let teamFortuneLoadingTimer = null;

const adminUsers = {
  boss: { adminId: "boss", name: "村松 剛好", role: "admin", label: "管理者" },
  "staff-kanda": { adminId: "staff-kanda", name: "神田 加奈", role: "staff", label: "スタッフ" }
};
const ADMIN_PASSCODE = "0000";
const ADMIN_SESSION_VERSION = 2;
const ADMIN_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const adminTabs = [
  { key: "dashboard", label: "管理トップ" },
  { key: "bookings", label: "予約管理" },
  { key: "visits", label: "来店確認" },
  { key: "coupons", label: "クーポン" },
  { key: "gacha", label: "ガチャ管理" },
  { key: "members", label: "会員管理" },
  { key: "lounge", label: "ご縁ラウンジ" },
  { key: "settings", label: "LINE通知設定" }
];

document.addEventListener("DOMContentLoaded", async () => {
  if (await reloadIfFrontendBuildIsStale()) return;
  const splash = document.getElementById("splashScreen");
  window.setTimeout(() => {
    splash?.classList.add("is-hidden");
  }, 1080);
  ensureDemoState();
  await initializeLinkedIdentityFromUrl();
  applyStoreSettings();
  renderBookingFormOptions();
  bindNavigation();
  bindForms();
  bindBookingFormInputs();
  bindHomeCarousel();
  renderApp();
  openInitialView();
  if (appState.currentView === "adminView" && getAdminSession()) {
    syncProductionAdminSection();
  } else {
    syncProductionState();
  }
});

async function reloadIfFrontendBuildIsStale() {
  try {
    const response = await fetch(`./index.html?build-check=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) return false;
    const html = await response.text();
    const latestBuild = html.match(/app\.js\?v=([^"']+)/)?.[1] || "";
    if (!latestBuild || latestBuild === TEAM_LINK_FRONTEND_BUILD) return false;
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("frontendBuild", latestBuild);
    window.location.replace(nextUrl.toString());
    return true;
  } catch (error) {
    console.warn("[TEAM LINK FRONTEND BUILD CHECK FAILED]", error);
    return false;
  }
}

function bindNavigation() {
  document.body.addEventListener("pointerdown", (event) => {
    const choiceButton = event.target.closest("[data-gacha-action='selectCard']");
    if (!choiceButton || appState.gachaChoiceInProgress || event.button > 0) return;
    choiceButton.dataset.gachaPointerStartedAt = String(performance.now());
    choiceButton.classList.add("is-pressed");
    choiceButton.closest("[data-gacha-choice-stage]")?.classList.add("has-pointer-feedback");
  }, { passive: true });
  document.body.addEventListener("click", (event) => {
    const viewButton = event.target.closest("[data-view]");
    const messageButton = event.target.closest("[data-message]");
    const backButton = event.target.closest("[data-back]");
    const adminTabButton = event.target.closest("[data-admin-tab]");
    const adminActionButton = event.target.closest("[data-admin-action]");
    const bookingDateChoiceButton = event.target.closest("[data-booking-date-choice]");
    const bookingActionButton = event.target.closest("[data-booking-action]");
    const bookingMenuCategoryButton = event.target.closest("[data-booking-menu-category]");
    const bookingLineCouponToggle = event.target.closest("[data-booking-line-coupon-toggle]");
    const bookingLineCouponCategoryButton = event.target.closest("[data-booking-line-coupon-category]");
    const lineCouponCategoryButton = event.target.closest("[data-line-coupon-category]");
    const lineCouponDetailButton = event.target.closest("[data-line-coupon-detail]");
    const gachaActionButton = event.target.closest("[data-gacha-action]");
    const couponActionButton = event.target.closest("[data-coupon-action]");
    const customerCheckInActionButton = event.target.closest("[data-customer-checkin-action]");
    if (customerCheckInActionButton) {
      handleCustomerCheckInAction(customerCheckInActionButton.dataset.customerCheckinAction);
      return;
    }
    if (adminTabButton) {
      appState.adminTab = adminTabButton.dataset.adminTab;
      renderAdmin();
      if (isProductionApiMode() && appState.adminTab === "settings" && (appState.lineNotificationSettingsStatus !== "ready" || appState.bookingNotificationSettingsStatus !== "ready")) {
        syncProductionAdminSettings().catch((error) => {
          console.error("[TEAM LINK ADMIN SETTINGS SYNC FAILED]", error);
          showToast("通知設定を取得できませんでした。");
        });
      } else if (isProductionApiMode() && ["bookings", "visits", "coupons", "gacha", "members"].includes(appState.adminTab) && appState.adminDataStatus[appState.adminTab] !== "ready") {
        syncProductionAdminSection().catch((error) => {
          console.error("[TEAM LINK ADMIN SYNC FAILED]", error);
          showToast("管理データを取得できませんでした。");
        });
      }
      return;
    }
    if (bookingDateChoiceButton) {
      const parts = splitBookingDateTime(bookingDateChoiceButton.dataset.bookingDateChoice);
      const modal = bookingDateChoiceButton.closest(".admin-booking-response-modal");
      const dateInput = modal?.querySelector("[data-admin-booking-confirm-date]");
      const timeInput = modal?.querySelector("[data-admin-booking-confirm-time]");
      if (dateInput) dateInput.value = parts.date;
      if (timeInput) timeInput.value = parts.time;
      updateBookingDecisionPreview(modal);
      return;
    }
    if (adminActionButton) {
      handleAdminAction(adminActionButton);
      return;
    }
    if (bookingActionButton) {
      handleBookingAction(bookingActionButton);
      return;
    }
    if (bookingMenuCategoryButton) {
      appState.bookingMenuCategory = String(bookingMenuCategoryButton.dataset.bookingMenuCategory || "");
      renderBookingMenuChoices();
      return;
    }
    if (bookingLineCouponToggle) {
      appState.bookingLineCouponsExpanded = !appState.bookingLineCouponsExpanded;
      renderBookingCouponChoices();
      return;
    }
    if (bookingLineCouponCategoryButton) {
      appState.bookingLineCouponCategory = String(bookingLineCouponCategoryButton.dataset.bookingLineCouponCategory || "すべて");
      renderBookingCouponChoices();
      return;
    }
    if (lineCouponCategoryButton) {
      appState.lineCouponCategory = String(lineCouponCategoryButton.dataset.lineCouponCategory || "すべて");
      renderCoupons();
      return;
    }
    if (lineCouponDetailButton) {
      const card = lineCouponDetailButton.closest("[data-line-coupon-card]");
      const expanded = card?.classList.toggle("is-description-expanded") || false;
      lineCouponDetailButton.textContent = expanded ? "閉じる" : "詳細を見る";
      lineCouponDetailButton.setAttribute("aria-expanded", String(expanded));
      return;
    }
    if (gachaActionButton) {
      handleGachaAction(gachaActionButton);
      return;
    }
    if (couponActionButton) {
      handleCouponSelectionAction(couponActionButton);
      return;
    }
    if (viewButton) {
      showView(viewButton.dataset.view);
      return;
    }
    if (messageButton) {
      showToast(messageButton.dataset.message);
      return;
    }
    if (backButton) {
      showView(appState.previousView === appState.currentView ? "home" : appState.previousView);
    }
  });
  document.body.addEventListener("input", (event) => {
    if (event.target.closest("#gachaCharacterEditForm")) updateGachaCharacterPreview();
    if (event.target.matches("[data-admin-booking-confirm-date], [data-admin-booking-confirm-time]")) updateBookingDecisionPreview(event.target.closest(".admin-booking-response-modal"));
  });
  document.body.addEventListener("change", (event) => {
    if (event.target.closest("#gachaCharacterEditForm")) updateGachaCharacterPreview();
    if (event.target.matches("[data-admin-booking-confirm-date], [data-admin-booking-confirm-time]")) updateBookingDecisionPreview(event.target.closest(".admin-booking-response-modal"));
  });
  document.body.addEventListener("submit", (event) => {
    if (event.target.matches("#gachaCharacterEditForm")) {
      event.preventDefault();
      saveGachaCharacterForm(event.target);
    }
  });
}

function bindForms() {
  document.getElementById("adminLoginForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const adminId = String(form.get("adminId") || "");
    const password = String(form.get("password") || "");
    if (password !== ADMIN_PASSCODE) {
      showToast("管理パスコードが違います。");
      return;
    }
    const admin = adminUsers[adminId];
    if (!admin) {
      showToast("スタッフを選択してください。");
      return;
    }
    saveAdminSession(adminId);
    addAdminLog("login", "管理画面にログイン", admin.name);
    event.currentTarget.reset();
    renderAdmin();
    await syncProductionAdminSection();
  });

  document.getElementById("adminLogoutButton").addEventListener("click", () => {
    const admin = getAdminSession();
    addAdminLog("logout", "管理画面からログアウト", admin?.name || "unknown");
    clearAdminSession();
    renderAdmin();
  });

  document.getElementById("bookingForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (appState.bookingSubmitBusy) return;
    const bookingForm = event.currentTarget;
    const request = buildBookingRequestFromForm(bookingForm);
    if (!request) return;
    const submitButton = bookingForm.querySelector("button[type='submit']");
    appState.bookingSubmitBusy = true;
    setButtonLoading(submitButton, true, "送信中…");
    let result = null;
    try {
      if (isProductionApiMode()) {
        result = await submitBookingRequestSafely(request);
        request.requestId = result.data?.bookingRequestId || result.bookingRequestId || result.data?.requestId || result.requestId || request.requestId;
        request.bookingRequestId = request.requestId;
        await markBookingCouponsAsPlanned(request).catch((error) => {
          console.warn("[TEAM LINK BOOKING COUPON PLAN FAILED]", error);
        });
      } else {
        await markBookingCouponsAsPlanned(request);
      }
      const bookings = readJson(STORAGE_KEYS.bookings, []);
      bookings.unshift(request);
      writeJson(STORAGE_KEYS.bookings, bookings);
      if (!isProductionApiMode()) await apiRequest("submitBookingRequest", request);
      document.getElementById("bookingSummary").innerHTML = summaryRows([
        ["メニュー", request.menu],
        ["担当者", request.staff],
        ["第1希望", formatDateTime(request.firstDateTime)],
        ["第2希望", formatDateTime(request.secondDateTime)],
        ["第3希望", formatDateTime(request.thirdDateTime)],
        ["施術時間", formatMinutes(request.totalMinutes)],
        ["参考金額", formatYen(request.referenceAmount)],
        ["状態", normalizeBookingStatus(request.status)]
      ]);
      bookingForm.reset();
      appState.bookingMenuMode = "regular";
      appState.bookingMenuCategory = "";
      appState.bookingSelectedMenuIds = null;
      appState.bookingSelectedCouponIds = null;
      appState.bookingLineCouponsExpanded = false;
      appState.bookingLineCouponCategory = "すべて";
      appState.bookingValidationVisible = false;
      appState.bookingDraft = null;
      appState.bookingPendingRequestId = "";
      renderBookingFormOptions();
      renderApp();
      showView("bookingDone", { preserveBookingDraft: false });
      const notification = result?.data?.notification || result?.notification;
      if (["failed", "partial_failed"].includes(String(notification?.status || ""))) {
        console.error("[TEAM LINK BOOKING EMAIL FAILED]", notification);
        showToast(notification.status === "partial_failed" ? "予約は受け付けましたが、一部の通知メール送信に失敗しました" : "予約は受け付けましたが、通知メールの送信に失敗しました");
      } else {
        showToast("予約希望を送信しました");
      }
    } catch (error) {
      console.error("[TEAM LINK BOOKING SUBMIT FAILED]", error);
      const isSaveFailure = ["SERVER_ERROR", "BOOKING_SAVE_FAILED", "VALIDATION_ERROR"].includes(String(error?.errorCode || ""));
      showToast(isSaveFailure ? "予約希望を保存できませんでした" : "予約サーバーに接続できませんでした");
    } finally {
      appState.bookingSubmitBusy = false;
      setButtonLoading(submitButton, false, "予約希望を送信する");
    }
  });

  document.getElementById("loungeForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!isLoungeOpen()) {
      showToast("ご縁ラウンジは10月スタート予定です。ただいま準備中です。");
      showView("lounge");
      return;
    }
    const submitButton = event.currentTarget.querySelector("button[type='submit']");
    setButtonLoading(submitButton, true, "登録中…");
    try {
      const form = new FormData(event.currentTarget);
      const entry = {
        entryId: createId("LOUNGE"),
        nickname: form.get("nickname"),
        gender: form.get("gender"),
        ageGroup: form.get("ageGroup"),
        area: form.get("area"),
        isSingle: form.get("single") === "on",
        interest: form.get("interest"),
        notify: form.get("notify") === "on",
        createdAt: new Date().toISOString()
      };
      const entries = readJson(STORAGE_KEYS.loungeEntries, []);
      entries.push(entry);
      writeJson(STORAGE_KEYS.loungeEntries, entries);
      await apiRequest("submitLoungePreEntry", entry);
      event.currentTarget.reset();
      renderApp();
      showToast("無料事前登録を受け付けました。正式開始時にLINEでお知らせします。");
      showView("lounge");
    } finally {
      setButtonLoading(submitButton, false, "無料で事前登録する");
    }
  });
}

function bindBookingFormInputs() {
  const form = document.getElementById("bookingForm");
  const modeSelect = document.getElementById("bookingMenuMode");
  const inputs = [
    document.getElementById("bookingCustomerName"),
    document.getElementById("bookingFirstDate"),
    document.getElementById("bookingFirstTime"),
    document.getElementById("bookingSecondDate"),
    document.getElementById("bookingSecondTime"),
    document.getElementById("bookingThirdDate"),
    document.getElementById("bookingThirdTime"),
    document.getElementById("bookingStaffSelect"),
    modeSelect,
    document.querySelector("#bookingForm textarea[name='customMenu']"),
    document.querySelector("#bookingForm textarea[name='memo']")
  ];
  modeSelect?.addEventListener("change", () => {
    appState.bookingMenuMode = modeSelect.value;
    captureBookingDraft();
    renderBookingMenuChoices();
    renderBookingCouponChoices();
    renderBookingMySelectionChoices();
    updateBookingConfirm();
    refreshBookingValidationFeedback();
  });
  form?.addEventListener("change", (event) => {
    if (event.target.matches("input[name='menuIds']")) {
      updateBookingMenuSelection(event.target.value, event.target.checked);
      renderBookingMenuChoices();
    }
    if (event.target.matches("input[name='couponIds']")) {
      updateBookingCouponSelection(event.target.value, event.target.checked);
      renderBookingCouponChoices();
    }
    if (event.target.matches("[data-my-booking-selection]")) {
      syncMySelectionCheckboxToBooking(event.target);
      return;
    }
    if (event.target.matches("#bookingFirstDate, #bookingFirstTime, #bookingSecondDate, #bookingSecondTime, #bookingThirdDate, #bookingThirdTime")) syncBookingDateTimeFields();
    if (event.target.matches("input, select, textarea")) captureBookingDraft();
    if (event.target.matches("#bookingFirstDate, #bookingFirstTime, #bookingStaffSelect")) {
      renderBookingMenuChoices();
      renderBookingCouponChoices();
    }
    renderBookingMySelectionChoices();
    if (event.target.matches("input, select, textarea")) updateBookingConfirm();
    refreshBookingValidationFeedback();
  });
  form?.addEventListener("input", (event) => {
    if (event.target.matches("input, textarea")) {
      if (event.target.matches("#bookingFirstDate, #bookingSecondDate, #bookingThirdDate")) syncBookingDateTimeFields();
      captureBookingDraft();
      updateBookingConfirm();
      refreshBookingValidationFeedback();
    }
  });
  inputs.forEach((input) => input?.addEventListener("blur", updateBookingConfirm));
}

function applyStoreSettings() {
  const settings = getStoreSettings();
  const hotpepperLink = document.getElementById("hotpepperLink");
  if (hotpepperLink) hotpepperLink.href = settings.hotpepperReservationUrl || "#";
}

function minutesFromTimeValue(value) {
  const [hours, minutes] = String(value || "00:00").split(":").map(Number);
  return (Number.isFinite(hours) ? hours : 0) * 60 + (Number.isFinite(minutes) ? minutes : 0);
}

function timeValueFromMinutes(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function renderBookingTimeOptions() {
  const settings = getStoreSettings();
  const interval = Math.max(5, Number(settings.bookingTimeInterval || 30));
  const start = minutesFromTimeValue(settings.businessHours?.start || "09:00");
  const end = minutesFromTimeValue(settings.businessHours?.end || "18:00");
  const options = [];
  for (let minutes = start; minutes <= end; minutes += interval) options.push(timeValueFromMinutes(minutes));
  ["bookingFirstTime", "bookingSecondTime", "bookingThirdTime"].forEach((id) => {
    const select = document.getElementById(id);
    if (!select) return;
    const selected = select.value;
    select.innerHTML = `<option value="">時間を選択</option>${options.map((time) => `<option value="${time}">${time}</option>`).join("")}`;
    if (options.includes(selected)) select.value = selected;
  });
}

function combineBookingDateTime(date, time) {
  return date && time ? `${date}T${time}` : "";
}

function splitBookingDateTime(value) {
  const match = String(value || "").match(/^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})/);
  return match ? { date: match[1], time: match[2] } : { date: "", time: "" };
}

function normalizeBookingDateTimeValue(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return formatBookingDateTimeInputInJst(value);
  const text = String(value || "").trim();
  const local = text.match(/^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})(?::\d{2}(?:\.\d{1,3})?)?$/);
  if (local) return combineBookingDateTime(local[1], local[2]);
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? "" : formatBookingDateTimeInputInJst(parsed);
}

function formatBookingDateTimeInputInJst(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);
  const get = (type) => parts.find((part) => part.type === type)?.value || "";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

function getBookingRequestedDateTimes(booking) {
  return [
    { key: "first", label: "第1希望", value: normalizeBookingDateTimeValue(booking?.firstDateTime) },
    { key: "second", label: "第2希望", value: normalizeBookingDateTimeValue(booking?.secondDateTime) },
    { key: "third", label: "第3希望", value: normalizeBookingDateTimeValue(booking?.thirdDateTime) }
  ].filter((item) => item.value);
}

function decideBookingDateTimeAction(booking, selectedDateTime) {
  const normalized = normalizeBookingDateTimeValue(selectedDateTime);
  if (!normalized) return { ok: false, status: "", confirmedChoice: "", dateTime: "" };
  const requested = getBookingRequestedDateTimes(booking);
  const matched = requested.find((item) => item.value === normalized);
  return {
    ok: true,
    status: matched ? "confirmed" : "proposed",
    confirmedChoice: matched?.label || "",
    dateTime: normalized
  };
}

function decideBookingResponseAction(booking, selectedDateTime, mode) {
  const decision = decideBookingDateTimeAction(booking, selectedDateTime);
  if (!decision.ok) return { ...decision, message: "日付と時間を選択してください。" };
  const isProposalMode = ["needs_change", "propose", "proposed"].includes(String(mode || ""));
  if (isProposalMode) {
    if (decision.status === "confirmed") {
      return { ...decision, ok: false, message: "お客様の希望日時と一致しています。予約確定を選択してください。" };
    }
    return { ...decision, status: "proposed" };
  }
  if (decision.status === "confirmed") return decision;
  const proposedDateTime = normalizeBookingDateTimeValue(booking?.proposedDateTime);
  if (proposedDateTime && proposedDateTime === decision.dateTime) {
    return { ...decision, status: "confirmed", confirmedChoice: "店舗提案（了承済み）" };
  }
  return { ...decision, ok: false, message: "希望外の日時は「別日の案内」からお客様へ提案してください。" };
}

function getBookingDisplayDateTime(booking) {
  const status = normalizeBookingStatus(booking?.status || booking?.currentStatus || "");
  if (status === "予約確定" || status === "サロンボード入力済み" || status === "来店済み") {
    return normalizeBookingDateTimeValue(booking?.confirmedDateTime)
      || normalizeBookingDateTimeValue(booking?.firstDateTime)
      || normalizeBookingDateTimeValue(booking?.dateTime);
  }
  if (status === "別日時提案中" || status === "お客様返答待ち") {
    return normalizeBookingDateTimeValue(booking?.proposedDateTime)
      || normalizeBookingDateTimeValue(booking?.firstDateTime)
      || normalizeBookingDateTimeValue(booking?.dateTime);
  }
  return normalizeBookingDateTimeValue(booking?.firstDateTime)
    || normalizeBookingDateTimeValue(booking?.dateTime);
}

function getBookingDisplayDateTimeLabel(booking) {
  const status = normalizeBookingStatus(booking?.status || booking?.currentStatus || "");
  if (["予約確定", "サロンボード入力済み", "来店済み"].includes(status)) return "確定日時";
  if (["別日時提案中", "お客様返答待ち"].includes(status)) return "店舗提案日時";
  return "第1希望日時";
}

function syncBookingDateTimeFields() {
  const firstHidden = document.getElementById("bookingFirstDateTime");
  const secondHidden = document.getElementById("bookingSecondDateTime");
  const thirdHidden = document.getElementById("bookingThirdDateTime");
  if (firstHidden) firstHidden.value = combineBookingDateTime(document.getElementById("bookingFirstDate")?.value, document.getElementById("bookingFirstTime")?.value);
  if (secondHidden) secondHidden.value = combineBookingDateTime(document.getElementById("bookingSecondDate")?.value, document.getElementById("bookingSecondTime")?.value);
  if (thirdHidden) thirdHidden.value = combineBookingDateTime(document.getElementById("bookingThirdDate")?.value, document.getElementById("bookingThirdTime")?.value);
}

function renderBookingFormOptions() {
  const settings = getStoreSettings();
  renderBookingTimeOptions();
  const customerNameInput = document.getElementById("bookingCustomerName");
  const profile = getProfile();
  if (customerNameInput && !customerNameInput.value && !["お客様", "ゲスト"].includes(String(profile.nickname || ""))) {
    customerNameInput.value = profile.nickname || "";
  }
  const staffSelect = document.getElementById("bookingStaffSelect");
  if (staffSelect) {
    const currentStaffId = String(staffSelect.value || "");
    const reservableStaff = settings.staff
      .filter((staff) => staff.isReservable !== false)
      .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
    staffSelect.innerHTML = `
      <option value="">選択してください</option>
      ${reservableStaff
        .map((staff) => `<option value="${escapeHtml(staff.staffId)}">${escapeHtml(staff.name)}</option>`)
        .join("")}
    `;
    const noPreference = reservableStaff.find((staff) => String(staff.name || "").includes("指名なし"));
    const initialStaffId = currentStaffId || String(noPreference?.staffId || "");
    if ([...staffSelect.options].some((option) => option.value === initialStaffId)) staffSelect.value = initialStaffId;
  }
  const modeSelect = document.getElementById("bookingMenuMode");
  if (modeSelect) modeSelect.value = appState.bookingMenuMode;
  renderBookingMenuChoices();
  renderBookingCouponChoices();
  renderBookingMySelectionChoices();
  updateBookingDateConstraints();
  updateBookingConfirm();
}

function renderBookingMenuChoices(selectedIds = null) {
  const container = document.getElementById("bookingMenuChoices");
  const customField = document.getElementById("bookingCustomMenuField");
  if (!container) return;
  const mode = document.getElementById("bookingMenuMode")?.value || appState.bookingMenuMode;
  customField.hidden = mode !== "consult";
  if (mode === "consult") {
    container.innerHTML = `<p class="soft-note">メニューが決まっていない場合は、下の欄に希望や髪のお悩みをご記入ください。</p>`;
    return;
  }
  if (isProductionApiMode() && appState.menuMasterSyncStatus !== "synced") {
    container.innerHTML = `<p class="soft-note">${appState.menuMasterSyncStatus === "unavailable" ? "メニュー情報を取得できませんでした。" : "通常メニューを取得しています…"}</p>`;
    return;
  }
  const context = getBookingMenuContext();
  const menus = getPublicReservationMenus(context).filter((menu) => menu.type === "通常メニュー");
  if (!menus.length) {
    container.innerHTML = `<p class="soft-note">現在利用できるメニューはありません。</p>`;
    return;
  }
  if (Array.isArray(selectedIds)) appState.bookingSelectedMenuIds = [...new Set(selectedIds.map(String))];
  if (!Array.isArray(appState.bookingSelectedMenuIds)) {
    appState.bookingSelectedMenuIds = getBookingDraftSelectionIds("menuIds");
  }
  const selected = new Set(appState.bookingSelectedMenuIds.map(String));
  const categories = [...new Set(menus.map((menu) => String(menu.category || "未分類").trim() || "未分類"))];
  if (appState.bookingMenuCategory && !categories.includes(appState.bookingMenuCategory)) appState.bookingMenuCategory = "";
  const activeCategory = appState.bookingMenuCategory;
  const visibleMenus = activeCategory
    ? menus.filter((menu) => (String(menu.category || "未分類").trim() || "未分類") === activeCategory)
    : [];
  container.innerHTML = `
    <div class="booking-menu-category-panel">
      <div class="booking-menu-category-chips" role="group" aria-label="通常メニューのカテゴリー">
        ${categories.map((category) => {
          const count = menus.filter((menu) => (String(menu.category || "未分類").trim() || "未分類") === category).length;
          return `<button type="button" class="booking-menu-category-chip ${activeCategory === category ? "is-active" : ""}" data-booking-menu-category="${escapeHtml(category)}" aria-pressed="${activeCategory === category}">${escapeHtml(category)} <small>${count}</small></button>`;
        }).join("")}
      </div>
      <p class="booking-menu-selection-count">選択中 <strong>${selected.size}</strong>件</p>
    </div>
    <div class="booking-menu-category-list">
      ${activeCategory ? visibleMenus.map((menu) => `
        <label class="menu-choice-card ${selected.has(String(menu.menuId)) ? "is-selected" : ""}">
          <input type="checkbox" name="menuIds" value="${escapeHtml(menu.menuId)}" ${selected.has(String(menu.menuId)) ? "checked" : ""}>
          <span>
            <strong>${escapeHtml(menu.title)}</strong>
            <small>${escapeHtml(menu.description || "")}</small>
            <em>${escapeHtml(formatMinutes(menu.durationMinutes))} / ${escapeHtml(formatYen(getMenuPrice(menu)))}</em>
          </span>
        </label>
      `).join("") : `<p class="soft-note booking-menu-category-prompt">カテゴリーを選んでください。</p>`}
    </div>
  `;
}

function renderBookingCouponChoices(selectedIds = getBookingDraftSelectionIds("couponIds")) {
  const container = document.getElementById("bookingCouponChoices");
  if (!container) return;
  if (isProductionApiMode() && appState.couponMasterSyncStatus !== "synced") {
    container.innerHTML = `<p class="soft-note">${appState.couponMasterSyncStatus === "unavailable" ? "クーポン情報を取得できませんでした。" : "クーポン情報を取得しています…"}</p>`;
    return;
  }
  const coupons = getBookableMyLineCoupons(getBookingMenuContext());
  if (Array.isArray(selectedIds)) appState.bookingSelectedCouponIds = [...new Set(selectedIds.map(String))];
  if (!Array.isArray(appState.bookingSelectedCouponIds)) {
    appState.bookingSelectedCouponIds = getBookingDraftSelectionIds("couponIds");
  }
  const selected = new Set(appState.bookingSelectedCouponIds.map(String));
  const activeCategory = LINE_COUPON_CATEGORY_ORDER.includes(appState.bookingLineCouponCategory)
    ? appState.bookingLineCouponCategory
    : "すべて";
  appState.bookingLineCouponCategory = activeCategory;
  const visibleCoupons = filterLineCouponsByCategory(coupons, activeCategory);
  container.innerHTML = coupons.length ? `
    <div class="line-coupon-booking-shell">
      <button type="button" class="line-coupon-disclosure" data-booking-line-coupon-toggle aria-expanded="${appState.bookingLineCouponsExpanded}">
        <span>LINEクーポンを選ぶ（${coupons.length}件）</span>
        <small>${selected.size ? `選択中 ${selected.size}件` : "任意"}</small>
      </button>
      <div class="line-coupon-booking-panel" ${appState.bookingLineCouponsExpanded ? "" : "hidden"}>
        ${lineCouponCategoryButtonsHtml(coupons, activeCategory, "data-booking-line-coupon-category", "予約用LINEクーポンのカテゴリー")}
        <div class="line-coupon-booking-list">
          ${visibleCoupons.map((coupon) => bookingLineCouponCardHtml(coupon, selected.has(String(coupon.couponId)))).join("") || `<p class="soft-note">このカテゴリーにクーポンはありません。</p>`}
        </div>
      </div>
    </div>
  ` : `<p class="soft-note">利用できるクーポンはありません。</p>`;
}

function bookingLineCouponCardHtml(coupon, selected) {
  const couponId = String(coupon.couponId || "");
  return `
    <article class="menu-choice-card line-coupon-booking-card ${selected ? "is-selected" : ""}" data-line-coupon-card>
      <input id="booking-line-coupon-${escapeHtml(couponId)}" type="checkbox" name="couponIds" value="${escapeHtml(couponId)}" ${selected ? "checked" : ""}>
      <label class="line-coupon-booking-content" for="booking-line-coupon-${escapeHtml(couponId)}">
        <small>LINEクーポン・${escapeHtml(getLineCouponCategory(coupon))}</small>
        <strong>${escapeHtml(coupon.title)}</strong>
        <p class="line-coupon-description">${escapeHtml(coupon.description || coupon.message || "LINE公式クーポン")}</p>
        <em>期限 ${escapeHtml(formatDateUntil(coupon.validUntil || coupon.endDate))}</em>
      </label>
      ${lineCouponDetailButtonHtml(coupon)}
    </article>
  `;
}

function getBookingDraftSelectionIds(name) {
  if (name === "menuIds" && Array.isArray(appState.bookingSelectedMenuIds)) {
    return appState.bookingSelectedMenuIds.map(String);
  }
  if (name === "couponIds" && Array.isArray(appState.bookingSelectedCouponIds)) {
    return appState.bookingSelectedCouponIds.map(String);
  }
  const form = document.getElementById("bookingForm");
  const checked = form ? [...form.querySelectorAll(`input[name="${name}"]:checked`)].map((input) => input.value) : [];
  if (checked.length) return checked;
  const draft = appState.bookingDraft;
  return Array.isArray(draft?.[name]) ? draft[name].map(String) : [];
}

function updateBookingMenuSelection(menuId, checked) {
  const selected = new Set(getBookingDraftSelectionIds("menuIds"));
  if (checked) selected.add(String(menuId));
  else selected.delete(String(menuId));
  appState.bookingSelectedMenuIds = [...selected];
  if (appState.bookingDraft) appState.bookingDraft.menuIds = [...selected];
}

function updateBookingCouponSelection(couponId, checked) {
  const selected = new Set(getBookingDraftSelectionIds("couponIds"));
  if (checked) selected.add(String(couponId));
  else selected.delete(String(couponId));
  appState.bookingSelectedCouponIds = [...selected];
  if (appState.bookingDraft) appState.bookingDraft.couponIds = [...selected];
}

function renderBookingMySelectionChoices() {
  const container = document.getElementById("bookingMySelectionChoices");
  if (!container) return;
  const selections = getMySelections();
  if (!selections.length) {
    container.innerHTML = `<p class="soft-note">マイクーポンに追加した項目はありません。「マイクーポンを見る」から追加できます。</p>`;
    return;
  }
  const menuIds = new Set(getBookingDraftSelectionIds("menuIds"));
  const couponIds = new Set(getBookingDraftSelectionIds("couponIds"));
  const availableMenuIds = new Set(getPublicReservationMenus(getBookingMenuContext()).map((menu) => String(menu.menuId)));
  const availableCouponIds = new Set(getBookableMyLineCoupons(getBookingMenuContext()).map((coupon) => String(coupon.couponId)));
  container.innerHTML = selections.map((item) => {
    const isCoupon = item.type === "coupon";
    const selected = (isCoupon ? couponIds : menuIds).has(String(item.itemId));
    const available = (isCoupon ? availableCouponIds : availableMenuIds).has(String(item.itemId));
    const detail = isCoupon
      ? `有効期限：${formatDateUntil(item.endDate)}`
      : `${formatYen(item.price)} / ${formatMinutes(item.duration)}`;
    return `
      <label class="menu-choice-card booking-my-selection-card ${available ? "" : "is-unavailable"}">
        <input type="checkbox" data-my-booking-selection data-item-type="${escapeHtml(item.type)}" data-item-id="${escapeHtml(item.itemId)}" ${selected ? "checked" : ""} ${available ? "" : "disabled"}>
        <span>
          <small>${isCoupon ? "LINEクーポン" : "通常メニュー"}</small>
          <strong>${escapeHtml(item.title)}</strong>
          <em>${escapeHtml(available ? detail : "現在は予約対象外です")}</em>
        </span>
      </label>
    `;
  }).join("");
}

function syncMySelectionCheckboxToBooking(checkbox) {
  const name = checkbox.dataset.itemType === "coupon" ? "couponIds" : "menuIds";
  const itemId = String(checkbox.dataset.itemId || "");
  if (name === "menuIds") {
    updateBookingMenuSelection(itemId, checkbox.checked);
    renderBookingMenuChoices();
    captureBookingDraft();
    renderBookingMySelectionChoices();
    updateBookingConfirm();
    return;
  }
  updateBookingCouponSelection(itemId, checkbox.checked);
  renderBookingCouponChoices();
  captureBookingDraft();
  renderBookingMySelectionChoices();
  updateBookingConfirm();
}

function captureBookingDraft() {
  const form = document.getElementById("bookingForm");
  if (!form) return;
  syncBookingDateTimeFields();
  const data = new FormData(form);
  appState.bookingDraft = {
    customerName: String(data.get("customerName") || ""),
    firstDateTime: String(data.get("firstDateTime") || ""),
    secondDateTime: String(data.get("secondDateTime") || ""),
    thirdDateTime: String(data.get("thirdDateTime") || ""),
    staff: String(data.get("staff") || ""),
    menuMode: String(data.get("menuMode") || "regular"),
    customMenu: String(data.get("customMenu") || ""),
    memo: String(data.get("memo") || ""),
    menuIds: [...new Set(getBookingDraftSelectionIds("menuIds"))],
    couponIds: [...new Set(getBookingDraftSelectionIds("couponIds"))]
  };
}

function restoreBookingDraft() {
  const draft = appState.bookingDraft;
  const form = document.getElementById("bookingForm");
  if (!draft || !form) {
    renderBookingFormOptions();
    return;
  }
  const first = splitBookingDateTime(draft.firstDateTime);
  const second = splitBookingDateTime(draft.secondDateTime);
  const third = splitBookingDateTime(draft.thirdDateTime);
  document.getElementById("bookingFirstDate").value = first.date;
  document.getElementById("bookingFirstTime").value = first.time;
  document.getElementById("bookingSecondDate").value = second.date;
  document.getElementById("bookingSecondTime").value = second.time;
  document.getElementById("bookingThirdDate").value = third.date;
  document.getElementById("bookingThirdTime").value = third.time;
  form.elements.firstDateTime.value = draft.firstDateTime || "";
  form.elements.customerName.value = draft.customerName || "";
  form.elements.secondDateTime.value = draft.secondDateTime || "";
  form.elements.thirdDateTime.value = draft.thirdDateTime || "";
  form.elements.staff.value = draft.staff || "";
  form.elements.menuMode.value = draft.menuMode || "regular";
  form.elements.customMenu.value = draft.customMenu || "";
  form.elements.memo.value = draft.memo || "";
  appState.bookingMenuMode = draft.menuMode || "regular";
  appState.bookingSelectedMenuIds = [...new Set((draft.menuIds || []).map(String))];
  appState.bookingSelectedCouponIds = [...new Set((draft.couponIds || []).map(String))];
  renderBookingMenuChoices(draft.menuIds || []);
  renderBookingCouponChoices(draft.couponIds || []);
  renderBookingMySelectionChoices();
  updateBookingDateConstraints();
  updateBookingConfirm();
}

function startBookingFromMySelections() {
  captureBookingDraft();
  const selections = getMySelections();
  const draft = appState.bookingDraft || {};
  appState.bookingDraft = {
    ...draft,
    menuMode: "regular",
    menuIds: selections.filter((item) => item.type === "menu").map((item) => String(item.itemId)),
    couponIds: selections.filter((item) => item.type === "coupon").map((item) => String(item.itemId))
  };
  appState.bookingSelectedMenuIds = [...appState.bookingDraft.menuIds];
  appState.bookingSelectedCouponIds = [...appState.bookingDraft.couponIds];
  appState.bookingMenuCategory = "";
  appState.bookingMenuMode = "regular";
  showView("booking");
}

function updateBookingDateConstraints() {
  const min = jstDateKey();
  ["bookingFirstDate", "bookingSecondDate", "bookingThirdDate"].forEach((id) => {
    const input = document.getElementById(id);
    if (input) input.min = min;
  });
}

function updateBookingConfirm() {
  const form = document.getElementById("bookingForm");
  const confirm = document.getElementById("bookingConfirm");
  if (!form || !confirm) return;
  const formData = new FormData(form);
  const selected = getSelectedReservationMenus(formData);
  const selectedCoupons = getSelectedBookingCoupons(formData);
  const staff = getStaffName(formData.get("staff"));
  const mode = String(formData.get("menuMode") || "regular");
  const menuText = mode === "consult"
    ? String(formData.get("customMenu") || "相談して決めたい").trim()
    : selected.map((menu) => menu.title).join("＋") || (selectedCoupons.length ? `クーポンメニュー：${selectedCoupons.map((coupon) => coupon.title).join("＋")}` : "未選択");
  const totals = calculateBookingTotals(selected, selectedCoupons);
  confirm.innerHTML = `
    <strong>10. 内容確認</strong>
    <div class="summary-list">
      ${summaryRows([
        ["第1希望", formatDateTime(formData.get("firstDateTime")) || "未入力"],
        ["第2希望", formatDateTime(formData.get("secondDateTime")) || "未入力"],
        ["第3希望", formatDateTime(formData.get("thirdDateTime")) || "未入力"],
        ["担当者", staff || "未選択"],
        ["メニュー", menuText],
        ["LINEクーポン", selectedCoupons.map((coupon) => coupon.title).join("、") || "利用しない"],
        ["合計施術時間", totals.durationKnown ? formatMinutes(totals.totalMinutes) : "店舗確認"],
        ["参考金額", totals.priceKnown ? formatYen(totals.referenceAmount) : "店舗確認"]
      ])}
    </div>
    <p class="soft-note">最終金額と予約可否は、店舗確認後に確定します。</p>
  `;
}

function buildBookingRequestFromForm(formElement) {
  syncBookingDateTimeFields();
  const form = new FormData(formElement);
  const profile = getProfile();
  const userKey = getCurrentUserKey();
  const validation = validateBookingForm(form);
  if (!validation.ok) {
    showBookingValidationErrors(formElement, validation);
    return null;
  }
  clearBookingValidationErrors(formElement);
  appState.bookingValidationVisible = false;
  const selectedMenus = getSelectedReservationMenus(form);
  const selectedCoupons = getSelectedBookingCoupons(form);
  const menuMode = String(form.get("menuMode") || "regular");
  const customMenu = String(form.get("customMenu") || "").trim();
  const menuTitle = menuMode === "consult"
    ? customMenu
    : selectedMenus.map((menu) => menu.title).join("＋") || selectedCoupons.map((coupon) => coupon.title).join("＋");
  const totals = calculateBookingTotals(selectedMenus, selectedCoupons);
  const now = new Date().toISOString();
  const bookingRequestId = appState.bookingPendingRequestId || createId("REQ");
  appState.bookingPendingRequestId = bookingRequestId;
  return {
    bookingRequestId,
    requestId: bookingRequestId,
    reservationId: createId("RSV"),
    userId: userKey,
    memberId: userKey,
    lineUserId: profile.lineUserId || "",
    customerName: String(form.get("customerName") || "").trim(),
    reservationSource: "TEAM LINK相談",
    source: "TEAM LINK相談",
    requestType: "予約相談",
    firstDateTime: String(form.get("firstDateTime") || ""),
    secondDateTime: String(form.get("secondDateTime") || ""),
    thirdDateTime: String(form.get("thirdDateTime") || ""),
    staffId: String(form.get("staff") || ""),
    staff: getStaffName(form.get("staff")),
    menuMode,
    menu: menuTitle,
    customMenu,
    consultation: customMenu || String(form.get("memo") || "").trim(),
    menuIds: selectedMenus.map((menu) => menu.menuId),
    couponIds: selectedCoupons.map((coupon) => coupon.couponId).filter(Boolean),
    selectedMenus: selectedMenus.map(toReservationMenuSnapshot),
    selectedCoupons: selectedCoupons.map(toReservationMenuSnapshot),
    couponTitle: selectedCoupons.map((coupon) => coupon.title).join("、"),
    referenceAmount: totals.priceKnown ? totals.referenceAmount : "",
    referenceAmountStatus: totals.priceKnown ? "calculated" : "store_confirmation",
    totalMinutes: totals.durationKnown ? totals.totalMinutes : "",
    totalDurationMinutes: totals.durationKnown ? totals.totalMinutes : "",
    totalDurationStatus: totals.durationKnown ? "calculated" : "store_confirmation",
    memo: String(form.get("memo") || "").trim(),
    status: "pending",
    currentStatus: "pending",
    createdAt: now,
    receivedAt: now,
    updatedAt: now
  };
}

function validateBookingForm(form) {
  const customerName = String(form.get("customerName") || "").trim();
  const first = String(form.get("firstDateTime") || "");
  const second = String(form.get("secondDateTime") || "");
  const third = String(form.get("thirdDateTime") || "");
  const firstDate = String(form.get("firstDate") || "");
  const firstTime = String(form.get("firstTime") || "");
  const secondDate = String(form.get("secondDate") || "");
  const secondTime = String(form.get("secondTime") || "");
  const thirdDate = String(form.get("thirdDate") || "");
  const thirdTime = String(form.get("thirdTime") || "");
  const issues = [];
  const addIssue = (fieldId, message) => {
    if (!issues.some((issue) => issue.fieldId === fieldId && issue.message === message)) issues.push({ fieldId, message });
  };
  if (!customerName) addIssue("bookingCustomerNameField", "お客様名を入力してください");
  if (!firstDate || !firstTime) {
    addIssue("bookingFirstDateTimeField", "第一希望の日付と時間を選択してください");
  } else if (!first) {
    addIssue("bookingFirstDateTimeField", "第一希望日時を入力してください");
  } else {
    const firstCheck = validateReservableDateTime(first);
    if (!firstCheck.ok) addIssue("bookingFirstDateTimeField", `第一希望：${firstCheck.message}`);
  }
  if ((secondDate && !secondTime) || (!secondDate && secondTime)) {
    addIssue("bookingSecondDateTimeField", "第二希望は日付と時間の両方を選択してください");
  }
  if (second && first === second) addIssue("bookingSecondDateTimeField", "第一希望と第二希望は別の日時を選んでください");
  if (second) {
    const secondCheck = validateReservableDateTime(second);
    if (!secondCheck.ok) addIssue("bookingSecondDateTimeField", `第二希望：${secondCheck.message}`);
  }
  if ((thirdDate && !thirdTime) || (!thirdDate && thirdTime)) {
    addIssue("bookingThirdDateTimeField", "第三希望は日付と時間の両方を選択してください");
  }
  if (third && [first, second].includes(third)) addIssue("bookingThirdDateTimeField", "第三希望は第一・第二希望と別の日時を選んでください");
  if (third) {
    const thirdCheck = validateReservableDateTime(third);
    if (!thirdCheck.ok) addIssue("bookingThirdDateTimeField", `第三希望：${thirdCheck.message}`);
  }
  if (!String(form.get("staff") || "")) addIssue("bookingStaffField", "担当希望を選択してください");
  const mode = String(form.get("menuMode") || "regular");
  if (mode === "consult") {
    if (!String(form.get("customMenu") || "").trim()) addIssue("bookingCustomMenuField", "相談したい内容を入力してください");
  } else {
    const selectedMenus = getSelectedReservationMenus(form);
    const selectedCoupons = getSelectedBookingCoupons(form);
    if (!selectedMenus.length && !selectedCoupons.length) addIssue("bookingMenuSelectionField", "メニューまたはクーポンを1つ以上選択してください");
  }
  return {
    ok: issues.length === 0,
    issues,
    message: issues.length === 1 ? issues[0].message : "入力内容をご確認ください"
  };
}

function clearBookingValidationErrors(formElement = document.getElementById("bookingForm")) {
  if (!formElement) return;
  formElement.querySelectorAll(".booking-field-error").forEach((node) => node.remove());
  formElement.querySelectorAll(".is-booking-invalid").forEach((field) => field.classList.remove("is-booking-invalid"));
  formElement.querySelectorAll("[aria-invalid='true']").forEach((control) => control.removeAttribute("aria-invalid"));
  const summary = document.getElementById("bookingValidationSummary");
  if (summary) {
    summary.hidden = true;
    summary.innerHTML = "";
  }
}

function showBookingValidationErrors(formElement, validation, scrollToFirst = true) {
  clearBookingValidationErrors(formElement);
  const issues = Array.isArray(validation?.issues) ? validation.issues : [];
  if (!issues.length) {
    appState.bookingValidationVisible = false;
    return;
  }
  appState.bookingValidationVisible = true;
  const summary = document.getElementById("bookingValidationSummary");
  if (summary) {
    summary.hidden = false;
    summary.innerHTML = `
      <strong>入力内容をご確認ください</strong>
      <ul>${issues.map((issue) => `<li>${escapeHtml(issue.message)}</li>`).join("")}</ul>
    `;
  }
  const issuesByField = new Map();
  issues.forEach((issue) => {
    if (!issuesByField.has(issue.fieldId)) issuesByField.set(issue.fieldId, []);
    issuesByField.get(issue.fieldId).push(issue.message);
  });
  issuesByField.forEach((messages, fieldId) => {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.classList.add("is-booking-invalid");
    field.querySelectorAll("input, select, textarea").forEach((control) => control.setAttribute("aria-invalid", "true"));
    field.insertAdjacentHTML("beforeend", `<small class="booking-field-error">${messages.map((message) => escapeHtml(message)).join("<br>")}</small>`);
  });
  if (scrollToFirst) showToast(validation.message || "入力内容をご確認ください");
  if (!scrollToFirst) return;
  const firstField = document.getElementById(issues[0].fieldId);
  firstField?.scrollIntoView?.({ behavior: "smooth", block: "center" });
  window.setTimeout(() => firstField?.querySelector("input, select, textarea, button")?.focus({ preventScroll: true }), 350);
}

function refreshBookingValidationFeedback() {
  if (!appState.bookingValidationVisible) return;
  const formElement = document.getElementById("bookingForm");
  if (!formElement) return;
  syncBookingDateTimeFields();
  const validation = validateBookingForm(new FormData(formElement));
  if (validation.ok) {
    clearBookingValidationErrors(formElement);
    appState.bookingValidationVisible = false;
    return;
  }
  showBookingValidationErrors(formElement, validation, false);
}

function validateReservableDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { ok: false, message: "日時の形式が正しくありません。" };
  if (date.getTime() <= Date.now()) return { ok: false, message: "過去日時は選択できません。" };
  const settings = getStoreSettings();
  const weekday = date.getDay();
  if ((settings.closedWeekdays || []).includes(weekday)) return { ok: false, message: "定休日は選択できません。" };
  const hhmm = toTimeValue(date);
  if (hhmm < settings.businessHours.start || hhmm > settings.businessHours.end) {
    return { ok: false, message: `営業時間内（${settings.businessHours.start}〜${settings.businessHours.end}）で選択してください。` };
  }
  return { ok: true };
}

function getSelectedReservationMenus(form) {
  const ids = getBookingDraftSelectionIds("menuIds");
  const context = {
    staffId: String(form.get("staff") || ""),
    dateTime: String(form.get("firstDateTime") || "")
  };
  const menus = getPublicReservationMenus(context).filter((menu) => menu.type === "通常メニュー");
  return ids.map((id) => menus.find((menu) => menu.menuId === id)).filter(Boolean);
}

function getSelectedBookingCoupons(form) {
  const ids = getBookingDraftSelectionIds("couponIds");
  const context = {
    staffId: String(form.get("staff") || ""),
    dateTime: String(form.get("firstDateTime") || "")
  };
  const coupons = getBookableMyLineCoupons(context);
  return ids.map((id) => coupons.find((coupon) => coupon.couponId === id)).filter(Boolean);
}

function toReservationMenuSnapshot(menu) {
  return {
    menuId: menu.menuId,
    couponId: menu.couponId || "",
    myCouponId: menu.myCouponId || "",
    type: menu.type || (menu.lineCouponUrl ? "LINEクーポン" : ""),
    title: menu.title,
    price: getMenuPrice(menu),
    priceKnown: isBookingPriceKnown(menu),
    regularPrice: Number(menu.regularPrice || 0),
    couponPrice: Number(menu.couponPrice || 0),
    durationMinutes: Number(menu.durationMinutes || 0),
    durationKnown: isBookingDurationKnown(menu),
    source: menu.source || "",
    status: menu.status || "",
    lineCouponUrl: menu.lineCouponUrl || "",
    imageUrl: menu.imageUrl || ""
  };
}

function getMenuPrice(menu) {
  return Number(menu.couponPrice || menu.regularPrice || 0);
}

function isBookingPriceKnown(item) {
  if (!item) return false;
  if (item.type === "通常メニュー") return Number.isFinite(Number(getMenuPrice(item)));
  return item.bookingPriceKnown === true || item.priceKnown === true || Number(item.couponPrice || 0) > 0;
}

function isBookingDurationKnown(item) {
  if (!item) return false;
  if (item.type === "通常メニュー") return Number(item.durationMinutes || 0) > 0;
  return item.bookingDurationKnown === true || item.durationKnown === true || Number(item.durationMinutes || 0) > 0;
}

function calculateBookingTotals(menus = [], coupons = []) {
  const allItems = [...menus, ...coupons];
  return {
    referenceAmount: allItems.reduce((sum, item) => sum + Number(getMenuPrice(item) || 0), 0),
    totalMinutes: allItems.reduce((sum, item) => sum + Number(item.durationMinutes || 0), 0),
    priceKnown: coupons.every(isBookingPriceKnown),
    durationKnown: allItems.length > 0 && allItems.every(isBookingDurationKnown)
  };
}

function getPublicCoupons(context = {}) {
  return getAdminCoupons()
    .filter((coupon) => coupon.isPublic !== false)
    .filter((coupon) => getCouponPublicationState(coupon) === "公開中")
    .filter((coupon) => isCouponWithinValidityPeriod(coupon, context.dateTime || jstDateKey()))
    .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
}

function isCouponWithinValidityPeriod(coupon, dateTime) {
  const date = dateTime ? new Date(dateTime) : new Date();
  const key = Number.isNaN(date.getTime())
    ? jstDateKey()
    : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const validFrom = normalizeApiDateKey(coupon.validStartAt || coupon.startDate || coupon.validFrom || "");
  const validUntil = normalizeApiDateKey(coupon.validUntil || coupon.endDate || coupon.expires || "");
  if (validFrom && key < validFrom) return false;
  if (validUntil && key > validUntil) return false;
  return true;
}

function isLineCouponDefinition(coupon) {
  return Boolean(coupon?.lineCouponUrl) || coupon?.couponType === "LINE公式クーポン" || coupon?.source === "LINE公式アカウント";
}

function getPublicLineCoupons(context = {}) {
  return getPublicCoupons(context)
    .filter(isLineCouponDefinition)
    .filter((coupon) => isCouponForStaff(coupon, context.staffId))
    .filter((coupon) => !coupon.lineCouponUrl || isSafeLineCouponUrl(coupon.lineCouponUrl));
}

function getBookableMyLineCoupons(context = {}) {
  return getPublicLineCoupons(context);
}

function isSafeLineCouponUrl(value) {
  try {
    const url = new URL(String(value || ""));
    return url.protocol === "https:" && url.hostname === "lin.ee";
  } catch (_) {
    return false;
  }
}

function getProfileCoupons() {
  return getMemberCoupons(getProfile());
}

function getAvailableCoupons() {
  return getProfileCoupons().filter((coupon) => getCouponStatus(coupon) === "使用可能");
}

const gachaStateLabels = {
  available: "未使用",
  pending: "スタッフ確認待ち",
  used: "使用済み",
  expired: "期限切れ",
  cancelled: "使用申請キャンセル",
  test: "テスト"
};

function getGachaServerDateKey() {
  return jstDateKey();
}

function endOfMonthDateKeyFor(issueMonth = currentMonthKey()) {
  const [year, month] = String(issueMonth || currentMonthKey()).split("-").map(Number);
  const last = new Date(year, month, 0);
  return `${last.getFullYear()}-${String(last.getMonth() + 1).padStart(2, "0")}-${String(last.getDate()).padStart(2, "0")}`;
}

function normalizeServerYearMonth(value, fallback = currentMonthKey()) {
  const text = String(value || "").trim();
  if (/^\d{4}-\d{2}$/.test(text)) return text;
  const date = text ? new Date(text) : null;
  if (date && !Number.isNaN(date.getTime())) {
    const parts = new Intl.DateTimeFormat("ja-JP", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit"
    }).formatToParts(date);
    const year = parts.find((part) => part.type === "year")?.value;
    const month = parts.find((part) => part.type === "month")?.value;
    if (year && month) return `${year}-${month}`;
  }
  const match = text.match(/^(\d{4})-(\d{2})/);
  return match ? `${match[1]}-${match[2]}` : fallback;
}

function normalizeGachaState(value) {
  const text = String(value || "").trim();
  if (["available", "未使用", "利用可能"].includes(text)) return "available";
  if (["pending", "スタッフ確認待ち", "確認待ち"].includes(text)) return "pending";
  if (["used", "使用済み"].includes(text)) return "used";
  if (["expired", "期限切れ"].includes(text)) return "expired";
  if (["cancelled", "キャンセル", "使用申請キャンセル"].includes(text)) return "cancelled";
  if (["test", "テスト"].includes(text)) return "test";
  return "available";
}

function getGachaLifecycleState(card) {
  const stored = normalizeGachaState(card.lifecycleState || card.useState || card.status);
  if (stored === "used" || stored === "pending" || stored === "cancelled" || stored === "test") return stored;
  if (isPastDateLabel(card.validUntil || card.expires)) return "expired";
  return "available";
}

function getGachaStateLabel(card) {
  return gachaStateLabels[getGachaLifecycleState(card)] || "未使用";
}

function normalizeGachaDrawRecord(card) {
  const issueMonth = card.issueMonth || currentMonthKey();
  const state = getGachaLifecycleState(card);
  return {
    ...card,
    issueMonth,
    validUntil: card.validUntil || endOfMonthDateKeyFor(issueMonth),
    expires: card.expires || card.validUntil || endOfMonthDateKeyFor(issueMonth),
    lifecycleState: state,
    useState: state,
    status: state
  };
}

function refreshGachaCardStates() {
  const normalizeList = (list) => {
    let changed = false;
    const next = list.map((card) => {
      const normalized = normalizeGachaDrawRecord(card);
      const issueMonth = normalizeServerYearMonth(normalized.issueMonth || normalized.obtainedAt || normalized.drawnAt);
      const isPastIssueMonth = issueMonth < currentMonthKey();
      const shouldStoreInBinder = normalized.lifecycleState === "used" && isPastIssueMonth;
      const shouldExpire = ["available", "pending", "cancelled"].includes(normalized.lifecycleState) && isPastIssueMonth;
      if (shouldStoreInBinder) {
        normalized.inBinder = true;
        normalized.binderYear = issueMonth.slice(0, 4);
        normalized.binderStoredAt = normalized.binderStoredAt || new Date().toISOString();
      }
      if (shouldExpire) {
        normalized.lifecycleState = "expired";
        normalized.useState = "expired";
        normalized.status = "expired";
        normalized.inBinder = false;
        normalized.expiredAt = normalized.expiredAt || new Date().toISOString();
      }
      if (JSON.stringify(normalized) !== JSON.stringify(card)) changed = true;
      return normalized;
    });
    return { next, changed };
  };
  const draws = refreshOneGachaStore(STORAGE_KEYS.monthlyGachaDraws, normalizeList);
  const history = refreshOneGachaStore(STORAGE_KEYS.gachaCardHistory, normalizeList);
  return draws || history;
}

function refreshOneGachaStore(key, normalizer) {
  const list = readJson(key, []);
  const { next, changed } = normalizer(list);
  if (changed) writeJson(key, next);
  return changed;
}

function getBookableCouponMenus(context = {}) {
  const member = getProfile();
  const publicCoupons = getPublicCoupons(context)
    .filter((coupon) => coupon.selectableOnBooking !== false)
    .filter((coupon) => isCouponForStaff(coupon, context.staffId))
    .filter((coupon) => hasCouponUsageCapacity(coupon, member.memberId))
    .map((coupon) => couponToReservationMenu(coupon, false));
  const ownedCoupons = getMemberCoupons(member)
    .filter((coupon) => ["使用可能", "予約で使用予定"].includes(getCouponStatus(coupon)))
    .filter((coupon) => coupon.selectableOnBooking !== false)
    .filter((coupon) => isCouponForDate(coupon, context.dateTime || jstDateKey()))
    .filter((coupon) => isCouponForStaff(coupon, context.staffId))
    .map((coupon) => couponToReservationMenu(coupon, true));
  const map = new Map();
  [...ownedCoupons, ...publicCoupons].forEach((coupon) => map.set(coupon.menuId, coupon));
  return [...map.values()].sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
}

function couponToReservationMenu(coupon, isOwnedCoupon) {
  return {
    menuId: isOwnedCoupon ? `mycoupon:${coupon.couponId}` : `coupon:${coupon.couponId}`,
    couponId: coupon.parentCouponId || coupon.couponDefinitionId || coupon.couponId,
    myCouponId: isOwnedCoupon ? coupon.couponId : "",
    type: "クーポン",
    title: coupon.title,
    description: coupon.description || coupon.message || coupon.condition || "",
    regularPrice: Number(coupon.regularPrice || 0),
    couponPrice: Number(coupon.couponPrice || 0),
    durationMinutes: Number(coupon.durationMinutes || 0),
    targetStaff: coupon.targetStaff || ["all"],
    targetWeekdays: coupon.targetWeekdays || [0, 2, 3, 4, 5, 6],
    source: coupon.source || coupon.sourceType || "Console作成",
    status: coupon.status || "公開",
    sortOrder: coupon.sortOrder || 999,
    isOwnedCoupon
  };
}

async function markBookingCouponsAsPlanned(request) {
  const selected = (Array.isArray(request.selectedCoupons) ? request.selectedCoupons : [])
    .filter((coupon) => !coupon.lineCouponUrl && coupon.source !== "LINE公式アカウント");
  if (!selected.length) return;
  const coupons = readJson(STORAGE_KEYS.myCoupons, []);
  const member = findMember(request.memberId) || getProfile();
  let changed = false;
  for (const selectedCoupon of selected) {
    const myCouponId = selectedCoupon.myCouponId;
    let coupon = myCouponId ? coupons.find((item) => item.couponId === myCouponId) : null;
    if (!coupon && selectedCoupon.couponId) {
      const definition = getAdminCoupons().find((item) => item.couponId === selectedCoupon.couponId);
      if (definition) {
        if (isProductionApiMode()) {
          const grantResult = await apiRequest("grantMemberCoupon", {
            memberId: member.memberId,
            lineUserId: member.lineUserId || "",
            couponId: definition.couponId,
            validUntil: definition.validUntil,
            sourceType: "booking_public_coupon",
            sourceId: request.reservationId || request.requestId,
            note: "予約時に選択",
            transactionId: createTransactionId("COUPON-BOOKING-GRANT")
          });
          coupon = mergeServerMemberCoupon(grantResult.memberCoupon);
        } else {
          coupon = grantCouponDefinitionToMember(definition, member, {
            reason: "予約時に選択",
            source: definition.source,
            sourceType: "booking-public-coupon",
            sourceId: request.reservationId || request.requestId,
            staffName: "予約フォーム"
          });
          if (coupon) coupons.unshift(coupon);
        }
      }
    }
    if (!coupon || getCouponStatus(coupon) === "使用済み") continue;
    if (isProductionApiMode()) {
      const reserveResult = await apiRequest("reserveMemberCouponForBooking", {
        memberCouponId: coupon.memberCouponId || coupon.couponId,
        memberId: request.memberId,
        bookingId: request.reservationId || request.requestId,
        usageDate: request.firstDateTime,
        note: request.menu || "",
        transactionId: createTransactionId("COUPON-RESERVE")
      });
      mergeServerMemberCoupon(reserveResult.memberCoupon);
      changed = true;
      continue;
    }
    coupon.status = "予約で使用予定";
    coupon.reservationStatus = "予約で使用予定";
    coupon.reservationId = request.reservationId || request.requestId;
    coupon.reservationMenu = request.menu;
    coupon.updatedAt = new Date().toISOString();
    changed = true;
  }
  if (changed) writeJson(STORAGE_KEYS.myCoupons, coupons);
}

function releaseBookingPlannedCoupons(reservationId) {
  const coupons = readJson(STORAGE_KEYS.myCoupons, []);
  let changed = false;
  coupons.forEach((coupon) => {
    if (String(coupon.reservationId || "") === String(reservationId) && getCouponStatus(coupon) === "予約で使用予定") {
      coupon.status = "未使用";
      coupon.reservationStatus = "";
      coupon.reservationId = "";
      coupon.updatedAt = new Date().toISOString();
      changed = true;
    }
  });
  if (changed) writeJson(STORAGE_KEYS.myCoupons, coupons);
}

async function releaseBookingPlannedCouponsRemote(reservationId) {
  const coupons = readJson(STORAGE_KEYS.myCoupons, []).filter((coupon) => (
    String(coupon.reservationId || "") === String(reservationId) &&
    getCouponStatus(coupon) === "予約で使用予定"
  ));
  for (const coupon of coupons) {
    const result = await apiRequest("releaseReservedCoupon", {
      memberCouponId: coupon.memberCouponId || coupon.couponId,
      bookingId: reservationId,
      transactionId: createTransactionId("COUPON-RELEASE")
    });
    mergeServerMemberCoupon(result.memberCoupon);
  }
}

function normalizeCouponDefinition(coupon) {
  return {
    couponId: coupon.couponId || createId("COUPON"),
    type: coupon.type || (coupon.lineCouponUrl ? "LINEクーポン" : "クーポン"),
    title: coupon.title || coupon.name || "クーポン",
    description: coupon.description || coupon.desc || coupon.message || "",
    imageUrl: coupon.imageUrl || "",
    lineCouponUrl: coupon.lineCouponUrl || "",
    couponType: coupon.couponType || (coupon.isLineOnly ? "LINE限定クーポン" : "全会員向けクーポン"),
    category: coupon.category || "おすすめ",
    regularPrice: Number(coupon.regularPrice || 0),
    couponPrice: Number(coupon.couponPrice || 0),
    durationMinutes: Number(coupon.durationMinutes || coupon.duration || 0),
    bookingPriceKnown: coupon.bookingPriceKnown === true || Number(coupon.couponPrice || 0) > 0,
    bookingDurationKnown: coupon.bookingDurationKnown === true || Number(coupon.durationMinutes || coupon.duration || 0) > 0,
    discountAmount: Number(coupon.discountAmount || 0),
    discountRate: Number(coupon.discountRate || 0),
    targetMenu: coupon.targetMenu || "全メニュー",
    targetStaff: Array.isArray(coupon.targetStaff) ? coupon.targetStaff : ["all"],
    targetWeekdays: Array.isArray(coupon.targetWeekdays) ? coupon.targetWeekdays : [0, 2, 3, 4, 5, 6],
    condition: coupon.condition || coupon.usageCondition || "",
    startDate: coupon.startDate || coupon.validFrom || coupon.publishStartAt || coupon.startAt || jstDateKey(),
    endDate: coupon.endDate || coupon.validUntil || coupon.expires || coupon.publishEndAt || coupon.endAt || "",
    publishStartAt: coupon.publishStartAt || coupon.startDate || coupon.validFrom || coupon.startAt || jstDateKey(),
    publishEndAt: coupon.publishEndAt || coupon.endDate || coupon.validUntil || coupon.endAt || "",
    validStartAt: coupon.validStartAt || coupon.startDate || coupon.validFrom || coupon.startAt || jstDateKey(),
    validUntil: coupon.validUntil || coupon.endDate || coupon.expires || coupon.endAt || endOfMonthDateKey(),
    perUserLimit: Number(coupon.perUserLimit || 1),
    canCombine: Boolean(coupon.canCombine),
    selectableOnBooking: coupon.selectableOnBooking !== false,
    isRecommended: Boolean(coupon.isRecommended),
    isPublic: coupon.isPublic !== false && coupon.status !== "非公開" && coupon.status !== "終了",
    sortOrder: Number(coupon.sortOrder || 999),
    source: coupon.source || "Console作成",
    autoGrantCondition: coupon.autoGrantCondition || "",
    status: coupon.status || (coupon.isPublic === false ? "非公開" : "公開"),
    createdAt: coupon.createdAt || new Date().toISOString(),
    updatedAt: coupon.updatedAt || new Date().toISOString()
  };
}

function validateCouponDefinition(coupon) {
  if (coupon.regularPrice && coupon.couponPrice && coupon.couponPrice > coupon.regularPrice) {
    return { ok: false, message: "クーポン価格が通常価格を上回っています。" };
  }
  if (coupon.discountRate < 0 || coupon.discountRate > 100) {
    return { ok: false, message: "割引率は0〜100で入力してください。" };
  }
  if (coupon.regularPrice && coupon.couponPrice && coupon.discountAmount && coupon.regularPrice - coupon.couponPrice !== coupon.discountAmount) {
    return { ok: false, message: "通常価格・クーポン価格・割引額が矛盾しています。" };
  }
  return { ok: true };
}

function getCouponPublicationState(coupon) {
  if (coupon.status === "終了") return "終了";
  if (coupon.isPublic === false || coupon.status === "非公開") return "非公開";
  const today = jstDateKey();
  if (coupon.publishStartAt && coupon.publishStartAt > today) return "公開予定";
  if (coupon.publishEndAt && coupon.publishEndAt < today) return "終了";
  return "公開中";
}

function getCouponStatus(coupon) {
  if (coupon.status === "使用済み") return "使用済み";
  if (coupon.status === "スタッフ確認待ち") return "スタッフ確認待ち";
  if (coupon.status === "予約で使用予定" || coupon.reservationStatus === "予約で使用予定") return "予約で使用予定";
  if (isPastDateLabel(coupon.expires || coupon.validUntil)) return "期限切れ";
  return "使用可能";
}

function getCouponBenefitText(coupon) {
  if (Number(coupon.discountAmount || 0)) return `${formatYen(coupon.discountAmount)}OFF`;
  if (Number(coupon.discountRate || 0)) return `${coupon.discountRate}%OFF`;
  if (Number(coupon.regularPrice || 0) && Number(coupon.couponPrice || 0)) return `${formatYen(coupon.regularPrice)} → ${formatYen(coupon.couponPrice)}`;
  if (Number(coupon.regularPrice || 0) && !Number(coupon.couponPrice || 0)) return `${formatYen(coupon.regularPrice)}相当`;
  return coupon.description || coupon.message || coupon.condition || "";
}

function couponMatchesAdminFilter(coupon, filter) {
  const state = getCouponPublicationState(coupon);
  if (filter === "LINEクーポン") return isLineCouponDefinition(coupon) && state === "公開中";
  if (["公開中", "公開予定", "終了", "非公開"].includes(filter)) return state === filter;
  if (filter === "個別付与用") return coupon.couponType === "個別付与クーポン" || coupon.source === "スタッフ手動付与";
  if (filter === "ガチャ連動") return coupon.couponType === "ガチャ当選クーポン" || coupon.source === "ガチャ";
  if (filter === "年間特典連動") return coupon.couponType === "年間カードコレクション特典" || coupon.source === "年間特典";
  return true;
}

function getCouponIssueStats(coupon, myCoupons = readJson(STORAGE_KEYS.myCoupons, [])) {
  const issued = myCoupons.filter((item) => item.parentCouponId === coupon.couponId || item.couponDefinitionId === coupon.couponId);
  return {
    issued: issued.length,
    used: issued.filter((item) => getCouponStatus(item) === "使用済み").length,
    unused: issued.filter((item) => getCouponStatus(item) === "使用可能").length
  };
}

function isCouponForDate(coupon, dateTime) {
  const date = dateTime ? new Date(dateTime) : new Date();
  const key = Number.isNaN(date.getTime()) ? jstDateKey() : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  if ((coupon.validStartAt || coupon.startAt) && key < (coupon.validStartAt || coupon.startAt)) return false;
  if ((coupon.validUntil || coupon.expires) && key > (coupon.validUntil || coupon.expires)) return false;
  const weekdays = coupon.targetWeekdays || [];
  if (weekdays.length && !weekdays.includes(date.getDay())) return false;
  return true;
}

function isCouponForStaff(coupon, staffId) {
  const targetStaff = coupon.targetStaff || ["all"];
  if (!staffId || targetStaff.includes("all")) return true;
  return targetStaff.includes(staffId);
}

function hasCouponUsageCapacity(coupon, memberId) {
  const issued = readJson(STORAGE_KEYS.myCoupons, []).filter((item) => (
    String(item.memberId || "") === String(memberId || "") &&
    (item.parentCouponId === coupon.couponId || item.couponDefinitionId === coupon.couponId)
  ));
  return issued.length < Number(coupon.perUserLimit || 1);
}

function grantCouponDefinitionToMember(coupon, member, options = {}) {
  const normalized = normalizeCouponDefinition(coupon);
  const coupons = readJson(STORAGE_KEYS.myCoupons, []);
  const allowDuplicate = Number(normalized.perUserLimit || 1) > 1;
  const duplicate = coupons.some((item) => (
    item.memberId === member.memberId &&
    (item.parentCouponId === normalized.couponId || item.couponDefinitionId === normalized.couponId) &&
    getCouponStatus(item) !== "使用済み"
  ));
  if (duplicate && !allowDuplicate) {
    showToast("同じクーポンがすでに付与されています。");
    return null;
  }
  const now = new Date().toISOString();
  const issued = {
    couponId: createId("MYCOUPON"),
    parentCouponId: normalized.couponId,
    couponDefinitionId: normalized.couponId,
    memberId: member.memberId,
    lineUserId: member.lineUserId || "",
    title: normalized.title,
    description: normalized.description,
    message: normalized.description,
    couponType: normalized.couponType,
    category: normalized.category,
    regularPrice: normalized.regularPrice,
    couponPrice: normalized.couponPrice,
    discountAmount: normalized.discountAmount,
    discountRate: normalized.discountRate,
    targetMenu: normalized.targetMenu,
    targetStaff: normalized.targetStaff,
    targetWeekdays: normalized.targetWeekdays,
    condition: normalized.condition,
    source: options.source || normalized.source || "Console作成",
    sourceType: options.sourceType || normalized.source || "Console作成",
    sourceId: options.sourceId || "",
    linkedCardHistoryId: options.linkedCardHistoryId || "",
    linkedRewardId: options.linkedRewardId || "",
    expires: options.expires || normalized.validUntil,
    validUntil: options.expires || normalized.validUntil,
    selectableOnBooking: normalized.selectableOnBooking,
    status: "未使用",
    grantReason: options.reason || "",
    grantMemo: options.memo || "",
    grantedByStaff: options.staffName || getAdminSession()?.name || "スタッフ",
    createdAt: now,
    grantedAt: now,
    updatedAt: now,
    snapshotCoupon: JSON.stringify(normalized)
  };
  coupons.unshift(issued);
  writeJson(STORAGE_KEYS.myCoupons, coupons);
  return issued;
}

function createLinkedCouponFromGacha(draw) {
  const member = findMember(draw.memberId) || getProfile();
  const match = getAdminCoupons().find((coupon) => (
    coupon.source === "ガチャ" &&
    (coupon.title === draw.prizeName || coupon.targetMenu === draw.targetMenu)
  ));
  const base = match || normalizeCouponDefinition({
    couponId: `GACHA-COUPON-${draw.cardId}`,
    title: draw.prizeName,
    description: draw.prizeDescription,
    couponType: "ガチャ当選クーポン",
    category: "ガチャ当選",
    targetMenu: draw.targetMenu || "全メニュー",
    validUntil: draw.validUntil,
    condition: draw.usageCondition,
    source: "ガチャ",
    isPublic: true,
    selectableOnBooking: true
  });
  const issued = grantCouponDefinitionToMember(base, member, {
    source: "ガチャ",
    sourceType: "gacha-card",
    sourceId: draw.cardHistoryId,
    linkedCardHistoryId: draw.cardHistoryId,
    expires: draw.validUntil,
    reason: `${draw.cardName} 当選`,
    staffName: "自動発行"
  });
  if (issued) {
    draw.linkedCouponId = issued.couponId;
    issued.linkedCardHistoryId = draw.cardHistoryId;
  }
  return issued;
}

function syncLinkedCouponUsage(coupon, status) {
  if (!coupon.linkedCardHistoryId) return;
  const cardStores = [STORAGE_KEYS.gachaCardHistory, STORAGE_KEYS.monthlyGachaDraws];
  cardStores.forEach((key) => {
    const cards = readJson(key, []);
    const card = cards.find((item) => item.cardHistoryId === coupon.linkedCardHistoryId);
    if (!card) return;
    const nextState = status === "使用済み" ? "used" : "available";
    card.status = nextState;
    card.lifecycleState = nextState;
    card.useState = nextState;
    card.usedAt = nextState === "used" ? coupon.usedAt : "";
    card.usedByStaff = nextState === "used" ? coupon.confirmedByStaff : "";
    card.linkedCouponId = coupon.couponId;
    writeJson(key, cards);
  });
}

function formatTargetStaff(targetStaff) {
  if (!Array.isArray(targetStaff) || targetStaff.includes("all")) return "全スタッフ";
  return targetStaff.map(getStaffName).join("、");
}

function parseWeekdayList(value) {
  const parsed = String(value || "").split(",").map((item) => Number(item.trim())).filter((item) => !Number.isNaN(item) && item >= 0 && item <= 6);
  return parsed.length ? parsed : [0, 2, 3, 4, 5, 6];
}

function nextCouponSortOrder(coupons) {
  return coupons.reduce((max, coupon) => Math.max(max, Number(coupon.sortOrder || 0)), 0) + 10;
}

function buildNextReservationCardData(reservation) {
  if (!reservation) {
    return {
      hasReservation: false,
      date: "",
      time: "",
      staffName: "",
      status: ""
    };
  }
  const dateTime = getBookingDisplayDateTime(reservation);
  const parsedDate = parseReservationDateTimeParts(dateTime);
  return {
    hasReservation: true,
    date: parsedDate.date,
    time: parsedDate.time,
    staffName: String(reservation.staffName || reservation.staff || "").trim(),
    status: reservation.status || "",
    title: [parsedDate.dateLabel, parsedDate.time].filter(Boolean).join("\n") || "予約内容を確認する",
    countdownLabel: buildReservationCountdownLabel(dateTime)
  };
}

function parseReservationDateTimeParts(value) {
  const raw = String(value || "").trim();
  if (!raw) return { date: "", time: "", dateLabel: "" };
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return { date: raw, time: "", dateLabel: raw };
  return {
    date: new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit" }).format(date).replaceAll("/", "-"),
    time: date.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Tokyo" }),
    dateLabel: date.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Tokyo" })
  };
}

function buildReservationCountdownLabel(value) {
  if (!value) return "";
  const daysUntil = daysUntilDate(value);
  if (daysUntil === 0) return "本日です";
  if (daysUntil === 1) return "明日です";
  if (daysUntil > 1) return `あと${daysUntil}日です`;
  return "予約内容を確認する";
}

function renderApp() {
  refreshGachaCardStates();
  appState.todayFortune = buildFortunePreview();
  renderHome();
  renderReservationStatus();
  renderCoupons();
  renderFortune();
  renderGacha();
  renderMyCards();
  renderCollectionRewardsPage();
  renderGachaHistoryPage();
  renderLounge();
  renderMyPage();
  renderAdmin();
}

function renderGachaCollectionViews() {
  refreshGachaCardStates();
  renderGacha();
  renderMyCards();
  renderCollectionRewardsPage();
  renderGachaHistoryPage();
}

function renderHome() {
  const nextReservation = buildNextReservationCardData(getNextReservation());
  const coupons = [...getPublicLineCoupons(), ...getAvailableCoupons()];
  const gachaStatus = getMonthlyGachaStatus();
  renderCustomerCheckIn();
  const reservationTitle = document.getElementById("homeNextReservationTitle");
  const reservationMeta = document.getElementById("homeNextReservationMeta");
  const reservationCountdown = document.getElementById("homeNextReservationCountdown");
  if (nextReservation.hasReservation) {
    reservationTitle.textContent = nextReservation.title;
    if (nextReservation.staffName) {
      reservationMeta.hidden = false;
      reservationMeta.textContent = `担当：${nextReservation.staffName}`;
    } else {
      reservationMeta.hidden = true;
      reservationMeta.textContent = "";
    }
    reservationCountdown.textContent = nextReservation.countdownLabel || "予約内容を確認する";
  } else {
    reservationTitle.textContent = "次回のご予約はありません";
    reservationMeta.hidden = false;
    reservationMeta.textContent = "ご希望の日時から予約できます";
    reservationCountdown.textContent = "予約をする";
  }

  const couponBadge = document.getElementById("homeCouponBadge");
  if (couponBadge) {
    couponBadge.hidden = coupons.length === 0;
    couponBadge.textContent = `${coupons.length}枚`;
  }

  const gachaBadge = document.getElementById("homeGachaBadge");
  if (gachaBadge) {
    gachaBadge.textContent = gachaStatus.used
      ? "今月は使用済み"
      : gachaStatus.state === "利用可能"
        ? "今月まだ引けます"
        : "準備中";
  }

  const fortuneBadge = document.getElementById("homeFortuneBadge");
  if (fortuneBadge) {
    fortuneBadge.textContent = appState.todayFortune?.summary || "今日の運勢をチェック";
  }
  const savedBirthDate = localStorage.getItem(STORAGE_KEYS.birthDate);
  if (savedBirthDate) warmTeamFortuneCache(savedBirthDate);

  const loungeCard = document.getElementById("homeLoungeCard");
  const loungeBadge = document.getElementById("homeLoungeBadge");
  if (loungeCard) loungeCard.classList.toggle("is-coming-soon", !isLoungeOpen());
  if (loungeBadge) loungeBadge.textContent = isLoungeOpen() ? "OPEN" : "10月スタート予定";
}

function isLineLinkedCustomer(profile = getProfile()) {
  const memberId = String(profile.memberId || profile.linkedMemberId || "").trim();
  return Boolean(memberId && !memberId.startsWith("guest_") && String(profile.lineUserId || "").trim() && String(profile.memberToken || "").trim());
}

function renderCustomerCheckIn() {
  const profile = getProfile();
  const button = document.getElementById("customerCheckInButton");
  const dialog = document.getElementById("customerCheckInDialog");
  if (!button || !dialog) return;
  const linked = isLineLinkedCustomer(profile);
  const checkedInToday = linked && isToday(profile.lastVisitDate);
  button.hidden = !linked;
  button.classList.toggle("is-complete", checkedInToday);
  document.getElementById("customerCheckInTitle").textContent = checkedInToday ? "本日の来店記録済み" : "来店しました";
  document.getElementById("customerCheckInStatus").textContent = checkedInToday ? "ご来店ありがとうございます" : "ご来店時にタップしてください";
  dialog.hidden = !linked || !appState.customerCheckInOpen;
  document.body.classList.toggle("has-customer-checkin-dialog", linked && appState.customerCheckInOpen);
  const confirmButton = document.getElementById("customerCheckInConfirmButton");
  if (confirmButton) setButtonLoading(confirmButton, appState.customerCheckInBusy, "記録中…");
}

async function handleCustomerCheckInAction(action) {
  const profile = getProfile();
  if (!isLineLinkedCustomer(profile)) {
    showToast("LINE連携済みの本人画面からご利用ください。");
    return;
  }
  if (action === "open") {
    if (isToday(profile.lastVisitDate)) {
      showToast("本日の来店はすでに記録されています");
      return;
    }
    appState.customerCheckInOpen = true;
    renderCustomerCheckIn();
    return;
  }
  if (action === "cancel") {
    if (appState.customerCheckInBusy) return;
    appState.customerCheckInOpen = false;
    renderCustomerCheckIn();
    return;
  }
  if (action !== "confirm" || appState.customerCheckInBusy) return;
  appState.customerCheckInBusy = true;
  renderCustomerCheckIn();
  try {
    const result = await apiRequest("customerCheckIn", {
      memberId: profile.memberId || profile.linkedMemberId,
      lineUserId: profile.lineUserId,
      memberToken: profile.memberToken
    });
    const data = result.data || result;
    const member = data.member || {};
    const nextProfile = {
      ...profile,
      memberId: member.memberId || profile.memberId,
      linkedMemberId: member.memberId || profile.linkedMemberId || profile.memberId,
      lineUserId: member.lineUserId || profile.lineUserId,
      nickname: member.nickname || member.realName || profile.nickname,
      lastVisitDate: member.lastVisitDate || data.visitDate || profile.lastVisitDate,
      visitCount: Number(member.visitCount ?? profile.visitCount ?? 0),
      identityType: "member"
    };
    writeJson(STORAGE_KEYS.profile, nextProfile);
    mergeCurrentMemberCache(nextProfile);
    appState.customerCheckInOpen = false;
    renderApp();
    showToast(data.duplicate ? "本日の来店はすでに記録されています" : "本日の来店を記録しました");
  } catch (error) {
    console.error("[TEAM LINK CUSTOMER CHECK-IN FAILED]", error);
    showToast(error?.message || "来店を記録できませんでした。もう一度お試しください。");
  } finally {
    appState.customerCheckInBusy = false;
    renderCustomerCheckIn();
  }
}

function mergeCurrentMemberCache(profile) {
  const members = getMembers();
  const index = members.findIndex((member) => String(member.memberId || "") === String(profile.memberId || "") || (profile.lineUserId && String(member.lineUserId || "") === String(profile.lineUserId)));
  const member = {
    ...(index >= 0 ? members[index] : {}),
    memberId: profile.memberId,
    lineUserId: profile.lineUserId,
    nickname: profile.nickname,
    realName: profile.realName || profile.nickname,
    birthDate: profile.birthDate || "",
    lastVisitDate: profile.lastVisitDate,
    visitCount: Number(profile.visitCount || 0)
  };
  if (index >= 0) members[index] = member;
  else members.unshift(member);
  writeJson(STORAGE_KEYS.members, members);
}

async function initializeLinkedIdentityFromUrl() {
  const params = new URLSearchParams(location.search);
  const current = getProfile();
  const hasIdentityParams = Boolean(params.get("memberId") || params.get("lineUserId") || params.get("memberToken"));
  const memberId = String(params.get("memberId") || current.memberId || current.linkedMemberId || "").trim();
  const lineUserId = String(params.get("lineUserId") || current.lineUserId || "").trim();
  const memberToken = String(params.get("memberToken") || current.memberToken || "").trim();
  if (!memberId || !lineUserId || !memberToken || !isProductionApiMode()) return;
  try {
    const result = await apiRequest("getLinkedMemberProfile", { memberId, lineUserId, memberToken });
    const member = result.data?.member || result.member;
    if (!member?.memberId || !member?.lineUserId) throw new Error("本人情報を取得できませんでした。");
    const linkedBirthDate = normalizeLinkedMemberBirthDate(member.birthDate || current.birthDate || "");
    const nextProfile = {
      ...defaultProfile,
      ...current,
      memberId: member.memberId,
      linkedMemberId: member.memberId,
      guestId: current.guestId || getOrCreateGuestId(),
      identityType: "member",
      lineUserId: member.lineUserId,
      memberToken,
      nickname: member.nickname || member.realName || current.nickname,
      realName: member.realName || member.nickname || current.realName,
      birthDate: linkedBirthDate,
      lastVisitDate: member.lastVisitDate || "",
      visitCount: Number(member.visitCount || 0)
    };
    writeJson(STORAGE_KEYS.profile, nextProfile);
    if (linkedBirthDate) localStorage.setItem(STORAGE_KEYS.birthDate, linkedBirthDate);
    mergeCurrentMemberCache(nextProfile);
    if (hasIdentityParams) {
      params.delete("memberId");
      params.delete("lineUserId");
      params.delete("memberToken");
      const cleanQuery = params.toString();
      history.replaceState({}, "", `${location.pathname}${cleanQuery ? `?${cleanQuery}` : ""}${location.hash}`);
    }
  } catch (error) {
    console.error("[TEAM LINK LINKED IDENTITY FAILED]", error);
    showToast("本人情報を確認できませんでした。LINEからもう一度開いてください。");
  }
}

function normalizeLinkedMemberBirthDate(value) {
  const match = String(value || "").trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return "";
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return "";
  return `${match[1]}-${match[2]}-${match[3]}`;
}

function warmTeamFortuneCache(birthDate) {
  loadTeamFortune(birthDate).catch((error) => {
    console.info("[TEAM Fortune Preload] unavailable", { errorCode: error?.code || error?.errorCode || "" });
  });
}

function renderReservationStatus() {
  const nextReservation = getNextReservation();
  const container = document.getElementById("reservationStatusPanel");
  if (!container) return;
  if (nextReservation) {
    const requestId = nextReservation.bookingRequestId || nextReservation.requestId || "";
    const consultationOpen = String(appState.bookingConsultationOpenId || "") === String(requestId);
    const consultations = readJson(STORAGE_KEYS.bookingConsultations, []).filter((item) => String(item.bookingRequestId || "") === String(requestId));
    const latestConsultation = consultations.slice().sort((a, b) => String(b.sentAt || "").localeCompare(String(a.sentAt || "")))[0] || null;
    const rows = [
      [getBookingDisplayDateTimeLabel(nextReservation), formatDateTime(getBookingDisplayDateTime(nextReservation))],
      nextReservation.staff ? ["担当者", nextReservation.staff] : null,
      ["状態", normalizeBookingStatus(nextReservation.status || nextReservation.currentStatus || "確認中")],
      getReservationMenuDisplayText(nextReservation) ? ["メニュー", getReservationMenuDisplayText(nextReservation)] : null,
      getReservationCouponDisplayText(nextReservation) ? ["使用クーポン", getReservationCouponDisplayText(nextReservation)] : null
    ].filter(Boolean);
    container.innerHTML = `
      <p class="kicker">Current booking</p>
      <h2>現在の予約</h2>
      <div class="summary-list">${summaryRows(rows)}</div>
      <p class="soft-note">予約内容の変更やキャンセルは、スタッフ確認後に反映されます。</p>
      ${latestConsultation ? `<p class="booking-consultation-latest"><strong>予約相談を受付済み</strong><span>${escapeHtml(latestConsultation.consultationType || "その他相談")} / ${escapeHtml(formatDateTime(latestConsultation.sentAt) || "送信済み")}</span></p>` : ""}
      <button class="secondary-button booking-consultation-open" type="button" data-booking-action="openBookingConsultation" data-id="${escapeHtml(requestId)}">予約を変更・相談する</button>
      ${consultationOpen ? renderBookingConsultationForm(nextReservation) : ""}
    `;
  } else {
    container.innerHTML = `
      <p class="kicker">Reservation</p>
      <h2>現在の予約はありません</h2>
      <p>空き時間からすぐ予約するか、希望日時とメニューをスタッフへ相談できます。</p>
    `;
  }
}

function renderBookingConsultationForm(booking) {
  const requestId = booking.bookingRequestId || booking.requestId || "";
  return `
    <section class="booking-consultation-panel" data-booking-consultation-panel>
      <h3>予約変更の相談</h3>
      <p>現在の予約は自動変更されません。スタッフが内容を確認してご連絡します。</p>
      <label>相談内容
        <select data-booking-consultation-type ${appState.bookingConsultationBusy ? "disabled" : ""}>
          <option value="">選択してください</option>
          <option value="日時を変更したい">日時を変更したい</option>
          <option value="メニューを変更したい">メニューを変更したい</option>
          <option value="キャンセルしたい">キャンセルしたい</option>
          <option value="その他相談">その他相談</option>
        </select>
      </label>
      <label>コメント
        <textarea data-booking-consultation-comment rows="4" placeholder="例：14:00に変更できますか？" ${appState.bookingConsultationBusy ? "disabled" : ""}></textarea>
      </label>
      <div class="booking-consultation-actions">
        <button class="primary-button" type="button" data-booking-action="submitBookingConsultation" data-id="${escapeHtml(requestId)}" ${appState.bookingConsultationBusy ? "disabled" : ""}>${appState.bookingConsultationBusy ? "送信中…" : "相談内容を送信する"}</button>
        <button class="secondary-button" type="button" data-booking-action="closeBookingConsultation" data-id="${escapeHtml(requestId)}" ${appState.bookingConsultationBusy ? "disabled" : ""}>戻る</button>
      </div>
    </section>
  `;
}

function getReservationMenuDisplayText(booking) {
  const snapshots = Array.isArray(booking?.selectedMenus) ? booking.selectedMenus : [];
  if (snapshots.length) return snapshots.map((menu) => menu.title).filter(Boolean).join("＋");
  if (booking?.menu) return booking.menu;
  const ids = Array.isArray(booking?.menuIds) ? booking.menuIds : [];
  if (!ids.length) return "";
  const commonMenus = [
    ...getReservationMenus(),
    ...getBookableCouponMenus({ staffId: booking.staffId || "", dateTime: getBookingDisplayDateTime(booking) })
  ];
  return ids.map((id) => commonMenus.find((menu) => menu.menuId === id)?.title || "").filter(Boolean).join("＋");
}

function getReservationCouponDisplayText(booking) {
  const coupons = Array.isArray(booking?.selectedCoupons) ? booking.selectedCoupons : [];
  if (coupons.length) return coupons.map((coupon) => coupon.title).filter(Boolean).join("、");
  if (booking?.couponTitle) return booking.couponTitle;
  const couponIds = Array.isArray(booking?.couponIds) ? booking.couponIds : [];
  if (!couponIds.length) return "";
  const definitions = [...getAdminCoupons(), ...getProfileCoupons()];
  return couponIds.map((id) => definitions.find((coupon) => (
    coupon.couponId === id ||
    coupon.memberCouponId === id ||
    coupon.parentCouponId === id ||
    coupon.couponDefinitionId === id
  ))?.title || "").filter(Boolean).join("、");
}

function openInitialView() {
  const params = new URLSearchParams(location.search);
  const view = params.get("view") || params.get("page") || "home";
  const adminSection = String(params.get("section") || "").trim();
  if (view === "admin" && adminTabs.some((tab) => tab.key === adminSection)) {
    appState.adminTab = adminSection;
    if (adminSection === "bookings") appState.adminFocusedBookingRequestId = String(params.get("requestId") || "").trim();
  }
  showView(viewMap[view] ? view : "home", { replace: true });
}

function showView(viewKey, options = {}) {
  if (viewKey === "loungeRegister" && !isLoungeOpen()) {
    showToast("ご縁ラウンジは10月スタート予定です。ただいま準備中です。");
    viewKey = "lounge";
  }
  const viewId = viewMap[viewKey] || viewKey;
  const target = document.getElementById(viewId);
  if (!target) return;
  if (appState.currentView === "bookingView" && viewId !== "bookingView" && options.preserveBookingDraft !== false) captureBookingDraft();
  if (!options.replace) appState.previousView = appState.currentView;
  appState.currentView = viewId;
  document.querySelectorAll(".view").forEach((view) => view.classList.toggle("is-active", view.id === viewId));
  const routeKey = Object.keys(viewMap).find((key) => viewMap[key] === viewId) || "home";
  document.body.classList.toggle("is-admin-view", routeKey === "admin");
  document.body.classList.toggle("is-home-view", routeKey === "home");
  const url = new URL(location.href);
  url.searchParams.set("view", routeKey);
  history[options.replace ? "replaceState" : "pushState"]({ view: routeKey }, "", url);
  window.scrollTo({ top: 0, behavior: "smooth" });
  updateNav(routeKey);
  if (routeKey === "home") renderHome();
  if (routeKey === "booking") restoreBookingDraft();
  if (routeKey === "fortune") renderFortune();
  if (routeKey === "coupons") renderCoupons();
  if (routeKey === "gacha") renderGacha();
  if (routeKey === "mycards") renderMyCards();
  if (routeKey === "collectionRewards") renderCollectionRewardsPage();
  if (routeKey === "gachaHistory") renderGachaHistoryPage();
  if (routeKey === "lounge") renderLounge();
  if (routeKey === "mypage") renderMyPage();
  if (routeKey === "admin") renderAdmin();
}

window.addEventListener("popstate", () => {
  const params = new URLSearchParams(location.search);
  const view = params.get("view") || "home";
  showView(view, { replace: true });
});

function updateNav(routeKey) {
  document.querySelectorAll(".bottom-nav button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === routeKey);
  });
}

function bindHomeCarousel() {
  const carousel = document.getElementById("homeCarousel");
  if (!carousel) return;
  carousel.addEventListener("scroll", () => {
    clearTimeout(bindHomeCarousel.timer);
    bindHomeCarousel.timer = setTimeout(updateHomeCarouselActive, 60);
  }, { passive: true });
  document.getElementById("homeCarouselDots").innerHTML = Array.from(carousel.querySelectorAll(".feature-card"))
    .map((_, index) => `<span class="${index === 0 ? "is-active" : ""}"></span>`)
    .join("");
  requestAnimationFrame(() => {
    const firstFocus = carousel.querySelector('[data-feature="reservation"]');
    if (firstFocus) {
      carousel.scrollLeft = firstFocus.offsetLeft - ((carousel.clientWidth - firstFocus.offsetWidth) / 2);
    }
    updateHomeCarouselActive();
  });
}

function updateHomeCarouselActive() {
  const carousel = document.getElementById("homeCarousel");
  if (!carousel) return;
  const cards = Array.from(carousel.querySelectorAll(".feature-card"));
  if (!cards.length) return;
  const center = carousel.scrollLeft + carousel.clientWidth / 2;
  let activeIndex = 0;
  let minDistance = Infinity;
  cards.forEach((card, index) => {
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const distance = Math.abs(center - cardCenter);
    if (distance < minDistance) {
      minDistance = distance;
      activeIndex = index;
    }
  });
  cards.forEach((card, index) => card.classList.toggle("is-active", index === activeIndex));
  document.querySelectorAll("#homeCarouselDots span").forEach((dot, index) => {
    dot.classList.toggle("is-active", index === activeIndex);
  });
}

function buildFortunePreview() {
  const birthDate = localStorage.getItem(STORAGE_KEYS.birthDate);
  const latest = readJson(STORAGE_KEYS.fortuneHistory, [])[0];
  if (birthDate && latest?.type) {
    return {
      type: latest.type,
      beauty: getTeamFortuneLuckDisplay({ luckName: latest.todayLuck }) || "詳しく見る",
      color: latest.imagePath || "",
      summary: latest.type
    };
  }
  return {
    type: birthDate ? "今日のTEAM占い" : "守護どうぶつ未登録",
    beauty: birthDate ? "詳しく見る" : "未登録",
    color: "",
    summary: birthDate ? "今日の運気を詳しく見る" : "守護どうぶつを見つける"
  };
}

function renderFortuneBirthDateFields() {
  const years = Array.from({ length: currentYear() - 1919 }, (_, index) => currentYear() - index);
  const months = Array.from({ length: 12 }, (_, index) => index + 1);
  const days = Array.from({ length: 31 }, (_, index) => index + 1);
  return `
    <fieldset class="team-fortune-birth-fieldset">
      <legend>生年月日</legend>
      <small>年・月・日を選択してください</small>
      <div class="team-fortune-birth-selects">
        <select name="birthYear" required aria-label="生年月日の年">
          <option value="">年</option>
          ${years.map((year) => `<option value="${year}">${year}年</option>`).join("")}
        </select>
        <select name="birthMonth" required aria-label="生年月日の月">
          <option value="">月</option>
          ${months.map((month) => `<option value="${month}">${String(month).padStart(2, "0")}月</option>`).join("")}
        </select>
        <select name="birthDay" required aria-label="生年月日の日">
          <option value="">日</option>
          ${days.map((day) => `<option value="${day}">${String(day).padStart(2, "0")}日</option>`).join("")}
        </select>
      </div>
      <p class="team-fortune-birth-error" id="birthDateError" role="alert" hidden>生年月日をすべて選択してください</p>
    </fieldset>
  `;
}

function updateFortuneBirthDays(form) {
  const yearSelect = form?.elements?.birthYear;
  const monthSelect = form?.elements?.birthMonth;
  const daySelect = form?.elements?.birthDay;
  if (!yearSelect || !monthSelect || !daySelect) return;
  const previousDay = Number(daySelect.value);
  const year = Number(yearSelect.value) || 2000;
  const month = Number(monthSelect.value) || 1;
  const maxDay = new Date(year, month, 0).getDate();
  daySelect.innerHTML = `<option value="">日</option>${Array.from({ length: maxDay }, (_, index) => {
    const day = index + 1;
    return `<option value="${day}">${String(day).padStart(2, "0")}日</option>`;
  }).join("")}`;
  if (previousDay && previousDay <= maxDay) daySelect.value = String(previousDay);
}

function getFortuneBirthDate(form) {
  const year = Number(form?.elements?.birthYear?.value);
  const month = Number(form?.elements?.birthMonth?.value);
  const day = Number(form?.elements?.birthDay?.value);
  if (!year || !month || !day) return "";
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return "";
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function renderFortune() {
  const container = document.getElementById("fortuneContent");
  const birthDate = localStorage.getItem(STORAGE_KEYS.birthDate);
  stopTeamFortuneLoadingMessages();
  if (!birthDate) {
    appState.fortuneLoading = false;
    container.innerHTML = `
      <form class="step-form team-fortune-onboarding" id="birthDateForm" novalidate>
        <p class="kicker">TEAM FORTUNE</p>
        <h3>あなたの守護どうぶつを見つけよう</h3>
        <p>生年月日から、あなたに寄り添うTEAM LINKタイプを確認します。</p>
        ${renderFortuneBirthDateFields()}
        <button class="primary-button" type="submit">守護どうぶつを見つける</button>
        <small>正式データだけを使い、未確認の結果は推測表示しません。</small>
      </form>
    `;
    const birthDateForm = document.getElementById("birthDateForm");
    const birthDateError = document.getElementById("birthDateError");
    const clearBirthDateError = () => { if (birthDateError) birthDateError.hidden = true; };
    birthDateForm.elements.birthYear.addEventListener("change", () => {
      updateFortuneBirthDays(birthDateForm);
      clearBirthDateError();
    });
    birthDateForm.elements.birthMonth.addEventListener("change", () => {
      updateFortuneBirthDays(birthDateForm);
      clearBirthDateError();
    });
    birthDateForm.elements.birthDay.addEventListener("change", clearBirthDateError);
    birthDateForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (appState.fortuneLoading) return;
      const selectedBirthDate = getFortuneBirthDate(event.currentTarget);
      if (!selectedBirthDate) {
        if (birthDateError) birthDateError.hidden = false;
        showToast("生年月日をすべて選択してください");
        return;
      }
      const submitButton = event.currentTarget.querySelector("button[type='submit']");
      appState.fortuneLoading = true;
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "確認しています…";
      }
      localStorage.setItem(STORAGE_KEYS.birthDate, selectedBirthDate);
      appState.todayFortune = buildFortunePreview();
      renderHome();
      renderFortune();
    });
    return;
  }

  appState.fortuneLoading = true;
  const startedAt = performance.now();
  container.innerHTML = `
    <article class="fortune-card team-fortune-loading">
      <span class="badge">TEAM占い</span>
      <h3 id="teamFortuneLoadingMessage">守護どうぶつを確認しています</h3>
      <div class="team-fortune-loading-lights" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
    </article>
  `;
  startTeamFortuneLoadingMessages(container);
  loadTeamFortune(birthDate)
    .then((result) => {
      stopTeamFortuneLoadingMessages();
      appState.fortuneLoading = false;
      container.innerHTML = renderTeamFortuneResult(result);
      bindTeamFortuneActions(container);
      appState.todayFortune = buildFortunePreview();
      renderHome();
      console.info("[TEAM Fortune Load]", { elapsedMs: Math.round(performance.now() - startedAt), cache: teamFortuneSessionCache.has(`${birthDate}|${jstDateKey()}`) });
    })
    .catch((error) => {
      stopTeamFortuneLoadingMessages();
      appState.fortuneLoading = false;
      console.warn("[TEAM Fortune] result unavailable", error);
      container.innerHTML = renderTeamFortuneDataWaiting(error, birthDate);
      bindTeamFortuneActions(container);
    });
}

function startTeamFortuneLoadingMessages(container) {
  stopTeamFortuneLoadingMessages();
  const messages = [
    "守護どうぶつを確認しています",
    "運気の流れを確認しています",
    "あなたの結果を準備しています"
  ];
  let index = 0;
  teamFortuneLoadingTimer = window.setInterval(() => {
    const target = container.querySelector("#teamFortuneLoadingMessage");
    if (!target) {
      stopTeamFortuneLoadingMessages();
      return;
    }
    index = (index + 1) % messages.length;
    target.textContent = messages[index];
  }, 700);
}

function stopTeamFortuneLoadingMessages() {
  if (!teamFortuneLoadingTimer) return;
  window.clearInterval(teamFortuneLoadingTimer);
  teamFortuneLoadingTimer = null;
}

async function loadTeamFortune(birthDate) {
  if (!TEAM_LINK_FORTUNE_API_URL || !TEAM_LINK_FORTUNE_DB_ID) {
    throw createFortuneError("FORTUNE_API_NOT_CONFIGURED", "TEAM LINK Fortune DB APIが未設定です。");
  }
  const cacheKey = `${birthDate}|${jstDateKey()}`;
  if (teamFortuneSessionCache.has(cacheKey)) return teamFortuneSessionCache.get(cacheKey);
  const stored = readTeamFortuneSessionResult(cacheKey);
  if (stored) {
    const cachedRequest = Promise.resolve(stored);
    teamFortuneSessionCache.set(cacheKey, cachedRequest);
    return cachedRequest;
  }
  const request = fortuneApiRequest("resolveTeamFortune", {
    birthDate,
    targetDate: jstDateKey(),
    fortuneSpreadsheetId: TEAM_LINK_FORTUNE_DB_ID
  }, { apiUrl: TEAM_LINK_FORTUNE_API_URL }).then((result) => {
    if (!result?.success) {
      throw createFortuneError(result?.errorCode || "FORTUNE_API_ERROR", result?.message || "TEAM占いデータを取得できませんでした。", result?.data || result);
    }
    const data = result.data || result;
    writeTeamFortuneSessionResult(cacheKey, data);
    return data;
  }).catch((error) => {
    teamFortuneSessionCache.delete(cacheKey);
    throw error;
  });
  teamFortuneSessionCache.set(cacheKey, request);
  return request;
}

function readTeamFortuneSessionResult(cacheKey) {
  try {
    const record = JSON.parse(sessionStorage.getItem(`teamFortuneResult:${cacheKey}`) || "null");
    return record?.date === jstDateKey() ? record.data : null;
  } catch {
    return null;
  }
}

function writeTeamFortuneSessionResult(cacheKey, data) {
  try {
    sessionStorage.setItem(`teamFortuneResult:${cacheKey}`, JSON.stringify({ date: jstDateKey(), data }));
  } catch {
    // セッションキャッシュが使用できない環境でも占い結果の表示は継続する。
  }
}

function createFortuneError(code, message, data = {}) {
  const error = new Error(message);
  error.code = code;
  error.data = data;
  return error;
}

async function fortuneApiRequest(action, payload = {}) {
  const url = new URL(TEAM_LINK_FORTUNE_API_URL);
  url.searchParams.set("action", action);
  url.searchParams.set("payload", JSON.stringify(payload));
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || typeof value === "object") return;
    url.searchParams.set(key, String(value));
  });
  url.searchParams.set("_", String(Date.now()));
  let response;
  let text = "";
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);
  try {
    response = await fetch(url.toString(), { method: "GET", redirect: "follow", cache: "no-store", signal: controller.signal });
    text = await response.text();
    const contentType = response.headers.get("content-type") || "";
    console.info("[TEAM FORTUNE API RESPONSE]", {
      action,
      apiUrl: TEAM_LINK_FORTUNE_API_URL,
      responseUrl: response.url,
      httpStatus: response.status,
      contentType,
      responsePrefix: text.slice(0, 200)
    });
    if (!response.ok) throw createFortuneError("FORTUNE_HTTP_ERROR", `HTTP ${response.status}`);
    if (!/^\s*[\[{]/.test(text)) throw createFortuneError("FORTUNE_NON_JSON_RESPONSE", "Fortune API returned a non-JSON response.");
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      throw createFortuneError("FORTUNE_JSON_PARSE_ERROR", "Fortune API response could not be parsed.", { cause: parseError?.message || "" });
    }
    if (!data?.success) throw createFortuneError(data?.errorCode || "FORTUNE_API_ERROR", data?.message || "Fortune API returned an error.", data?.data || data);
    return data;
  } catch (error) {
    console.error("[TEAM FORTUNE API ERROR]", {
      action,
      apiUrl: TEAM_LINK_FORTUNE_API_URL,
      responseUrl: response?.url || "",
      httpStatus: response?.status || "network_error",
      contentType: response?.headers?.get("content-type") || "",
      responsePrefix: text.slice(0, 200),
      error: error?.message || String(error),
      errorCode: error?.code || error?.errorCode || ""
    });
    if (error?.name === "AbortError") {
      throw createFortuneError("FORTUNE_TIMEOUT", "占いデータの取得がタイムアウトしました。");
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

function renderTeamFortuneResult(result) {
  const character = result.character || {};
  const calculation = result.calculation || {};
  const today = result.today || result.dayLuck || {};
  const month = result.month || result.monthLuck || {};
  const year = result.year || result.yearLuck || {};
  const todayName = getFortuneLuckName(today);
  const characterLuckProfile = createCharacterLuckProfile(character, calculation);
  saveFortuneHistory({
    date: jstDateKey(),
    type: character.displayName,
    todayLuck: getTeamFortuneLuckDisplay(today) || todayName,
    todayHint: getCharacterHomeHint(characterLuckProfile, today),
    imagePath: character.imagePath || ""
  });
  return `
    <article class="fortune-card team-fortune-card">
      ${fortuneCharacterVisual(character)}
      <span class="badge">あなたの守護どうぶつ</span>
      <h3>${escapeHtml(character.displayName || "判定中")}</h3>
      <p>${escapeHtml(character.catchCopy || "")}</p>
      ${renderFortuneJudgement(calculation, character)}
      <div class="team-fortune-overview">
        ${renderFortuneOverviewItem("今日の運気", today, renderFortuneSummaryPanel("今日の運気", today, "今日の過ごし方", character, calculation), true)}
        ${renderFortuneOverviewItem("今月の運気", month, renderFortuneSummaryPanel("今月の運気", month, "今月の流れ", character, calculation))}
        ${renderFortuneOverviewItem(`${new Date().getFullYear()}年の運気`, year, renderFortuneSummaryPanel(`${new Date().getFullYear()}年の運気`, year, "今年のテーマ", character, calculation))}
        <details class="team-fortune-overview-item">
          <summary><span>あなたの基本性格</span><strong>${escapeHtml(character.basicPersonality || "詳しく見る")}</strong></summary>
          <div class="team-fortune-overview-detail">
            <div class="team-fortune-section"><h4>基本性格</h4><p>${escapeHtml(character.basicPersonality || "")}</p></div>
            ${renderFortuneList("あなたの長所", character.strengths)}
            ${renderFortuneList("気をつけたいところ", character.cautions)}
            ${renderFortuneTextGrid(character)}
          </div>
        </details>
        <details class="team-fortune-overview-item fortune-compatibility-panel" id="fortuneCompatibilityPanel">
          <summary><span>相性を見る</span><strong>気になる相手との相性を確認</strong></summary>
          <div class="team-fortune-overview-detail">
            <form id="fortuneCompatibilityForm" class="mini-form compatibility-input-form">
              <label class="field">お相手の名前<input name="nickname" autocomplete="name" placeholder="お名前" required></label>
              ${renderCompatibilityBirthDateFields()}
              <label class="field">お相手の性別<select name="partnerGender" required><option value="">選択してください</option><option value="female">女性</option><option value="male">男性</option><option value="other">その他・回答しない</option></select></label>
              <button class="primary-button" type="submit">相性を見る</button>
            </form>
            <div id="fortuneCompatibilityResult" class="team-fortune-compatibility-result" aria-live="polite"></div>
          </div>
        </details>
      </div>
      <button class="secondary-button" type="button" id="resetBirthDate">生年月日を変更する</button>
    </article>
  `;
}

function renderFortuneOverviewItem(title, luck, detailHtml, open = false) {
  const primaryLuck = luck?.main || luck;
  const displayName = getTeamFortuneLuckDisplay(primaryLuck) || "詳しく見る";
  return `
    <details class="team-fortune-overview-item" ${open ? "open" : ""}>
      <summary>
        <span>${escapeHtml(title)}</span>
        <div class="team-fortune-overview-value">
          <strong>${escapeHtml(displayName)}</strong>
          ${renderTeamFortuneRating(primaryLuck, true)}
        </div>
      </summary>
      <div class="team-fortune-overview-detail">${detailHtml}</div>
    </details>
  `;
}

function renderCompatibilityBirthDateFields() {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 101 }, (_, index) => currentYear - index);
  const months = Array.from({ length: 12 }, (_, index) => index + 1);
  const days = Array.from({ length: 31 }, (_, index) => index + 1);
  const options = (values, suffix) => values.map((value) => `<option value="${value}">${value}${suffix}</option>`).join("");
  return `
    <fieldset class="compatibility-birth-fieldset">
      <legend>お相手の生年月日</legend>
      <div class="compatibility-birth-selects">
        <label><span>年</span><select name="partnerBirthYear" required><option value="">年</option>${options(years, "年")}</select></label>
        <label><span>月</span><select name="partnerBirthMonth" required><option value="">月</option>${options(months, "月")}</select></label>
        <label><span>日</span><select name="partnerBirthDay" required><option value="">日</option>${options(days, "日")}</select></label>
      </div>
    </fieldset>
  `;
}

function updateCompatibilityBirthDays(form) {
  const yearSelect = form?.elements?.partnerBirthYear;
  const monthSelect = form?.elements?.partnerBirthMonth;
  const daySelect = form?.elements?.partnerBirthDay;
  if (!yearSelect || !monthSelect || !daySelect) return;
  const previousDay = Number(daySelect.value);
  const year = Number(yearSelect.value) || 2000;
  const month = Number(monthSelect.value) || 1;
  const maxDay = new Date(year, month, 0).getDate();
  daySelect.innerHTML = `<option value="">日</option>${Array.from({ length: maxDay }, (_, index) => {
    const day = index + 1;
    return `<option value="${day}">${day}日</option>`;
  }).join("")}`;
  if (previousDay && previousDay <= maxDay) daySelect.value = String(previousDay);
}

function getCompatibilityBirthDate(formData) {
  const year = Number(formData.get("partnerBirthYear"));
  const month = Number(formData.get("partnerBirthMonth"));
  const day = Number(formData.get("partnerBirthDay"));
  if (!year || !month || !day) return "";
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return "";
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function fortuneMeter(label, value) {
  return `<div class="fortune-meter"><span>${label}</span><strong>${value}</strong><progress max="100" value="${value}"></progress></div>`;
}

function renderTeamFortuneDataWaiting(error, birthDate) {
  return `
    <article class="fortune-card team-fortune-card">
      <span class="badge">通信エラー</span>
      <h3>占いデータを取得できませんでした</h3>
      <p>通信状況をご確認のうえ、もう一度お試しください。</p>
      <div class="team-fortune-alert">
        <strong>占い結果を表示できませんでした</strong>
        <span>正式な占いデータ以外を代わりに表示することはありません。</span>
      </div>
      <button class="primary-button" type="button" id="retryTeamFortune">もう一度試す</button>
      <button class="secondary-button" type="button" id="resetBirthDate">生年月日を変更する</button>
    </article>
  `;
}

function fortuneCharacterVisual(character) {
  const image = character.imagePath || "";
  const fallback = `<span class="team-fortune-placeholder">${escapeHtml(character.animal || "TL")}</span>`;
  return `<div class="team-fortune-visual">${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(character.displayName || "守護どうぶつ")}" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'team-fortune-placeholder',textContent:'${escapeHtml(character.animal || "TL")}' }))">` : fallback}</div>`;
}

function renderFortuneJudgement(calculation, character) {
  const rows = [
    ["TEAM LINKタイプ", character.displayName || "-"]
  ];
  return `
    <section class="team-fortune-judgement">
      ${rows.map(([label, value]) => `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("")}
    </section>
  `;
}

function getFortuneLuckName(luck) {
  if (!luck || typeof luck !== "object") return "";
  return luck.displayLuckName || luck.luckName || luck.internalLuckName || "";
}

function getTeamFortuneLuckInfo(luck) {
  if (!luck || typeof luck !== "object") return null;
  const byCycle = TEAM_FORTUNE_LUCK_BY_CYCLE[Number(luck.cycleIndex)];
  if (byCycle) return byCycle;
  return TEAM_FORTUNE_LUCK_BY_INTERNAL[getFortuneLuckName(luck)] || null;
}

function renderTeamFortuneRating(luck, compact = false) {
  const info = getTeamFortuneLuckInfo(luck);
  const rating = Number(info?.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return "";
  const filled = "★".repeat(rating);
  const empty = "☆".repeat(5 - rating);
  return `
    <span class="team-fortune-rating${compact ? " is-compact" : ""}" aria-label="5段階中${rating}、${escapeHtml(info.ratingLabel)}">
      <span class="team-fortune-stars" aria-hidden="true"><b>${filled}</b><i>${empty}</i></span>
      <small>${escapeHtml(info.ratingLabel)}</small>
    </span>
  `;
}

function getTeamFortuneLuckDisplay(luck) {
  const info = getTeamFortuneLuckInfo(luck);
  return info?.title || getFortuneLuckName(luck);
}

function getTeamFortuneLuckMessage(luck, period = "") {
  const info = getTeamFortuneLuckInfo(luck);
  if (!info) return luck?.message || luck?.shortMeaning || luck?.sourceNote || "";
  const periodText = period === "day"
    ? info.todayMessage
    : period === "month"
      ? info.monthMessage
      : period === "year"
        ? info.yearMessage
        : info.theme;
  return periodText || info.theme || "";
}

function renderTeamFortuneLuckMeta(luck) {
  const info = getTeamFortuneLuckInfo(luck);
  if (!info) return "";
  return `
    <div class="team-fortune-luck-meta">
      <div><span>おすすめ</span><strong>${escapeHtml(info.recommendedAction || "-")}</strong></div>
      <div><span>注意ポイント</span><strong>${escapeHtml(info.caution || "-")}</strong></div>
    </div>
  `;
}

function splitFortuneTextList(value) {
  return String(value || "").split(/[｜,]/).map((item) => item.trim()).filter(Boolean);
}

function createCharacterLuckProfile(character = {}, calculation = {}) {
  const strengths = splitFortuneTextList(character.strengths);
  const cautions = splitFortuneTextList(character.cautions);
  return {
    characterName: character.displayName || "",
    starType: calculation.baseStar || calculation.starType || "",
    polarity: calculation.polarity || "",
    coreTrait: character.basicPersonality || "",
    strength: strengths[0] || "",
    weakness: cautions[0] || "",
    loveStyle: character.love || "",
    workStyle: character.work || "",
    relationshipStyle: character.relationships || "",
    adviceTone: character.message || "",
    positiveAdvice: strengths.slice(0, 2).join("・"),
    cautionAdvice: cautions.slice(0, 2).join("・")
  };
}

function getCharacterPersonalAdvice(profile, luck, period = "") {
  const luckName = getTeamFortuneLuckDisplay(luck);
  const strength = profile.positiveAdvice || profile.strength || "あなたらしい良さ";
  const caution = profile.cautionAdvice || profile.weakness || "無理のしすぎ";
  if (period === "month") {
    return `${profile.characterName || "あなた"}の${strength}が、${luckName || "この流れ"}の中でじっくり育ちます。今月は周りに合わせすぎず、自分の心地よいペースを選ぶと流れが整います。`;
  }
  if (period === "year") {
    return `${profile.characterName || "あなた"}が持つ${strength}を一年の軸にすると、${luckName || "この流れ"}を自分らしく活かせます。${caution}には気をつけながら、長く続く選択を大切に。`;
  }
  return `${profile.characterName || "あなた"}らしい${strength}が活きる日です。${caution}に気づいたら、一人で抱え込まず、少し力を抜いて流れを整えてみて。`;
}

function getCharacterHomeHint(profile, luck) {
  const luckName = getTeamFortuneLuckDisplay(luck);
  const strength = profile.strength || "あなたらしさ";
  return `${strength}を少し活かす${luckName || "日"}`;
}

function getCharacterSubFlowAdvice(luck) {
  const info = getTeamFortuneLuckInfo(luck);
  const luckName = getTeamFortuneLuckDisplay(luck);
  if (!info && !luckName) return "";
  return `${luckName || "もうひとつの流れ"}も重なっています。${info?.recommendedAction || "整えること"}を少し意識すると、メインの流れを穏やかに支えてくれます。`;
}

function renderCharacterPersonalAdvice(profile, luck, period = "") {
  const advice = getCharacterPersonalAdvice(profile, luck, period);
  if (!advice) return "";
  return `
    <div class="team-fortune-personal-advice">
      <span>キャラクターアドバイス</span>
      <p>${escapeHtml(advice)}</p>
    </div>
  `;
}

function getFortuneLuckStatus(luck) {
  if (!luck || typeof luck !== "object") return "";
  return luck.status || luck.sourceStatus || "";
}

function renderFortuneLuckLine(label, luck, profile, period = "", options = {}) {
  const name = getTeamFortuneLuckDisplay(luck);
  const info = getTeamFortuneLuckInfo(luck);
  const advice = options.isSubFlow
    ? getCharacterSubFlowAdvice(luck)
    : (profile ? getCharacterPersonalAdvice(profile, luck, period) : "");
  return `
    <div class="team-fortune-sub-luck">
      <span>${escapeHtml(label)}</span>
      <div class="team-fortune-name-rating">
        <strong>${escapeHtml(name || "資料待ち")}</strong>
        ${renderTeamFortuneRating(luck)}
      </div>
      ${info?.theme ? `<small>${escapeHtml(info.theme)}</small>` : ""}
      ${advice ? `<p>${escapeHtml(advice)}</p>` : ""}
      ${info ? `
        <dl class="team-fortune-sub-meta">
          <dt>おすすめ</dt><dd>${escapeHtml(info.recommendedAction || "-")}</dd>
          <dt>注意ポイント</dt><dd>${escapeHtml(info.caution || "-")}</dd>
        </dl>
      ` : ""}
    </div>
  `;
}

function renderFortuneSummaryPanel(title, luck, subtitle = "", character = {}, calculation = {}) {
  const isDual = luck && typeof luck === "object" && (luck.main || luck.sub);
  const isConfirmed = getFortuneLuckStatus(luck) === "confirmed";
  const name = getFortuneLuckName(luck);
  const state = name || isConfirmed
    ? luck
    : { displayLuckName: "資料待ち", starRating: "-", message: "確定した起点データが未投入のため、推測表示は行いません。" };
  const period = state.period || "";
  const profile = createCharacterLuckProfile(character, calculation);
  const message = isDual
    ? "メインとサブ、2つの流れをどちらも大切に見る日です。"
    : getTeamFortuneLuckMessage(state, period);
  return `
    <section class="team-fortune-summary${isDual ? " is-reigou" : ""}">
      <span>${escapeHtml(title)}</span>
      ${subtitle ? `<em>${escapeHtml(subtitle)}</em>` : ""}
      ${isDual ? `
        <div class="team-fortune-dual-luck">
          ${renderFortuneLuckLine("メイン", state.main, profile, period)}
          ${renderFortuneLuckLine("もうひとつの流れ", state.sub, profile, period, { isSubFlow: true })}
        </div>
      ` : `
        <div class="team-fortune-name-rating">
          <strong>${escapeHtml(getTeamFortuneLuckDisplay(state) || "資料待ち")}</strong>
          ${renderTeamFortuneRating(state)}
        </div>
        ${getFortuneLuckName(state) ? `<small>${escapeHtml(getTeamFortuneLuckInfo(state)?.theme || "TEAM LINKの12運気")}</small>` : `<small>${escapeHtml(renderStarText(state.starRating))}</small>`}
      `}
      <p>${escapeHtml(message || "正式APIの確定値を表示しています。")}</p>
      ${isDual ? "" : renderCharacterPersonalAdvice(profile, state, period)}
      ${isDual ? "" : renderTeamFortuneLuckMeta(state)}
    </section>
  `;
}

function renderStarText(value) {
  const number = Number(value);
  if (!number) return "未確認";
  return "★★★★★".slice(0, number) + "☆☆☆☆☆".slice(0, Math.max(0, 5 - number));
}

function renderFortuneList(title, value) {
  const items = String(value || "").split(/[｜,]/).map((item) => item.trim()).filter(Boolean);
  return `<div class="team-fortune-section"><h4>${escapeHtml(title)}</h4><ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("") || "<li>データ未設定</li>"}</ul></div>`;
}

function renderFortuneTextGrid(character) {
  const fields = [
    ["恋愛傾向", character.love],
    ["仕事傾向", character.work],
    ["お金の傾向", character.money],
    ["人間関係", character.relationships],
    ["健康・コンディション", character.health],
    ["ラッキーカラー", character.luckyColors],
    ["ラッキーアイテム", character.luckyItems],
    ["ラッキースポット", character.luckySpots],
    ["相性の傾向", character.compatibilityTendency],
    ["守護どうぶつからの一言", character.message]
  ];
  return `<div class="team-fortune-text-grid">${fields.map(([label, text]) => `<section><span>${escapeHtml(label)}</span><p>${escapeHtml(text || "データ未設定")}</p></section>`).join("")}</div>`;
}

function bindTeamFortuneActions(container) {
  container.querySelector("#retryTeamFortune")?.addEventListener("click", () => renderFortune());
  container.querySelector("#resetBirthDate")?.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEYS.birthDate);
    renderApp();
  });
  const compatibilityForm = container.querySelector("#fortuneCompatibilityForm");
  compatibilityForm?.elements?.partnerBirthYear?.addEventListener("change", () => updateCompatibilityBirthDays(compatibilityForm));
  compatibilityForm?.elements?.partnerBirthMonth?.addEventListener("change", () => updateCompatibilityBirthDays(compatibilityForm));
  compatibilityForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const resultBox = container.querySelector("#fortuneCompatibilityResult");
    const submitButton = form.querySelector("button[type='submit']");
    const formData = new FormData(form);
    const birthDate = localStorage.getItem(STORAGE_KEYS.birthDate);
    const partnerBirthDate = getCompatibilityBirthDate(formData);
    if (!birthDate || !partnerBirthDate) {
      showToast("年・月・日をすべて選択してください。");
      return;
    }
    const partnerNickname = String(formData.get("nickname") || "").trim();
    const partnerGender = String(formData.get("partnerGender") || "");
    const cacheKey = [birthDate, partnerBirthDate, partnerNickname, partnerGender, jstDateKey()].join("|");
    const startedAt = performance.now();
    if (submitButton) submitButton.disabled = true;
    if (submitButton) submitButton.textContent = "占っています…";
    if (resultBox) {
      resultBox.innerHTML = `<div class="team-fortune-compatibility-loading"><span class="compatibility-loading-dot" aria-hidden="true"></span>二人の相性を占っています…</div>`;
    }
    try {
      let data = teamFortuneCompatibilitySessionCache.get(cacheKey);
      const cacheHit = Boolean(data);
      if (!data) {
        const result = await fortuneApiRequest("calculateTeamFortuneCompatibility", {
          birthDate,
          partnerBirthDate,
          partnerNickname,
          partnerGender,
          fortuneSpreadsheetId: TEAM_LINK_FORTUNE_DB_ID
        }, { apiUrl: TEAM_LINK_FORTUNE_API_URL });
        if (!result?.success) {
          throw createFortuneError(result?.errorCode || "FORTUNE_COMPATIBILITY_ERROR", result?.message || "相性判定を取得できませんでした。", result?.data || result);
        }
        data = result.data || result;
        teamFortuneCompatibilitySessionCache.set(cacheKey, data);
      }
      const elapsedMs = Math.round(performance.now() - startedAt);
      console.info("[TEAM Fortune Compatibility]", { elapsedMs, cacheHit, data });
      if (resultBox) resultBox.innerHTML = renderFortuneCompatibilityResult(data || {});
    } catch (error) {
      console.warn("[TEAM Fortune Compatibility] unavailable", error);
      if (resultBox) resultBox.innerHTML = renderFortuneCompatibilityError(error);
      showToast(error?.message || "相性判定を取得できませんでした。");
    } finally {
      if (submitButton) submitButton.disabled = false;
      if (submitButton) submitButton.textContent = "相性を見る";
    }
  });
}

function renderFortuneCompatibilityResult(data) {
  const self = data.self || {};
  const partner = data.partner || {};
  const compatibility = data.compatibility || {};
  const humanLuck = compatibility.humanLuck || {};
  const earthLuck = compatibility.earthLuck || {};
  const totalScore = compatibility.totalScore || {};
  if (!compatibility.status || compatibility.status !== "confirmed") {
    return `
      <section class="team-fortune-alert">
        <strong>相性結果を表示できませんでした</strong>
        <span>時間をおいて、もう一度お試しください。</span>
      </section>
    `;
  }
  const partnerLabel = partner.nickname ? `${partner.nickname}さん` : "お相手";
  return `
    <section class="team-fortune-compatibility-card">
      <div class="team-fortune-compatibility-pair">
        <div><span>あなた</span><strong>${escapeHtml(self.teamLinkName || "判定中")}</strong></div>
        <div><span>${escapeHtml(partnerLabel)}</span><strong>${escapeHtml(partner.teamLinkName || "判定中")}</strong></div>
      </div>
      <div class="team-fortune-compatibility-total">
        <span>二人の総合相性</span>
        <strong>${escapeHtml(totalScore.percentage ?? "-")}%</strong>
      </div>
      <div class="team-fortune-compatibility-symbols">
        ${renderCompatibilitySymbol("心のつながり", humanLuck)}
        ${renderCompatibilitySymbol("ご縁の流れ", earthLuck)}
      </div>
      <div class="team-fortune-compatibility-comments">
        ${renderCompatibilityCommentCards(self, partner, compatibility)}
      </div>
    </section>
  `;
}

function firstFortuneSentence(value) {
  const text = String(value || "").trim();
  const boundary = [...text].findIndex((character) => "。！？".includes(character));
  return boundary >= 0 ? [...text].slice(0, boundary + 1).join("") : text;
}

function firstFortuneItems(value, count = 2) {
  return String(value || "").split(/[｜,]/).map((item) => item.trim()).filter(Boolean).slice(0, count);
}

function joinFortuneTraits(items) {
  const values = (items || []).filter(Boolean);
  if (values.length < 2) return `「${values[0] || "自然体の魅力"}」`;
  return `「${values[0]}」「${values[1]}」`;
}

function getCompatibilityConclusion(percentage) {
  const score = Number(percentage);
  if (score >= 90) return "かなり相性のいい二人です。一緒にいるほど安心感が生まれやすく、長く付き合うほど良さが出てくる組み合わせです。";
  if (score >= 80) return "とても相性のいい二人です。お互いの良さを自然に引き出し、心地よい関係を育てやすいでしょう。";
  if (score >= 70) return "バランスのいい二人です。違いを楽しみながら歩幅を合わせると、居心地のよい関係になります。";
  if (score >= 60) return "知るほど味わいが増す二人です。少しずつ気持ちを伝え合うことで、二人らしい関係を育てられます。";
  if (score >= 40) return "惹かれ合う一方で、すれ違いにも気をつけたい二人です。相手の考えを決めつけず、丁寧に確かめることが大切です。";
  return "違いがはっきり出やすい二人です。無理に同じになろうとせず、それぞれの心地よい距離を尊重しましょう。";
}

function getCompatibilityConnectionText(symbol) {
  const messages = {
    "◎": "気持ちのテンポが合いやすく、自然体でも分かり合える場面が多いでしょう。",
    "○": "会話を重ねるほど気持ちが通じ、安心できる関係になりやすいでしょう。",
    "△": "感じ方に違いはありますが、言葉で伝え合うほど理解が深まります。",
    "▲": "気持ちが強く動く分、思い込みによるすれ違いには少し注意が必要です。",
    "×": "気持ちの受け取り方が違いやすいので、結論を急がず確認し合うことが大切です。"
  };
  return messages[symbol] || "会話を大切にすると、二人らしいつながりが育ちます。";
}

function getCompatibilityFlowText(symbol) {
  const messages = {
    "◎": "日々を一緒に過ごすほど、二人の良さが自然に重なっていきます。",
    "○": "無理のないペースで時間を重ねるほど、安定した関係を築けます。",
    "△": "予定や過ごし方を相談して決めると、二人のペースが整います。",
    "▲": "タイミングがずれやすいときは、少し間を置いて話すとうまくいきます。",
    "×": "それぞれの時間も大切にすると、一緒にいる時間を心地よく保てます。"
  };
  return messages[symbol] || "二人に合うペースを見つけることが、心地よい関係につながります。";
}

function getCompatibilityCautionCategory(cautions) {
  const text = (cautions || []).join("｜");
  const rules = [
    { key: "overcare", words: ["合わせ", "本音", "気を使", "我慢", "遠慮", "断りにく", "抱え込", "頼まれ"] },
    { key: "overthink", words: ["考えすぎ", "迷い", "慎重", "疑い", "決断を先延ばし"] },
    { key: "fastpace", words: ["急ぎ", "勢い", "気分", "予定を変え", "飽き"] },
    { key: "stubborn", words: ["頑固", "こだわり", "完璧", "白黒", "融通"] },
    { key: "closed", words: ["弱さを隠", "感情表現", "一人で完結", "孤立", "心を開"] }
  ];
  return rules.find((rule) => rule.words.some((word) => text.includes(word)))?.key || "differentPace";
}

function getCompatibilityCautionText(selfCategory, partnerCategory, partnerLabel) {
  if (selfCategory === "overcare" && partnerCategory === "overcare") {
    return `二人とも相手を思いやれる分、「本当はこうしてほしい」を我慢してしまうことがありそうです。気持ちをため込むと、優しさがすれ違いに変わってしまうことも。小さな希望ほど早めに言葉にしてみてください。`;
  }
  if (selfCategory === "overthink" || partnerCategory === "overthink") {
    return `どちらかが考え込むと、もう一人も答えを待ちすぎてしまうことがありそうです。すぐに結論を出さなくても、「今はこう感じている」と途中の気持ちを伝えましょう。安心して考えられる時間をつくることが大切です。`;
  }
  if (selfCategory === "fastpace" || partnerCategory === "fastpace") {
    return `行動の速さや気分の切り替え方に差が出ると、置いていかれたように感じることがありそうです。予定を決めるときは、二人が無理なく楽しめるペースを一度確認しましょう。急な変更にはひと言添えると安心です。`;
  }
  if (selfCategory === "stubborn" || partnerCategory === "stubborn") {
    return `お互いに大切にしたい考えがある分、譲れないところがぶつかることもありそうです。正しさを決めるより、「なぜ大切なのか」を話してみてください。${partnerLabel}の考えを聞いてから自分の希望を伝えると、着地点を見つけやすくなります。`;
  }
  if (selfCategory === "closed" || partnerCategory === "closed") {
    return `平気そうに見えても、どちらかが気持ちを内側にしまっていることがあります。答えを急かさず、落ち着いて話せる時間をつくりましょう。「聞いてほしいだけ」と最初に伝えるのもおすすめです。`;
  }
  return `心地よいペースが違うときに、相手も同じ気持ちだと思い込まないことが大切です。無理に合わせるより、その日の希望を短い言葉で伝えてみましょう。違いを知るほど、二人らしい付き合い方が見つかります。`;
}

function getCompatibilityLoveRole(profile) {
  const strengths = String(profile?.strengths || "");
  const love = String(profile?.love || "");
  if (/[親しみ明る会話人気楽し笑自由軽やか]/.test(strengths)) return "関係に明るさや楽しさをつくる";
  if (/[安心信頼安定誠実堅実支え責任]/.test(strengths)) return "関係に安心感と落ち着きをつくる";
  const text = `${love}｜${strengths}`;
  if (/[楽し笑会話自由直感軽やか明る]/.test(text)) return "関係に明るさや楽しさをつくる";
  if (/[安心信頼安定誠実堅実支え]/.test(text)) return "関係に安心感と落ち着きをつくる";
  if (/[尊重深い特別丁寧繊細]/.test(text)) return "心の深いつながりを育てる";
  return "自分らしい魅力で関係をあたためる";
}

function renderCompatibilityCommentCard(title, text) {
  if (!text) return "";
  return `<section><h4>${escapeHtml(title)}</h4><p>${escapeHtml(text)}</p></section>`;
}

function renderCompatibilityCommentCards(self, partner, compatibility) {
  const selfName = "あなた";
  const partnerName = partner.nickname ? `${partner.nickname}さん` : "お相手";
  const selfProfile = self.profile || {};
  const partnerProfile = partner.profile || {};
  const humanLuck = compatibility.humanLuck || {};
  const earthLuck = compatibility.earthLuck || {};
  const totalScore = compatibility.totalScore || {};
  const selfStrengths = firstFortuneItems(selfProfile.strengths);
  const partnerStrengths = firstFortuneItems(partnerProfile.strengths);
  const selfCautions = firstFortuneItems(selfProfile.cautions, 5);
  const partnerCautions = firstFortuneItems(partnerProfile.cautions, 5);
  const selfCautionCategory = getCompatibilityCautionCategory(selfCautions);
  const partnerCautionCategory = getCompatibilityCautionCategory(partnerCautions);
  const selfLove = firstFortuneSentence(selfProfile.love).replace(/^恋愛では/, "");
  const partnerLove = firstFortuneSentence(partnerProfile.love).replace(/^恋愛では/, "");
  const basic = [
    getCompatibilityConclusion(totalScore.percentage),
    `${selfName}は${joinFortuneTraits(selfStrengths)}が魅力で、${partnerName}は${joinFortuneTraits(partnerStrengths)}が持ち味です。`,
    getCompatibilityConnectionText(humanLuck.symbol),
    getCompatibilityFlowText(earthLuck.symbol)
  ].join("");
  const love = [
    `「楽しい」と「安心」のバランスを育てやすい二人です。`,
    selfLove ? `${selfName}は${selfLove}` : "",
    partnerLove ? `${partnerName}は${partnerLove}` : "",
    `${selfName}が${getCompatibilityLoveRole(selfProfile)}一方で、${partnerName}が${getCompatibilityLoveRole(partnerProfile)}関係になりやすいでしょう。`
  ].filter(Boolean).join("");
  const caution = getCompatibilityCautionText(selfCautionCategory, partnerCautionCategory, partnerName);
  const hint = totalScore.percentage >= 80
    ? `この二人は、派手なサプライズより一緒に過ごす時間を積み重ねるほど関係が深まりやすい組み合わせです。食事やお出かけなど、二人だけの定番をつくるとさらに距離が縮まりそう。うれしかったことは、その日のうちに言葉で伝えてみてください。`
    : `二人にとって心地よい連絡の頻度や過ごし方を、少しずつ見つけていきましょう。無理に相手へ合わせるより、「今日はこうしたい」を自然に伝えることが大切です。二人だけの小さな楽しみを増やすほど、関係が育っていきます。`;
  return [
    renderCompatibilityCommentCard("二人の相性", basic),
    renderCompatibilityCommentCard("恋愛での相性", love),
    renderCompatibilityCommentCard("気をつけたいポイント", caution),
    renderCompatibilityCommentCard("もっと仲良くなるヒント", hint)
  ].join("");
}

function renderCompatibilitySymbol(label, judgement) {
  const symbol = judgement?.symbol || "-";
  const description = judgement?.description || "正式資料から判定できませんでした。";
  return `
    <div class="team-fortune-compatibility-symbol">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(symbol)}</strong>
      <small>${escapeHtml(description)}</small>
    </div>
  `;
}

function renderFortuneCompatibilityError(error) {
  return `
    <section class="team-fortune-alert">
      <strong>相性結果を表示できませんでした</strong>
      <span>${escapeHtml(error?.message || "相性判定を取得できませんでした。")}</span>
    </section>
  `;
}

function renderCoupons() {
  const lineCoupons = getPublicLineCoupons();
  const menus = getPublicReservationMenus();
  const mySelections = getMySelections();
  const categories = ["クーポン", "通常メニュー", "マイクーポン"];
  if (!categories.includes(appState.couponCategory)) appState.couponCategory = "クーポン";
  document.getElementById("couponTabs").innerHTML = categories.map((category) => `
    <button type="button" role="tab" aria-selected="${category === appState.couponCategory}" class="${category === appState.couponCategory ? "is-active" : ""}" data-category="${escapeHtml(category)}">${escapeHtml(category)}</button>
  `).join("");
  document.getElementById("couponTabs").querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      appState.couponCategory = button.dataset.category;
      renderCoupons();
    });
  });

  const selected = appState.couponCategory;
  const couponList = document.getElementById("couponList");
  if (selected === "クーポン") {
    if (isProductionApiMode() && appState.couponMasterSyncStatus !== "synced") {
      couponList.innerHTML = `<p class="soft-note">${appState.couponMasterSyncStatus === "unavailable" ? "クーポン情報を取得できませんでした。" : "クーポン情報を取得しています…"}</p>`;
      return;
    }
    const activeCategory = LINE_COUPON_CATEGORY_ORDER.includes(appState.lineCouponCategory) ? appState.lineCouponCategory : "すべて";
    appState.lineCouponCategory = activeCategory;
    const visibleCoupons = filterLineCouponsByCategory(lineCoupons, activeCategory);
    couponList.innerHTML = lineCoupons.length ? `
      <section class="line-coupon-page-filter">
        ${lineCouponCategoryButtonsHtml(lineCoupons, activeCategory, "data-line-coupon-category", "LINEクーポンのカテゴリー")}
      </section>
      <div class="line-coupon-page-list">
        ${visibleCoupons.map(lineCouponSelectionCardHtml).join("") || `<p class="soft-note">このカテゴリーにクーポンはありません。</p>`}
      </div>
    ` : "<p class=\"soft-note\">現在表示できるクーポンはありません。</p>";
    return;
  }
  if (selected === "通常メニュー") {
    if (isProductionApiMode() && appState.menuMasterSyncStatus !== "synced") {
      couponList.innerHTML = `<p class="soft-note">${appState.menuMasterSyncStatus === "unavailable" ? "メニュー情報を取得できませんでした。" : "通常メニューを取得しています…"}</p>`;
      return;
    }
    couponList.innerHTML = menus.map(menuSelectionCardHtml).join("") || "<p class=\"soft-note\">現在表示できる通常メニューはありません。</p>";
    return;
  }
  couponList.innerHTML = `
    ${mySelections.map(mySelectionCardHtml).join("") || "<p class=\"soft-note\">まだ選択された項目はありません。クーポンまたは通常メニューから追加してください。</p>"}
    <div class="my-booking-cta">
      <button class="primary-button" type="button" data-coupon-action="book" ${mySelections.length ? "" : "disabled"}>${mySelections.length === 1 && mySelections[0].type === "coupon" ? "このクーポンを使って予約する" : "この内容で予約する"}</button>
    </div>
  `;
}

function normalizeLineCouponCategoryText(value) {
  return String(value || "").normalize("NFKC").toLowerCase().replace(/\s+/g, "");
}

function getLineCouponCategory(coupon) {
  const titleCategory = findLineCouponCategoryMatch(normalizeLineCouponCategoryText(coupon?.title));
  if (titleCategory) return titleCategory;
  const descriptionCategory = findLineCouponCategoryMatch(normalizeLineCouponCategoryText([
    coupon?.description,
    coupon?.message,
    coupon?.condition,
    coupon?.usageCondition,
    coupon?.targetMenu
  ].filter(Boolean).join(" ")));
  return descriptionCategory || "その他";
}

function findLineCouponCategoryMatch(text) {
  if (!text) return "";
  const matches = LINE_COUPON_CATEGORY_RULES.map((rule, ruleIndex) => {
    const positions = rule.keywords
      .map((keyword) => text.indexOf(normalizeLineCouponCategoryText(keyword)))
      .filter((position) => position >= 0);
    return positions.length ? { rule, ruleIndex, position: Math.min(...positions) } : null;
  }).filter(Boolean);
  const primaryMatch = matches.find((match) => match.rule.primary);
  if (primaryMatch) return primaryMatch.rule.category;
  matches.sort((a, b) => a.position - b.position || a.ruleIndex - b.ruleIndex);
  return matches[0]?.rule.category || "";
}

function filterLineCouponsByCategory(coupons, category) {
  if (category === "すべて") return coupons;
  return coupons.filter((coupon) => getLineCouponCategory(coupon) === category);
}

function lineCouponCategoryButtonsHtml(coupons, activeCategory, dataAttribute, ariaLabel) {
  return `
    <div class="booking-menu-category-chips line-coupon-category-chips" role="group" aria-label="${escapeHtml(ariaLabel)}">
      ${LINE_COUPON_CATEGORY_ORDER.map((category) => {
        const count = category === "すべて" ? coupons.length : filterLineCouponsByCategory(coupons, category).length;
        return `<button type="button" class="booking-menu-category-chip ${activeCategory === category ? "is-active" : ""}" ${dataAttribute}="${escapeHtml(category)}" aria-pressed="${activeCategory === category}" ${count ? "" : "disabled"}>${escapeHtml(category)} <small>${count}</small></button>`;
      }).join("")}
    </div>
  `;
}

function lineCouponDetailButtonHtml(coupon) {
  const description = String(coupon?.description || coupon?.message || "").trim();
  return description.length > 54
    ? `<button type="button" class="line-coupon-detail-button" data-line-coupon-detail aria-expanded="false">詳細を見る</button>`
    : "";
}

function getMySelections() {
  const selections = readJson(STORAGE_KEYS.mySelections, []);
  if (!Array.isArray(selections)) return [];
  const seen = new Set();
  return selections.filter((item) => {
    const type = item?.type === "coupon" || item?.type === "menu" ? item.type : "";
    const itemId = String(item?.itemId || "");
    const key = `${type}:${itemId}`;
    if (!type || !itemId || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function mySelectionKey(type, itemId) {
  return `${String(type || "")}:${String(itemId || "")}`;
}

function isMySelectionAdded(type, itemId) {
  const key = mySelectionKey(type, itemId);
  return getMySelections().some((item) => mySelectionKey(item.type, item.itemId) === key);
}

function handleCouponSelectionAction(button) {
  const action = button.dataset.couponAction;
  const type = button.dataset.itemType;
  const itemId = button.dataset.itemId;
  if (action === "add") addMySelection(type, itemId);
  if (action === "remove") removeMySelection(type, itemId);
  if (action === "book") startBookingFromMySelections();
}

function addMySelection(type, itemId) {
  const selections = getMySelections();
  const key = mySelectionKey(type, itemId);
  if (selections.some((item) => mySelectionKey(item.type, item.itemId) === key)) {
    showToast("すでにマイクーポンへ追加済みです。");
    return;
  }

  let selection = null;
  if (type === "coupon") {
    const coupon = getPublicLineCoupons().find((item) => String(item.couponId) === String(itemId));
    if (coupon) {
      selection = {
        type: "coupon",
        itemId: String(coupon.couponId),
        title: coupon.title,
        description: coupon.description || coupon.message || "",
        imageUrl: coupon.imageUrl || "",
        lineCouponUrl: coupon.lineCouponUrl || "",
        endDate: coupon.expires || coupon.validUntil || coupon.endDate || coupon.endAt || "",
        addedAt: new Date().toISOString()
      };
    }
  }
  if (type === "menu") {
    const menu = getPublicReservationMenus().find((item) => String(item.menuId) === String(itemId));
    if (menu) {
      selection = {
        type: "menu",
        itemId: String(menu.menuId),
        title: menu.title,
        category: menu.category || "その他",
        description: menu.description || "",
        price: Number(menu.regularPrice || 0),
        duration: Number(menu.durationMinutes || 0),
        addedAt: new Date().toISOString()
      };
    }
  }
  if (!selection) {
    showToast("項目を追加できませんでした。再読み込みしてお試しください。");
    return;
  }
  writeJson(STORAGE_KEYS.mySelections, [...selections, selection]);
  renderCoupons();
  showToast("マイクーポンへ追加しました。");
}

function removeMySelection(type, itemId) {
  const key = mySelectionKey(type, itemId);
  const selections = getMySelections();
  const next = selections.filter((item) => mySelectionKey(item.type, item.itemId) !== key);
  if (next.length === selections.length) return;
  writeJson(STORAGE_KEYS.mySelections, next);
  renderCoupons();
  showToast("マイクーポンから削除しました。");
}

function buildMySelectionReservationPayload() {
  const selectedItems = getMySelections().map(({ type, itemId, title }) => ({ type, itemId, title }));
  return {
    selectedItems,
    menuIds: selectedItems.filter((item) => item.type === "menu").map((item) => item.itemId),
    couponIds: selectedItems.filter((item) => item.type === "coupon").map((item) => item.itemId)
  };
}

function selectionButtonHtml(type, itemId) {
  const added = isMySelectionAdded(type, itemId);
  return `<button class="secondary-button ${added ? "is-added" : ""}" type="button" data-coupon-action="add" data-item-type="${escapeHtml(type)}" data-item-id="${escapeHtml(itemId)}" ${added ? "disabled" : ""}>${added ? "追加済み" : "マイクーポンに追加"}</button>`;
}

function lineCouponSelectionCardHtml(coupon) {
  const expiry = coupon.expires || coupon.validUntil || coupon.endDate || coupon.endAt;
  return `
    <article class="coupon-card compact-selection-card has-image line-coupon-page-card" data-line-coupon-card>
      ${coupon.imageUrl ? `<img src="${escapeHtml(coupon.imageUrl)}" alt="${escapeHtml(coupon.title)}">` : ""}
      <div class="compact-selection-body"><span>${escapeHtml(getLineCouponCategory(coupon))}</span><h3>${escapeHtml(coupon.title)}</h3><p class="line-coupon-description">${escapeHtml(coupon.description || coupon.message || "LINE公式クーポン")}</p>${lineCouponDetailButtonHtml(coupon)}<small>有効期限：${escapeHtml(formatDateUntil(expiry))}</small></div>
      <div class="compact-selection-action">${selectionButtonHtml("coupon", coupon.couponId)}</div>
    </article>
  `;
}

function menuSelectionCardHtml(menu) {
  return `
    <article class="coupon-card menu-selection-card compact-selection-card">
      <div class="compact-selection-body"><span>通常メニュー</span><small class="selection-category">${escapeHtml(menu.category || "その他")}</small><h3>${escapeHtml(menu.title)}</h3><p>${escapeHtml(menu.description || "")}</p></div>
      <div class="selection-meta"><strong>${escapeHtml(formatYen(menu.regularPrice))}</strong><small>${escapeHtml(formatMinutes(menu.durationMinutes))}</small></div>
      <div class="compact-selection-action">${selectionButtonHtml("menu", menu.menuId)}</div>
    </article>
  `;
}

function mySelectionCardHtml(item) {
  const isCoupon = item.type === "coupon";
  const safeLineUrl = isCoupon && isSafeLineCouponUrl(item.lineCouponUrl) ? item.lineCouponUrl : "";
  return `
    <article class="coupon-card is-mine compact-selection-card ${isCoupon && item.imageUrl ? "has-image" : ""}">
      ${isCoupon && item.imageUrl ? `<img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.title)}">` : ""}
      <div class="compact-selection-body"><span>${isCoupon ? "クーポン" : "通常メニュー"}</span>${!isCoupon && item.category ? `<small class="selection-category">${escapeHtml(item.category)}</small>` : ""}<h3>${escapeHtml(item.title)}</h3>${item.description ? `<p>${escapeHtml(item.description)}</p>` : ""}
      ${isCoupon
        ? `<small>有効期限：${escapeHtml(formatDateUntil(item.endDate))}</small>`
        : `<div class="selection-meta"><strong>${escapeHtml(formatYen(item.price))}</strong><small>${escapeHtml(formatMinutes(item.duration))}</small></div>`}</div>
      <div class="selection-actions">
        ${safeLineUrl ? `<a class="secondary-button" href="${escapeHtml(safeLineUrl)}" target="_blank" rel="noopener noreferrer">LINEでクーポンを開く</a>` : ""}
        <button class="selection-remove-button" type="button" data-coupon-action="remove" data-item-type="${escapeHtml(item.type)}" data-item-id="${escapeHtml(item.itemId)}">削除</button>
      </div>
    </article>
  `;
}

function renderGacha() {
  const status = getMonthlyGachaStatus();
  const result = document.getElementById("gachaResult");
  const button = document.getElementById("drawGachaButton");
  const choiceStage = document.getElementById("gachaChoiceStage");
  const setting = getCurrentGachaSetting();
  const gachaCards = getGachaCards(setting);
  preloadGachaRevealAssets().catch((error) => {
    console.warn("[TEAM LINK GACHA PRELOAD FAILED]", error);
  });
  const grandPrize = gachaCards.find((card) => card.rarity === "UR") || gachaCards.find((card) => card.rarity === "SSR") || gachaCards[0];
  document.getElementById("gachaMonthTitle").textContent = `${status.monthLabel}ガチャ`;
  document.getElementById("gachaGrandPrize").textContent = `今月の特賞：${grandPrize?.prizeName || "準備中"}`;
  document.getElementById("gachaTicketBox").innerHTML = `
    <small>今月の利用状況</small>
    <strong>${status.state === "利用済み" ? "利用済み" : status.state === "利用可能" ? "残り1回" : status.state}</strong>
    <p>${status.used ? `獲得カード：${escapeHtml(status.draw.cardName)} / ${escapeHtml(status.draw.prizeName)}` : `${escapeHtml(status.expiresLabel)}まで引けます。前月分は繰り越されません。`}</p>
  `;
  if (status.used) {
    button.disabled = true;
    button.textContent = "今月は利用済み";
    button.hidden = true;
    document.getElementById("gachaStage")?.classList.add("is-claimed");
    if (choiceStage) choiceStage.innerHTML = renderGachaClaimedStage(status.draw);
  } else if (setting.status !== "公開" || (!isProductionApiMode() && getGachaOddsTotal(setting) !== 100)) {
    button.disabled = true;
    button.textContent = "今月のガチャは準備中";
    button.hidden = true;
    document.getElementById("gachaStage")?.classList.remove("is-claimed");
    if (choiceStage) choiceStage.innerHTML = `<p class="gacha-choice-message">今月のガチャは準備中です。</p>`;
  } else {
    button.disabled = false;
    button.hidden = true;
    button.textContent = "カードを選ぶ";
    document.getElementById("gachaStage")?.classList.remove("is-claimed");
    if (choiceStage) choiceStage.innerHTML = renderGachaCardChoices();
  }
  result.hidden = true;
  result.innerHTML = "";
  button.onclick = async () => {
    const latestStatus = getMonthlyGachaStatus();
    if (latestStatus.used || button.disabled) return;
    button.disabled = true;
    const draw = isProductionApiMode() ? await drawGachaRemote(latestStatus.month) : createGachaDraw(latestStatus.month);
    if (!draw) {
      button.disabled = false;
      return;
    }
    await revealGachaCard(draw);
    const saved = await saveGachaDraw(draw);
    if (!saved) {
      button.disabled = false;
      return;
    }
    showGachaResult(draw, false);
    renderApp();
  };
  renderCouponGachaDashboard();
}

function renderGachaCardChoices() {
  return `
    <div class="gacha-choice-stage" data-gacha-choice-stage>
      ${["left", "center", "right"].map((position) => `
        <button class="gacha-choice-card is-${position}" type="button" data-gacha-action="selectCard" data-choice="${position}" aria-label="${position === "center" ? "中央" : position === "left" ? "左" : "右"}のカードを選ぶ">
          ${gachaRevealBackHtml()}
        </button>
      `).join("")}
    </div>
    <p class="gacha-choice-message">3枚のカードから1枚を選んでください。</p>
  `;
}

function renderGachaClaimedStage(draw) {
  const state = getGachaLifecycleState(draw || {});
  const id = String(draw?.cardHistoryId || draw?.drawId || "");
  const isConfirming = Boolean(id) && appState.gachaUseConfirmId === id;
  const userFacingState = state === "used" ? "使用済み" : state === "expired" ? "有効期限切れ" : "未使用";
  return `
    <div class="gacha-claimed-stage gacha-current-win">
      <p class="kicker">This month's card</p>
      <strong>今月当たったカード</strong>
      <div class="gacha-claimed-card">
        ${gachaCompletedCardHtml(draw || {}, "result")}
      </div>
      <div class="gacha-current-win-details">
        ${summaryRows([
          ["キャラクター", draw?.characterName || draw?.cardName || "獲得カード"],
          ["レアリティ", draw?.rarity || "-"],
          ["景品", draw?.prizeName || "今月の景品"],
          ["景品内容", draw?.prizeDescription || draw?.message || "-"],
          ["獲得日", formatDateTime(draw?.obtainedAt || draw?.drawnAt) || "-"],
          ["有効期限", formatDateUntil(draw?.validUntil || draw?.expires) || "-"],
          ["状態", userFacingState]
        ])}
      </div>
      ${state === "used" ? `
        <div class="gacha-use-complete" role="status">
          <strong>✓ 使用済み</strong>
          <span>使用日時：${escapeHtml(formatDateTime(draw?.usedAt || draw?.useConfirmedAt) || "記録済み")}</span>
        </div>
      ` : state === "expired" ? `
        <div class="gacha-use-expired" role="status"><strong>有効期限切れ</strong><small>この景品は利用できません。</small></div>
      ` : isConfirming ? renderGachaUseConfirmation(draw) : `
        <div class="gacha-staff-present">
          <strong>来店時にスタッフへ画面を見せてください</strong>
          <small>ボタンを押しても、次の確認までは使用済みになりません。</small>
          <button class="primary-button gacha-present-button" type="button" data-gacha-action="showUseConfirmation" data-id="${escapeHtml(id)}">スタッフに見せる</button>
        </div>
      `}
    </div>
  `;
}

function renderGachaUseConfirmation(card) {
  const id = card?.cardHistoryId || card?.drawId || "";
  return `
    <section class="gacha-use-confirmation" aria-label="景品の使用確認">
      <strong>この景品を使用しますか？</strong>
      <p>スタッフが内容を確認してから「使用済みにする」を押してください。</p>
      <div class="summary-list">${summaryRows([
        ["キャラクター", card?.characterName || card?.cardName || "-"],
        ["レアリティ", card?.rarity || "-"],
        ["景品名", card?.prizeName || card?.title || "-"],
        ["景品内容", card?.prizeDescription || card?.message || "-"],
        ["有効期限", formatDateUntil(card?.validUntil || card?.expires) || "-"]
      ])}</div>
      <div class="gacha-use-confirm-actions">
        <button class="primary-button" type="button" data-gacha-action="confirmUse" data-id="${escapeHtml(id)}" ${appState.gachaUseConfirmBusy ? "disabled" : ""}>${appState.gachaUseConfirmBusy ? "処理中…" : "使用済みにする"}</button>
        <button class="secondary-button" type="button" data-gacha-action="hideUseConfirmation" data-id="${escapeHtml(id)}" ${appState.gachaUseConfirmBusy ? "disabled" : ""}>戻る</button>
      </div>
      <small>一度使用済みにすると、同じ景品は再利用できません。</small>
    </section>
  `;
}

async function selectGachaCard(button) {
  if (appState.gachaChoiceInProgress) return;
  const latestStatus = getMonthlyGachaStatus();
  if (latestStatus.used) {
    showToast("今月のカードは獲得済みです。");
    renderGacha();
    return;
  }
  appState.gachaChoiceInProgress = true;
  const stage = button.closest("[data-gacha-choice-stage]");
  const choice = button.dataset.choice || "center";
  const pointerStartedAt = Number(button.dataset.gachaPointerStartedAt || performance.now());
  const clickStartedAt = performance.now();
  stage?.classList.add("is-selecting", `selected-${choice}`);
  stage?.querySelectorAll("button").forEach((item) => {
    item.disabled = true;
    if (item !== button) item.classList.add("is-fading");
    else item.classList.add("is-picked", "is-pressed");
  });
  console.info("[TEAM LINK GACHA] choice animation start", {
    choice,
    month: latestStatus.month,
    pointerToClickMs: Math.round(clickStartedAt - pointerStartedAt)
  });
  openGachaRevealAnimation({ choice });
  try {
    await waitForGachaInteractionPaint();
    const apiStartedAt = performance.now();
    console.info("[TEAM LINK GACHA] immediate feedback painted", {
      pointerToFeedbackMs: Math.round(apiStartedAt - pointerStartedAt)
    });
    const draw = isProductionApiMode() ? await drawGachaRemote(latestStatus.month, { silent: true, skipPreflight: true }) : createGachaDraw(latestStatus.month);
    if (!draw) {
      closeGachaRevealAnimation();
      renderApp();
      return;
    }
    const apiCompletedAt = performance.now();
    console.info("[TEAM LINK GACHA] production draw ready", {
      apiMs: Math.round(apiCompletedAt - apiStartedAt),
      pointerToResultMs: Math.round(apiCompletedAt - pointerStartedAt)
    });
    await completeGachaReveal(draw);
    console.info("[TEAM LINK GACHA] front card visible", {
      pointerToFrontCompleteMs: Math.round(performance.now() - pointerStartedAt)
    });
    const saved = await saveGachaDraw(draw);
    if (!saved) throw new Error("GACHA_SAVE_FAILED");
    const refreshPromise = isProductionApiMode()
      ? refreshProductionGachaCoupons(draw.memberId || getProfile().memberId).catch((error) => {
        console.error("[TEAM LINK GACHA COUPON BACKGROUND REFRESH FAILED]", error);
      })
      : Promise.resolve();
    await playGachaCollectionAdded();
    showGachaResult(draw, false);
    renderApp();
    refreshPromise.then(() => {
      if (isProductionApiMode() && appState.currentView === viewMap.gacha) renderGacha();
    });
    window.setTimeout(() => {
      document.getElementById("gachaStage")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);
  } catch (error) {
    console.error("[TEAM LINK GACHA CHOICE FAILED]", error);
    closeGachaRevealAnimation();
    showToast("通信に失敗しました。時間をおいてもう一度お試しください");
    stage?.classList.remove("is-selecting", `selected-${choice}`);
    stage?.querySelectorAll("button").forEach((item) => {
      item.disabled = false;
      item.classList.remove("is-fading", "is-picked");
    });
  } finally {
    appState.gachaChoiceInProgress = false;
  }
}

function waitForGachaInteractionPaint() {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => window.requestAnimationFrame(resolve));
  });
}

function renderCouponGachaDashboard() {
  const container = document.getElementById("couponGachaDashboard");
  if (!container) return;
  container.innerHTML = `
    <section class="gacha-top-actions" aria-label="ガチャメニュー">
      <button type="button" data-view="mycards"><strong>マイカードを見る</strong><small>取得状況と30キャラクター一覧</small></button>
      <button type="button" data-view="collectionRewards"><strong>コレクション特典</strong><small>達成条件と現在の進捗</small></button>
      <button type="button" data-view="gachaHistory"><strong>ガチャ履歴</strong><small>過去に獲得したカード</small></button>
    </section>
  `;
}

function renderGachaCouponShelf(title, cards, mode) {
  return `
    <section class="card-shelf gacha-coupon-shelf">
      <header><h3>${escapeHtml(title)}</h3><span>${cards.length}枚</span></header>
      <div class="my-card-grid">
        ${cards.map((card) => gachaCouponCardHtml(card, mode)).join("") || "<p>該当カードはありません。</p>"}
      </div>
    </section>
  `;
}

function gachaCouponCardHtml(card, mode = "available") {
  const id = card.cardHistoryId || card.drawId;
  const state = getGachaLifecycleState(card);
  const isConfirming = appState.gachaUseConfirmId === String(id || "");
  return `
    <article class="collection-card gacha-coupon-card rarity-${escapeHtml(String(card.rarity || "R").toLowerCase())}">
      ${gachaCompletedCardHtml(card, "result")}
      <div class="summary-list">${summaryRows([
        ["キャラクター", card.characterName || card.cardName],
        ["景品", card.prizeName || card.title],
        ["対象メニュー", card.targetMenu || "全メニュー"],
        ["利用条件", card.usageCondition || card.condition || "-"],
        ["有効期限", formatDateUntil(card.validUntil || card.expires)],
        ["状態", state === "expired" ? "有効期限切れ" : getCardUsageState(card)],
        state === "used" ? ["使用日時", formatDateTime(card.usedAt || card.useConfirmedAt) || "記録済み"] : ["景品内容", card.prizeDescription || card.message || "-"]
      ])}</div>
      ${state === "used" ? `<div class="gacha-use-complete"><strong>✓ 使用済み</strong><span>使用日時：${escapeHtml(formatDateTime(card.usedAt || card.useConfirmedAt) || "記録済み")}</span></div>`
        : state === "expired" ? `<div class="gacha-use-expired"><strong>有効期限切れ</strong></div>`
        : isConfirming ? renderGachaUseConfirmation(card)
        : `<div class="admin-actions mini"><button class="primary-button" type="button" data-gacha-action="showUseConfirmation" data-id="${escapeHtml(id)}">スタッフに見せる</button></div>`}
    </article>
  `;
}

function renderGachaBinderSection(year, cards, collectionCards = cards) {
  const summary = buildCollectionSummary(cards, year);
  return `
    <section class="card-shelf">
      <header><h3>${escapeHtml(year)}年カードバインダー</h3><span>${cards.length}枚</span></header>
      <div class="collection-progress"><strong>${cards.length}枚</strong><span>UR ${summary.rarity.UR} / SSR ${summary.rarity.SSR} / SR ${summary.rarity.SR} / R ${summary.rarity.R} / N ${summary.rarity.N}</span></div>
      ${renderCollectionDex(buildCharacterCollection(collectionCards).items)}
    </section>
  `;
}

function renderArchivedBinderYears(years, usedCards) {
  return `
    <section class="card-shelf">
      <header><h3>過去年度の履歴</h3><span>${years.length}年分</span></header>
      <div class="chart-list">
        ${years.map((year) => {
          const cards = usedCards.filter((card) => String(card.issueMonth || "").startsWith(year));
          const summary = buildCollectionSummary(cards, Number(year));
          return `<article class="chart-row"><strong>${escapeHtml(year)}年バインダー</strong><span>${cards.length}枚 / UR ${summary.rarity.UR} / SSR ${summary.rarity.SSR} / SR ${summary.rarity.SR}</span></article>`;
        }).join("") || "<p>過去年度の使用済みカードはありません。</p>"}
      </div>
    </section>
  `;
}

function renderExpiredGachaHistory(cards) {
  return `
    <section class="card-shelf">
      <header><h3>期限切れ履歴</h3><span>${cards.length}枚</span></header>
      <div class="chart-list">
        ${cards.map((card) => `<article class="chart-row"><strong>${escapeHtml(card.characterName || card.cardName)}</strong><span>${escapeHtml(card.issueMonth || "")} / ${escapeHtml(card.prizeName || "")} / 未使用のまま終了</span></article>`).join("") || "<p>期限切れカードはありません。</p>"}
      </div>
    </section>
  `;
}

function renderCollectionRewardPanel(rewards) {
  return `
    <section class="card-shelf">
      <header><h3>コレクション特典</h3><span>${rewards.length}件</span></header>
      <div class="chart-list">
        ${rewards.map((reward) => `<article class="chart-row"><strong>${escapeHtml(reward.title)}</strong><span>${escapeHtml(reward.state)} / ${escapeHtml(reward.requiredRarity || "全カード")} ${escapeHtml(reward.requiredCount)}枚</span><p>${escapeHtml(reward.description || "")}</p></article>`).join("")}
      </div>
    </section>
  `;
}

function handleGachaAction(button) {
  const action = button.dataset.gachaAction;
  const id = button.dataset.id || "";
  if (action === "selectCard") return selectGachaCard(button);
  if (action === "selectBinderYear") {
    appState.gachaBinderYear = Number(button.dataset.year || currentYear());
    renderMyCards();
    return;
  }
  if (action === "closeRevealToCoupons") {
    const wasTestMode = document.getElementById("gachaReveal")?.classList.contains("is-test-mode");
    closeGachaPreviewAnimation();
    if (wasTestMode) {
      renderAdmin();
      return;
    }
    renderGacha();
    document.getElementById("gachaStage")?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  if (action === "showUseConfirmation") return showGachaUseConfirmation(id);
  if (action === "hideUseConfirmation") return hideGachaUseConfirmation();
  if (action === "confirmUse") return confirmGachaCardUse(id);
}

function updateGachaCardEverywhere(cardId, updater) {
  let updated = null;
  [STORAGE_KEYS.monthlyGachaDraws, STORAGE_KEYS.gachaCardHistory].forEach((key) => {
    const list = readJson(key, []);
    let changed = false;
    list.forEach((card) => {
      if (String(card.cardHistoryId || card.drawId) !== String(cardId)) return;
      updater(card);
      updated = card;
      changed = true;
    });
    if (changed) writeJson(key, list);
  });
  return updated;
}

function findGachaCardRecord(cardId) {
  return [...readJson(STORAGE_KEYS.gachaCardHistory, []), ...readJson(STORAGE_KEYS.monthlyGachaDraws, [])]
    .find((card) => String(card.cardHistoryId || card.drawId) === String(cardId));
}

function showGachaUseConfirmation(cardId) {
  const card = findGachaCardRecord(cardId);
  if (!card) return;
  const state = getGachaLifecycleState(card);
  if (state === "used") {
    showToast("この景品はすでに使用済みです。");
    return;
  }
  if (state === "expired") {
    showToast("この景品は有効期限切れです。");
    return;
  }
  const userKey = getCurrentUserKey();
  if (card.memberId && String(card.memberId) !== String(userKey)) {
    showToast("この景品は現在のユーザーのものではありません。");
    return;
  }
  appState.gachaUseConfirmId = String(cardId);
  renderApp();
}

function hideGachaUseConfirmation() {
  if (appState.gachaUseConfirmBusy) return;
  appState.gachaUseConfirmId = "";
  renderApp();
}

async function confirmGachaCardUse(cardId) {
  if (appState.gachaUseConfirmBusy || appState.gachaUseConfirmId !== String(cardId)) return;
  const card = findGachaCardRecord(cardId);
  if (!card) return;
  const state = getGachaLifecycleState(card);
  if (state === "used") {
    appState.gachaUseConfirmId = "";
    showToast("この景品はすでに使用済みです。");
    renderApp();
    return;
  }
  if (state === "expired") {
    appState.gachaUseConfirmId = "";
    showToast("この景品は有効期限切れです。");
    renderApp();
    return;
  }
  const userKey = getCurrentUserKey();
  if (card.memberId && String(card.memberId) !== String(userKey)) {
    appState.gachaUseConfirmId = "";
    showToast("この景品は現在のユーザーのものではありません。");
    renderApp();
    return;
  }

  appState.gachaUseConfirmBusy = true;
  renderApp();
  try {
    if (isProductionApiMode() && card.drawId) {
      if (card.dataMode === "TEST") throw new Error("TESTカードは本番画面から使用できません。");
      if (normalizeServerYearMonth(card.issueMonth || card.obtainedAt) !== currentMonthKey()) {
        throw new Error("このカードは当月の景品ではありません。");
      }
      const confirmResult = await apiRequest("confirmGachaPrizeUse", {
        userId: userKey,
        memberId: userKey,
        drawId: card.drawId,
        confirmedBy: "店頭スタッフ（お客様画面）",
        storeName: getStoreSettings().shopName
      });
      const confirmedDraw = confirmResult.data?.draw || confirmResult.draw || {};
      const confirmedUsage = confirmResult.data?.usage || confirmResult.usage || {};
      if (normalizeGachaState(confirmedDraw.status || confirmedUsage.status) !== "used") {
        throw new Error("使用済み状態を確認できませんでした。");
      }
      updateGachaCardEverywhere(cardId, (item) => {
        item.lifecycleState = "used";
        item.useState = "used";
        item.status = "used";
        item.usedAt = confirmedDraw.usedAt || confirmedUsage.confirmedAt || new Date().toISOString();
        item.useConfirmedAt = item.usedAt;
        item.usedByStaff = confirmedDraw.usedByStaff || confirmedUsage.confirmedBy || "店頭スタッフ（お客様画面）";
        item.usedStore = confirmedUsage.storeName || getStoreSettings().shopName;
      });
      appState.gachaUseConfirmId = "";
      renderGachaCollectionViews();
      await refreshProductionGachaCoupons(userKey).catch((error) => {
        console.warn("[TEAM LINK GACHA POST-USE REFRESH FAILED]", error);
      });
      renderGachaCollectionViews();
    } else {
      const usedAt = new Date().toISOString();
      updateGachaCardEverywhere(cardId, (item) => {
        item.lifecycleState = "used";
        item.useState = "used";
        item.status = "used";
        item.usedAt = usedAt;
        item.useConfirmedAt = usedAt;
        item.usedByStaff = "店頭スタッフ（お客様画面）";
        item.usedStore = getStoreSettings().shopName;
      });
    }
    appState.gachaUseConfirmId = "";
    renderGachaCollectionViews();
    showToast("景品を使用済みにしました。");
  } catch (error) {
    console.error("[TEAM LINK GACHA CUSTOMER USE CONFIRM FAILED]", error);
    showToast(getGachaUseErrorMessage(error));
  } finally {
    appState.gachaUseConfirmBusy = false;
    renderApp();
  }
}

function getGachaUseErrorMessage(error) {
  const code = String(error?.errorCode || "");
  const message = String(error?.message || "");
  if (code === "ALREADY_USED" || /すでに使用済み/.test(message)) return "この景品はすでに使用済みです。";
  if (code === "EXPIRED" || /期限/.test(message)) return "この景品は有効期限が切れています。";
  if (code === "NOT_FOUND" || code === "USER_MISMATCH" || /見つかりません|一致しません/.test(message)) return "カード情報を取得できませんでした。";
  return "通信に失敗しました。もう一度お試しください。";
}

function createGachaConfirmCode(card) {
  const seed = `${card.memberId || ""}${card.cardHistoryId || card.drawId || ""}${Date.now()}`;
  return `TL-${Math.abs(hashString(seed)).toString(36).toUpperCase().slice(0, 6).padEnd(6, "0")}`;
}

async function drawGachaRemote(issueMonth, options = {}) {
  try {
    if (!options.silent) showToast("抽選しています…");
    const profile = getProfile();
    const userKey = getCurrentUserKey();
    console.info("[TEAM LINK GACHA] drawMonthlyGacha start", {
      userId: userKey,
      lineUserId: profile.lineUserId || "",
      targetYearMonth: issueMonth
    });
    if (!options.skipPreflight) {
      const configResult = await apiRequest("getGachaConfig", {});
      console.info("[TEAM LINK API OK]", { action: "getGachaConfig", data: configResult.data || configResult });
      const statusResult = await apiRequest("checkMonthlyDrawStatus", {
        userId: userKey,
        memberId: userKey,
        lineUserId: profile.lineUserId || "",
        targetYearMonth: issueMonth
      });
      console.info("[TEAM LINK API OK]", { action: "checkMonthlyDrawStatus", data: statusResult.data || statusResult });
      if (statusResult.data?.alreadyDrawn || statusResult.data?.canDraw === false) {
        if (statusResult.data?.draw) {
          const existing = mapServerGachaDrawToLocal(statusResult.data.draw, statusResult.data.coupon || {});
          upsertLocalGachaDraw(existing);
          await refreshProductionGachaCoupons(userKey);
        }
        showToast(statusResult.data?.draw ? "今月のガチャはすでに引いています。" : "今月のガチャは利用できません。");
        return null;
      }
    }
    const result = await apiRequest("drawMonthlyGacha", {
      userId: userKey,
      memberId: userKey,
      lineUserId: profile.lineUserId || "",
      targetYearMonth: issueMonth,
      transactionId: createTransactionId("GACHA-DRAW")
    });
    console.info("[TEAM LINK API OK]", { action: "drawMonthlyGacha", response: result, data: result.data || result });
    console.info("[TEAM LINK GACHA] drawMonthlyGacha complete", {
      response: result,
      cardId: result.data?.draw?.cardId || result.draw?.cardId || "",
      rewardName: result.data?.draw?.rewardName || result.draw?.rewardName || ""
    });
    const localDraw = mapServerGachaDrawToLocal(result.data?.draw || result.draw || {}, result.data?.reward || result.reward || {});
    const coupon = result.data?.coupon || result.coupon || {};
    if (coupon.confirmationCode) localDraw.confirmationCode = coupon.confirmationCode;
    if (coupon.usageId) localDraw.usageId = coupon.usageId;
    return localDraw;
  } catch (error) {
    console.error("[TEAM LINK GACHA DRAW FAILED]", {
      action: "drawMonthlyGacha",
      errorCode: error?.errorCode || "",
      message: error?.message || String(error),
      responseBody: error?.responseBody || "",
      requestUrl: error?.requestUrl || TEAM_LINK_API_URL
    });
    showToast("通信に失敗しました。時間をおいてもう一度お試しください");
    return null;
  }
}

function mapServerGachaDrawToLocal(draw, reward) {
  const profile = getProfile();
  const userKey = getCurrentUserKey();
  const issueMonth = normalizeServerYearMonth(draw.targetYearMonth || reward.targetYearMonth || draw.drawnAt || reward.createdAt);
  const serverCardId = draw.cardId || reward.cardId || "";
  const officialCard = getOfficialGachaCard(serverCardId, issueMonth);
  if (!officialCard) {
    console.error(`CARD_MASTER_NOT_FOUND: ${serverCardId}`, { draw, reward });
  }
  const sheetPrize = getGachaPrizes().find((item) => String(item.cardId || item.prizeId) === String(serverCardId));
  const characterId = officialCard?.characterId || normalizeGachaCharacterId(serverCardId);
  const cardNo = officialCard?.cardNo || reward.cardNumber || reward.cardNo || draw.cardNumber || "";
  return {
    ...(officialCard || {}),
    drawId: draw.drawId,
    cardHistoryId: draw.drawId,
    memberId: userKey,
    lineUserId: profile.lineUserId || "",
    issueMonth,
    cardId: officialCard?.cardId || characterId || serverCardId,
    characterId,
    serverCardId,
    cardNo,
    cardName: officialCard?.cardName || officialCard?.characterName || reward.characterName || draw.characterName || reward.cardName || "",
    characterName: officialCard?.characterName || officialCard?.cardName || reward.characterName || draw.characterName || reward.cardName || "",
    rarity: officialCard?.rarity || draw.rarity || reward.rarity || "N",
    intro: officialCard?.intro || reward.description || "",
    effectName: officialCard?.effectName || reward.effectName || "",
    effectDescription: officialCard?.effectDescription || reward.description || "",
    prizeId: serverCardId,
    prizeName: draw.rewardName || reward.rewardName || sheetPrize?.prizeName || "",
    title: draw.rewardName || reward.rewardName || "",
    prizeTitle: draw.rewardName || reward.rewardName || "",
    prizeDescription: reward.rewardDetail || sheetPrize?.prizeDescription || "",
    message: reward.rewardDetail || sheetPrize?.prizeDescription || "",
    validUntil: draw.expiryDate || reward.expiryDate || endOfMonthDateKeyFor(issueMonth),
    expires: draw.expiryDate || reward.expiryDate || endOfMonthDateKeyFor(issueMonth),
    usageCondition: reward.notes || sheetPrize?.usageCondition || "",
    condition: reward.notes || sheetPrize?.usageCondition || "",
    targetMenu: reward.targetMenu || sheetPrize?.targetMenu || "",
    benefitDetail: reward.rewardDetail || sheetPrize?.prizeDescription || "",
    canCombine: reward.canCombine === true || String(reward.canCombine).toUpperCase() === "TRUE",
    notice: reward.notes || "",
    obtainedAt: draw.drawnAt || new Date().toISOString(),
    drawnAt: draw.drawnAt || new Date().toISOString(),
    lifecycleState: draw.status || "available",
    useState: draw.status || "available",
    status: draw.status || "available",
    confirmationCode: reward.confirmationCode || "",
    usageId: reward.usageId || "",
    serverSaved: true,
    snapshotPrize: JSON.stringify(reward),
    snapshotRarity: draw.rarity || reward.rarity || "N",
    snapshotSetting: JSON.stringify({ issueMonth, source: "Apps Script" })
  };
}

function normalizeGachaCharacterId(value) {
  const id = String(value || "").trim();
  const match = id.match(/^card-(\d{2})$/);
  return match ? `character-${match[1]}` : id;
}

function getOfficialGachaCard(cardId, issueMonth = currentMonthKey()) {
  const characterId = normalizeGachaCharacterId(cardId);
  if (!characterId) return null;
  const character = getGachaCharacters().find((item) => item.characterId === characterId);
  const officialBase = character ? monthlyCardFromCharacter(character, getGachaPrizes()[0], issueMonth, 0) : null;
  const setting = getGachaSetting(issueMonth);
  const monthlyCard = getGachaCards(setting).find((card) => (
    String(card.characterId || "") === characterId ||
    String(card.cardId || "") === characterId ||
    String(card.serverCardId || "") === String(cardId)
  ));
  if (!officialBase) return monthlyCard || null;
  if (!monthlyCard) return officialBase;
  return {
    ...monthlyCard,
    cardId: officialBase.cardId,
    characterId: officialBase.characterId,
    cardNo: officialBase.cardNo,
    cardName: officialBase.cardName,
    characterName: officialBase.characterName,
    rarity: officialBase.rarity,
    intro: officialBase.intro,
    effectName: officialBase.effectName,
    effectDescription: officialBase.effectDescription,
    imageUrl: officialBase.imageUrl,
    imagePath: officialBase.imagePath,
    cardBackground: officialBase.cardBackground,
    isPublic: officialBase.isPublic,
    sortOrder: officialBase.sortOrder
  };
}

function showGachaResult(card, isSaved) {
  const result = document.getElementById("gachaResult");
  result.hidden = false;
  const rarity = rarityMeta[card.rarity] || rarityMeta.R;
  result.innerHTML = `
    <p class="kicker">${isSaved ? "Latest result" : "Congratulations"}</p>
    <h2>${escapeHtml(card.characterName || card.cardName || card.prizeName)}</h2>
    ${gachaCompletedCardHtml(card, "result")}
    <div class="summary-list">${summaryRows([
      ["効果", `${card.effectName || ""}${card.effectDescription ? ` / ${card.effectDescription}` : ""}`],
      ["今回の景品", card.prizeName],
      ["景品説明", card.prizeDescription],
      ["当選年月", card.issueMonth || currentMonthKey()],
      ["利用期限", formatDateUntil(card.validUntil || card.expires)],
      ["利用条件", card.usageCondition || card.condition || ""],
      ["レア度", `${card.rarity} ${rarity.label}`],
      ["状態", card.status || "未使用"]
    ])}</div>
    <div class="action-row">
      <button class="primary-button compact" type="button" data-view="gacha">当選カードを見る</button>
      <button class="primary-button compact" type="button" data-view="mycards">コレクションを見る</button>
      <button class="secondary-button compact" type="button" data-view="home">ホームへ戻る</button>
    </div>
  `;
}

function gachaCharacterImageHtml(card) {
  if (Object.prototype.hasOwnProperty.call(card || {}, "obtained") && !card.obtained) {
    return `<span class="gacha-character-placeholder is-unknown" aria-label="未取得キャラクター">???</span>`;
  }
  const image = getGachaCharacterSrc(card);
  const fallback = `<span class="gacha-character-placeholder">${escapeHtml(card.cardNo || "?")}</span>`;
  return image
    ? `<img class="gacha-character-image" src="${escapeHtml(image)}" alt="${escapeHtml(card.characterName || card.cardName || "キャラクター")}" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'gacha-character-placeholder',textContent:'${escapeHtml(card.cardNo || "?")}' }))">`
    : fallback;
}

function gachaRawCharacterImageHtml(card) {
  const image = getGachaCharacterSrc(card);
  return image
    ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(card.characterName || card.cardName || "キャラクター")}" style="display:block;max-width:100%;max-height:180px;object-fit:contain;margin:auto;background:transparent;border:0;">`
    : `<span>${escapeHtml(card.cardNo || "?")}</span>`;
}

const trimmedCharacterImageCache = new Map();
let trimGachaCharacterImagesTimer = 0;

function scheduleTrimGachaCharacterImages(root = document) {
  return;
}

function trimGachaCharacterImages(root = document) {
  root.querySelectorAll?.([
    ".gacha-complete-card .gacha-character-image[data-character-source]",
    ".collection-card .gacha-character-image[data-character-source]",
    ".collection-dex-card.is-owned .gacha-character-image[data-character-source]",
    ".gacha-transparent-frame .gacha-character-image[data-character-source]",
    ".gacha-plain-image-frame .gacha-character-image[data-character-source]",
    "#gachaPreviewPanel .gacha-preview-mode .gacha-character-image[data-character-source]"
  ].join(",")).forEach((image) => {
    if (image.dataset.trimStatus === "done" || image.dataset.trimStatus === "pending") return;
    const source = image.dataset.characterSource;
    if (!source || source.startsWith("data:") || source.startsWith("blob:")) return;
    image.dataset.trimStatus = "pending";
    const cleanMode = image.dataset.cleanMode || "clean";
    const imagePromise = cleanMode === "simple" ? getSimpleTrimmedCharacterImage(source) : getCleanCharacterImage(source);
    imagePromise
      .then((cleanResult) => {
        if (cleanResult?.dataUrl && image.isConnected) {
          image.src = cleanResult.dataUrl;
          const { dataUrl, ...debug } = cleanResult;
          image.dataset.trimDebug = JSON.stringify(debug);
          image.dataset.trimStatus = "done";
        }
      })
      .catch(() => {
        if (image.isConnected) image.dataset.trimStatus = "failed";
      });
  });
}

function getCleanCharacterOptions(source) {
  const id = String(source || "").match(/character-\d+/)?.[0] || "default";
  const defaults = { coreAlphaThreshold: 72, expandPx: 16, featherPx: 10 };
  const perCharacter = {
    "character-01": { coreAlphaThreshold: 255, expandPx: 72, featherPx: 18, minComponentArea: 480 },
    "character-02": { coreAlphaThreshold: 255, expandPx: 24, featherPx: 10, minComponentArea: 480 }
  };
  return { ...defaults, ...(perCharacter[id] || {}), characterId: id };
}

function getCleanCharacterImage(source) {
  const options = getCleanCharacterOptions(source);
  const cacheKey = `${source}|${options.coreAlphaThreshold}|${options.expandPx}|${options.featherPx}|${options.minComponentArea || 0}`;
  if (!trimmedCharacterImageCache.has(cacheKey)) {
    trimmedCharacterImageCache.set(cacheKey, createCleanCharacterImage(source, options));
  }
  return trimmedCharacterImageCache.get(cacheKey);
}

function getSimpleTrimmedCharacterImage(source) {
  const cacheKey = `${source}|simple`;
  if (!trimmedCharacterImageCache.has(cacheKey)) {
    trimmedCharacterImageCache.set(cacheKey, createSimpleTrimmedCharacterImage(source));
  }
  return trimmedCharacterImageCache.get(cacheKey);
}

function createSimpleTrimmedCharacterImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      try {
        const width = image.naturalWidth;
        const height = image.naturalHeight;
        if (!width || !height) {
          resolve({ dataUrl: source, status: "empty-image" });
          return;
        }
        const sourceCanvas = document.createElement("canvas");
        sourceCanvas.width = width;
        sourceCanvas.height = height;
        const sourceContext = sourceCanvas.getContext("2d", { willReadFrequently: true });
        sourceContext.drawImage(image, 0, 0);
        const imageData = sourceContext.getImageData(0, 0, width, height);
        const boundingBox = getAlphaBoundingBox(imageData.data, width, height, 1);
        if (!boundingBox) {
          resolve({ dataUrl: source, status: "empty-after-simple-trim" });
          return;
        }
        const canvas = document.createElement("canvas");
        canvas.width = boundingBox.width;
        canvas.height = boundingBox.height;
        const drawImage = {
          sx: boundingBox.left,
          sy: boundingBox.top,
          sWidth: boundingBox.width,
          sHeight: boundingBox.height,
          dx: 0,
          dy: 0,
          dWidth: boundingBox.width,
          dHeight: boundingBox.height
        };
        canvas.getContext("2d").drawImage(
          sourceCanvas,
          drawImage.sx,
          drawImage.sy,
          drawImage.sWidth,
          drawImage.sHeight,
          drawImage.dx,
          drawImage.dy,
          drawImage.dWidth,
          drawImage.dHeight
        );
        const debug = {
          source,
          status: "simple-trimmed",
          originalSize: { width, height },
          cleanedBoundingBox: boundingBox,
          cleanedRatios: getAlphaRatios(canvas.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, canvas.width, canvas.height).data),
          canvas: { width: canvas.width, height: canvas.height },
          drawImage
        };
        resolve({ dataUrl: canvas.toDataURL("image/png"), ...debug });
      } catch (error) {
        reject(error);
      }
    };
    image.onerror = reject;
    image.src = source;
  });
}

function createCleanCharacterImage(source, options = {}) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      try {
        const width = image.naturalWidth;
        const height = image.naturalHeight;
        if (!width || !height) {
          resolve({ dataUrl: source, status: "empty-image" });
          return;
        }
        const sourceCanvas = document.createElement("canvas");
        sourceCanvas.width = width;
        sourceCanvas.height = height;
        const sourceContext = sourceCanvas.getContext("2d", { willReadFrequently: true });
        sourceContext.drawImage(image, 0, 0);
        const imageData = sourceContext.getImageData(0, 0, width, height);
        const pixels = imageData.data;
        const originalRatios = getAlphaRatios(pixels);
        const simpleBoundingBox = getAlphaBoundingBox(pixels, width, height, 1);
        const coreAlphaThreshold = Number(options.coreAlphaThreshold || 72);
        const expandPx = Number(options.expandPx || 16);
        const featherPx = Number(options.featherPx || 10);
        const minComponentArea = Number(options.minComponentArea || 0);
        const coreComponent = findBodyAlphaComponents(pixels, width, height, coreAlphaThreshold, minComponentArea);
        if (!coreComponent?.area) {
          resolve({
            dataUrl: source,
            originalSize: { width, height },
            status: "no-core-component",
          threshold: { coreAlphaThreshold, expandPx, featherPx, minComponentArea }
          });
          return;
        }
        const cleanMask = buildExpandedFeatherMask(coreComponent.mask, width, height, expandPx, featherPx);
        for (let index = 0; index < pixels.length; index += 4) {
          const pixelIndex = index / 4;
          const alpha = pixels[index + 3];
          const mask = cleanMask[pixelIndex];
          if (!mask || alpha <= 16) {
            pixels[index + 3] = 0;
            continue;
          }
          let remappedAlpha = alpha;
          if (alpha <= 48) {
            remappedAlpha = Math.round(alpha * ((alpha - 16) / 32));
          }
          pixels[index + 3] = Math.round(remappedAlpha * (mask / 255));
        }
        const cleanedBoundingBox = getAlphaBoundingBox(pixels, width, height, 8);
        if (!cleanedBoundingBox) {
          resolve({
            dataUrl: source,
            originalSize: { width, height },
            originalRatios,
            status: "empty-after-clean",
            threshold: { coreAlphaThreshold, expandPx, featherPx, minComponentArea }
          });
          return;
        }
        sourceContext.putImageData(imageData, 0, 0);
        const trimWidth = cleanedBoundingBox.width;
        const trimHeight = cleanedBoundingBox.height;
        const trimmedCanvas = document.createElement("canvas");
        const drawArgs = {
          sx: cleanedBoundingBox.left,
          sy: cleanedBoundingBox.top,
          sWidth: trimWidth,
          sHeight: trimHeight,
          dx: 0,
          dy: 0,
          dWidth: trimWidth,
          dHeight: trimHeight
        };
        trimmedCanvas.width = trimWidth;
        trimmedCanvas.height = trimHeight;
        trimmedCanvas.getContext("2d").drawImage(
          sourceCanvas,
          drawArgs.sx,
          drawArgs.sy,
          drawArgs.sWidth,
          drawArgs.sHeight,
          drawArgs.dx,
          drawArgs.dy,
          drawArgs.dWidth,
          drawArgs.dHeight
        );
        const cleanedData = trimmedCanvas.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, trimWidth, trimHeight).data;
        const debug = {
          originalSize: { width, height },
          originalRatios,
          cleanedBoundingBox,
          cleanedRatios: getAlphaRatios(cleanedData),
          simpleBoundingBox,
          threshold: { coreAlphaThreshold, expandPx, featherPx, minComponentArea },
          status: "cleaned",
          source,
          canvas: {
            width: trimmedCanvas.width,
            height: trimmedCanvas.height
          },
          drawImage: drawArgs
        };
        console.info("[TEAM LINK gacha character clean]", debug);
        resolve({
          dataUrl: trimmedCanvas.toDataURL("image/png"),
          ...debug
        });
      } catch (error) {
        reject(error);
      }
    };
    image.onerror = reject;
    image.src = source;
  });
}

function getAlphaRatios(pixels) {
  let transparent = 0;
  let semiTransparent = 0;
  let opaque = 0;
  const total = pixels.length / 4;
  for (let index = 3; index < pixels.length; index += 4) {
    const alpha = pixels[index];
    if (alpha === 0) transparent += 1;
    else if (alpha === 255) opaque += 1;
    else semiTransparent += 1;
  }
  return {
    transparent,
    semiTransparent,
    opaque,
    transparentRatio: transparent / total,
    semiTransparentRatio: semiTransparent / total,
    opaqueRatio: opaque / total
  };
}

function getAlphaBoundingBox(pixels, width, height, threshold = 1) {
  let left = width;
  let top = height;
  let right = -1;
  let bottom = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (pixels[(y * width + x) * 4 + 3] < threshold) continue;
      if (x < left) left = x;
      if (x > right) right = x;
      if (y < top) top = y;
      if (y > bottom) bottom = y;
    }
  }
  if (right < left || bottom < top) return null;
  return { left, top, right, bottom, width: right - left + 1, height: bottom - top + 1 };
}

function findBodyAlphaComponents(pixels, width, height, threshold, minComponentArea = 0) {
  const total = width * height;
  const candidate = new Uint8Array(total);
  const visited = new Uint8Array(total);
  for (let pixel = 0; pixel < total; pixel += 1) {
    if (pixels[pixel * 4 + 3] >= threshold) candidate[pixel] = 1;
  }
  const queue = new Int32Array(total);
  const keptComponents = [];
  let largestArea = 0;
  const directions = [1, -1, width, -width];
  for (let start = 0; start < total; start += 1) {
    if (!candidate[start] || visited[start]) continue;
    let head = 0;
    let tail = 0;
    const current = [];
    queue[tail] = start;
    tail += 1;
    visited[start] = 1;
    while (head < tail) {
      const pixel = queue[head];
      head += 1;
      current.push(pixel);
      const x = pixel % width;
      for (const offset of directions) {
        if ((offset === 1 && x === width - 1) || (offset === -1 && x === 0)) continue;
        const next = pixel + offset;
        if (next < 0 || next >= total || visited[next] || !candidate[next]) continue;
        visited[next] = 1;
        queue[tail] = next;
        tail += 1;
      }
    }
    if (current.length > largestArea) largestArea = current.length;
    keptComponents.push(current);
  }
  if (!keptComponents.length) return null;
  const areaFloor = Math.max(Number(minComponentArea || 0), Math.round(largestArea * 0.018));
  const mask = new Uint8Array(total);
  let keptArea = 0;
  keptComponents.forEach((component) => {
    if (component.length < areaFloor) return;
    keptArea += component.length;
    component.forEach((pixel) => {
      mask[pixel] = 255;
    });
  });
  return { mask, area: keptArea, largestArea, areaFloor };
}

function buildExpandedFeatherMask(coreMask, width, height, expandPx, featherPx) {
  const total = width * height;
  const mask = new Uint8Array(coreMask);
  let frontier = new Uint8Array(coreMask);
  for (let step = 1; step <= expandPx + featherPx; step += 1) {
    const nextFrontier = new Uint8Array(total);
    const value = step <= expandPx
      ? 255
      : Math.max(0, Math.round(255 * (1 - ((step - expandPx) / (featherPx + 1)))));
    for (let pixel = 0; pixel < total; pixel += 1) {
      if (!frontier[pixel]) continue;
      const x = pixel % width;
      const neighbors = [
        x > 0 ? pixel - 1 : -1,
        x < width - 1 ? pixel + 1 : -1,
        pixel >= width ? pixel - width : -1,
        pixel < total - width ? pixel + width : -1
      ];
      neighbors.forEach((next) => {
        if (next < 0 || mask[next]) return;
        mask[next] = value;
        nextFrontier[next] = value;
      });
    }
    frontier = nextFrontier;
  }
  return mask;
}

function withAssetVersion(url) {
  const value = String(url || "").trim();
  if (!value) return "";
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  if (!value.includes("images/gacha/characters/")) return value;
  return `${value}${value.includes("?") ? "&" : "?"}v=${ASSET_VERSION}`;
}

function preloadGachaImage(url, timeoutMs = 2200) {
  const src = String(url || "").trim();
  if (!src) return Promise.resolve({ src, ok: false, skipped: true });
  if (gachaRevealAssetCache.has(src)) return gachaRevealAssetCache.get(src);
  const promise = new Promise((resolve) => {
    const image = new Image();
    let settled = false;
    const done = (ok, eventType) => {
      if (settled) return;
      settled = true;
      resolve({
        src,
        ok,
        eventType,
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight
      });
    };
    const timer = window.setTimeout(() => done(Boolean(image.naturalWidth), "timeout"), timeoutMs);
    image.onload = () => {
      window.clearTimeout(timer);
      done(true, "load");
    };
    image.onerror = () => {
      window.clearTimeout(timer);
      done(false, "error");
    };
    image.src = src;
  });
  gachaRevealAssetCache.set(src, promise);
  return promise;
}

function preloadGachaRevealAssets(cards = []) {
  const rarityKeys = ["n", "r", "sr", "ssr", "ur"];
  const baseAssets = [
    "images/gacha/bg-gacha.webp",
    "images/gacha/card-back.webp",
    ...rarityKeys.flatMap((rarity) => [
      `images/gacha/frames/frame-${rarity}.webp`,
      `images/gacha/inside/inside-${rarity}.webp`
    ])
  ];
  const characterAssets = cards
    .map((card) => getGachaCharacterSrc(card))
    .filter(Boolean);
  return Promise.all([...new Set([...baseAssets, ...characterAssets])].map((src) => preloadGachaImage(src, 1800)));
}

function gachaFrameImageHtml(card) {
  const rarity = String(card.rarity || "N").toLowerCase();
  const frameImage = card.frameImageUrl || card.snapshotFrameImageUrl || `images/gacha/frames/frame-${rarity}.webp`;
  if (!frameImage) return "";
  const src = escapeHtml(frameImage);
  return ["top", "left", "right", "bottom"].map((part) => (
    `<img class="gacha-frame-image gacha-frame-piece frame-piece-${part}" src="${src}" alt="" aria-hidden="true" onerror="this.closest('.gacha-complete-card')?.classList.add('is-frame-missing')">`
  )).join("");
}

function gachaInsideImageHtml(card) {
  const rarity = String(card.rarity || "N").toLowerCase();
  const insideImage = card.insideImageUrl || card.snapshotInsideImageUrl || `images/gacha/inside/inside-${rarity}.webp`;
  return insideImage
    ? `<img class="gacha-inside-image" src="${escapeHtml(insideImage)}" alt="" aria-hidden="true" onerror="this.closest('.gacha-complete-card')?.classList.add('is-inside-missing')">`
    : "";
}

function getGachaCharacterSrc(cardData = {}) {
  const characterId = normalizeGachaCharacterId(cardData.characterId || cardData.cardId || "");
  const source = String(cardData.imageUrl || cardData.snapshotImageUrl || cardData.imagePath || (characterId ? `images/gacha/characters/${characterId}.png` : "")).trim();
  if (/^images\/gacha\/characters\/character-\d+\.png(?:\?.*)?$/i.test(source)) {
    return source.replace(/\.png(?=\?|$)/i, ".webp");
  }
  return source;
}

function createSimpleGachaCard(cardData = {}, options = {}) {
  const rarityKey = String(cardData.rarity || "N").toLowerCase();
  const characterSrc = getGachaCharacterSrc(cardData);
  const insideSrc = cardData.insideImageUrl || cardData.snapshotInsideImageUrl || `images/gacha/inside/inside-${rarityKey}.webp`;
  const frameSrc = cardData.frameImageUrl || cardData.snapshotFrameImageUrl || `images/gacha/frames/frame-${rarityKey}.webp`;
  const characterName = cardData.characterName || cardData.cardName || "";
  const introText = cardData.intro || cardData.description || "TEAM LINKだけのコレクションカード";
  const effectName = cardData.effectName || cardData.effectTitle || "ビューティー運アップ";
  const effectDetail = cardData.effectDetail || cardData.effectDescription || cardData.effectSubtext || "";
  const validUntil = cardData.validUntil || cardData.expires || cardData.expiresAt || endOfMonthLabel();
  const compactClass = options.compact ? " is-compact" : "";
  const modeClass = options.mode ? ` mode-${escapeHtml(options.mode)}` : "";
  const nameSize = getGachaNameSize(characterName);
  return `
    <div class="tl-simple-card rarity-${escapeHtml(rarityKey)}${compactClass}${modeClass}" data-rarity="${escapeHtml(cardData.rarity || "N")}">
      <img class="tl-simple-card__inside" src="${escapeHtml(insideSrc)}" alt="" aria-hidden="true">
      <div class="tl-simple-card__character-area">
        ${characterSrc
          ? `<img class="tl-simple-card__character" src="${escapeHtml(characterSrc)}" alt="${escapeHtml(characterName || "キャラクター")}">`
          : `<span class="tl-simple-card__character-placeholder">${escapeHtml(cardData.cardNo || "?")}</span>`}
      </div>
      <img class="tl-simple-card__frame" src="${escapeHtml(frameSrc)}" alt="" aria-hidden="true">
      <div class="tl-simple-card__number">No.${escapeHtml(cardData.cardNo || "")}</div>
      <div class="tl-simple-card__info">
        <div class="tl-simple-card__name" style="--simple-card-name-size:${escapeHtml(nameSize)}">${escapeHtml(characterName)}</div>
        <div class="tl-simple-card__description">${escapeHtml(introText)}</div>
        <div class="tl-simple-card__effect">
          <span class="tl-simple-card__label">効果</span>
          <strong>${escapeHtml(effectName)}</strong>
          <small>${escapeHtml(effectDetail)}</small>
        </div>
        <div class="tl-simple-card__reward">
          <span class="tl-simple-card__label">今回の景品</span>
          <strong>${escapeHtml(cardData.prizeName || "今月の景品")}</strong>
          <small>${escapeHtml(formatDateUntil(validUntil))}</small>
        </div>
      </div>
      <div class="tl-simple-card__fx" aria-hidden="true"></div>
    </div>
  `;
}

function gachaRevealBackHtml() {
  return `
    <div class="gacha-card-back-art">
      <img src="images/gacha/card-back.webp" alt="" aria-hidden="true" onerror="this.hidden=true;this.closest('.gacha-card-back-art')?.classList.add('is-css-back')">
    </div>
  `;
}

function drawPrize(issueMonth) {
  const setting = getGachaSetting(issueMonth);
  const publicCards = getGachaCards(setting).filter((card) => card.isPublic !== false && card.isDrawable !== false);
  const availableCards = publicCards.filter((card) => (
    !hasReachedMonthlyLimit(card, issueMonth) &&
    Number(card.stockCount ?? card.inventoryCount ?? 999) > 0
  ));
  const pool = availableCards.length ? availableCards : publicCards;
  const rarityGroups = Object.keys(rarityMeta).filter((rarity) => pool.some((card) => card.rarity === rarity));
  const rates = setting.rarityRates || defaultGachaRarityRates;
  const rateTotal = rarityGroups.reduce((sum, rarity) => sum + Number(rates[rarity] || 0), 0);
  let rarityPoint = Math.random() * (rateTotal || 100);
  let selectedRarity = rarityGroups[rarityGroups.length - 1];
  for (const rarity of rarityGroups) {
    rarityPoint -= Number(rates[rarity] || 0);
    if (rarityPoint <= 0) {
      selectedRarity = rarity;
      break;
    }
  }
  const sameRarity = pool.filter((card) => card.rarity === selectedRarity);
  const targetPool = sameRarity.length ? sameRarity : pool;
  const weightTotal = targetPool.reduce((sum, card) => sum + Number(card.weight || card.winRate || 1), 0);
  let point = Math.random() * weightTotal;
  for (const card of targetPool) {
    point -= Number(card.weight || card.winRate || 1);
    if (point <= 0) return card;
  }
  return targetPool[targetPool.length - 1];
}

function createGachaDraw(issueMonth) {
  const profile = getProfile();
  const userKey = getCurrentUserKey();
  const setting = getGachaSetting(issueMonth);
  if (!setting || setting.status !== "公開") {
    showToast("今月のガチャは準備中です。");
    return null;
  }
  if (getGachaOddsTotal(setting) !== 100) {
    showToast("ガチャ確率の合計が100％ではありません。");
    return null;
  }
  const card = drawPrize(issueMonth);
  if (!card) {
    showToast("抽選対象カードがありません。");
    return null;
  }
  const now = new Date().toISOString();
  return {
    drawId: createId("GACHA"),
    cardHistoryId: createId("CARD"),
    memberId: userKey,
    lineUserId: profile.lineUserId || "",
    issueMonth,
    cardId: card.cardId,
    characterId: card.characterId || card.cardId,
    cardNo: card.cardNo || "",
    cardName: card.cardName,
    characterName: card.characterName || card.cardName,
    rarity: card.rarity,
    intro: card.intro || "",
    effectName: card.effectName || "",
    effectDescription: card.effectDescription || "",
    prizeId: card.prizeId || card.cardId,
    prizeName: card.prizeName,
    title: card.prizeName,
    prizeTitle: card.prizeName,
    prizeDescription: card.prizeDescription,
    message: card.prizeDescription,
    imageUrl: card.imageUrl || "",
    cardBackground: card.cardBackground || "",
    validUntil: endOfMonthDateKeyFor(issueMonth),
    expires: endOfMonthDateKeyFor(issueMonth),
    usageCondition: card.usageCondition || "",
    condition: card.usageCondition || "",
    targetMenu: card.targetMenu || "",
    benefitDetail: card.benefitDetail || card.prizeDescription || "",
    canCombine: Boolean(card.canCombine),
    notice: card.notice || "",
    issueAsCoupon: Boolean(card.issueAsCoupon),
    obtainedAt: now,
    drawnAt: now,
    lifecycleState: "available",
    useState: "available",
    status: "available",
    useRequestedAt: "",
    useCancelledAt: "",
    confirmationCode: "",
    pendingExpiresAt: "",
    usedAt: "",
    usedByStaff: "",
    usedStore: "",
    usedBookingId: "",
    useNote: "",
    snapshotImageUrl: card.imageUrl || "",
    snapshotPrize: JSON.stringify(card),
    snapshotRarity: card.rarity,
    snapshotSetting: JSON.stringify(setting)
  };
}

async function saveGachaDraw(draw) {
  const draws = readJson(STORAGE_KEYS.monthlyGachaDraws, []);
  if (draws.some((item) => (
    String(item.issueMonth) === String(draw.issueMonth) &&
    (String(item.memberId) === String(draw.memberId) || (draw.lineUserId && String(item.lineUserId) === String(draw.lineUserId)))
  ))) return true;
  if (draw.serverSaved) {
    writeJson(STORAGE_KEYS.monthlyGachaDraws, [draw, ...draws]);
    writeJson(STORAGE_KEYS.gachaCardHistory, [draw, ...readJson(STORAGE_KEYS.gachaCardHistory, [])]);
    addAdminLog("gacha_draw", `${draw.memberId} が ${draw.characterName || draw.cardName} を獲得`, "サーバー抽選", draw.memberId);
    return true;
  }
  if (isProductionApiMode()) {
    try {
      showToast("保存しています…");
      await apiRequest("saveGachaCardHistory", {
        ...draw,
        transactionId: createTransactionId("GACHA-CARD")
      });
      if (draw.issueAsCoupon) {
        const linkedCoupon = getAdminCoupons().find((coupon) => coupon.source === "ガチャ" && (coupon.title === draw.prizeName || coupon.targetMenu === draw.targetMenu));
        if (!linkedCoupon) throw new Error("ガチャ景品に対応するクーポンマスタが見つかりません。");
        const issued = await apiRequest("issueGachaCoupon", {
          memberId: draw.memberId,
          lineUserId: draw.lineUserId || "",
          couponId: linkedCoupon.couponId,
          gachaHistoryId: draw.cardHistoryId,
          cardId: draw.cardId,
          cardName: draw.cardName,
          rarity: draw.rarity,
          issueMonth: draw.issueMonth,
          prizeId: draw.prizeId || draw.cardId,
          prizeName: draw.prizeName,
          transactionId: createTransactionId("GACHA-COUPON")
        });
        const localCoupon = mergeServerMemberCoupon(issued.memberCoupon);
        if (localCoupon) draw.linkedCouponId = localCoupon.couponId;
      }
    } catch (error) {
      showToast("通信に失敗しました。時間をおいてもう一度お試しください");
      return false;
    }
  }
  writeJson(STORAGE_KEYS.monthlyGachaDraws, [draw, ...draws]);
  const history = readJson(STORAGE_KEYS.gachaCardHistory, []);
  writeJson(STORAGE_KEYS.gachaCardHistory, [draw, ...history]);
  if (draw.issueAsCoupon && !isProductionApiMode()) {
    createLinkedCouponFromGacha(draw);
  }
  addAdminLog("gacha_draw", `${draw.memberId} が ${draw.cardName} を獲得`, "テスト抽選", draw.memberId);
  return true;
}

function upsertLocalGachaDraw(draw) {
  if (!draw) return;
  [STORAGE_KEYS.monthlyGachaDraws, STORAGE_KEYS.gachaCardHistory].forEach((key) => {
    const list = readJson(key, []);
    const id = String(draw.drawId || draw.cardHistoryId || "");
    const filtered = list.filter((item) => String(item.drawId || item.cardHistoryId || "") !== id);
    writeJson(key, [draw, ...filtered]);
  });
}

function removeLocalGachaDrawForUserMonth(userId, month) {
  [STORAGE_KEYS.monthlyGachaDraws, STORAGE_KEYS.gachaCardHistory].forEach((key) => {
    const next = readJson(key, []).filter((card) => !(
      String(card.issueMonth || card.targetYearMonth || "") === String(month || "") &&
      (
        String(card.memberId || card.userId || "") === String(userId || "") ||
        String(card.lineUserId || "") === String(userId || "")
      )
    ));
    writeJson(key, next);
  });
}

async function refreshProductionGachaCoupons(userId = getCurrentUserKey()) {
  if (!isProductionApiMode()) return;
  const result = await apiRequest("getUserCoupons", { userId });
  const coupons = result.data?.coupons || result.coupons || [];
  replaceServerGachaCoupons(coupons, userId);
  console.info("[TEAM LINK GACHA COUPONS REFRESHED]", {
    userId,
    count: coupons.length,
    coupons
  });
}

function revealGachaCard(card) {
  const overlay = document.getElementById("gachaReveal");
  if (!overlay) return Promise.resolve();
  overlay.hidden = false;
  overlay.className = `gacha-reveal rarity-${String(card.rarity || "R").toLowerCase()} is-running is-secret-reveal`;
  overlay.innerHTML = `
    <div class="gacha-stage-bg" aria-hidden="true"></div>
    <div class="reveal-particles rarity-burst" aria-hidden="true"></div>
    <div class="preview-aura rarity-aura" aria-hidden="true"></div>
    <div class="reveal-blackout" aria-hidden="true"></div>
    <article class="reveal-card">
      <div class="reveal-card-inner">
        <section class="reveal-card-face reveal-card-back">${gachaRevealBackHtml()}</section>
        <section class="reveal-card-face reveal-card-front reveal-card-complete">
          ${gachaCompletedCardHtml(card, "reveal")}
        </section>
      </div>
    </article>
  `;
  if ((card.rarity === "UR" || card.rarity === "SSR") && navigator.vibrate) navigator.vibrate(card.rarity === "UR" ? 55 : 38);
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return new Promise((resolve) => {
    window.setTimeout(() => {
      overlay.hidden = true;
      overlay.className = "gacha-reveal";
      resolve();
    }, prefersReduced ? 900 : 7600);
  });
}

function openGachaRevealAnimation({ choice = "center", testMode = false } = {}) {
  const overlay = document.getElementById("gachaReveal");
  if (!overlay) return;
  preloadGachaRevealAssets().catch((error) => {
    console.warn("[TEAM LINK GACHA PRELOAD FAILED]", error);
  });
  overlay.hidden = false;
  overlay.className = `gacha-reveal gacha-reveal-stage is-choice-reveal is-waiting selected-${choice}${testMode ? " is-test-mode" : ""}`;
  overlay.innerHTML = `
    <div class="gacha-stage-bg" aria-hidden="true"></div>
    <div class="gacha-choice-particles" aria-hidden="true"></div>
    <div class="gacha-reveal-choice-set" aria-hidden="true">
      <div class="gacha-reveal-ghost-card is-left">${gachaRevealBackHtml()}</div>
      <div class="gacha-reveal-ghost-card is-center">${gachaRevealBackHtml()}</div>
      <div class="gacha-reveal-ghost-card is-right">${gachaRevealBackHtml()}</div>
    </div>
    <article class="gacha-reveal-main-card">
      <div class="gacha-reveal-main-inner">
        <section class="gacha-reveal-face gacha-reveal-back">${gachaRevealBackHtml()}</section>
        <section class="gacha-reveal-face gacha-reveal-front" data-gacha-reveal-front></section>
      </div>
    </article>
    <p class="gacha-reveal-message" data-gacha-reveal-message>運命のカードを選んでいます…</p>
    <div class="gacha-reveal-actions" data-gacha-reveal-actions hidden>
      <button class="primary-button compact" type="button" data-gacha-action="closeRevealToCoupons">当選カードを見る</button>
    </div>
  `;
  window.setTimeout(() => {
    const currentMessage = overlay.querySelector("[data-gacha-reveal-message]");
    if (!overlay.hidden && overlay.classList.contains("is-waiting") && currentMessage) {
      currentMessage.textContent = "光が集まっています…";
    }
  }, 2300);
}

function completeGachaReveal(card) {
  const overlay = document.getElementById("gachaReveal");
  if (!overlay) return Promise.resolve();
  const rarityKey = String(card.rarity || "N").toLowerCase();
  const timing = getGachaRevealTiming(card.rarity);
  const front = overlay.querySelector("[data-gacha-reveal-front]");
  const message = overlay.querySelector("[data-gacha-reveal-message]");
  const actions = overlay.querySelector("[data-gacha-reveal-actions]");
  const frontHtml = gachaCompletedCardHtml(card, "reveal");
  console.info("[TEAM LINK GACHA] completeGachaReveal start", {
    cardId: card.cardId,
    characterId: card.characterId,
    rarity: card.rarity,
    prizeName: card.prizeName
  });
  overlay.style.setProperty("--gacha-reveal-total", `${timing.totalMs}ms`);
  overlay.style.setProperty("--gacha-actions-delay", `${Math.max(timing.totalMs - 120, 900)}ms`);
  overlay.style.setProperty("--gacha-flip-duration", `${timing.flipMs}ms`);
  overlay.classList.add("is-front-preparing");
  if (front) front.innerHTML = frontHtml;
  console.info("[TEAM LINK GACHA REVEAL READY]", {
    stage: "front_dom_created",
    cardId: card.cardId,
    serverCardId: card.serverCardId,
    characterId: card.characterId,
    rarity: card.rarity,
    officialCard: getOfficialGachaCard(card.cardId || card.characterId || card.serverCardId, card.issueMonth),
    frontHtmlLength: frontHtml.length,
    imageUrls: front ? Array.from(front.querySelectorAll("img")).map((img) => img.getAttribute("src")) : []
  });
  return waitForGachaRevealImages(front, timing.imageWaitMs).then((imageResults) => {
    console.info("[TEAM LINK GACHA] image load complete", {
      cardId: card.cardId,
      imageResults
    });
    console.info("[TEAM LINK GACHA REVEAL IMAGES]", {
      stage: "front_images_loaded",
      cardId: card.cardId,
      imageResults
    });
    overlay.classList.remove("is-waiting", "is-front-preparing", "rarity-ur", "rarity-ssr", "rarity-sr", "rarity-r", "rarity-n");
    overlay.classList.add("is-front-ready", "is-revealing", `rarity-${rarityKey}`);
    console.info("[TEAM LINK GACHA] flip animation start", {
      cardId: card.cardId,
      rarity: card.rarity
    });
    if (message) message.textContent = "";
    if ((card.rarity === "UR" || card.rarity === "SSR") && navigator.vibrate) navigator.vibrate(card.rarity === "UR" ? [28, 28, 54] : 38);
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return new Promise((resolve) => {
      window.setTimeout(() => {
        overlay.classList.remove("is-revealing");
        overlay.classList.add("is-reveal-complete");
        if (message) message.textContent = "獲得しました";
        if (actions) actions.hidden = false;
        console.info("[TEAM LINK GACHA] flip animation end", {
          cardId: card.cardId,
          rarity: card.rarity
        });
        resolve();
      }, prefersReduced ? 650 : timing.totalMs);
    });
  }).catch((error) => {
    console.error("[TEAM LINK GACHA REVEAL FAILED]", {
      stage: "front_images_or_flip",
      cardId: card.cardId,
      error
    });
    throw error;
  });
}

function getGachaRevealTiming(rarity = "N") {
  const key = String(rarity || "N").toUpperCase();
  const timings = {
    N: { totalMs: 650, flipMs: 300, imageWaitMs: 80 },
    R: { totalMs: 680, flipMs: 310, imageWaitMs: 80 },
    SR: { totalMs: 740, flipMs: 330, imageWaitMs: 100 },
    SSR: { totalMs: 820, flipMs: 350, imageWaitMs: 120 },
    UR: { totalMs: 900, flipMs: 380, imageWaitMs: 120 }
  };
  return timings[key] || timings.N;
}

function waitForGachaRevealImages(root, timeoutMs = 900) {
  if (!root) return Promise.resolve([]);
  const images = Array.from(root.querySelectorAll("img"));
  if (!images.length) return Promise.resolve([]);
  return Promise.all(images.map((img) => new Promise((resolve) => {
    let settled = false;
    let timer = null;
    const done = (ok, eventType = "unknown") => {
      if (settled) return;
      settled = true;
      if (timer) window.clearTimeout(timer);
      resolve({
        src: img.currentSrc || img.src || img.getAttribute("src") || "",
        ok,
        eventType,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight
      });
    };
    if (img.complete) {
      done(Boolean(img.naturalWidth), img.naturalWidth ? "already-complete" : "already-complete-no-size");
      return;
    }
    img.addEventListener("load", () => done(true, "load"), { once: true });
    img.addEventListener("error", () => done(false, "error"), { once: true });
    timer = window.setTimeout(() => {
      done(Boolean(img.naturalWidth), "timeout");
    }, timeoutMs);
  })));
}

function playGachaCollectionAdded() {
  const overlay = document.getElementById("gachaReveal");
  if (!overlay || overlay.hidden) return Promise.resolve();
  const message = overlay.querySelector("[data-gacha-reveal-message]");
  const actions = overlay.querySelector("[data-gacha-reveal-actions]");
  overlay.classList.add("is-collection-added");
  if (message) message.textContent = "コレクションに追加";
  if (actions) actions.hidden = true;
  return new Promise((resolve) => {
    window.setTimeout(() => {
      closeGachaRevealAnimation();
      resolve();
    }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 420 : 1150);
  });
}

function openGachaTestChoiceStage(testDraw) {
  openGachaRevealAnimation({ choice: "center", testMode: true });
  const overlay = document.getElementById("gachaReveal");
  if (!overlay) return;
  overlay.querySelectorAll(".gacha-reveal-ghost-card, .gacha-reveal-main-card").forEach((card) => {
    card.setAttribute("role", "button");
    card.tabIndex = 0;
    card.addEventListener("click", () => {
      if (overlay.classList.contains("is-revealing") || overlay.classList.contains("is-reveal-complete")) return;
      completeGachaReveal(testDraw);
    }, { once: true });
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      card.click();
    }, { once: true });
  });
}

function previewCurrentGachaAnimation(replay = false) {
  const form = document.getElementById("gachaCharacterEditForm");
  if (!form) return;
  const character = readGachaCharacterForm(form);
  const setting = getCurrentGachaSetting();
  const currentCard = getGachaCards(setting).find((card) => card.characterId === character.characterId || card.cardId === character.characterId) || {};
  const card = {
    ...currentCard,
    ...characterToCardPreview(character, currentCard),
    drawId: "PREVIEW-ONLY",
    cardHistoryId: "PREVIEW-ONLY",
    memberId: "PREVIEW",
    lineUserId: "",
    issueMonth: setting.issueMonth || currentMonthKey()
  };
  showGachaPreviewAnimation(card, replay);
}

function showGachaPreviewAnimation(card, replay = false) {
  const overlay = document.getElementById("gachaReveal");
  if (!overlay || overlay.classList.contains("is-preview-running")) return;
  overlay.hidden = false;
  overlay.className = `gacha-reveal gacha-preview-overlay rarity-${String(card.rarity || "N").toLowerCase()} is-preview-running is-secret-reveal ${replay ? "is-replay" : ""}`;
  overlay.innerHTML = `
    <div class="gacha-stage-bg" aria-hidden="true"></div>
    <div class="reveal-particles rarity-burst" aria-hidden="true"></div>
    <div class="preview-aura rarity-aura" aria-hidden="true"></div>
    <div class="reveal-blackout" aria-hidden="true"></div>
    <article class="reveal-card preview-reveal-card">
      <div class="reveal-card-inner">
        <section class="reveal-card-face reveal-card-back">${gachaRevealBackHtml()}</section>
        <section class="reveal-card-face reveal-card-front reveal-card-complete">
          ${gachaCompletedCardHtml(card, "reveal")}
        </section>
      </div>
    </article>
    <div class="gacha-preview-controls">
      <button type="button" data-admin-action="closeGachaPreviewAnimation">閉じる</button>
      <button type="button" data-admin-action="replayGachaPreviewAnimation">もう一度見る</button>
      <button type="button" data-admin-action="setGachaPreviewTab" data-id="card">カード完成形へ戻る</button>
    </div>
  `;
  if ((card.rarity === "UR" || card.rarity === "SSR") && navigator.vibrate) navigator.vibrate(card.rarity === "UR" ? [28, 28, 46] : 38);
  const duration = card.rarity === "UR" ? 7600 : card.rarity === "SSR" ? 7200 : card.rarity === "SR" ? 6900 : card.rarity === "R" ? 6600 : 6300;
  window.setTimeout(() => {
    overlay.classList.remove("is-preview-running");
    overlay.classList.add("is-preview-complete");
  }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 600 : duration);
}

function closeGachaPreviewAnimation() {
  const overlay = document.getElementById("gachaReveal");
  if (!overlay) return;
  overlay.hidden = true;
  overlay.className = "gacha-reveal";
  overlay.innerHTML = "";
}

function closeGachaRevealAnimation() {
  closeGachaPreviewAnimation();
}

function renderMyCards() {
  const container = document.getElementById("myCardsContent");
  if (!container) return;
  const profile = getProfile();
  const cards = getMemberCardHistory(profile);
  const availableYears = getBinderYears(cards);
  const selectedYear = availableYears.includes(Number(appState.gachaBinderYear)) ? Number(appState.gachaBinderYear) : currentYear();
  appState.gachaBinderYear = selectedYear;
  const collected = getUsedCollectionCards(cards, selectedYear);
  const confirmedBinderCards = collected.filter((card) => card.inBinder === true);
  const pendingBinderCards = collected.filter((card) => card.inBinder !== true);
  const pendingBinderCount = pendingBinderCards.length;
  const collection = buildCollectionSummary(collected, selectedYear);
  const characterCollection = buildCharacterCollection(collected);
  container.innerHTML = `
    <div class="binder-year-tabs" role="tablist" aria-label="カードバインダーの年">
      ${availableYears.map((year) => `<button type="button" role="tab" data-gacha-action="selectBinderYear" data-year="${year}" aria-selected="${year === selectedYear}">${year}年${year === currentYear() ? "" : "（過去）"}</button>`).join("")}
    </div>
    <article class="admin-preview">
      <p class="kicker">${selectedYear} collection</p>
      <h3>${selectedYear}年の取得状況</h3>
      <div class="collection-progress"><strong>${characterCollection.owned} / 30種類</strong><span>コンプリート率 ${characterCollection.rate}% / 次の年間特典まであと${collection.nextRemaining}枚</span></div>
      ${selectedYear === currentYear() && pendingBinderCount > 0 ? `<p class="binder-pending-note">使用済み ${pendingBinderCount}枚は取得済みとして反映中です。翌月に正式バインダーへ確定します。</p>` : ""}
      <div class="mini-grid">
        <span>正式バインダー ${confirmedBinderCards.length}枚</span>
        ${selectedYear === currentYear() ? `<span>翌月確定予定 ${pendingBinderCount}枚</span>` : ""}
        <span>UR ${characterCollection.rarity.UR || 0}種</span>
        <span>SSR ${collection.rarity.SSR}枚</span>
        <span>SR ${collection.rarity.SR}枚</span>
        <span>R ${collection.rarity.R}枚</span>
        <span>N ${characterCollection.rarity.N || 0}種</span>
      </div>
    </article>
    ${renderCollectionDex(characterCollection.items)}
    ${selectedYear === currentYear() && pendingBinderCards.length ? renderCardShelf("今月取得（翌月バインダー確定予定）", pendingBinderCards) : ""}
    ${renderCardShelf(`${selectedYear}年 正式バインダー`, confirmedBinderCards)}
  `;
}

function renderCollectionRewardsPage() {
  const container = document.getElementById("collectionRewardsContent");
  if (!container) return;
  const profile = getProfile();
  const cards = getUsedCollectionCards(getMemberCardHistory(profile), currentYear());
  const rewards = getCollectionRewardStates(profile, cards)
    .filter((reward) => reward.isPublic !== false && reward.active !== false)
    .sort((a, b) => Number(a.sortOrder || 999) - Number(b.sortOrder || 999));
  container.innerHTML = `
    <div class="collection-reward-list">
      ${rewards.map((reward) => {
        const progress = getCollectionRewardProgress(reward, cards);
        const achieved = progress.achieved;
        return `
          <article class="collection-reward-card ${achieved ? "is-achieved" : ""}">
            <div class="collection-reward-head">
              <span>${achieved ? "達成" : "チャレンジ中"}</span>
              <strong>${escapeHtml(reward.title)}</strong>
            </div>
            <p>${escapeHtml(reward.description || "")}</p>
            <div class="collection-reward-progress">
              <strong>現在 ${escapeHtml(progress.current)} / ${escapeHtml(progress.target)}</strong>
              <progress max="${escapeHtml(progress.target)}" value="${escapeHtml(Math.min(progress.current, progress.target))}"></progress>
            </div>
            ${reward.prizeName ? `<div class="collection-reward-prize"><small>達成特典</small><strong>${escapeHtml(reward.prizeName)}</strong>${reward.prizeDescription ? `<p>${escapeHtml(reward.prizeDescription)}</p>` : ""}</div>` : ""}
          </article>
        `;
      }).join("") || `<p class="soft-note">現在表示できるコレクション特典はありません。</p>`}
    </div>
    <button class="secondary-button" type="button" data-view="gacha">今月のガチャへ戻る</button>
  `;
}

function renderGachaHistoryPage() {
  const container = document.getElementById("gachaHistoryContent");
  if (!container) return;
  const cards = getMemberCardHistory(getProfile());
  container.innerHTML = `
    <div class="gacha-history-list">
      ${cards.map((card) => `
        <article class="gacha-history-row">
          ${gachaCharacterImageHtml(card)}
          <div>
            <small>${escapeHtml(formatDateTime(card.obtainedAt || card.drawnAt) || card.issueMonth || "")}</small>
            <strong>${escapeHtml(card.characterName || card.cardName || "獲得カード")}</strong>
            <span>${escapeHtml(card.rarity || "-")} / ${escapeHtml(card.prizeName || "景品")}</span>
            <em>${escapeHtml(getGachaStateLabel(card))}</em>
          </div>
        </article>
      `).join("") || `<p class="soft-note">ガチャ履歴はまだありません。</p>`}
    </div>
    <button class="secondary-button" type="button" data-view="gacha">今月のガチャへ戻る</button>
  `;
}

function buildCharacterCollection(cards) {
  const characters = getGachaCharacters();
  const rarity = { UR: 0, SSR: 0, SR: 0, R: 0, N: 0 };
  const items = characters.map((character) => {
    const ownedCards = cards.filter((card) => String(card.characterId || card.cardId) === String(character.characterId));
    if (ownedCards.length) rarity[character.rarity] = Number(rarity[character.rarity] || 0) + 1;
    return {
      ...character,
      obtained: ownedCards.length > 0,
      obtainedCount: ownedCards.length,
      firstObtainedAt: ownedCards[ownedCards.length - 1]?.obtainedAt || ownedCards[ownedCards.length - 1]?.drawnAt || "",
      lastObtainedAt: ownedCards[0]?.obtainedAt || ownedCards[0]?.drawnAt || ""
    };
  });
  const owned = items.filter((item) => item.obtained).length;
  return { items, owned, rate: Math.round((owned / Math.max(1, characters.length)) * 100), rarity };
}

function renderCollectionDex(items) {
  return `
    <section class="card-shelf">
      <header><h3>30キャラクター一覧</h3><span>${items.filter((item) => item.obtained).length} / ${items.length}</span></header>
      <div class="collection-dex-grid">
        ${items.map((item) => `
          <article class="collection-dex-card rarity-${escapeHtml(String(item.rarity || "N").toLowerCase())} ${item.obtained ? "is-owned" : "is-locked"}">
            ${gachaCharacterImageHtml(item)}
            <span>No.${escapeHtml(item.cardNo)} ${escapeHtml(item.rarity)}</span>
            <strong>${escapeHtml(item.obtained ? item.name : "未取得")}</strong>
            <small>${item.obtained ? `初回 ${formatDateTime(item.firstObtainedAt) || "-"} / ${item.obtainedCount}回` : "未取得"}</small>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderCardShelf(title, cards) {
  return `
    <section class="card-shelf">
      <header><h3>${escapeHtml(title)}</h3><span>${cards.length}枚</span></header>
      <div class="my-card-grid">
        ${cards.map((card) => gachaCardHtml(card, false)).join("") || "<p>カードはありません。</p>"}
      </div>
    </section>
  `;
}

function gachaCardHtml(card, withActions = false) {
  const rarity = rarityMeta[card.rarity] || rarityMeta.R;
  const binderStatus = getGachaLifecycleState(card) === "used"
    ? card.inBinder === true
      ? "バインダー保存済み"
      : normalizeServerYearMonth(card.issueMonth || card.usedAt || card.obtainedAt) === currentMonthKey()
        ? "今月取得 / 使用済み / 翌月バインダー確定予定"
        : "使用済み / バインダー確定待ち"
    : getCardUsageState(card);
  return `
    <article class="collection-card rarity-${escapeHtml(String(card.rarity || "R").toLowerCase())}">
      <span>${escapeHtml(rarity.icon)} ${escapeHtml(card.rarity)} ${escapeHtml(rarity.label)}</span>
      ${gachaCharacterImageHtml(card)}
      <h4>${escapeHtml(card.characterName || card.cardName || card.prizeName)}</h4>
      <p>${escapeHtml(card.intro || "")}</p>
      <small>効果：${escapeHtml(card.effectName || "")} ${escapeHtml(card.effectDescription || "")}</small>
      <strong>${escapeHtml(card.prizeName)}</strong>
      <p>${escapeHtml(card.prizeDescription || card.message || "")}</p>
      <small class="gacha-card-binder-status">${escapeHtml(card.issueMonth || "")} / ${escapeHtml(binderStatus)} / 期限 ${escapeHtml(formatDateUntil(card.validUntil || card.expires))}</small>
      ${withActions ? `<div class="admin-actions mini"><button type="button" data-admin-action="chartUseGacha" data-id="${escapeHtml(card.drawId || card.cardHistoryId)}">カードを使用する</button><button type="button" data-admin-action="chartUndoGacha" data-id="${escapeHtml(card.drawId || card.cardHistoryId)}">使用取り消し</button><button type="button" data-admin-action="cardDetail" data-id="${escapeHtml(card.drawId || card.cardHistoryId)}">カード詳細</button></div>` : ""}
    </article>
  `;
}

function isLoungeOpen() {
  return jstDateKey() >= LOUNGE_RELEASE_DATE;
}

function renderLounge() {
  const comingSoonPanel = document.getElementById("loungeComingSoonPanel");
  const openPanel = document.getElementById("loungeOpenPanel");
  const isOpen = isLoungeOpen();
  if (comingSoonPanel) comingSoonPanel.hidden = isOpen;
  if (openPanel) openPanel.hidden = !isOpen;
  if (!isOpen) return;
  const count = getLoungeCount();
  document.getElementById("loungeCount").textContent = count;
  document.getElementById("loungeProgress").value = count;
}

function renderMyPage() {
  const profile = getProfile();
  const member = getMembers().find((item) => (
    String(item.memberId || "") === String(profile.memberId || "") ||
    (profile.lineUserId && String(item.lineUserId || "") === String(profile.lineUserId))
  ));
  const lastVisitDate = member?.lastVisitDate || profile.lastVisitDate;
  const visitCount = Number(member?.visitCount ?? profile.visitCount ?? 0);
  document.getElementById("mypageMemberName").textContent = formatMemberDisplayName(profile.nickname);
  document.getElementById("mypageVisitDays").textContent = lastVisitDate ? String(daysSince(lastVisitDate)) : "―";
  document.getElementById("mypageVisitCount").textContent = String(Math.max(0, visitCount));
}

function renderAdmin() {
  const session = getAdminSession();
  document.body.classList.toggle("has-admin-booking-response", Boolean(appState.adminBookingResponseRequestId));
  const loginPanel = document.getElementById("adminLoginPanel");
  const cockpit = document.getElementById("adminCockpit");
  if (!session) {
    loginPanel.hidden = false;
    cockpit.hidden = true;
    return;
  }
  loginPanel.hidden = true;
  cockpit.hidden = false;
  document.getElementById("adminWelcomeText").textContent = `${session.name}さん / ${session.label}として操作中`;
  renderAdminTabs();
  renderAdminPanel();
}

function renderAdminTabs() {
  const counts = getAdminCounts();
  const session = getAdminSession();
  if (appState.adminTab === "gachaTest" && session?.role !== "admin") appState.adminTab = "dashboard";
  const current = adminTabs.find((tab) => tab.key === appState.adminTab);
  document.getElementById("adminTabs").innerHTML = `
    <button type="button" class="${appState.adminTab === "dashboard" ? "is-active" : ""}" data-admin-tab="dashboard">
      <span>${appState.adminTab === "dashboard" ? "管理トップ" : "← 管理トップへ戻る"}</span>
    </button>
    ${current && current.key !== "dashboard" ? `<span class="admin-current-page">${escapeHtml(current.label)}${counts[current.key] ? ` <em>${escapeHtml(counts[current.key])}</em>` : ""}</span>` : ""}
    ${appState.adminTab === "gachaTest" ? `<span class="admin-current-page">ガチャ管理 / TEST</span>` : ""}
  `;
}

function renderAdminPanel() {
  const panel = document.getElementById("adminPanel");
  const renderers = {
    dashboard: renderAdminDashboard,
    visits: renderAdminVisits,
    members: renderAdminMembers,
    memberDetail: renderAdminMemberDetail,
    bookings: renderAdminBookings,
    reservationMenus: renderAdminReservationMenus,
    coupons: renderAdminCoupons,
    gacha: renderAdminGacha,
    gachaTest: renderAdminGachaTest,
    fortune: renderAdminFortune,
    lounge: renderAdminLounge,
    notices: renderAdminNotices,
    settings: renderAdminSettings
  };
  panel.innerHTML = (renderers[appState.adminTab] || renderAdminDashboard)();
  focusAdminBookingFromLink();
}

function focusAdminBookingFromLink() {
  const requestId = appState.adminFocusedBookingRequestId;
  if (appState.adminTab !== "bookings" || !requestId) return;
  window.requestAnimationFrame(() => {
    const row = document.querySelector(`[data-booking-request-id="${CSS.escape(requestId)}"]`);
    if (!row) return;
    row.querySelector("details")?.setAttribute("open", "");
    row.scrollIntoView({ behavior: "smooth", block: "center" });
    appState.adminFocusedBookingRequestId = "";
    window.setTimeout(() => row.classList.remove("is-deep-linked"), 6000);
  });
}

function renderAdminDashboard() {
  const dashboard = buildOperationDashboard();
  const todos = [
    ["bookings", "予約対応待ち", dashboard.todo.bookingNeedsAction],
    ["visits", "来店確認待ち", dashboard.todo.unconfirmedVisits],
    ["coupons", "本日のクーポン使用", dashboard.today.usedCoupons]
  ];
  const menus = [
    ["bookings", "予約", "予約管理", "予約希望の確認・対応"],
    ["visits", "来店", "来店確認", "本日の来店を確認"],
    ["coupons", "券", "クーポン", "使用履歴を確認"],
    ["gacha", "G", "ガチャ管理", "カード・景品・テスト"],
    ["members", "会員", "会員管理", "会員情報を確認"],
    ["lounge", "縁", "ご縁ラウンジ", "有料会員管理"]
  ];
  return `
    <section class="admin-section-head">
      <div>
        <h3>今日やること</h3>
        <p>営業中に対応する項目だけをまとめています。</p>
      </div>
    </section>
    <section class="admin-today-grid">
      ${todos.map(([tab, title, value]) => `
        <button type="button" class="admin-today-item ${Number(value) > 0 ? "has-count" : ""}" data-admin-tab="${tab}">
          <span>${escapeHtml(title)}</span>
          <strong>${escapeHtml(value)}<small>件</small></strong>
          <i aria-hidden="true">›</i>
        </button>
      `).join("")}
    </section>
    <section class="admin-menu-section">
      <header><h3>管理メニュー</h3><p>行いたい業務を選んでください。</p></header>
      <div class="admin-main-menu">
        ${menus.map(([tab, icon, title, description]) => `
          <button type="button" class="admin-menu-button" data-admin-tab="${tab}">
            <span class="admin-menu-icon" aria-hidden="true">${escapeHtml(icon)}</span>
            <span class="admin-menu-copy"><strong>${escapeHtml(title)}</strong><small>${escapeHtml(description)}</small>${tab === "lounge" ? `<em>2026年10月開始予定・準備中</em>` : ""}</span>
            <i aria-hidden="true">›</i>
          </button>
        `).join("")}
      </div>
      <button type="button" class="admin-settings-shortcut" data-admin-tab="settings">LINE自動通知設定</button>
    </section>
  `;
}

function dashboardMetricSection(title, cards) {
  return `
    <section class="dashboard-metric-section">
      <h3>${escapeHtml(title)}</h3>
      <div class="admin-dashboard-grid">
        ${cards.map(([tab, label, value, desc]) => `<button type="button" class="admin-metric" data-admin-tab="${tab}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><small>${escapeHtml(desc)}</small></button>`).join("")}
      </div>
    </section>
  `;
}

function renderAdminVisits() {
  if (isProductionApiMode() && appState.adminDataStatus.visits !== "ready") {
    return renderAdminDataState("来店確認", appState.adminDataStatus.visits, "来店確認データを取得できませんでした。");
  }
  const allReceptions = getVisitReceptions();
  const receptions = appState.adminVisitShowHistory ? allReceptions : allReceptions.filter((item) => isToday(item.receivedAt));
  const unconfirmed = receptions.filter((item) => item.status === "未確認" || item.status === "確認待ち");
  const confirmed = receptions.filter((item) => item.status === "来店済み" || item.status === "確認済み");
  const identified = receptions.filter((item) => item.status === "本人確認済み");
  const normalMessages = receptions.filter((item) => item.status === "対象外" || item.status === "通常メッセージ");
  const todayReceptions = allReceptions.filter((item) => isToday(item.receivedAt));
  const todaySummary = {
    total: todayReceptions.length,
    unconfirmed: todayReceptions.filter((item) => item.status === "未確認" || item.status === "確認待ち").length,
    confirmed: todayReceptions.filter((item) => item.status === "来店済み" || item.status === "確認済み").length,
    identified: todayReceptions.filter((item) => item.status === "本人確認済み").length,
    normal: todayReceptions.filter((item) => item.status === "対象外" || item.status === "通常メッセージ").length
  };
  return `
    <section class="admin-section-head">
      <div>
        <h3>来店確認</h3>
        <p>お客様が「来店しました」を確定した記録を表示します。名前送信だけの本人確認は来店回数へ加算されません。</p>
      </div>
      <div class="admin-head-actions">
        <button class="secondary-button compact" type="button" data-admin-action="toggleVisitHistory">${appState.adminVisitShowHistory ? "本日だけ表示" : "履歴を見る"}</button>
        ${isProductionApiMode() ? "" : `<button class="secondary-button compact" type="button" data-admin-action="simulateVisit">TESTメッセージを追加</button>`}
      </div>
    </section>
    <section class="visit-summary-grid">
      ${summaryMetric("本日のメッセージ", todaySummary.total)}
      ${summaryMetric("未確認人数", todaySummary.unconfirmed)}
      ${summaryMetric("確認済み人数", todaySummary.confirmed)}
      ${summaryMetric("本人確認のみ", todaySummary.identified)}
      ${summaryMetric("対象外", todaySummary.normal)}
    </section>
    ${visitGroup("未確認", "warning", unconfirmed, "未確認の来店受付はありません")}
    ${visitGroup("確認済み", "success", confirmed, "確認済みの受付はありません")}
    ${visitGroup("本人確認のみ（来店未記録）", "neutral", identified, "本人確認のみのメッセージはありません")}
    ${visitGroup("対象外", "neutral", normalMessages, "対象外にしたメッセージはありません")}
  `;
}

function summaryMetric(label, value) {
  return `<article><small>${escapeHtml(label)}</small><strong>${escapeHtml(value)}</strong></article>`;
}

function visitGroup(title, tone, items, emptyMessage) {
  return `
    <section class="visit-group ${tone}">
      <header><h4>${escapeHtml(title)}</h4><span>${items.length}件</span></header>
      <div class="admin-list">
        ${items.map((item) => visitReceptionCard(item, tone)).join("") || emptyAdminState(emptyMessage)}
      </div>
    </section>
  `;
}

function visitReceptionCard(item, tone = "") {
  const member = findMember(item.memberId);
  const time = formatReceptionTime(item.visitTime || item.confirmedAt || item.receivedAt);
  const todayBooking = readJson(STORAGE_KEYS.bookings, []).find((booking) => (
    String(booking.memberId || booking.userId || "") === String(item.memberId || "") &&
    isToday(getBookingDisplayDateTime(booking))
  ));
  const pending = item.status === "未確認" || item.status === "確認待ち";
  return `
    <article class="admin-record visit-card admin-visit-row ${pending ? "is-pending" : ""} ${tone}">
      <header>
        <span class="badge status-${statusTone(item.status)}">${escapeHtml(item.status)}</span>
        <strong>${escapeHtml(member?.realName || item.sentName || item.lineDisplayName || "LINEユーザー")}</strong>
        <small>${todayBooking ? `予約 ${escapeHtml(formatReceptionTime(getBookingDisplayDateTime(todayBooking)))}` : `受付 ${escapeHtml(time)}`}</small>
      </header>
      <div class="admin-record-grid">
        ${summaryRows([
          ["LINE表示名", item.lineDisplayName || "未取得"],
          ["メッセージ", item.messageText || item.sentName || "-"],
          ["来店状態", item.status],
          ["累計来店回数", `${Number(item.visitCount ?? member?.visitCount ?? 0)}回`]
        ])}
      </div>
      <div class="admin-actions priority-actions">
        ${pending ? `<button type="button" data-admin-action="confirmVisit" data-id="${escapeHtml(item.receptionId)}">来店確認</button>` : ""}
      </div>
    </article>
  `;
}

function renderAdminMemberDetail() {
  const member = findMember(appState.adminMemberDetailId);
  if (!member) {
    appState.adminTab = "members";
    return renderAdminMembers();
  }
  const bookings = getMemberBookings(member);
  const coupons = getMemberCoupons(member);
  const gachaDraws = readJson(STORAGE_KEYS.monthlyGachaDraws, []).filter((draw) => draw.memberId === member.memberId || draw.lineUserId === member.lineUserId);
  const lounge = getLoungeEntries().filter((entry) => entry.lineUserId === member.lineUserId || entry.memberId === member.memberId);
  const logs = getMemberLogs(member);
  const visitDays = member.lastVisitDate ? `${daysSince(member.lastVisitDate)}日` : "-";
  const linked = member.lineUserId ? "連携済み" : "未連携";
  const chartBody = renderMemberChartTab(member, { bookings, coupons, gachaDraws, lounge, logs });
  return `
    <section class="admin-section-head">
      <div>
        <h3>会員カルテ</h3>
        <p>${escapeHtml(member.realName || member.nickname)}さんのすべての履歴と操作を集約します。</p>
      </div>
      <button class="secondary-button compact" type="button" data-admin-action="backToMembers">会員一覧へ戻る</button>
    </section>
    <article class="member-chart">
      <header class="member-chart-hero">
        <div>
          <span class="badge">${escapeHtml(member.memberStatus)}</span>
          <h3>${escapeHtml(member.realName || member.nickname)}</h3>
          <p>${escapeHtml(member.memberId)} / ${escapeHtml(member.lineDisplayName || "-")} / ${escapeHtml(linked)}</p>
          <small class="line-id-chip">詳細LINE ID: ${escapeHtml(member.lineUserId || "未登録")}</small>
        </div>
        <div class="member-chart-stats">
          ${summaryMetric("前回来店から", visitDays)}
          ${summaryMetric("来店回数", `${member.visitCount || 0}回`)}
        </div>
      </header>
      <div class="chart-quick-actions">
        <button type="button" data-admin-action="chartConfirmVisit" data-id="${escapeHtml(member.memberId)}">来店確認</button>
        <button type="button" data-admin-action="chartCreateBooking" data-id="${escapeHtml(member.memberId)}">予約作成</button>
        <button type="button" data-admin-action="chartGrantCoupon" data-id="${escapeHtml(member.memberId)}">クーポン付与</button>
        <button type="button" data-admin-action="chartOpenGacha" data-id="${escapeHtml(member.memberId)}">ガチャ確認</button>
        <button type="button" data-admin-action="chartAddMemo" data-id="${escapeHtml(member.memberId)}">メモ追加</button>
      </div>
      <nav class="member-chart-tabs" aria-label="会員カルテ内メニュー">
        ${memberChartTabs.map((tab) => `<button type="button" class="${appState.memberChartTab === tab.key ? "is-active" : ""}" data-admin-action="memberChartTab" data-tab="${tab.key}">${escapeHtml(tab.label)}</button>`).join("")}
      </nav>
      <section class="member-chart-body">${chartBody}</section>
    </article>
  `;
}

function renderMemberChartTab(member, related) {
  const tab = appState.memberChartTab;
  if (tab === "basic") return renderMemberBasicTab(member);
  if (tab === "visits") return renderMemberVisitsTab(member);
  if (tab === "bookings") return renderMemberBookingsTab(member, related.bookings);
  if (tab === "coupons") return renderMemberCouponsTab(member, related.coupons);
  if (tab === "gacha") return renderMemberGachaTab(member, related.gachaDraws);
  if (tab === "lounge") return renderMemberLoungeTab(member, related.lounge);
  if (tab === "memos") return renderMemberMemosTab(member);
  return renderMemberLogsTab(member, related.logs);
}

function renderMemberBasicTab(member) {
  const linked = member.lineUserId ? "連携済み" : "未連携";
  return `
    <section>
      <h4>基本情報</h4>
      <div class="admin-record-grid">${summaryRows([
        ["登録氏名", member.realName || "-"],
        ["LINE表示名", member.lineDisplayName || "-"],
        ["TEAM LINK会員ID", member.memberId],
        ["新規／既存", member.memberStatus || "-"],
        ["LINE連携状態", linked],
        ["会員状態", member.status || "有効"],
        ["登録日", member.createdAt || "-"],
        ["最終更新日", member.updatedAt || "-"],
        ["前回来店日", member.lastVisitDate || "-"],
        ["前回来店から", member.lastVisitDate ? `${daysSince(member.lastVisitDate)}日` : "-"],
        ["来店回数", `${member.visitCount || 0}回`],
        ["電話番号", member.phone || "-"],
        ["担当スタッフ", member.staff || "-"],
        ["来店頻度目安", member.visitCycle || "-"],
        ["おすすめメニュー", member.recommendedMenu || "-"],
        ["注意事項", member.caution || "-"]
      ])}</div>
      <div class="admin-actions">
        <button type="button" data-admin-action="editMemberBasic" data-id="${escapeHtml(member.memberId)}">基本情報を編集</button>
      </div>
    </section>
  `;
}

function renderMemberVisitsTab(member) {
  const visits = (member.visitHistory || []).slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
  return `
    <section>
      <h4>来店履歴</h4>
      <div class="admin-actions"><button type="button" data-admin-action="chartAddVisit" data-id="${escapeHtml(member.memberId)}">来店履歴を追加</button></div>
      <div class="chart-list">${visits.map((visit, index) => `
        <article class="chart-row">
          <strong>${escapeHtml(visit.date)}</strong>
          <span>受付 ${escapeHtml(visit.receivedAt || "-")} / 確認 ${escapeHtml(visit.confirmedAt || "-")}</span>
          <span>確認スタッフ ${escapeHtml(visit.adminName || visit.source || "-")} / 前回から ${escapeHtml(visit.daysSincePrevious || "-")}</span>
          <p>${escapeHtml(visit.memo || "備考なし")}</p>
          <div class="admin-actions mini">
            <button type="button" data-admin-action="editVisitHistory" data-id="${escapeHtml(member.memberId)}" data-index="${index}">日付修正</button>
            <button type="button" data-admin-action="memoVisitHistory" data-id="${escapeHtml(member.memberId)}" data-index="${index}">備考追加</button>
            <button type="button" data-admin-action="cancelVisitHistory" data-id="${escapeHtml(member.memberId)}" data-index="${index}">誤登録取り消し</button>
          </div>
        </article>
      `).join("") || "<p>履歴はありません</p>"}</div>
    </section>
  `;
}

function renderMemberBookingsTab(member, bookings) {
  return `
    <section>
      <h4>予約履歴</h4>
      <div class="admin-actions"><button type="button" data-admin-action="chartCreateBooking" data-id="${escapeHtml(member.memberId)}">新しい予約を作成</button></div>
      <div class="chart-list">${bookings.map((booking) => `
        <article class="chart-row">
          <strong>${escapeHtml(formatDateTime(getBookingDisplayDateTime(booking)))}</strong>
          <span>${escapeHtml(booking.menu || "-")} / 担当 ${escapeHtml(booking.staff || "-")}</span>
          <span>予約元 ${escapeHtml(booking.reservationSource || booking.source || "-")} / 状態 ${escapeHtml(normalizeBookingStatus(booking.status))}</span>
          <span>クーポン ${escapeHtml(booking.couponTitle || "-")} / ${escapeHtml(formatYen(booking.referenceAmount))} / ${escapeHtml(formatMinutes(booking.totalMinutes || booking.totalDurationMinutes))}</span>
          <p>受付 ${escapeHtml(formatDateTime(booking.createdAt || booking.receivedAt))} / 備考 ${escapeHtml(booking.memo || "-")}</p>
        </article>
      `).join("") || "<p>予約履歴はありません</p>"}</div>
    </section>
  `;
}

function renderMemberCouponsTab(member, coupons) {
  const groups = ["使用可能", "予約で使用予定", "使用済み", "期限切れ"];
  return `
    <section>
      <h4>クーポン</h4>
      <div class="admin-actions"><button type="button" data-admin-action="chartGrantCoupon" data-id="${escapeHtml(member.memberId)}">クーポン付与</button><button type="button" data-admin-action="chartCreatePrivateCoupon" data-id="${escapeHtml(member.memberId)}">個別クーポン作成</button></div>
      ${groups.map((group) => {
        const groupCoupons = coupons.filter((coupon) => getCouponStatus(coupon) === group);
        return `
          <div class="chart-list coupon-chart-group">
            <h5>${escapeHtml(group)} ${groupCoupons.length}枚</h5>
            ${groupCoupons.map((coupon) => `
              <article class="chart-row">
                <strong>${escapeHtml(coupon.title)}</strong>
                <span>${escapeHtml(coupon.couponType || coupon.source || "クーポン")} / 発行元 ${escapeHtml(coupon.source || coupon.sourceType || "Console作成")}</span>
                <span>付与 ${escapeHtml(formatDateTime(coupon.createdAt || coupon.grantedAt || coupon.drawnAt))} / 期限 ${escapeHtml(formatDateUntil(coupon.expires || coupon.validUntil))}</span>
                <span>条件 ${escapeHtml(coupon.condition || coupon.message || "-")}</span>
                <p>使用日時 ${escapeHtml(formatDateTime(coupon.usedAt)) || "-"} / 使用メニュー ${escapeHtml(coupon.usedMenu || "-")} / 担当 ${escapeHtml(coupon.usedStaff || "-")}</p>
                <div class="admin-actions mini">
                  <button type="button" data-admin-action="chartUseCoupon" data-id="${escapeHtml(coupon.drawId || coupon.couponId)}">使用確認</button>
                  <button type="button" data-admin-action="chartUndoCoupon" data-id="${escapeHtml(coupon.drawId || coupon.couponId)}">使用取り消し</button>
                  <button type="button" data-admin-action="chartChangeCouponExpiry" data-id="${escapeHtml(coupon.drawId || coupon.couponId)}">期限変更</button>
                  <button type="button" data-admin-action="couponDetail" data-id="${escapeHtml(coupon.drawId || coupon.couponId)}">詳細</button>
                </div>
              </article>
            `).join("") || "<p>該当クーポンはありません</p>"}
          </div>
        `;
      }).join("")}
    </section>
  `;
}

function renderMemberGachaTab(member, gachaDraws) {
  const monthStatus = getMemberGachaStatus(member);
  const cards = getMemberCardHistory(member);
  const collection = buildCollectionSummary(cards, currentYear());
  const rewards = getCollectionRewardStates(member, cards.filter((card) => getGachaLifecycleState(card) === "used"));
  return `
    <section>
      <h4>ガチャ</h4>
      <div class="admin-record-grid">${summaryRows([
        ["今月の利用状況", monthStatus.state],
        ["抽選日時", monthStatus.used ? formatDateTime(monthStatus.draw.drawnAt) : "-"],
        ["当選カード", monthStatus.used ? monthStatus.draw.cardName : "-"],
        ["今年の獲得枚数", `${collection.total}枚`],
        ["レア度別", `UR ${collection.rarity.UR} / SSR ${collection.rarity.SSR} / SR ${collection.rarity.SR} / R ${collection.rarity.R} / N ${collection.rarity.N}`],
        ["未使用カード", `${cards.filter((card) => getCardUsageState(card) === "未使用").length}枚`]
      ])}</div>
      <h4>未使用カード</h4>
      <div class="my-card-grid">${cards.filter((card) => getCardUsageState(card) === "未使用").map((card) => gachaCardHtml(card, true)).join("") || "<p>未使用カードはありません。</p>"}</div>
      <h4>年間特典達成状況</h4>
      <div class="chart-list">${rewards.map((reward) => `<article class="chart-row"><strong>${escapeHtml(reward.title)}</strong><span>${escapeHtml(reward.state)} / ${reward.requiredCount}枚達成</span><p>${escapeHtml(reward.description || "")}</p><div class="admin-actions mini"><button type="button" data-admin-action="grantCollectionReward" data-id="${escapeHtml(member.memberId)}" data-reward-id="${escapeHtml(reward.rewardId)}">特典付与</button><button type="button" data-admin-action="receiveCollectionReward" data-id="${escapeHtml(member.memberId)}" data-reward-id="${escapeHtml(reward.rewardId)}">受取確認</button></div></article>`).join("")}</div>
      <h4>過去のカード履歴</h4>
      <div class="my-card-grid">${cards.map((card) => gachaCardHtml(card, true)).join("") || "<p>抽選履歴はありません</p>"}</div>
    </section>
  `;
}

function renderMemberLoungeTab(member, entries) {
  return `
    <section>
      <h4>ご縁ラウンジ</h4>
      <p>現在は事前登録管理のみです。自動課金は行いません。</p>
      <div class="chart-list">${entries.map((entry) => `
        <article class="chart-row">
          <strong>${escapeHtml(entry.status || "事前登録")}</strong>
          <span>登録日 ${escapeHtml(formatDateTime(entry.createdAt))} / 年代 ${escapeHtml(entry.ageGroup || "-")}</span>
          <span>居住エリア ${escapeHtml(entry.area || "-")} / 通知 ${entry.notify ? "希望" : "希望なし"}</span>
          <p>興味: ${escapeHtml(entry.interest || "-")} / 管理メモ: ${escapeHtml(entry.adminMemo || "-")}</p>
        </article>
      `).join("") || "<p>事前登録はありません</p>"}</div>
    </section>
  `;
}

function renderMemberMemosTab(member) {
  const memos = member.memos || [];
  return `
    <section>
      <h4>管理メモ</h4>
      <div class="admin-actions"><button type="button" data-admin-action="chartAddMemo" data-id="${escapeHtml(member.memberId)}">メモ追加</button></div>
      <div class="chart-list">${memos.map((memo, index) => `
        <article class="chart-row">
          <strong>${escapeHtml(memo.body)}</strong>
          <span>記入者 ${escapeHtml(memo.author || "-")} / 記入 ${escapeHtml(formatDateTime(memo.createdAt))}</span>
          <span>編集 ${escapeHtml(formatDateTime(memo.updatedAt)) || "-"}</span>
          <div class="admin-actions mini"><button type="button" data-admin-action="chartEditMemo" data-id="${escapeHtml(member.memberId)}" data-index="${index}">編集</button></div>
        </article>
      `).join("") || "<p>メモはありません</p>"}</div>
    </section>
  `;
}

function renderMemberLogsTab(member, logs) {
  return `
    <section>
      <h4>操作履歴</h4>
      <div class="chart-list">${logs.map((log) => `
        <article class="chart-row">
          <strong>${escapeHtml(log.message)}</strong>
          <span>${escapeHtml(formatDateTime(log.createdAt))} / ${escapeHtml(log.adminName || "-")}</span>
          <span>${escapeHtml(log.action || "")}</span>
        </article>
      `).join("") || "<p>操作履歴はありません</p>"}</div>
    </section>
  `;
}

function renderAdminMembers() {
  if (isProductionApiMode() && appState.adminDataStatus.members !== "ready") {
    return renderAdminDataState("会員管理", appState.adminDataStatus.members, "会員データを取得できませんでした。");
  }
  const members = filterMembers(getMembers());
  return `
    <section class="admin-section-head">
      <div>
        <h3>会員管理</h3>
        <p>会員情報とLINE連携・来店状況を確認します。</p>
      </div>
    </section>
    <div class="admin-filterbar">
      <input id="adminMemberSearch" value="${escapeHtml(appState.adminMemberQuery)}" placeholder="会員ID・氏名・LINE名・電話で検索">
      <select id="adminMemberFilter">
        ${[
          ["all", "すべて"],
          ["new", "新規会員"],
          ["visited", "来店済み"],
          ["inactive", "長期間来店なし"],
          ["gachaUnused", "今月ガチャ未利用"],
          ["coupon", "クーポン保有者"],
          ["lounge", "ご縁ラウンジ事前登録者"]
        ].map(([value, label]) => `<option value="${value}" ${appState.adminMemberFilter === value ? "selected" : ""}>${label}</option>`).join("")}
      </select>
      <button class="secondary-button compact" type="button" data-admin-action="applyMemberFilter">検索</button>
    </div>
    <div class="admin-list">
      ${members.map((member) => memberCard(member)).join("") || emptyAdminState("本番会員マスターに登録された会員はいません")}
    </div>
  `;
}

function memberCard(member) {
  const linked = Boolean(member.lineUserId);
  return `
    <article class="admin-record admin-member-row">
      <header>
        <span class="badge status-${linked ? "success" : "muted"}">${linked ? "LINE連携済み" : "LINE未連携"}</span>
        <strong>${escapeHtml(member.realName || member.nickname)}</strong>
        <small>${escapeHtml(member.memberId)}</small>
      </header>
      <div class="admin-record-grid">
        ${summaryRows([
          ["前回来店日", member.lastVisitDate || "-"],
          ["累計来店", `${member.visitCount || 0}回`],
          ["会員状態", member.status || "有効"]
        ])}
      </div>
      <div class="admin-actions">
        <button type="button" data-admin-action="memberDetail" data-id="${escapeHtml(member.memberId)}">詳細を見る</button>
      </div>
    </article>
  `;
}

function renderAdminBookings() {
  if (isProductionApiMode() && appState.adminDataStatus.bookings !== "ready") {
    return renderAdminDataState("予約管理", appState.adminDataStatus.bookings, "予約希望データを取得できませんでした。");
  }
  const bookings = readJson(STORAGE_KEYS.bookings, []);
  const sorted = bookings.slice().sort((a, b) => new Date(b.receivedAt || b.createdAt || 0) - new Date(a.receivedAt || a.createdAt || 0));
  return `
    <section class="admin-section-head">
      <div>
        <h3>予約管理</h3>
        <p>希望日時を残したまま、店舗側の確定日時または提案日時を設定します。</p>
      </div>
      <button type="button" class="secondary-button compact" data-admin-tab="settings">LINE通知設定</button>
    </section>
    <div class="admin-list admin-booking-list">
      ${sorted.map((booking) => bookingCard(booking)).join("") || emptyAdminState("予約希望はありません")}
    </div>
    ${renderAdminBookingResponseModal(sorted)}
  `;
}

function bookingCard(booking) {
  const selectedMenus = Array.isArray(booking.selectedMenus) ? booking.selectedMenus : [];
  const selectedCoupons = Array.isArray(booking.selectedCoupons) ? booking.selectedCoupons : [];
  const status = normalizeBookingStatus(booking.status);
  const menuLabel = selectedMenus.length ? selectedMenus.map((menu) => menu.title).join("、") : booking.menu || "";
  const couponLabel = selectedCoupons.length ? selectedCoupons.map((menu) => menu.title).join("、") : booking.couponTitle || "なし";
  const requestId = booking.requestId || booking.bookingRequestId || "";
  const isActionBusy = String(appState.adminBookingActionBusyId || "") === String(requestId);
  const isDeepLinked = String(appState.adminFocusedBookingRequestId || "") === String(requestId);
  const canRespond = ["予約希望", "確認待ち", "日時変更相談", "変更依頼", "別日時提案中", "お客様返答待ち"].includes(status);
  const hasProposal = Boolean(normalizeBookingDateTimeValue(booking.proposedDateTime));
  const lineNotificationLabel = getBookingLineNotificationLabel(booking);
  const emailNotificationLabel = getBookingEmailNotificationLabel(booking);
  const consultations = Array.isArray(booking.bookingConsultations) ? booking.bookingConsultations : [];
  return `
    <article class="admin-mini-record admin-booking-row ${canRespond ? "is-pending" : ""} ${isDeepLinked ? "is-deep-linked" : ""}" data-booking-request-id="${escapeHtml(requestId)}">
      <header><strong>${escapeHtml(booking.customerName || "お客様")}</strong><span class="badge status-${statusTone(status)}">${escapeHtml(status)}</span></header>
      <div class="record-meta-grid">
        <span>希望日時 ${escapeHtml(formatDateTime(booking.firstDateTime) || "未入力")}</span>
        <span>希望メニュー ${escapeHtml(menuLabel || "相談")}</span>
        ${consultations.length ? `<span class="admin-booking-consultation-count">予約相談 ${consultations.length}件（${consultations.filter((item) => item.status !== "resolved").length}件未対応）</span>` : ""}
      </div>
      <details class="admin-record-details">
        <summary>予約内容を見る</summary>
        <p>第二希望：${escapeHtml(formatDateTime(booking.secondDateTime) || "なし")}</p>
        <p>第三希望：${escapeHtml(formatDateTime(booking.thirdDateTime) || "なし")}</p>
        ${booking.confirmedDateTime ? `<p>確定日時：${escapeHtml(formatDateTime(booking.confirmedDateTime))}</p>` : ""}
        ${booking.proposedDateTime ? `<p>店舗提案日時：${escapeHtml(formatDateTime(booking.proposedDateTime))}</p>` : ""}
        <p>担当：${escapeHtml(formatStaffDisplayName(booking.staff) || "未定")}</p>
        <p>クーポン：${escapeHtml(couponLabel)}</p>
        ${(booking.consultation || booking.customMenu || booking.memo) ? `<p>相談内容：${escapeHtml(booking.consultation || booking.customMenu || booking.memo)}</p>` : ""}
        ${consultations.length ? `
          <div class="admin-booking-consultations">
            <strong>予約相談 ${consultations.length}件</strong>
            ${consultations.map((item) => `
              <article>
                <span class="badge status-warning">${escapeHtml(item.consultationType || "その他相談")}</span>
                <p>${escapeHtml(item.consultationComment || "").replace(/\n/g, "<br>")}</p>
                <small>${escapeHtml(formatDateTime(item.sentAt || item.createdAt) || "送信日時不明")} / ${escapeHtml(item.status === "resolved" ? "対応済み" : "未対応")}</small>
              </article>
            `).join("")}
          </div>
        ` : ""}
        ${booking.adminReply ? `
          <div class="admin-booking-sent-proposal">
            <strong>店舗からの案内</strong>
            <p>${escapeHtml(booking.adminReply).replace(/\n/g, "<br>")}</p>
            ${(booking.adminReplySentAt || booking.adminReplySentBy) ? `<small>${escapeHtml(booking.adminReplySentBy || "スタッフ")} / ${escapeHtml(formatDateTime(booking.adminReplySentAt) || "送信日時未記録")}</small>` : ""}
          </div>
        ` : ""}
        ${booking.staffMessage ? `
          <div class="admin-booking-sent-proposal">
            <strong>予約確定時のメッセージ</strong>
            <p>${escapeHtml(booking.staffMessage).replace(/\n/g, "<br>")}</p>
            ${(booking.staffMessageSentAt || booking.staffMessageSentBy) ? `<small>${escapeHtml(booking.staffMessageSentBy || "スタッフ")} / ${escapeHtml(formatDateTime(booking.staffMessageSentAt) || "送信日時未記録")}</small>` : ""}
          </div>
        ` : ""}
        ${emailNotificationLabel ? `<p>予約通知メール：${escapeHtml(emailNotificationLabel)}</p>` : ""}
        ${lineNotificationLabel ? `<p>LINE通知：${escapeHtml(lineNotificationLabel)}</p>` : ""}
        <small>${escapeHtml(booking.userId || booking.memberId || "")} / 受付 ${escapeHtml(formatDateTime(booking.receivedAt || booking.createdAt))}</small>
      </details>
      <div class="admin-actions admin-booking-actions">
        ${canRespond ? `<button type="button" data-admin-action="confirmFirstChoice" data-id="${escapeHtml(requestId)}" ${isActionBusy ? "disabled" : ""}>${hasProposal ? "提案日時を確認・確定" : "確定日時を選ぶ"}</button><button type="button" class="secondary-button" data-admin-action="proposeBooking" data-id="${escapeHtml(requestId)}" ${isActionBusy ? "disabled" : ""}>${hasProposal ? "提案日時を変更・再送" : "別日の案内"}</button>` : ""}
      </div>
    </article>
  `;
}

function renderAdminBookingResponseModal(bookings) {
  const requestId = String(appState.adminBookingResponseRequestId || "");
  const mode = String(appState.adminBookingResponseMode || "");
  if (!requestId || !mode) return "";
  const booking = bookings.find((item) => String(item.bookingRequestId || item.requestId || "") === requestId);
  if (!booking) return "";
  const menuLabel = getReservationMenuDisplayText(booking) || booking.menu || "相談";
  const couponLabel = getReservationCouponDisplayText(booking) || "なし";
  const memo = booking.memo || booking.consultation || booking.customMenu || "なし";
  const isConfirm = mode === "confirm";
  const hasProposal = Boolean(normalizeBookingDateTimeValue(booking.proposedDateTime));
  const initialDateTime = normalizeBookingDateTimeValue(
    isConfirm
      ? booking.confirmedDateTime || booking.proposedDateTime || booking.firstDateTime
      : booking.proposedDateTime || booking.firstDateTime
  );
  const initial = splitBookingDateTime(initialDateTime);
  const requestedDateTimes = getBookingRequestedDateTimes(booking);
  const message = isConfirm ? booking.staffMessage || "" : booking.adminReply || "";
  return `
    <div class="admin-booking-response-backdrop" role="presentation">
      <section class="admin-booking-response-modal" role="dialog" aria-modal="true" aria-labelledby="adminBookingResponseTitle">
        <header>
          <p class="kicker">Booking response</p>
          <h3 id="adminBookingResponseTitle">${isConfirm ? "確定する予約日時" : "ご案内する日時"}</h3>
        </header>
        <div class="summary-list">
          ${summaryRows([
            ["お客様", booking.customerName || "お客様"],
            ["第1希望", formatDateTime(booking.firstDateTime) || "未入力"],
            ["第2希望", formatDateTime(booking.secondDateTime) || "なし"],
            ["第3希望", formatDateTime(booking.thirdDateTime) || "なし"],
            ["メニュー", menuLabel],
            ["クーポン", couponLabel],
            ["備考・相談内容", memo]
          ])}
        </div>
        <div class="admin-booking-requested-choices" aria-label="お客様の希望日時から選択">
          ${isConfirm ? requestedDateTimes.map((item) => `<button type="button" class="secondary-button" data-booking-date-choice="${escapeHtml(item.value)}">${escapeHtml(item.label)}<small>${escapeHtml(formatDateTime(item.value))}</small></button>`).join("") : requestedDateTimes.map((item) => `<span>${escapeHtml(item.label)}<small>${escapeHtml(formatDateTime(item.value))}</small></span>`).join("")}
        </div>
        ${hasProposal ? `<div class="admin-booking-current-proposal"><small>店舗からの提案日時</small><strong>${escapeHtml(formatDateTime(booking.proposedDateTime))}</strong></div>` : ""}
        <div class="admin-booking-confirmed-datetime">
          <label>日付<input type="date" min="${escapeHtml(jstDateKey())}" value="${escapeHtml(initial.date)}" data-admin-booking-confirm-date></label>
          <label>時間<input type="time" step="1800" value="${escapeHtml(initial.time)}" data-admin-booking-confirm-time></label>
        </div>
        <p class="admin-booking-decision-preview" data-admin-booking-decision-preview></p>
        <label class="admin-booking-response-message">お客様へのメッセージ（任意）
          <textarea data-admin-booking-response-message rows="5" placeholder="${isConfirm ? "空欄の場合は定型の予約確定通知を送信します。" : "空欄の場合は選択日時を含む定型の提案文を送信します。"}">${escapeHtml(message)}</textarea>
        </label>
        <p class="soft-note">LINE未連携・通知失敗の場合も、予約状態と入力内容は保存されます。</p>
        <div class="admin-booking-response-actions">
          <button type="button" data-admin-action="submitBookingResponse" data-id="${escapeHtml(requestId)}" data-mode="${escapeHtml(mode)}">${isConfirm ? (hasProposal ? "この日時で予約を確定してLINE通知" : "予約を確定してLINE通知") : "この日時をお客様へ送る"}</button>
          <button type="button" class="secondary-button" data-admin-action="closeBookingResponseModal">戻る</button>
        </div>
      </section>
    </div>
  `;
}

function renderAdminReservationMenus() {
  const menus = getReservationMenus();
  const regularMenus = menus.filter((menu) => menu.type === "通常メニュー");
  return `
    <section class="admin-section-head">
      <div>
        <h3>予約メニュー管理</h3>
        <p>通常メニューは本番スプレッドシートの MenuMaster を正本として管理します。</p>
      </div>
      <a class="secondary-button compact" href="https://docs.google.com/spreadsheets/d/${escapeHtml(TEAM_LINK_DATA_SPREADSHEET_ID)}/edit#gid=2060810001" target="_blank" rel="noopener">MenuMasterを開く</a>
    </section>
    <article class="admin-preview">
      <div class="mini-grid">
        <span>公開中 ${regularMenus.filter((menu) => menu.isPublic !== false).length}件</span>
        <span>通常 ${regularMenus.length}件</span>
        <span>${appState.menuMasterSyncStatus === "synced" ? "データ元 MenuMaster" : appState.menuMasterSyncStatus === "unavailable" ? "MenuMaster取得失敗" : "MenuMaster同期中"}</span>
      </div>
      <p class="soft-note">${appState.menuMasterSyncStatus === "synced" ? "本番スプレッドシートのMenuMasterから同期済みです。" : appState.menuMasterSyncStatus === "unavailable" ? "MenuMasterを取得できませんでした。API接続を確認してください。" : "本番スプレッドシートのMenuMasterを取得しています。"} 予約履歴には予約時点の価格と時間を保存します。</p>
    </article>
    ${renderReservationMenuGroup("通常メニュー", regularMenus)}
  `;
}

function renderReservationMenuGroup(title, menus) {
  return `
    <section class="reservation-menu-group">
      <header>
        <h4>${escapeHtml(title)}</h4>
        <span>${menus.length}件</span>
      </header>
      <div class="reservation-menu-list">
        ${menus.map((menu) => reservationMenuCard(menu)).join("") || "<p>登録はありません。</p>"}
      </div>
    </section>
  `;
}

function reservationMenuCard(menu) {
  return `
    <article class="reservation-menu-card ${menu.isPublic === false ? "is-private" : ""}">
      <header>
        <div>
          <strong>${escapeHtml(menu.title)}</strong>
          <small>${escapeHtml(menu.menuId)} / ${escapeHtml(menu.type)}</small>
        </div>
        <span class="badge ${menu.isPublic === false ? "status-muted" : "status-success"}">${menu.isPublic === false ? "非公開" : "公開"}</span>
      </header>
      <p>${escapeHtml(menu.description || "説明なし")}</p>
      <div class="record-meta-grid">
        <span>通常価格 ${escapeHtml(formatYen(menu.regularPrice))}</span>
        <span>クーポン価格 ${escapeHtml(formatYen(menu.couponPrice))}</span>
        <span>施術時間 ${escapeHtml(formatMinutes(menu.durationMinutes))}</span>
        <span>対象スタッフ ${escapeHtml(formatTargetStaff(menu.targetStaff))}</span>
        <span>対象曜日 ${escapeHtml(formatTargetWeekdays(menu.targetWeekdays))}</span>
        <span>公開期間 ${escapeHtml(formatPublishPeriod(menu))}</span>
        <span>並び順 ${escapeHtml(menu.sortOrder ?? "")}</span>
        <span>${menu.isRecommended ? "おすすめ表示" : "通常表示"}</span>
      </div>
      ${menu.condition ? `<p>利用条件：${escapeHtml(menu.condition)}</p>` : ""}
      <div class="admin-actions mini">
        ${isProductionApiMode()
          ? `<span class="soft-note">編集はMenuMasterで行います</span>`
          : `<button type="button" data-admin-action="editReservationMenu" data-id="${escapeHtml(menu.menuId)}">編集</button><button type="button" data-admin-action="duplicateReservationMenu" data-id="${escapeHtml(menu.menuId)}">複製</button><button type="button" data-admin-action="toggleReservationMenuPublic" data-id="${escapeHtml(menu.menuId)}">${menu.isPublic === false ? "公開" : "非公開"}</button><button type="button" data-admin-action="moveReservationMenuUp" data-id="${escapeHtml(menu.menuId)}">上へ</button><button type="button" data-admin-action="moveReservationMenuDown" data-id="${escapeHtml(menu.menuId)}">下へ</button><button type="button" data-admin-action="deleteReservationMenu" data-id="${escapeHtml(menu.menuId)}">削除</button>`}
      </div>
    </article>
  `;
}

function renderAdminCoupons() {
  if (isProductionApiMode() && appState.adminDataStatus.coupons !== "ready") {
    return renderAdminDataState("クーポン", appState.adminDataStatus.coupons, "クーポン使用履歴を取得できませんでした。");
  }
  const usageHistory = readJson(STORAGE_KEYS.adminCouponUsageHistory, [])
    .sort((a, b) => new Date(b.usedAt || b.updatedAt || 0) - new Date(a.usedAt || a.updatedAt || 0));
  const gachaRewards = readJson(STORAGE_KEYS.gachaAdminRewards, []);
  return `
    <section class="admin-section-head">
      <div>
        <h3>クーポン</h3>
        <p>誰が、いつ、どのクーポンを使用したかを確認します。</p>
      </div>
    </section>
    <div class="admin-list admin-coupon-usage-list">
      ${usageHistory.map((coupon) => {
        const member = findMember(coupon.memberId || coupon.userId);
        const gachaReward = coupon.sourceType === "gacha"
          ? gachaRewards.find((reward) => String(reward.cardId || reward.prizeId) === String(coupon.couponId || coupon.cardId))
          : null;
        const couponName = gachaReward?.prizeName || coupon.title || coupon.couponName || coupon.prizeName || "クーポン";
        return `<article class="admin-mini-record admin-coupon-usage-row"><time>${escapeHtml(formatDateTime(coupon.usedAt) || "日時不明")}</time><strong>${escapeHtml(member?.realName || coupon.memberName || coupon.userName || coupon.memberId || "会員")}</strong><span>${escapeHtml(couponName)}</span><span class="badge status-success">使用済み</span></article>`;
      }).join("") || emptyAdminState("クーポンの使用履歴はありません")}
    </div>
    <p class="soft-note">クーポンの正本データとLINE側の利用処理は変更していません。</p>
  `;
}

function renderAdminCouponGroup(title, coupons, myCoupons) {
  return `
    <section class="reservation-menu-group">
      <header><h4>${escapeHtml(title)}</h4><span>${coupons.length}件</span></header>
      <div class="reservation-menu-list">
        ${coupons.map((coupon) => {
          const stats = getCouponIssueStats(coupon, myCoupons);
          return `
            <article class="reservation-menu-card coupon-admin-card">
              <header>
                <div><strong>${escapeHtml(coupon.title)}</strong><small>${escapeHtml(coupon.couponId)} / ${escapeHtml(coupon.couponType)}</small></div>
                <span class="badge ${coupon.isPublic ? "status-success" : "status-muted"}">${escapeHtml(getCouponPublicationState(coupon))}</span>
              </header>
              <p>${escapeHtml(coupon.description || "")}</p>
              <div class="record-meta-grid">
                ${isLineCouponDefinition(coupon) ? `<span>LINE URL ${isSafeLineCouponUrl(coupon.lineCouponUrl) ? "登録済み" : "未登録"}</span>` : `<span>${escapeHtml(getCouponBenefitText(coupon))}</span>`}
                <span>画像 ${coupon.imageUrl ? "登録済み" : "未登録"}</span>
                <span>期間 ${escapeHtml(coupon.validStartAt || coupon.startAt || "-")}〜${escapeHtml(coupon.validUntil || coupon.endAt || "-")}</span>
                ${isLineCouponDefinition(coupon) ? "" : `<span>発行 ${stats.issued} / 使用 ${stats.used} / 未使用 ${stats.unused}</span>`}
              </div>
              <div class="admin-actions mini">
                <button type="button" data-admin-action="editCoupon" data-id="${escapeHtml(coupon.couponId)}">編集</button>
                <button type="button" data-admin-action="duplicateCoupon" data-id="${escapeHtml(coupon.couponId)}">複製</button>
                <button type="button" data-admin-action="toggleCoupon" data-id="${escapeHtml(coupon.couponId)}">${coupon.isPublic ? "非公開" : "公開"}</button>
                <button type="button" data-admin-action="endCoupon" data-id="${escapeHtml(coupon.couponId)}">終了</button>
                <button type="button" data-admin-action="deleteCoupon" data-id="${escapeHtml(coupon.couponId)}">削除</button>
                ${isLineCouponDefinition(coupon) ? "" : `<button type="button" data-admin-action="grantCoupon" data-id="${escapeHtml(coupon.couponId)}">会員へ付与</button><button type="button" data-admin-action="couponUsage" data-id="${escapeHtml(coupon.couponId)}">利用状況</button>`}
              </div>
            </article>
          `;
        }).join("") || "<p>該当クーポンはありません。</p>"}
      </div>
    </section>
  `;
}

function couponDashboardCards(coupons, myCoupons) {
  return [
    ["LINEクーポン", coupons.filter(isLineCouponDefinition).length, "LINEで開いて利用"],
    ["ガチャ連動", coupons.filter((coupon) => couponMatchesAdminFilter(coupon, "ガチャ連動")).length, "当選時に自動発行"],
    ["年間特典連動", coupons.filter((coupon) => couponMatchesAdminFilter(coupon, "年間特典連動")).length, "達成時に発行"]
  ].map(([label, value, desc]) => `<article class="admin-card"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><small>${escapeHtml(desc)}</small></article>`).join("");
}

function renderAdminGacha() {
  if (isProductionApiMode() && appState.adminDataStatus.gacha !== "ready") {
    return renderAdminDataState("ガチャ管理", appState.adminDataStatus.gacha, "本番ガチャマスターを取得できませんでした。");
  }
  const setting = getCurrentGachaSetting();
  const cards = readJson(STORAGE_KEYS.gachaAdminRewards, []);
  const oddsTotal = getGachaOddsTotal(setting);
  const rarityTotal = getRarityOddsTotal(setting);
  const draws = readJson(STORAGE_KEYS.monthlyGachaDraws, []);
  const month = setting.issueMonth;
  const members = getMembers();
  const monthDraws = draws.filter((draw) => draw.issueMonth === month);
  const usageHistory = readJson(STORAGE_KEYS.gachaCardHistory, [])
    .slice()
    .sort((a, b) => new Date(b.usedAt || b.obtainedAt || b.drawnAt || 0) - new Date(a.usedAt || a.obtainedAt || a.drawnAt || 0));
  const characters = getGachaCharacters();
  const prizes = getGachaPrizes();
  const rarityCounts = monthDraws.reduce((acc, draw) => {
    acc[draw.rarity] = Number(acc[draw.rarity] || 0) + 1;
    return acc;
  }, {});
  return `
    <section class="admin-section-head">
      <div>
        <h3>ガチャ管理</h3>
        <p>カード編集・テストガチャ・獲得履歴をこのページで管理します。</p>
      </div>
      <div class="admin-head-actions">
        <button class="primary-button compact" type="button" data-admin-tab="gachaTest">テストガチャ</button>
      </div>
    </section>
    <nav class="admin-gacha-shortcuts" aria-label="ガチャ管理メニュー">
      <a href="#adminGachaCards"><strong>カード編集</strong><small>30種類の設定</small></a>
      <button type="button" data-admin-tab="gachaTest"><strong>テストガチャ</strong><small>本番データと完全分離</small></button>
      <a href="#adminGachaHistory"><strong>獲得履歴</strong><small>利用状態を確認</small></a>
    </nav>
    <div class="admin-grid">
      <article class="admin-card"><span>対象年月</span><strong>${escapeHtml(formatMonthLabel(month))}</strong><small>${escapeHtml(setting.status)} / ${escapeHtml(setting.startAt)}〜${escapeHtml(setting.endAt)}</small></article>
      <article class="admin-card"><span>カード抽選ウェイト</span><strong>${oddsTotal}</strong><small>本番APIが登録値の比率で抽選します</small></article>
      <article class="admin-card"><span>レア度排出率</span><strong>${rarityTotal}%</strong><small>${rarityTotal === 100 ? "100％です" : "排出率の合計を100％にしてください"}</small></article>
      <article class="admin-card"><span>今月利用</span><strong>${monthDraws.length}名</strong><small>未利用 ${Math.max(0, members.length - monthDraws.length)}名</small></article>
      <article class="admin-card"><span>キャラクター</span><strong>${characters.length}種類</strong><small>景品 ${prizes.length}件 / 上限到達 ${cards.filter((card) => hasReachedMonthlyLimit(card, month)).length}件</small></article>
    </div>
    <section class="reservation-menu-group" id="adminGachaCards">
      <header><h4>排出率設定</h4><span>UR / SSR / SR / R / N</span></header>
      <div class="record-meta-grid gacha-rate-grid">
        ${Object.keys(rarityMeta).map((rarity) => `<span>${escapeHtml(rarity)} ${escapeHtml(rarityMeta[rarity].label)}：${escapeHtml(setting.rarityRates?.[rarity] ?? defaultGachaRarityRates[rarity] ?? 0)}%</span>`).join("")}
      </div>
    </section>
    ${renderGachaCharacterEditor(setting)}
    <section class="reservation-menu-group">
      <header><h4>キャラクター管理</h4><span>${characters.length}種類</span></header>
      <div class="gacha-character-admin-grid">
        ${characters.map((character) => `
          <article class="collection-dex-card rarity-${escapeHtml(String(character.rarity || "N").toLowerCase())}">
            ${gachaCharacterImageHtml(character)}
            <span>No.${escapeHtml(character.cardNo)} / ${escapeHtml(character.rarity)}</span>
            <strong>${escapeHtml(character.name)}</strong>
            <small>${escapeHtml(character.intro)}</small>
            <small>効果：${escapeHtml(character.effectName)} ${escapeHtml(character.effectDescription)}</small>
            <div class="admin-actions mini">
              <button type="button" data-admin-action="editGachaCharacter" data-id="${escapeHtml(character.characterId)}">編集</button>
              <button type="button" data-admin-action="toggleGachaCharacter" data-id="${escapeHtml(character.characterId)}">${character.isDrawable === false ? "排出対象" : "排出停止"}</button>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
    <section class="reservation-menu-group">
      <header><h4>景品管理</h4><span>${prizes.length}件</span></header>
      <div class="admin-head-actions inline-actions"><button class="secondary-button compact" type="button" data-admin-action="addGachaPrizeMaster">景品追加</button></div>
      <div class="reservation-menu-list">
        ${prizes.map((prize) => `
          <article class="reservation-menu-card">
            <header><div><strong>${escapeHtml(prize.title)}</strong><small>${escapeHtml(prize.prizeId)}</small></div><span class="badge ${prize.isPublic === false ? "status-muted" : "status-success"}">${prize.isPublic === false ? "停止" : "公開"}</span></header>
            <p>${escapeHtml(prize.description || "")}</p>
            <div class="record-meta-grid">
              <span>割引 ${escapeHtml(prize.discountAmount ? formatYen(prize.discountAmount) : `${prize.discountRate || 0}%`)}</span>
              <span>対象 ${escapeHtml(prize.targetMenu || "-")}</span>
              <span>期限 ${escapeHtml(prize.validDays || 35)}日</span>
              <span>${prize.canCombine ? "併用可能" : "併用不可"}</span>
            </div>
            <div class="admin-actions mini"><button type="button" data-admin-action="editGachaPrizeMaster" data-id="${escapeHtml(prize.prizeId)}">編集</button><button type="button" data-admin-action="toggleGachaPrizeMaster" data-id="${escapeHtml(prize.prizeId)}">${prize.isPublic === false ? "公開" : "停止"}</button></div>
          </article>
        `).join("")}
      </div>
    </section>
    <section class="reservation-menu-group">
      <header><h4>月別ガチャ設定</h4><span>${cards.length}件</span></header>
      <div class="reservation-menu-list">
        ${cards.map((card) => `
          <article class="reservation-menu-card rarity-${escapeHtml(String(card.rarity || "R").toLowerCase())}">
            <header><div><strong>${escapeHtml(card.characterName || card.cardName)}</strong><small>No.${escapeHtml(card.cardNo || "")} / ${escapeHtml(card.rarity)} ${escapeHtml(rarityMeta[card.rarity]?.label || "")}</small></div><span class="badge ${card.isPublic === false || card.isDrawable === false ? "status-muted" : "status-success"}">${card.isPublic === false ? "非公開" : card.isDrawable === false ? "排出停止" : "公開"}</span></header>
            <p>効果：${escapeHtml(card.effectName || "")} ${escapeHtml(card.effectDescription || "")}</p>
            <p>今月の景品：${escapeHtml(card.prizeName)} / ${escapeHtml(card.prizeDescription || "")}</p>
            <div class="record-meta-grid">
              <span>当選確率 ${escapeHtml(card.winRate)}%</span>
              <span>ウェイト ${escapeHtml(card.weight || 1)}</span>
              <span>月間上限 ${escapeHtml(card.monthlyWinLimit)}</span>
              <span>在庫 ${escapeHtml(card.stockCount ?? card.inventoryCount ?? "制限なし")}</span>
              <span>利用期限 ${escapeHtml(formatDateUntil(card.validUntil))}</span>
              <span>対象メニュー ${escapeHtml(card.targetMenu || "-")}</span>
              <span>${card.canCombine ? "併用可能" : "併用不可"}</span>
              <span>${card.issueAsCoupon ? "クーポン発行" : "カードのみ"}</span>
              <span>${hasReachedMonthlyLimit(card, month) ? "上限到達" : "抽選対象"}</span>
            </div>
            <div class="admin-actions mini"><button type="button" data-admin-action="editGachaPrize" data-id="${escapeHtml(card.cardId)}">編集</button><button type="button" data-admin-action="toggleGachaCard" data-id="${escapeHtml(card.cardId)}">${card.isPublic === false ? "公開" : "非公開"}</button></div>
          </article>
        `).join("")}
      </div>
    </section>
    <article class="admin-preview" id="adminGachaHistory">
      <h3>景品利用履歴</h3>
      <div class="chart-list">${usageHistory.slice(0, 50).map((card) => {
        const state = getGachaLifecycleState(card);
        const statusLabel = state === "expired" ? "期限切れ" : state === "used" ? "使用済み" : "未使用";
        return `<article class="chart-row"><strong>${escapeHtml(card.characterName || card.cardName || "-")} / ${escapeHtml(card.prizeName || "-")}</strong><span>ユーザー：${escapeHtml(card.memberId || card.userId || "-")} / 獲得：${escapeHtml(formatDateTime(card.obtainedAt || card.drawnAt) || "-")} / 使用：${escapeHtml(formatDateTime(card.usedAt || card.useConfirmedAt) || "-")} / ${escapeHtml(statusLabel)}</span><div class="admin-actions mini"><button type="button" data-admin-action="cardDetail" data-id="${escapeHtml(card.cardHistoryId || card.drawId)}">詳細</button></div></article>`;
      }).join("") || "<p>景品利用履歴はありません。</p>"}</div>
    </article>
    <article class="admin-preview">
      <h3>ガチャ履歴・集計</h3>
      <div class="summary-list">${summaryRows([
        ["月別ガチャ利用者数", `${monthDraws.length}名`],
        ["未利用者数", `${Math.max(0, members.length - monthDraws.length)}名`],
        ["レア度別排出", Object.keys(rarityMeta).map((rarity) => `${rarity}:${rarityCounts[rarity] || 0}`).join(" / ")],
        ["景品未利用", `${monthDraws.filter((draw) => getCardUsageState(draw) === "未使用").length}件`],
        ["景品利用済み", `${monthDraws.filter((draw) => getCardUsageState(draw) === "使用済み").length}件`]
      ])}</div>
      <div class="chart-list">${monthDraws.slice(0, 12).map((draw) => `<article class="chart-row"><strong>${escapeHtml(draw.cardNo || "")} ${escapeHtml(draw.characterName || draw.cardName)}</strong><span>${escapeHtml(draw.memberId)} / ${escapeHtml(draw.rarity)} / ${escapeHtml(draw.prizeName)} / ${escapeHtml(getCardUsageState(draw))} / 獲得 ${escapeHtml(formatDateTime(draw.obtainedAt || draw.drawnAt) || "-")} / 使用 ${escapeHtml(formatDateTime(draw.usedAt || draw.useConfirmedAt) || "-")}</span></article>`).join("") || "<p>今月の履歴はありません。</p>"}</div>
    </article>
    <article class="admin-preview">
      <h3>会員別の今月利用状況</h3>
      <div class="admin-table compact-table">
        ${getMembers().map((member) => {
          const memberStatus = getMemberGachaStatus(member);
          return `<article><strong>${escapeHtml(member.realName)}</strong><span>${escapeHtml(member.memberId)}</span><span>${memberStatus.used ? `利用済み ${escapeHtml(memberStatus.draw.cardName || memberStatus.draw.title)}` : "未利用"}</span><button type="button" data-admin-action="guideGacha" data-id="${escapeHtml(member.memberId)}">ガチャを案内する</button></article>`;
        }).join("")}
      </div>
    </article>
    <article class="admin-preview">
      <h3>年間コレクション特典</h3>
      <div class="chart-list">${getCollectionRewards().map((reward) => `<article class="chart-row"><strong>${escapeHtml(reward.requiredCount)}枚達成：${escapeHtml(reward.title)}</strong><span>${escapeHtml(reward.status)} / ${reward.issueAsCoupon ? "クーポン発行" : reward.handoffAtShop ? "店頭手渡し" : "手動付与"}</span><p>${escapeHtml(reward.description || "")}</p></article>`).join("")}</div>
    </article>
  `;
}

function renderAdminGachaTest() {
  const session = getAdminSession();
  if (session?.role !== "admin") {
    return emptyAdminState("テストガチャは管理者のみ利用できます。");
  }
  const setting = getCurrentGachaSetting();
  const cards = getGachaCards(setting);
  const testLog = readJson(STORAGE_KEYS.gachaTestLog, []);
  const latest = testLog[0] || null;
  const rarityCounts = Object.keys(rarityMeta).reduce((result, rarity) => {
    result[rarity] = testLog.filter((draw) => draw.rarity === rarity).length;
    return result;
  }, {});
  const testBinder = getUsedCollectionCards(testLog, currentYear());
  const uniqueCardCount = new Set(testBinder.map((draw) => String(draw.cardId || ""))).size;
  const isTestUseConfirming = Boolean(latest?.testId) && appState.gachaTestUseConfirmId === String(latest.testId);
  return `
    <section class="admin-section-head">
      <div>
        <h3>運営専用テストガチャ</h3>
        <p>本番履歴・クーポン・在庫・月1回権利へ影響しないプレビュー専用抽選です。</p>
      </div>
    </section>
    <div class="admin-grid">
      <article class="admin-card"><span>実行モード</span><strong>TEST</strong><small>本番設定は読取のみ。本番履歴へ書き込みません</small></article>
      <article class="admin-card"><span>対象年月</span><strong>${escapeHtml(formatMonthLabel(setting.issueMonth))}</strong><small>${escapeHtml(setting.status)} / ${escapeHtml(cards.length)}カード</small></article>
      <article class="admin-card"><span>テスト回数</span><strong>${testLog.length}回</strong><small>${Object.keys(rarityMeta).map((rarity) => `${rarity}:${rarityCounts[rarity]}`).join(" / ")}</small></article>
    </div>
    ${latest ? `<article class="admin-preview gacha-test-result rarity-${escapeHtml(String(latest.rarity || "N").toLowerCase())}">
      <h3>直近の当選カード</h3>
      <div class="gacha-test-result-card">${gachaCompletedCardHtml(latest, "admin-test")}</div>
      <div class="summary-list">${summaryRows([
        ["キャラクター", latest.characterName || latest.cardName || "-"],
        ["レアリティ", latest.rarity || "-"],
        ["景品", latest.prizeName || "-"],
        ["景品内容", latest.prizeDescription || "-"],
        ["テスト状態", latest.testStatus === "used" ? "使用済み" : "未使用"]
      ])}</div>
      ${latest.testStatus === "used" ? `<div class="gacha-use-complete"><strong>✓ 使用済み</strong><span>使用日時：${escapeHtml(formatDateTime(latest.usedAt) || "記録済み")}</span></div>`
        : isTestUseConfirming ? `<section class="gacha-use-confirmation"><strong>このテスト景品を使用しますか？</strong><p>本番データには影響しません。</p><div class="gacha-use-confirm-actions"><button class="primary-button" type="button" data-admin-action="confirmGachaTestUse" data-id="${escapeHtml(latest.testId)}">使用済みにする</button><button class="secondary-button" type="button" data-admin-action="hideGachaTestUseConfirmation">戻る</button></div></section>`
        : `<div class="admin-actions"><button class="primary-button" type="button" data-admin-action="showGachaTestUseConfirmation" data-id="${escapeHtml(latest.testId)}">スタッフに見せる</button></div>`}
    </article>` : ""}
    <section class="reservation-menu-group">
      <header><h4>テスト方法</h4><span>管理者専用</span></header>
      <div class="admin-head-actions inline-actions">
        <button class="primary-button compact" type="button" data-admin-action="runGachaTest" data-mode="normal">テストガチャを引く</button>
        <button class="secondary-button compact" type="button" data-admin-action="resetGachaTestData">リセット</button>
        ${Object.keys(rarityMeta).map((rarity) => `<button class="secondary-button compact" type="button" data-admin-action="runGachaTest" data-mode="rarity" data-rarity="${escapeHtml(rarity)}">${escapeHtml(rarity)}演出テスト</button>`).join("")}
      </div>
    </section>
    <section class="reservation-menu-group">
      <header><h4>テスト用バインダー</h4><span>使用済み ${testBinder.length}枚 / ${uniqueCardCount}種類</span></header>
      <div class="gacha-character-admin-grid">${testBinder.map((draw) => `<article class="collection-dex-card rarity-${escapeHtml(String(draw.rarity || "N").toLowerCase())}">${gachaCharacterImageHtml(draw)}<span>${escapeHtml(draw.rarity || "")}</span><strong>${escapeHtml(draw.characterName || draw.cardName || "")}</strong><small>${escapeHtml(draw.prizeName || "")}</small></article>`).join("") || "<p>使用済みにしたテストカードはまだありません。</p>"}</div>
    </section>
    <section class="reservation-menu-group">
      <header><h4>テスト用コレクション進捗</h4><span>本番データとは完全分離</span></header>
      <div class="chart-list">${getCollectionRewards().map((reward) => {
        const progress = getCollectionRewardProgress(reward, testBinder);
        return `<article class="chart-row"><strong>${escapeHtml(reward.title || reward.rewardName || "コレクション特典")}</strong><span>現在 ${progress.current} / ${progress.target}${progress.achieved ? " / 達成" : ""}</span></article>`;
      }).join("") || "<p>公開中のコレクション特典はありません。</p>"}</div>
    </section>
    <section class="reservation-menu-group">
      <header><h4>カードを直接指定</h4><span>${cards.length}種類</span></header>
      <div class="gacha-character-admin-grid">
        ${cards.map((card) => `
          <article class="collection-dex-card rarity-${escapeHtml(String(card.rarity || "N").toLowerCase())}">
            ${gachaCharacterImageHtml(card)}
            <span>No.${escapeHtml(card.cardNo)} / ${escapeHtml(card.rarity)}</span>
            <strong>${escapeHtml(card.characterName || card.cardName)}</strong>
            <small>${escapeHtml(card.prizeName || "")}</small>
            <div class="admin-actions mini">
              <button type="button" data-admin-action="runGachaTest" data-mode="card" data-id="${escapeHtml(card.cardId || card.characterId)}">このカードでテスト</button>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
    <article class="admin-preview">
      <h3>直近のテスト</h3>
      <div class="chart-list">${testLog.slice(0, 10).map((log) => `<article class="chart-row"><strong>${escapeHtml(log.cardName)} / ${escapeHtml(log.rarity)}</strong><span>${escapeHtml(formatDateTime(log.testedAt))} / ${escapeHtml(log.mode)} / 保存なし</span></article>`).join("") || "<p>まだテストしていません。</p>"}</div>
    </article>
  `;
}

async function runAdminGachaTest(button) {
  const session = getAdminSession();
  if (session?.role !== "admin") {
    showToast("テストガチャは管理者のみ利用できます。");
    return;
  }
  const mode = button.dataset.mode || "normal";
  const setting = getCurrentGachaSetting();
  let card = null;
  if (mode === "card") {
    card = getGachaCards(setting).find((item) => String(item.cardId || item.characterId) === String(button.dataset.id));
  } else if (mode === "rarity") {
    const rarity = button.dataset.rarity || "N";
    const pool = getGachaCards(setting).filter((item) => item.rarity === rarity && item.isPublic !== false && item.isDrawable !== false);
    card = pool[Math.floor(Math.random() * pool.length)] || getGachaCards(setting).find((item) => item.rarity === rarity);
  } else {
    // 本番マスタは同期済みデータを読取専用で使い、抽選結果はTEST領域だけへ保存する。
    // 未提供のtestDrawGacha APIに依存しないため、本番ユーザーの権利・履歴には触れない。
    card = drawPrize(setting.issueMonth);
  }
  if (!card) {
    showToast("テスト対象カードがありません。");
    return;
  }
  const testDraw = {
    ...card,
    drawId: createId("TEST-GACHA"),
    cardHistoryId: createId("TEST-CARD"),
    dataMode: "TEST",
    memberId: "TEST_ADMIN_ONLY",
    issueMonth: setting.issueMonth,
    lifecycleState: "test",
    useState: "test",
    status: "test",
    testStatus: "available",
    validUntil: endOfMonthDateKeyFor(setting.issueMonth),
    expires: endOfMonthDateKeyFor(setting.issueMonth),
    obtainedAt: new Date().toISOString(),
    drawnAt: new Date().toISOString()
  };
  const log = readJson(STORAGE_KEYS.gachaTestLog, []);
  writeJson(STORAGE_KEYS.gachaTestLog, [{
    testId: testDraw.drawId,
    mode,
    ...testDraw,
    testedAt: new Date().toISOString(),
    adminName: session.name,
    savedToProduction: false
  }, ...log].slice(0, 500));
  appState.gachaTestUseConfirmId = "";
  openGachaTestChoiceStage(testDraw);
}

function showGachaTestUseConfirmation(testId) {
  const draw = readJson(STORAGE_KEYS.gachaTestLog, []).find((item) => String(item.testId) === String(testId));
  if (!draw || draw.dataMode !== "TEST" || draw.memberId !== "TEST_ADMIN_ONLY" || draw.testStatus === "used") return;
  appState.gachaTestUseConfirmId = String(testId);
  renderAdmin();
}

function hideGachaTestUseConfirmation() {
  appState.gachaTestUseConfirmId = "";
  renderAdmin();
}

function confirmGachaTestUse(testId) {
  if (appState.gachaTestUseConfirmId !== String(testId)) return;
  const testLog = readJson(STORAGE_KEYS.gachaTestLog, []);
  const draw = testLog.find((item) => String(item.testId) === String(testId));
  if (!draw || draw.dataMode !== "TEST" || draw.memberId !== "TEST_ADMIN_ONLY" || draw.testStatus === "used") return;
  draw.testStatus = "used";
  draw.usedAt = new Date().toISOString();
  writeJson(STORAGE_KEYS.gachaTestLog, testLog);
  appState.gachaTestUseConfirmId = "";
  showToast("テスト景品を使用済みにしました。本番データには影響しません。");
  renderAdmin();
}

function toggleAdminGachaTestUse(testId) {
  const testLog = readJson(STORAGE_KEYS.gachaTestLog, []);
  const draw = testLog.find((item) => String(item.testId) === String(testId));
  if (!draw || draw.dataMode !== "TEST") return;
  draw.testStatus = draw.testStatus === "used" ? "available" : "used";
  draw.usedAt = draw.testStatus === "used" ? new Date().toISOString() : "";
  writeJson(STORAGE_KEYS.gachaTestLog, testLog);
  renderAdmin();
}

function resetAdminGachaTestData() {
  const confirmed = window.confirm("テストデータをリセットします。本番データには影響しません");
  if (!confirmed) return;
  localStorage.removeItem(STORAGE_KEYS.gachaTestLog);
  writeJson(STORAGE_KEYS.gachaTestLog, []);
  appState.gachaTestUseConfirmId = "";
  showToast("テストガチャのデータだけをリセットしました。");
  renderAdmin();
}

function renderGachaCharacterEditor(setting) {
  const characters = getGachaCharacters();
  const selected = characters.find((item) => item.characterId === appState.gachaCharacterEditId) || characters[0];
  if (!selected) return "";
  const currentCard = getGachaCards(setting).find((card) => card.characterId === selected.characterId || card.cardId === selected.characterId) || monthlyCardFromCharacter(selected, getGachaPrizes()[0], setting.issueMonth, 0);
  const previewCard = { ...currentCard, ...characterToCardPreview(selected, currentCard) };
  return `
    <section class="gacha-editor-panel">
      <div class="admin-section-head">
        <div>
          <h4>キャラクター編集プレビュー</h4>
          <p>背景透過PNGのキャラクター単体画像を使い、カード枠や景品情報はTEAM LINK側で重ねて表示します。</p>
        </div>
      </div>
      <form class="gacha-character-form" id="gachaCharacterEditForm" data-id="${escapeHtml(selected.characterId)}">
        <div class="field-grid">
          <label class="field">カード番号<input name="cardNo" value="${escapeHtml(selected.cardNo || "")}" required></label>
          <label class="field">キャラクター名<input name="name" value="${escapeHtml(selected.name || "")}" required></label>
          <label class="field">レア度
            <select name="rarity">
              ${Object.keys(rarityMeta).map((rarity) => `<option value="${escapeHtml(rarity)}" ${selected.rarity === rarity ? "selected" : ""}>${escapeHtml(rarity)} ${escapeHtml(rarityMeta[rarity].label)}</option>`).join("")}
            </select>
          </label>
          <label class="field">効果名<input name="effectName" value="${escapeHtml(selected.effectName || "")}"></label>
          <label class="field full">キャラクター説明<textarea name="intro" rows="2">${escapeHtml(selected.intro || "")}</textarea></label>
          <label class="field full">効果説明<textarea name="effectDescription" rows="2">${escapeHtml(selected.effectDescription || "")}</textarea></label>
          <label class="field full">画像パス<input name="imageUrl" value="${escapeHtml(selected.imageUrl || selected.imagePath || `images/gacha/characters/${selected.characterId}.png`)}" placeholder="images/gacha/characters/character-01.png"></label>
          <label class="field">並び順<input name="sortOrder" type="number" value="${escapeHtml(selected.sortOrder || selected.cardNo || 1)}"></label>
          <label class="field">公開状態
            <select name="isPublic">
              <option value="true" ${selected.isPublic !== false ? "selected" : ""}>公開</option>
              <option value="false" ${selected.isPublic === false ? "selected" : ""}>非公開</option>
            </select>
          </label>
        </div>
        <div class="gacha-preview-tabs">
          ${[
            ["image", "画像だけ"],
            ["transparent", "透過確認"],
            ["card", "カード完成形"],
            ["result", "ガチャ結果画面"],
            ["animation", "ガチャ演出"]
          ].map(([key, label]) => `<button type="button" class="${(appState.gachaPreviewMode || "card") === key ? "is-active" : ""}" data-admin-action="setGachaPreviewTab" data-id="${escapeHtml(key)}">${escapeHtml(label)}</button>`).join("")}
        </div>
        <div id="gachaPreviewPanel">${gachaPreviewPanelHtml(previewCard, appState.gachaPreviewMode || "card")}</div>
        <div class="admin-actions">
          <button class="primary-button compact" type="submit">キャラクターを保存</button>
          <button class="secondary-button compact" type="button" data-admin-action="previewGachaAnimation">このキャラクターでガチャ演出をテスト</button>
          <button class="secondary-button compact" type="button" data-admin-action="cancelGachaCharacterEdit">閉じる</button>
        </div>
      </form>
    </section>
  `;
}

function characterToCardPreview(character, baseCard = {}) {
  return {
    ...baseCard,
    characterId: character.characterId,
    cardId: character.characterId,
    cardNo: character.cardNo,
    cardName: character.name,
    characterName: character.name,
    rarity: character.rarity,
    intro: character.intro,
    effectName: character.effectName,
    effectDescription: character.effectDescription,
    imageUrl: character.imageUrl || "",
    imagePath: character.imagePath || `images/gacha/characters/${character.characterId}.png`,
    sortOrder: character.sortOrder,
    isPublic: character.isPublic !== false
  };
}

function gachaCompletedCardHtml(card, mode = "mobile") {
  return createSimpleGachaCard(card, { mode, compact: mode === "mobile" });
}

function getGachaNameSize(name) {
  const length = Array.from(String(name || "")).length;
  if (length >= 18) return "0.92rem";
  if (length >= 15) return "1.00rem";
  if (length >= 12) return "1.10rem";
  if (length >= 9) return "1.24rem";
  return "clamp(1.28rem, 5.65vw, 1.58rem)";
}

function gachaPreviewPanelHtml(card, mode = "card") {
  if (mode === "image") {
    return `
      <section class="gacha-preview-mode">
        <header><strong>画像だけ</strong><small>${escapeHtml(card.imageUrl || "画像未登録")}</small></header>
        <div class="gacha-plain-image-frame">${gachaCharacterImageHtml(card)}</div>
      </section>
    `;
  }
  if (mode === "transparent") {
    const rarityKey = String(card.rarity || "N").toLowerCase();
    const imageCompareStyle = "display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin:12px 0;";
    const checkerStyle = "min-height:190px;display:grid;place-items:center;padding:10px;border-radius:14px;background-color:#fff;background-image:linear-gradient(45deg,#ccc 25%,transparent 25%),linear-gradient(-45deg,#ccc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ccc 75%),linear-gradient(-45deg,transparent 75%,#ccc 75%);background-size:20px 20px;background-position:0 0,0 10px,10px -10px,-10px 0;";
    const darkStyle = "min-height:190px;display:grid;place-items:center;padding:10px;border-radius:14px;background:#050505;";
    const whiteStyle = "min-height:190px;display:grid;place-items:center;padding:10px;border-radius:14px;background:#fff;";
    const insideStyle = `min-height:190px;display:grid;place-items:center;padding:10px;border-radius:14px;background:#090909 url('images/gacha/inside/inside-${rarityKey}.webp') center/cover no-repeat;`;
    return `
      <section class="gacha-preview-mode">
        <header><strong>透過確認プレビュー</strong><small>元PNGを直接表示します。Canvas加工は使いません。</small></header>
        <div style="${imageCompareStyle}">
          <article><strong>市松模様</strong><div style="${checkerStyle}">${gachaRawCharacterImageHtml(card)}</div></article>
          <article><strong>黒背景</strong><div style="${darkStyle}">${gachaRawCharacterImageHtml(card)}</div></article>
          <article><strong>白背景</strong><div style="${whiteStyle}">${gachaRawCharacterImageHtml(card)}</div></article>
        </div>
        <div style="${imageCompareStyle}">
          <article><strong>inside背景</strong><div style="${insideStyle}">${gachaRawCharacterImageHtml(card)}</div></article>
        </div>
        <div class="summary-list gacha-image-meta" id="gachaImageMeta">${summaryRows([
          ["画像URL", card.imageUrl || "-"],
          ["読み込み", card.imageUrl ? "確認中…" : "画像未登録"],
          ["画像形式", getImageFormatLabel(card.imageUrl)],
          ["透明部分", "確認中…"]
        ])}</div>
      </section>
    `;
  }
  if (mode === "result") {
    return `
      <section class="gacha-preview-mode">
        <header><strong>ガチャ結果画面</strong><small>ユーザーが当選後に見る表示です。</small></header>
        ${gachaResultPreviewHtml(card)}
      </section>
    `;
  }
  if (mode === "animation") {
    return `
      <section class="gacha-preview-mode">
        <header><strong>ガチャ演出</strong><small>本番のガチャ権・履歴・クーポンは消費しません。</small></header>
        ${gachaCompletedCardHtml(card, "result")}
        <button class="primary-button compact" type="button" data-admin-action="previewGachaAnimation">このキャラクターでガチャ演出をテスト</button>
      </section>
    `;
  }
  return `
    <section class="gacha-preview-mode">
      <header><strong>カード完成形プレビュー</strong><small>現在選択中の月別景品を重ねています。</small></header>
      ${gachaCompletedCardHtml(card, "mobile")}
    </section>
  `;
}

function gachaResultPreviewHtml(card) {
  const rarity = rarityMeta[card.rarity] || rarityMeta.N;
  return `
    <article class="gacha-result-preview rarity-${escapeHtml(String(card.rarity || "N").toLowerCase())}">
      <p class="kicker">Congratulations</p>
      <h3>${escapeHtml(card.characterName || card.cardName || "")}</h3>
      ${gachaCompletedCardHtml(card, "result")}
      <div class="summary-list">${summaryRows([
        ["レア度", `${card.rarity} ${rarity.label}`],
        ["カード番号", `No.${card.cardNo || "-"}`],
        ["効果", `${card.effectName || ""}${card.effectDescription ? ` / ${card.effectDescription}` : ""}`],
        ["今回の景品", card.prizeName || "プレビュー用景品"],
        ["景品説明", card.prizeDescription || ""],
        ["有効期限", formatDateUntil(card.validUntil || endOfMonthDateKey())]
      ])}</div>
    </article>
  `;
}

function getImageFormatLabel(url) {
  const ext = String(url || "").split("?")[0].split(".").pop()?.toLowerCase();
  if (!ext || ext === url) return "-";
  return ext.toUpperCase();
}

function inspectPreviewImageMeta(card) {
  const meta = document.getElementById("gachaImageMeta");
  if (!meta) return;
  const url = card.imageUrl || "";
  if (!url) {
    meta.innerHTML = summaryRows([
      ["画像URL", "-"],
      ["読み込み", "画像未登録"],
      ["画像形式", "-"],
      ["透明部分", "未確認"]
    ]);
    return;
  }
  const image = new Image();
  image.onload = () => {
    const transparency = detectImageTransparency(image);
    meta.innerHTML = summaryRows([
      ["画像URL", url],
      ["読み込み", "成功"],
      ["画像形式", getImageFormatLabel(url)],
      ["画像サイズ", `${image.naturalWidth} x ${image.naturalHeight}px`],
      ["透明部分", transparency.hasTransparent ? "あり" : "検出できません"],
      ["判定", transparency.hasTransparent ? "透過PNGとして表示できます" : "この画像は背景が透過されていない可能性があります"]
    ]);
  };
  image.onerror = () => {
    meta.innerHTML = summaryRows([
      ["画像URL", url],
      ["読み込み", "失敗"],
      ["画像形式", getImageFormatLabel(url)],
      ["透明部分", "未確認"],
      ["判定", "画像パスまたはファイル名を確認してください"]
    ]);
  };
  image.src = url;
}

function detectImageTransparency(image) {
  try {
    const canvas = document.createElement("canvas");
    const width = Math.min(160, image.naturalWidth || 1);
    const height = Math.min(160, image.naturalHeight || 1);
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.drawImage(image, 0, 0, width, height);
    const data = context.getImageData(0, 0, width, height).data;
    let transparent = 0;
    for (let index = 3; index < data.length; index += 4) {
      if (data[index] < 250) transparent += 1;
      if (transparent > 24) break;
    }
    return { hasTransparent: transparent > 24 };
  } catch (error) {
    return { hasTransparent: false, error: error.message };
  }
}

function readGachaCharacterForm(form) {
  const data = new FormData(form);
  return {
    characterId: form.dataset.id,
    cardNo: String(data.get("cardNo") || "").trim(),
    name: String(data.get("name") || "").trim(),
    rarity: String(data.get("rarity") || "N").trim(),
    effectName: String(data.get("effectName") || "").trim(),
    intro: String(data.get("intro") || "").trim(),
    effectDescription: String(data.get("effectDescription") || "").trim(),
    imageUrl: String(data.get("imageUrl") || "").trim(),
    sortOrder: Number(data.get("sortOrder") || 0),
    isPublic: String(data.get("isPublic")) !== "false"
  };
}

function updateGachaCharacterPreview() {
  const form = document.getElementById("gachaCharacterEditForm");
  if (!form) return;
  const character = readGachaCharacterForm(form);
  const setting = getCurrentGachaSetting();
  const currentCard = getGachaCards(setting).find((card) => card.characterId === character.characterId || card.cardId === character.characterId) || {};
  const card = { ...currentCard, ...characterToCardPreview(character, currentCard) };
  const mobile = document.getElementById("gachaCharacterPreviewMobile");
  const result = document.getElementById("gachaCharacterPreviewResult");
  const panel = document.getElementById("gachaPreviewPanel");
  if (mobile) mobile.innerHTML = gachaCompletedCardHtml(card, "mobile");
  if (result) result.innerHTML = gachaCompletedCardHtml(card, "result");
  if (panel) panel.innerHTML = gachaPreviewPanelHtml(card, appState.gachaPreviewMode || "card");
  if ((appState.gachaPreviewMode || "card") === "transparent") window.setTimeout(() => inspectPreviewImageMeta(card), 50);
}

function saveGachaCharacterForm(form) {
  const next = readGachaCharacterForm(form);
  if (!next.cardNo || !next.name) {
    showToast("カード番号とキャラクター名を入力してください。");
    return;
  }
  if (!rarityMeta[next.rarity]) {
    showToast("レア度は UR / SSR / SR / R / N から選択してください。");
    return;
  }
  const characters = getGachaCharacters();
  const character = characters.find((item) => item.characterId === next.characterId);
  if (!character) return;
  Object.assign(character, {
    cardNo: next.cardNo,
    name: next.name,
    rarity: next.rarity,
    effectName: next.effectName,
    intro: next.intro,
    effectDescription: next.effectDescription,
    imageUrl: next.imageUrl,
    imagePath: next.imageUrl || `images/gacha/characters/${character.characterId}.png`,
    sortOrder: next.sortOrder || Number(next.cardNo || character.sortOrder || 1),
    isPublic: next.isPublic,
    updatedAt: new Date().toISOString()
  });
  writeGachaCharacters(characters);
  syncCharacterToCurrentMonth(character);
  appState.gachaCharacterEditId = character.characterId;
  addAdminLog("gacha_character_save", `${character.name} を保存`, getAdminSession()?.name, character.characterId);
  showToast("キャラクター情報を保存しました。過去の獲得履歴は変更していません。");
  renderApp();
}

function renderAdminFortune() {
  const fortunes = getAdminFortunes();
  return `
    <section class="admin-section-head">
      <div>
        <h3>占い管理</h3>
        <p>日付・TEAM LINKタイプごとの美容運、ラッキーカラー、おすすめメニューを編集できる構造です。</p>
      </div>
      <button class="secondary-button compact" type="button" data-admin-action="addFortune">一括登録準備</button>
    </section>
    <div class="admin-table">
      ${fortunes.map((fortune) => `
        <article>
          <strong>${escapeHtml(fortune.date)} / ${escapeHtml(fortune.type)}</strong>
          <span>美容運 ${escapeHtml(fortune.beauty)}</span>
          <span>${escapeHtml(fortune.luckyColor)}</span>
          <span>${escapeHtml(fortune.recommendedMenu)}</span>
          <button type="button" data-admin-action="editFortune" data-id="${escapeHtml(fortune.fortuneId)}">編集</button>
        </article>
      `).join("")}
    </div>
  `;
}

function renderAdminLounge() {
  return `
    <section class="admin-section-head">
      <div>
        <h3>ご縁ラウンジ</h3>
        <p>有料会員管理の入口です。</p>
      </div>
    </section>
    <article class="admin-coming-soon"><span>準備中</span><strong>2026年10月開始予定</strong><p>有料会員・月額課金・会員連携は開始時に追加します。</p></article>
  `;
}

function renderAdminNotices() {
  const notices = readJson(STORAGE_KEYS.adminNotices, []);
  return `
    <section class="admin-section-head">
      <div>
        <h3>お知らせ管理</h3>
        <p>公開開始日、対象会員、重要表示、LINE通知対象を指定して管理できます。</p>
      </div>
      <button class="secondary-button compact" type="button" data-admin-action="addNotice">お知らせ作成</button>
    </section>
    <div class="admin-table">
      ${notices.map((notice) => `
        <article>
          <strong>${escapeHtml(notice.title)}</strong>
          <span>${escapeHtml(notice.audience)}</span>
          <span>${escapeHtml(notice.startAt)}〜${escapeHtml(notice.endAt)}</span>
          <span>${notice.lineNotify ? "LINE通知対象" : "アプリ内のみ"}</span>
          <button type="button" data-admin-action="toggleNotice" data-id="${escapeHtml(notice.noticeId)}">${notice.status === "公開" ? "下書きへ" : "公開"}</button>
        </article>
      `).join("")}
    </div>
  `;
}

function renderAdminSettings() {
  const session = getAdminSession();
  const logs = readJson(STORAGE_KEYS.adminLogs, []).slice(0, 12);
  const settings = getStoreSettings();
  const menus = getReservationMenus();
  const canEditLineSettings = session.role === "admin";
  const lineSettings = appState.lineNotificationSettings;
  const lineSettingsStatus = appState.lineNotificationSettingsStatus;
  const bookingEmailSettings = appState.bookingNotificationSettings;
  const bookingEmailSettingsStatus = appState.bookingNotificationSettingsStatus;
  const lineSettingItems = [
    ["bookingConfirmed", "予約確定通知", "予約を確定したとき"],
    ["bookingNeedsChange", "別日の案内通知", "別日の相談を送るとき"],
    ["bookingConsultationReply", "予約相談への返信通知", "予約相談へ返信するとき（将来連携用）"],
    ["staffMessage", "その他スタッフメッセージ通知", "個別メッセージを送るとき（将来連携用）"]
  ];
  return `
    <section class="admin-section-head">
      <div>
        <h3>設定・権限管理</h3>
        <p>管理者とスタッフで操作範囲を分け、操作履歴を保存します。</p>
      </div>
    </section>
    <article class="admin-preview line-notification-settings">
      <header>
        <div><p class="kicker">LINE notification</p><h3>LINE自動通知設定</h3></div>
        <span class="badge ${lineSettings?.enabled ? "status-success" : "status-warning"}">${lineSettingsStatus === "ready" ? (lineSettings.enabled ? "全体 ON" : "全体 OFF") : "確認中"}</span>
      </header>
      <p class="soft-note">TEAM LINKからお客様へ送る自動通知だけを制御します。お客様からのLINEメッセージ受信には影響しません。</p>
      ${lineSettingsStatus === "loading" || lineSettingsStatus === "pending" ? `<p>本番Settingsを取得しています…</p>` : ""}
      ${lineSettingsStatus === "error" ? `<div class="admin-empty"><strong>LINE通知設定を取得できませんでした</strong><button type="button" class="secondary-button" data-admin-action="reloadLineNotificationSettings">再取得</button></div>` : ""}
      ${lineSettingsStatus === "ready" && lineSettings ? `
        <label class="line-notification-master-switch">
          <span><strong>LINE自動通知 全体</strong><small>OFFの場合、個別設定がONでも送信しません</small></span>
          <input type="checkbox" data-line-notification-setting="enabled" ${lineSettings.enabled ? "checked" : ""} ${appState.lineNotificationSettingsBusy || !canEditLineSettings ? "disabled" : ""}>
        </label>
        <div class="line-notification-setting-list">
          ${lineSettingItems.map(([key, title, description]) => `
            <label>
              <span><strong>${escapeHtml(title)}</strong><small>${escapeHtml(description)}</small></span>
              <input type="checkbox" data-line-notification-setting="${escapeHtml(key)}" ${lineSettings[key] ? "checked" : ""} ${appState.lineNotificationSettingsBusy || !canEditLineSettings ? "disabled" : ""}>
            </label>
          `).join("")}
        </div>
        ${canEditLineSettings ? `<button type="button" class="primary-button" data-admin-action="saveLineNotificationSettings" ${appState.lineNotificationSettingsBusy ? "disabled" : ""}>${appState.lineNotificationSettingsBusy ? "保存中…" : "設定を保存する"}</button>` : `<p class="soft-note">設定変更は管理者のみ行えます。</p>`}
      ` : ""}
    </article>
    ${renderBookingNotificationEmailSettings(bookingEmailSettings, bookingEmailSettingsStatus, canEditLineSettings)}
    <div class="admin-grid">
      <article class="admin-card"><span>現在の権限</span><strong>${escapeHtml(session.label)}</strong><small>${session.role === "admin" ? "すべての閲覧・編集・削除が可能" : "来店確認、予約対応、クーポン確認のみ"}</small></article>
      <article class="admin-card"><span>予約先</span><strong>Hot Pepper</strong><small>${escapeHtml(settings.hotpepperReservationUrl || "未設定")}</small></article>
      <article class="admin-card"><span>営業時間</span><strong>${escapeHtml(settings.businessHours.start)}〜${escapeHtml(settings.businessHours.end)}</strong><small>定休日: 月曜</small></article>
      <article class="admin-card"><span>スタッフ設定</span><strong>${escapeHtml(settings.staff.length)}名</strong><small>担当者選択は設定データから生成</small></article>
      <article class="admin-card"><span>予約メニュー</span><strong>${escapeHtml(menus.length)}件</strong><small>通常メニュー／クーポンを同じ管理データで保持</small></article>
      <article class="admin-card"><span>データ基準</span><strong>memberId / lineUserId</strong><small>ブラウザ単位ではなく会員単位で管理</small></article>
    </div>
    <article class="admin-preview">
      <h3>操作履歴</h3>
      <div class="timeline">${logs.map((log) => `<div><small>${formatDateTime(log.createdAt)}</small><span>${escapeHtml(log.adminName)}: ${escapeHtml(log.message)}</span></div>`).join("") || "<p>履歴はまだありません</p>"}</div>
    </article>
  `;
}

function renderBookingNotificationEmailSettings(settings, status, canEdit) {
  const emails = Array.isArray(settings?.emails) ? settings.emails : [];
  return `
    <article class="admin-preview booking-notification-email-settings" id="bookingNotificationEmailSettings">
      <header>
        <div><p class="kicker">Booking email</p><h3>予約通知メール設定</h3></div>
        <span class="badge ${status === "ready" && emails.length ? "status-success" : "status-warning"}">${status === "ready" ? `${emails.length}件` : "確認中"}</span>
      </header>
      <p class="soft-note">TEAM LINKから予約希望が入った際に通知するメールアドレスを管理します。</p>
      ${status === "loading" || status === "pending" ? `<p>本番Settingsを取得しています…</p>` : ""}
      ${status === "error" ? `<div class="admin-empty"><strong>予約通知メール設定を取得できませんでした</strong><button type="button" class="secondary-button" data-admin-action="reloadBookingNotificationSettings">再取得</button></div>` : ""}
      ${status === "ready" ? `
        ${canEdit ? `
          <div class="booking-notification-email-list">
            <strong class="booking-notification-email-list-title">現在登録されているメールアドレス</strong>
            ${emails.map((email, index) => `
              <div class="booking-notification-email-row">
                <span>${escapeHtml(email)}</span>
                <button type="button" class="selection-remove-button" data-admin-action="removeBookingNotificationEmail" data-index="${index}">削除</button>
              </div>
            `).join("") || `<p class="booking-notification-email-empty">通知先を1件以上登録してください。</p>`}
          </div>
          <div class="booking-notification-email-add">
            <label>メールアドレス
              <input type="email" inputmode="email" autocomplete="email" data-booking-notification-email-input placeholder="example@example.com">
            </label>
            <button type="button" class="secondary-button" data-admin-action="addBookingNotificationEmail">＋ メールアドレスを追加</button>
          </div>
          <button type="button" class="primary-button" data-admin-action="saveBookingNotificationSettings" ${appState.bookingNotificationSettingsBusy ? "disabled" : ""}>${appState.bookingNotificationSettingsBusy ? "保存中…" : "予約通知メール設定を保存"}</button>
        ` : `<p class="soft-note">予約通知先の変更は管理者のみ行えます。現在 ${emails.length}件登録されています。</p>`}
      ` : ""}
    </article>
  `;
}

function handleAdminAction(button) {
  const action = button.dataset.adminAction;
  const id = button.dataset.id || "";
  if (action === "reloadLineNotificationSettings") return syncProductionLineNotificationSettings();
  if (action === "saveLineNotificationSettings") return saveLineNotificationSettings(button);
  if (action === "reloadBookingNotificationSettings") return syncProductionBookingNotificationSettings();
  if (action === "addBookingNotificationEmail") return addBookingNotificationEmail(button);
  if (action === "removeBookingNotificationEmail") return removeBookingNotificationEmail(button);
  if (action === "saveBookingNotificationSettings") return saveBookingNotificationSettings(button);
  if (action === "simulateVisit") return simulateVisitReception();
  if (action === "toggleVisitHistory") {
    appState.adminVisitShowHistory = !appState.adminVisitShowHistory;
    renderAdmin();
    return;
  }
  if (action === "applyMemberFilter") return applyMemberFilter();
  if (action === "confirmVisit") return confirmVisitReception(id);
  if (action === "renameVisit") return renameVisitReception(id);
  if (action === "markMessage") return updateVisitReceptionStatus(id, "対象外");
  if (action === "mergeMember") return mergeVisitReceptionMember(id);
  if (action === "cancelVisit") return updateVisitReceptionStatus(id, "取り消し");
  if (action === "memberDetail") return openMemberChart(id);
  if (action === "backToMembers") {
    appState.adminTab = "members";
    appState.adminMemberDetailId = "";
    renderAdmin();
    return;
  }
  if (action === "memberCoupons") {
    appState.adminTab = "coupons";
    renderAdmin();
    showToast(`会員 ${id} のクーポン確認へ移動しました。`);
    return;
  }
  if (action === "memberGacha") {
    appState.adminTab = "gacha";
    renderAdmin();
    showToast(`会員 ${id} のガチャ利用状況を確認できます。`);
    return;
  }
  if (action === "memberBooking") {
    appState.adminTab = "bookings";
    renderAdmin();
    showToast(`会員 ${id} の予約確認へ移動しました。`);
    return;
  }
  if (action === "memberChartTab") {
    appState.memberChartTab = button.dataset.tab || "basic";
    renderAdmin();
    return;
  }
  if (action === "editMemberBasic") return editMemberBasic(id);
  if (action === "chartConfirmVisit") return confirmMemberVisitToday(id);
  if (action === "chartAddVisit") return addMemberVisitHistory(id);
  if (action === "editVisitHistory") return editMemberVisitDate(id, Number(button.dataset.index));
  if (action === "memoVisitHistory") return memoMemberVisit(id, Number(button.dataset.index));
  if (action === "cancelVisitHistory") return cancelMemberVisit(id, Number(button.dataset.index));
  if (action === "chartCreateBooking") return createMemberBooking(id);
  if (action === "chartGrantCoupon") return grantMemberCoupon(id);
  if (action === "chartCreatePrivateCoupon") return grantMemberCoupon(id, true);
  if (action === "chartUseCoupon") return updateMemberCouponStatus(id, "使用済み");
  if (action === "chartUndoCoupon") return updateMemberCouponStatus(id, "未使用");
  if (action === "chartChangeCouponExpiry") return changeMemberCouponExpiry(id);
  if (action === "couponDetail") return showMemberCouponDetail(id);
  if (action === "chartOpenGacha") {
    appState.memberChartTab = "gacha";
    renderAdmin();
    return;
  }
  if (action === "chartUseGacha") return updateMemberGachaStatus(id, "使用済み");
  if (action === "chartUndoGacha") return updateMemberGachaStatus(id, "未使用");
  if (action === "chartChangeGachaPrize") return changeMemberGachaPrize(id);
  if (action === "cardDetail") return showCardDetail(id);
  if (action === "grantCollectionReward") return updateCollectionRewardState(id, button.dataset.rewardId, "付与済み");
  if (action === "receiveCollectionReward") return updateCollectionRewardState(id, button.dataset.rewardId, "受取済み");
  if (action === "chartAddMemo") return addMemberChartMemo(id);
  if (action === "chartEditMemo") return editMemberChartMemo(id, Number(button.dataset.index));
  if (action === "addMemo") return addMemberMemo(id);
  if (action === "toggleMemberStatus") return toggleMemberStatus(id);
  if (action === "bookingDetail") return showBookingDetail(id);
  if (action === "bookingMemberChart") return openMemberChart(id);
  if (action === "confirmFirstChoice") return openBookingResponseModal(id, "confirm");
  if (action === "confirmSecondChoice") return confirmBookingChoice(id, "second");
  if (action === "proposeBooking") return openBookingResponseModal(id, "needs_change");
  if (action === "closeBookingResponseModal") return closeBookingResponseModal();
  if (action === "submitBookingResponse") return submitBookingResponse(button, id, button.dataset.mode);
  if (action === "editBooking") return editBooking(id);
  if (action === "bookingWaiting") return updateBookingStatus(id, "お客様返答待ち");
  if (action === "bookingSalonBoard") return updateBookingStatus(id, "サロンボード入力済み");
  if (action === "bookingConfirmed") return confirmBookingAfterSalonBoard(id);
  if (action === "processCancelBooking") return updateBookingStatus(id, "cancelled");
  if (action === "bookingVisited") return updateBookingStatus(id, "来店済み");
  if (action === "createManualBooking") return createManualBooking();
  if (action === "replyBooking") return replyBooking(id);
  if (action === "completeBooking") return updateBookingStatus(id, "対応完了");
  if (action === "addReservationMenu") return editReservationMenu("");
  if (action === "editReservationMenu") return editReservationMenu(id);
  if (action === "duplicateReservationMenu") return duplicateReservationMenu(id);
  if (action === "toggleReservationMenuPublic") return toggleReservationMenuPublic(id);
  if (action === "moveReservationMenuUp") return moveReservationMenu(id, -1);
  if (action === "moveReservationMenuDown") return moveReservationMenu(id, 1);
  if (action === "deleteReservationMenu") return deleteReservationMenu(id);
  if (action === "addCoupon") return addAdminCoupon();
  if (action === "editCoupon") return editAdminCoupon(id);
  if (action === "duplicateCoupon") return duplicateAdminCoupon(id);
  if (action === "toggleCoupon") return toggleAdminCoupon(id);
  if (action === "endCoupon") return endAdminCoupon(id);
  if (action === "deleteCoupon") return deleteAdminCoupon(id);
  if (action === "grantCoupon") return grantCouponToMember(id);
  if (action === "grantCouponToMember") return grantCouponToMember("");
  if (action === "couponUsage") return showCouponUsage(id);
  if (action === "filterCoupons") {
    appState.adminCouponFilter = id || "公開中";
    renderAdmin();
    return;
  }
  if (action === "createGachaMonth") return createGachaMonth();
  if (action === "duplicateGachaMonth") return duplicateGachaMonth();
  if (action === "editRarityRates") return editGachaRarityRates();
  if (action === "resetMonthlyGachaTest") return resetMonthlyGachaTest();
  if (action === "runGachaTest") return runAdminGachaTest(button);
  if (action === "showGachaTestUseConfirmation") return showGachaTestUseConfirmation(id);
  if (action === "hideGachaTestUseConfirmation") return hideGachaTestUseConfirmation();
  if (action === "confirmGachaTestUse") return confirmGachaTestUse(id);
  if (action === "resetGachaTestData") return resetAdminGachaTestData();
  if (action === "editGachaCharacter") return editGachaCharacter(id);
  if (action === "setGachaPreviewTab") {
    appState.gachaPreviewMode = id || "card";
    if (button.closest("#gachaReveal")) closeGachaPreviewAnimation();
    updateGachaCharacterPreview();
    return;
  }
  if (action === "previewGachaAnimation") return previewCurrentGachaAnimation();
  if (action === "closeGachaPreviewAnimation") return closeGachaPreviewAnimation();
  if (action === "replayGachaPreviewAnimation") return previewCurrentGachaAnimation(true);
  if (action === "cancelGachaCharacterEdit") {
    appState.gachaCharacterEditId = "";
    renderAdmin();
    return;
  }
  if (action === "toggleGachaCharacter") return toggleGachaCharacter(id);
  if (action === "addGachaPrizeMaster") return editGachaPrizeMaster("");
  if (action === "editGachaPrizeMaster") return editGachaPrizeMaster(id);
  if (action === "toggleGachaPrizeMaster") return toggleGachaPrizeMaster(id);
  if (action === "editGachaPrize") return editGachaPrize(id);
  if (action === "toggleGachaCard") return toggleGachaCard(id);
  if (action === "guideGacha") return showToast(`会員 ${id} へLINEでガチャページを案内する設計です。`);
  if (action === "addFortune") return showToast("CSV取込または一括登録に対応しやすいFortuneDailyContent構造です。");
  if (action === "editFortune") return showToast("日付・TEAM LINKタイプごとの運勢データを編集する画面へ接続予定です。");
  if (action === "loungeDetail") return showToast("事前登録の詳細、開始通知希望、正式参加希望を確認できます。");
  if (action === "loungeNotify") return showToast("正式開始時の一斉案内対象へ追加しました。");
  if (action === "loungeCancel") return cancelLoungeEntry(id);
  if (action === "addNotice") return addAdminNotice();
  if (action === "toggleNotice") return toggleAdminNotice(id);
}

function handleBookingAction(button) {
  const action = button.dataset.bookingAction;
  const id = button.dataset.id || "";
  if (action === "openMyCoupons") {
    captureBookingDraft();
    appState.couponCategory = "マイクーポン";
    showView("coupons");
    return;
  }
  if (action === "changeRequest") return requestBookingChange(id);
  if (action === "cancelRequest") return requestBookingCancel(id);
  if (action === "openBookingConsultation") {
    appState.bookingConsultationOpenId = id;
    renderReservationStatus();
    return;
  }
  if (action === "closeBookingConsultation") {
    appState.bookingConsultationOpenId = "";
    renderReservationStatus();
    return;
  }
  if (action === "submitBookingConsultation") return submitBookingConsultation(button, id);
}

async function submitBookingConsultation(button, bookingRequestId) {
  if (!bookingRequestId || appState.bookingConsultationBusy) return false;
  const panel = button.closest("[data-booking-consultation-panel]");
  const consultationType = String(panel?.querySelector("[data-booking-consultation-type]")?.value || "").trim();
  const consultationComment = String(panel?.querySelector("[data-booking-consultation-comment]")?.value || "").trim();
  if (!consultationType) {
    showToast("相談内容を選択してください。");
    return false;
  }
  if (!consultationComment) {
    showToast("相談コメントを入力してください。");
    panel?.querySelector("[data-booking-consultation-comment]")?.focus();
    return false;
  }
  const booking = readJson(STORAGE_KEYS.bookings, []).find((item) => String(item.bookingRequestId || item.requestId || "") === String(bookingRequestId));
  if (!booking) {
    showToast("予約情報を取得できませんでした。");
    return false;
  }
  const profile = getProfile();
  const now = new Date().toISOString();
  const consultation = {
    consultationId: createId("BC"),
    bookingRequestId,
    memberId: booking.memberId || profile.memberId || getCurrentUserKey(),
    lineUserId: booking.lineUserId || profile.lineUserId || "",
    userId: booking.userId || getCurrentUserKey(),
    userKey: getCurrentUserKey(),
    consultationType,
    consultationComment,
    status: "pending",
    sentAt: now,
    createdAt: now,
    updatedAt: now
  };
  appState.bookingConsultationBusy = true;
  const originalLabel = button.textContent;
  button.disabled = true;
  button.textContent = "送信中…";
  try {
    if (isProductionApiMode()) {
      const result = await apiRequest("submitBookingConsultation", consultation);
      consultation.consultationId = result.data?.consultationId || result.consultationId || consultation.consultationId;
    }
    const consultations = readJson(STORAGE_KEYS.bookingConsultations, []);
    if (!consultations.some((item) => String(item.consultationId) === String(consultation.consultationId))) consultations.unshift(consultation);
    writeJson(STORAGE_KEYS.bookingConsultations, consultations);
    appState.bookingConsultationOpenId = "";
    renderReservationStatus();
    showToast("予約変更の相談を送信しました。現在の予約はまだ変更されていません。");
    return true;
  } catch (error) {
    console.error("[TEAM LINK BOOKING CONSULTATION FAILED]", error);
    showToast("予約相談を送信できませんでした。もう一度お試しください。");
    return false;
  } finally {
    appState.bookingConsultationBusy = false;
    if (button.isConnected) {
      button.disabled = false;
      button.textContent = originalLabel;
    }
  }
}

function createAdminSession(adminId, now = Date.now()) {
  const admin = adminUsers[String(adminId || "")];
  if (!admin) return null;
  const loggedInAt = new Date(now).toISOString();
  return {
    ...admin,
    sessionVersion: ADMIN_SESSION_VERSION,
    loggedInAt,
    expiresAt: new Date(now + ADMIN_SESSION_TTL_MS).toISOString()
  };
}

function saveAdminSession(adminId, now = Date.now()) {
  const session = createAdminSession(adminId, now);
  if (!session) return null;
  writeJson(STORAGE_KEYS.adminSession, session);
  return session;
}

function clearAdminSession() {
  localStorage.removeItem(STORAGE_KEYS.adminSession);
}

function getAdminSession(now = Date.now()) {
  const stored = readJson(STORAGE_KEYS.adminSession, null);
  if (!stored) return null;
  const admin = adminUsers[String(stored.adminId || "")];
  if (!admin) {
    clearAdminSession();
    return null;
  }
  const loggedInTime = Date.parse(String(stored.loggedInAt || ""));
  let expiresAtTime = Date.parse(String(stored.expiresAt || ""));
  if (!Number.isFinite(expiresAtTime) && Number.isFinite(loggedInTime)) {
    expiresAtTime = loggedInTime + ADMIN_SESSION_TTL_MS;
  }
  if (!Number.isFinite(expiresAtTime) || now >= expiresAtTime) {
    clearAdminSession();
    return null;
  }
  const session = {
    ...admin,
    sessionVersion: ADMIN_SESSION_VERSION,
    loggedInAt: Number.isFinite(loggedInTime) ? new Date(loggedInTime).toISOString() : new Date(now).toISOString(),
    expiresAt: new Date(expiresAtTime).toISOString()
  };
  if (stored.sessionVersion !== ADMIN_SESSION_VERSION || stored.role !== admin.role || stored.expiresAt !== session.expiresAt) {
    writeJson(STORAGE_KEYS.adminSession, session);
  }
  return session;
}

function getAdminCounts() {
  const receptions = getVisitReceptions();
  const todayReceptions = receptions.filter((item) => isToday(item.receivedAt));
  const bookings = readJson(STORAGE_KEYS.bookings, []);
  const draws = readJson(STORAGE_KEYS.monthlyGachaDraws, []);
  const coupons = readJson(STORAGE_KEYS.myCoupons, []);
  const entries = getLoungeEntries();
  return {
    dashboard: todayReceptions.filter((item) => item.status === "確認待ち").length + bookings.filter((booking) => ["予約希望", "確認待ち", "日時変更相談", "変更依頼", "キャンセル依頼"].includes(normalizeBookingStatus(booking.status))).length,
    visits: todayReceptions.filter((item) => item.status === "確認待ち").length,
    members: 0,
    bookings: bookings.filter((booking) => ["予約希望", "確認待ち", "日時変更相談", "変更依頼", "キャンセル依頼", "別日時提案中", "お客様返答待ち"].includes(normalizeBookingStatus(booking.status))).length,
    reservationMenus: getReservationMenus().filter((menu) => menu.isPublic === false).length,
    coupons: coupons.filter((coupon) => getCouponStatus(coupon) === "使用可能").length,
    gacha: getMembers().filter((member) => !getMemberGachaStatus(member).used).length,
    fortune: 0,
    lounge: entries.length,
    notices: readJson(STORAGE_KEYS.adminNotices, []).filter((notice) => notice.status === "下書き").length,
    settings: 0,
    visitCandidates: todayReceptions.filter((item) => item.status !== "通常メッセージ" && item.status !== "取り消し").length,
    unconfirmedVisits: todayReceptions.filter((item) => item.status === "確認待ち").length,
    newBookings: bookings.filter((booking) => ["予約希望", "確認待ち", "日時変更相談", "変更依頼", "キャンセル依頼"].includes(normalizeBookingStatus(booking.status))).length,
    replyWaitingBookings: bookings.filter((booking) => ["別日時提案中", "お客様返答待ち"].includes(normalizeBookingStatus(booking.status))).length,
    todayConfirmedBookings: bookings.filter((booking) => ["サロンボード入力済み", "予約確定"].includes(normalizeBookingStatus(booking.status)) && isToday(getBookingDisplayDateTime(booking))).length,
    monthlyGachaUsers: draws.filter((draw) => draw.issueMonth === currentMonthKey()).length,
    unusedCoupons: coupons.filter((coupon) => getCouponStatus(coupon) === "使用可能").length,
    loungeEntries: getLoungeCount(),
    unreadInquiries: 2
  };
}

function buildOperationDashboard() {
  const members = getMembers();
  const receptions = getVisitReceptions();
  const bookings = readJson(STORAGE_KEYS.bookings, []);
  const cards = readJson(STORAGE_KEYS.gachaCardHistory, []);
  const draws = readJson(STORAGE_KEYS.monthlyGachaDraws, []);
  const coupons = readJson(STORAGE_KEYS.myCoupons, []);
  const notices = readJson(STORAGE_KEYS.adminNotices, []);
  const month = currentMonthKey();
  const year = currentYear();
  const monthCards = cards.filter((card) => card.issueMonth === month);
  const yearCards = cards.filter((card) => getGachaLifecycleState(card) === "used" && String(card.issueMonth || "").startsWith(String(year)));
  const bookingNeedsAction = bookings.filter((booking) => ["予約希望", "確認待ち", "日時変更相談", "変更依頼", "キャンセル依頼"].includes(normalizeBookingStatus(booking.status)));
  const rewardStates = members.flatMap((member) => getCollectionRewardStates(member, getMemberCardHistory(member).filter((card) => getGachaLifecycleState(card) === "used")).map((reward) => ({ member, reward })));
  const expiringCards = cards.filter((card) => getGachaLifecycleState(card) === "available" && isExpiringSoon(card.validUntil || card.expires));
  const expiringCoupons = coupons.filter((coupon) => String(coupon.status || "未使用") === "未使用" && isExpiringSoon(coupon.expires || coupon.validUntil));
  const plannedTodayCoupons = coupons.filter((coupon) => getCouponStatus(coupon) === "予約で使用予定" && bookings.some((booking) => (
    String(booking.reservationId || booking.requestId) === String(coupon.reservationId || "") &&
    isToday(getBookingDisplayDateTime(booking))
  )));
  const todayUsedCoupons = coupons.filter((coupon) => getCouponStatus(coupon) === "使用済み" && isToday(coupon.usedAt));
  const rarity = { UR: 0, SSR: 0, SR: 0, R: 0, N: 0 };
  monthCards.forEach((card) => { rarity[card.rarity] = Number(rarity[card.rarity] || 0) + 1; });
  return {
    todo: {
      unconfirmedVisits: receptions.filter((item) => isToday(item.receivedAt) && item.status === "確認待ち").length,
      bookingNeedsAction: bookingNeedsAction.length,
      changeCancelRequests: bookings.filter((booking) => ["変更依頼", "キャンセル依頼"].includes(normalizeBookingStatus(booking.status))).length,
      rewardAchievers: rewardStates.filter(({ reward }) => reward.state === "達成").length,
      expiringCards: expiringCards.length,
      expiringCoupons: expiringCoupons.length,
      plannedCouponsToday: plannedTodayCoupons.length,
      usedCouponsToday: todayUsedCoupons.length,
      pendingNotices: notices.filter((notice) => notice.status === "下書き").length
    },
    today: {
      visitReceptions: receptions.filter((item) => isToday(item.receivedAt)).length,
      unconfirmedVisits: receptions.filter((item) => isToday(item.receivedAt) && item.status === "確認待ち").length,
      confirmedBookings: bookings.filter((booking) => ["サロンボード入力済み", "予約確定"].includes(normalizeBookingStatus(booking.status)) && isToday(getBookingDisplayDateTime(booking))).length,
      bookingRequests: bookings.filter((booking) => isToday(booking.receivedAt || booking.createdAt)).length,
      cardUses: cards.filter((card) => getGachaLifecycleState(card) === "used" && isToday(card.usedAt)).length,
      plannedCoupons: plannedTodayCoupons.length,
      usedCoupons: todayUsedCoupons.length
    },
    month: {
      gachaUsers: draws.filter((draw) => draw.issueMonth === month).length,
      gachaUnused: Math.max(0, members.length - draws.filter((draw) => draw.issueMonth === month).length),
      rarityText: `UR ${rarity.UR} / SSR ${rarity.SSR} / SR ${rarity.SR} / R ${rarity.R} / N ${rarity.N}`,
      couponUses: coupons.filter((coupon) => String(coupon.status) === "使用済み" && String(coupon.usedAt || "").startsWith(month)).length,
      unusedCoupons: coupons.filter((coupon) => getCouponStatus(coupon) === "使用可能").length,
      gachaCoupons: coupons.filter((coupon) => coupon.sourceType === "gacha-card" || coupon.source === "ガチャ").length,
      collectionCoupons: coupons.filter((coupon) => coupon.sourceType === "collection-reward" || coupon.source === "年間特典").length,
      newMembers: members.filter((member) => String(member.createdAt || "").startsWith(month)).length,
      bookingRequests: bookings.filter((booking) => String(booking.receivedAt || booking.createdAt || "").startsWith(month)).length
    },
    year: {
      cards: yearCards.length,
      rewardAchievers: rewardStates.filter(({ reward }) => ["達成", "付与済み", "受取済み"].includes(reward.state)).length,
      rewardUnreceived: rewardStates.filter(({ reward }) => ["達成", "付与済み"].includes(reward.state)).length,
      ssrMembers: new Set(yearCards.filter((card) => card.rarity === "SSR").map((card) => card.memberId)).size
    }
  };
}

function isExpiringSoon(value) {
  const text = String(value || "");
  if (!/\\d{4}-\\d{2}-\\d{2}/.test(text)) return false;
  const today = new Date(`${jstDateKey()}T00:00:00+09:00`);
  const date = new Date(`${text.slice(0, 10)}T00:00:00+09:00`);
  return date.getTime() >= today.getTime() && date.getTime() - today.getTime() <= 7 * 86400000;
}

function simulateVisitReception() {
  const samples = ["山田 花子", "佐藤 美咲", "予約したい", "今日は空いていますか？", "鈴木 玲奈"];
  const text = samples[Math.floor(Math.random() * samples.length)];
  const lineUserId = `U-demo-${Math.floor(Math.random() * 3) + 1}`;
  const candidate = buildVisitReceptionFromLine({
    lineUserId,
    lineDisplayName: `LINEユーザー${lineUserId.slice(-1)}`,
    text,
    receivedAt: new Date().toISOString()
  });
  if (!candidate) {
    showToast(`「${text}」は通常メッセージとして扱いました。`);
    return;
  }
  const receptions = getVisitReceptions();
  writeJson(STORAGE_KEYS.visitReceptions, [candidate, ...receptions]);
  addAdminLog("visit_candidate", `${candidate.sentName} を来店受付候補に追加`, getAdminSession()?.name);
  renderAdmin();
  showToast("LINEからの名前送信を来店受付候補に追加しました。");
}

function buildVisitReceptionFromLine(event) {
  const text = String(event.text || "").trim();
  if (!isNameLikeLineText(text)) return null;
  const members = getMembers();
  let member = members.find((item) => item.lineUserId === event.lineUserId);
  const isNew = !member;
  if (!member) {
    member = createTemporaryMember(event.lineUserId, event.lineDisplayName, text);
    members.unshift(member);
    writeJson(STORAGE_KEYS.members, members);
  }
  return {
    receptionId: createId("VISIT"),
    lineUserId: event.lineUserId,
    memberId: member.memberId,
    sentName: text,
    registeredName: member.realName || "",
    lineDisplayName: event.lineDisplayName || member.lineDisplayName || "",
    receptionType: isNew ? "新規" : "既存",
    receivedAt: event.receivedAt || new Date().toISOString(),
    status: "確認待ち"
  };
}

function isNameLikeLineText(text) {
  if (!text) return false;
  if (/https?:\/\/|www\.|@|予約|空いて|カラー|ありがとう|キャンセル|変更|相談|クーポン|ガチャ|占い|ご縁/.test(text)) return false;
  if ([...text].length > 12) return false;
  if (!/[ぁ-んァ-ン一-龥A-Za-z]/.test(text)) return false;
  if (/^[\p{Emoji_Presentation}\p{Extended_Pictographic}\s]+$/u.test(text)) return false;
  return true;
}

function createTemporaryMember(lineUserId, lineDisplayName, sentName) {
  const nextNumber = getMembers().length + 1;
  const now = jstDateKey();
  return {
    memberId: `TL-${String(nextNumber).padStart(6, "0")}`,
    lineUserId,
    lineDisplayName,
    nickname: sentName,
    realName: sentName,
    phone: "",
    createdAt: now,
    updatedAt: now,
    lastVisitDate: "",
    visitCount: 0,
    memberStatus: "仮会員",
    status: "有効",
    adminMemo: ""
  };
}

async function confirmVisitReception(receptionId) {
  if (isProductionApiMode()) {
    try {
      await apiRequest("confirmVisitReception", { receptionId });
      await syncProductionVisitReceptions({ render: false });
      renderApp();
      showToast("来店を確認しました。正式な来店履歴へ反映しました。");
    } catch (error) {
      console.error("[TEAM LINK VISIT CONFIRM FAILED]", error);
      showToast(error?.message || "来店確認に失敗しました。");
    }
    return;
  }
  const receptions = getVisitReceptions();
  const reception = receptions.find((item) => item.receptionId === receptionId);
  if (!reception) return;
  const wasConfirmed = reception.status === "確認済み";
  reception.status = "確認済み";
  reception.confirmedAt = new Date().toISOString();
  const members = getMembers();
  const member = members.find((item) => item.memberId === reception.memberId);
  let addedVisit = false;
  if (member) {
    const today = jstDateKey();
    const visits = member.visitHistory || [];
    if (!visits.some((visit) => visit.date === today)) {
      visits.unshift({ date: today, source: "LINE来店受付", receptionId });
      member.visitHistory = visits;
      member.visitCount = Number(member.visitCount || 0) + 1;
      addedVisit = true;
    }
    member.realName = member.realName || reception.sentName;
    member.lastVisitDate = today;
    member.updatedAt = today;
    writeJson(STORAGE_KEYS.members, members);
    syncProfileFromMember(member);
    completeSingleTodayBookingForMember(member);
  }
  writeJson(STORAGE_KEYS.visitReceptions, receptions);
  addAdminLog("confirm_visit", `${reception.sentName} の来店を確認`, getAdminSession()?.name);
  renderApp();
  if (wasConfirmed || !addedVisit) {
    showToast("本日はすでに来店確認済みです。");
    return;
  }
  showToast(`${reception.sentName}さんの来店を確認しました。来店回数を更新しました。最終来店日を本日に更新しました。`);
}

function renameVisitReception(receptionId) {
  const receptions = getVisitReceptions();
  const reception = receptions.find((item) => item.receptionId === receptionId);
  if (!reception) return;
  const nextName = window.prompt("修正後の氏名を入力してください", reception.sentName);
  if (!nextName) return;
  reception.sentName = nextName.trim();
  const members = getMembers();
  const member = members.find((item) => item.memberId === reception.memberId);
  if (member) member.realName = nextName.trim();
  writeJson(STORAGE_KEYS.members, members);
  writeJson(STORAGE_KEYS.visitReceptions, receptions);
  addAdminLog("rename_visit", `${reception.memberId} の氏名を修正`, getAdminSession()?.name);
  renderApp();
}

async function updateVisitReceptionStatus(receptionId, status) {
  if (isProductionApiMode()) {
    try {
      await apiRequest("updateVisitReceptionStatus", { receptionId, status: status === "対象外" ? "excluded" : status });
      await syncProductionVisitReceptions({ render: false });
      renderApp();
      showToast("メッセージを対象外にしました。");
    } catch (error) {
      console.error("[TEAM LINK VISIT STATUS FAILED]", error);
      showToast(error?.message || "状態を更新できませんでした。");
    }
    return;
  }
  const receptions = getVisitReceptions();
  const reception = receptions.find((item) => item.receptionId === receptionId);
  if (!reception) return;
  reception.status = status;
  reception.updatedAt = new Date().toISOString();
  writeJson(STORAGE_KEYS.visitReceptions, receptions);
  addAdminLog("update_visit", `${reception.sentName} を${status}に変更`, getAdminSession()?.name);
  renderAdmin();
}

function mergeVisitReceptionMember(receptionId) {
  const receptions = getVisitReceptions();
  const reception = receptions.find((item) => item.receptionId === receptionId);
  if (!reception) return;
  const nextMemberId = window.prompt("統合先の会員IDを入力してください", "TL-000001");
  if (!nextMemberId) return;
  if (!findMember(nextMemberId.trim())) {
    showToast("指定した会員IDが見つかりません。");
    return;
  }
  reception.memberId = nextMemberId.trim();
  reception.receptionType = "既存";
  writeJson(STORAGE_KEYS.visitReceptions, receptions);
  addAdminLog("merge_member", `${reception.sentName} を ${nextMemberId} へ統合`, getAdminSession()?.name);
  renderAdmin();
}

function openMemberChart(memberId) {
  const member = findMember(memberId);
  if (!member) {
    showToast("会員情報が見つかりません。");
    return;
  }
  appState.adminMemberDetailId = memberId;
  appState.adminTab = "memberDetail";
  appState.memberChartTab = appState.memberChartTab || "basic";
  renderAdmin();
}

function editMemberBasic(memberId) {
  const members = getMembers();
  const member = members.find((item) => item.memberId === memberId);
  if (!member) return;
  const fields = [
    ["realName", "登録氏名"],
    ["lineDisplayName", "LINE表示名"],
    ["phone", "電話番号"],
    ["staff", "担当スタッフ"],
    ["status", "会員状態"],
    ["adminMemo", "管理者メモ"],
    ["visitCycle", "来店頻度の目安"],
    ["recommendedMenu", "おすすめメニュー"],
    ["caution", "注意事項"]
  ];
  fields.forEach(([key, label]) => {
    const nextValue = window.prompt(`${label}を入力してください`, member[key] || "");
    if (nextValue !== null) member[key] = nextValue.trim();
  });
  member.updatedAt = jstDateKey();
  writeJson(STORAGE_KEYS.members, members);
  syncProfileFromMember(member);
  addAdminLog("member_update", `${member.realName || member.memberId} の基本情報を編集`, getAdminSession()?.name, member.memberId);
  renderApp();
}

function confirmMemberVisitToday(memberId) {
  const members = getMembers();
  const member = members.find((item) => item.memberId === memberId);
  if (!member) return;
  const result = appendMemberVisit(member, {
    source: "会員カルテ",
    adminName: getAdminSession()?.name || "",
    memo: "カルテから来店確認"
  });
  writeJson(STORAGE_KEYS.members, members);
  syncProfileFromMember(member);
  if (result.added) completeSingleTodayBookingForMember(member);
  addAdminLog("visit_confirm", `${member.realName || member.memberId} の来店を確認`, getAdminSession()?.name, member.memberId);
  renderApp();
  showToast(result.added ? `${member.realName}さんの来店を確認しました。` : "本日はすでに来店確認済みです。");
}

function addMemberVisitHistory(memberId) {
  const members = getMembers();
  const member = members.find((item) => item.memberId === memberId);
  if (!member) return;
  const date = window.prompt("来店日を入力してください（例: 2026-07-30）", jstDateKey());
  if (!date) return;
  const result = appendMemberVisit(member, {
    date: date.trim(),
    source: "手動追加",
    adminName: getAdminSession()?.name || "",
    memo: window.prompt("備考を入力してください", "") || ""
  });
  writeJson(STORAGE_KEYS.members, members);
  syncProfileFromMember(member);
  addAdminLog("visit_add", `${member.realName || member.memberId} の来店履歴を追加`, getAdminSession()?.name, member.memberId);
  renderApp();
  showToast(result.added ? "来店履歴を追加しました。" : "同じ日付の来店履歴があるため追加しませんでした。");
}

function appendMemberVisit(member, options = {}) {
  const date = options.date || jstDateKey();
  const visits = member.visitHistory || [];
  if (visits.some((visit) => visit.date === date)) return { added: false };
  const previous = visits.slice().sort((a, b) => String(b.date).localeCompare(String(a.date)))[0];
  visits.unshift({
    date,
    receivedAt: formatReceptionTime(new Date().toISOString()),
    confirmedAt: formatReceptionTime(new Date().toISOString()),
    adminName: options.adminName || "",
    source: options.source || "手動",
    daysSincePrevious: previous?.date ? `${daysBetween(previous.date, date)}日` : "-",
    memo: options.memo || ""
  });
  member.visitHistory = visits;
  member.visitCount = Number(member.visitCount || 0) + 1;
  member.lastVisitDate = visits.slice().sort((a, b) => String(b.date).localeCompare(String(a.date)))[0].date;
  member.updatedAt = jstDateKey();
  return { added: true };
}

function editMemberVisitDate(memberId, index) {
  const members = getMembers();
  const member = members.find((item) => item.memberId === memberId);
  const visit = member?.visitHistory?.[index];
  if (!visit) return;
  const nextDate = window.prompt("修正後の来店日を入力してください", visit.date);
  if (!nextDate) return;
  if (member.visitHistory.some((item, itemIndex) => itemIndex !== index && item.date === nextDate.trim())) {
    showToast("同じ日付の来店履歴があるため変更できません。");
    return;
  }
  visit.date = nextDate.trim();
  member.lastVisitDate = member.visitHistory.slice().sort((a, b) => String(b.date).localeCompare(String(a.date)))[0]?.date || "";
  member.updatedAt = jstDateKey();
  writeJson(STORAGE_KEYS.members, members);
  addAdminLog("visit_edit", `${member.realName || member.memberId} の来店日を修正`, getAdminSession()?.name, member.memberId);
  renderApp();
}

function memoMemberVisit(memberId, index) {
  const members = getMembers();
  const member = members.find((item) => item.memberId === memberId);
  const visit = member?.visitHistory?.[index];
  if (!visit) return;
  const memo = window.prompt("来店履歴の備考を入力してください", visit.memo || "");
  if (memo === null) return;
  visit.memo = memo;
  member.updatedAt = jstDateKey();
  writeJson(STORAGE_KEYS.members, members);
  addAdminLog("visit_memo", `${member.realName || member.memberId} の来店備考を更新`, getAdminSession()?.name, member.memberId);
  renderApp();
}

function cancelMemberVisit(memberId, index) {
  const members = getMembers();
  const member = members.find((item) => item.memberId === memberId);
  if (!member?.visitHistory?.[index]) return;
  const removed = member.visitHistory.splice(index, 1)[0];
  member.visitCount = Math.max(0, Number(member.visitCount || 0) - 1);
  member.lastVisitDate = member.visitHistory.slice().sort((a, b) => String(b.date).localeCompare(String(a.date)))[0]?.date || "";
  member.updatedAt = jstDateKey();
  writeJson(STORAGE_KEYS.members, members);
  syncProfileFromMember(member);
  addAdminLog("visit_cancel", `${member.realName || member.memberId} の${removed.date}来店を取り消し`, getAdminSession()?.name, member.memberId);
  renderApp();
}

function createMemberBooking(memberId) {
  const member = findMember(memberId);
  if (!member) return;
  const menu = window.prompt("メニューを入力してください", member.recommendedMenu || "カット＋カラー");
  if (!menu) return;
  const firstDateTime = window.prompt("来店予定日時を入力してください（例: 2026-08-12T13:00）", "2026-08-12T13:00");
  if (!firstDateTime) return;
  const staffName = window.prompt("担当者を入力してください", formatStaffDisplayName(member.staff || member.preferredStaff) || "村松剛好") || "";
  const source = window.prompt("予約元を入力してください（Hot Pepper / TEAM LINK相談 / LINEチャット / 電話 / 店頭次回予約 / その他）", "店頭次回予約") || "その他";
  const bookings = readJson(STORAGE_KEYS.bookings, []);
  bookings.unshift({
    requestId: createId("REQ"),
    reservationId: createId("RSV"),
    lineUserId: member.lineUserId || "",
    memberId: member.memberId,
    customerName: member.realName || member.nickname,
    menu,
    staff: staffName,
    couponTitle: window.prompt("使用クーポンがあれば入力してください", "") || "",
    firstDateTime,
    secondDateTime: "",
    memo: window.prompt("備考を入力してください", "") || "",
    reservationSource: source,
    source,
    requestType: "手動予約",
    referenceAmount: 0,
    totalMinutes: 0,
    status: "予約希望",
    createdAt: new Date().toISOString(),
    receivedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  writeJson(STORAGE_KEYS.bookings, bookings);
  addAdminLog("booking_create", `${member.realName || member.memberId} の予約を作成`, getAdminSession()?.name, member.memberId);
  appState.memberChartTab = "bookings";
  renderApp();
}

function createManualBooking() {
  const memberId = window.prompt("会員IDを入力してください", "TL-000001");
  if (!memberId) return;
  createMemberBooking(memberId.trim());
  appState.adminTab = "bookings";
}

async function grantMemberCoupon(memberId, isPrivate = false) {
  const member = findMember(memberId);
  if (!member) return;
  if (isPrivate) {
    const title = window.prompt("個別クーポン名を入力してください", "個別クーポン");
    if (!title) return;
    const coupon = normalizeCouponDefinition({
      couponId: createId("PRIVATE-COUPON"),
      title,
      description: window.prompt("説明を入力してください", "") || "",
      couponType: "個別付与クーポン",
      category: "個別付与",
      discountAmount: promptNumber("割引額を入力してください", 500) || 0,
      targetMenu: "全メニュー",
      validUntil: window.prompt("利用期限を入力してください", endOfMonthDateKey()) || endOfMonthDateKey(),
      condition: window.prompt("利用条件を入力してください", "1会計につき1枚") || "",
      source: "スタッフ手動付与",
      isPublic: false,
      selectableOnBooking: true
    });
    if (isProductionApiMode()) {
      try {
        showToast("保存しています…");
        await apiRequest("createCouponMaster", {
          ...coupon,
          couponName: coupon.title,
          validFrom: coupon.validStartAt,
          usageLimit: coupon.perUserLimit,
          allowCombination: coupon.canCombine,
          issueType: coupon.source,
          displayOrder: coupon.sortOrder,
          status: "stopped",
          transactionId: createTransactionId("PRIVATE-COUPON")
        });
        const result = await apiRequest("grantMemberCoupon", {
          memberId: member.memberId,
          lineUserId: member.lineUserId || "",
          couponId: coupon.couponId,
          validUntil: coupon.validUntil,
          sourceType: "manual",
          note: "個別クーポン作成",
          transactionId: createTransactionId("COUPON-GRANT")
        });
        mergeServerMemberCoupon(result.memberCoupon);
      } catch (error) {
        showToast("通信に失敗しました。時間をおいてもう一度お試しください");
        return;
      }
    } else {
      grantCouponDefinitionToMember(coupon, member, { reason: "個別クーポン作成", staffName: getAdminSession()?.name || "スタッフ" });
    }
  } else {
    const coupons = getAdminCoupons();
    const list = coupons.map((coupon, index) => `${index + 1}: ${coupon.title}`).join("\n");
    const selected = window.prompt(`付与するクーポン番号を入力してください\n${list}`, "1");
    const coupon = coupons[Number(selected) - 1];
    if (!coupon) return;
    const reason = window.prompt("付与理由を入力してください", "会員カルテから付与") || "会員カルテから付与";
    if (isProductionApiMode()) {
      try {
        showToast("保存しています…");
        const result = await apiRequest("grantMemberCoupon", {
          memberId: member.memberId,
          lineUserId: member.lineUserId || "",
          couponId: coupon.couponId,
          validUntil: coupon.validUntil,
          sourceType: "manual",
          note: reason,
          transactionId: createTransactionId("COUPON-GRANT")
        });
        mergeServerMemberCoupon(result.memberCoupon);
      } catch (error) {
        showToast("通信に失敗しました。時間をおいてもう一度お試しください");
        return;
      }
    } else {
      grantCouponDefinitionToMember(coupon, member, {
        reason,
        staffName: getAdminSession()?.name || "スタッフ"
      });
    }
  }
  addAdminLog("coupon_grant", `${member.realName || member.memberId} にクーポンを付与`, getAdminSession()?.name, member.memberId);
  appState.memberChartTab = "coupons";
  renderApp();
}

async function updateMemberCouponStatus(couponId, status) {
  const coupons = readJson(STORAGE_KEYS.myCoupons, []);
  const coupon = coupons.find((item) => String(item.couponId || item.drawId) === String(couponId));
  if (!coupon) return;
  if (status === "使用済み" && getCouponStatus(coupon) === "使用済み") {
    showToast("このクーポンはすでに使用済みです。");
    return;
  }
  if (status === "使用済み") {
    const ok = window.confirm(`${coupon.title}を使用済みにしますか？\nお客様自身では取り消せない操作です。`);
    if (!ok) return;
    coupon.usedShop = getStoreSettings().shopName;
    coupon.usedMenu = window.prompt("使用メニューを入力してください", coupon.targetMenu || "") || "";
    coupon.usedStaff = window.prompt("担当スタッフを入力してください", getAdminSession()?.name || "") || "";
    coupon.confirmedByStaff = getAdminSession()?.name || "スタッフ";
    coupon.usageMemo = window.prompt("備考を入力してください", "") || "";
  } else {
    const session = getAdminSession();
    if (session?.role !== "admin" && !window.confirm("使用取り消しは管理者確認が必要です。デモとして続行しますか？")) return;
  }
  if (isProductionApiMode()) {
    try {
      showToast(status === "使用済み" ? "クーポンを確認しています…" : "保存しています…");
      const action = status === "使用済み" ? "useMemberCoupon" : "undoUseMemberCoupon";
      const result = await apiRequest(action, {
        memberCouponId: coupon.memberCouponId || coupon.couponId,
        memberId: coupon.memberId || "",
        bookingId: coupon.reservationId || "",
        usedStore: coupon.usedShop || getStoreSettings().shopName,
        usedByStaff: coupon.confirmedByStaff || getAdminSession()?.name || "",
        note: coupon.usageMemo || "",
        transactionId: createTransactionId(status === "使用済み" ? "COUPON-USE" : "COUPON-UNDO")
      });
      mergeServerMemberCoupon(result.memberCoupon);
      addAdminLog(status === "使用済み" ? "coupon_use" : "coupon_undo", `${coupon.title} を${status}に変更`, getAdminSession()?.name, coupon.memberId || "");
      renderApp();
      return;
    } catch (error) {
      showToast("通信に失敗しました。時間をおいてもう一度お試しください");
      return;
    }
  }
  coupon.status = status;
  coupon.usedAt = status === "使用済み" ? new Date().toISOString() : "";
  if (status === "未使用") {
    coupon.reservationStatus = "";
    coupon.reservationId = "";
    coupon.usedMenu = "";
    coupon.usedStaff = "";
    coupon.confirmedByStaff = "";
  }
  coupon.updatedAt = new Date().toISOString();
  writeJson(STORAGE_KEYS.myCoupons, coupons);
  syncLinkedCouponUsage(coupon, status);
  addAdminLog(status === "使用済み" ? "coupon_use" : "coupon_undo", `${coupon.title} を${status}に変更`, getAdminSession()?.name, coupon.memberId || "");
  renderApp();
}

function changeMemberCouponExpiry(couponId) {
  const coupons = readJson(STORAGE_KEYS.myCoupons, []);
  const coupon = coupons.find((item) => String(item.couponId || item.drawId) === String(couponId));
  if (!coupon) return;
  const expires = window.prompt("新しい利用期限を入力してください", coupon.expires || coupon.validUntil || "");
  if (!expires) return;
  coupon.expires = expires;
  coupon.updatedAt = new Date().toISOString();
  writeJson(STORAGE_KEYS.myCoupons, coupons);
  addAdminLog("coupon_expiry", `${coupon.title} の期限を変更`, getAdminSession()?.name, coupon.memberId || "");
  renderApp();
}

function showMemberCouponDetail(couponId) {
  const coupon = readJson(STORAGE_KEYS.myCoupons, []).find((item) => String(item.couponId || item.drawId) === String(couponId));
  if (!coupon) return;
  window.alert([
    `クーポン名：${coupon.title}`,
    `状態：${getCouponStatus(coupon)}`,
    `発行元：${coupon.source || coupon.sourceType || "-"}`,
    `付与日時：${formatDateTime(coupon.createdAt || coupon.grantedAt)}`,
    `利用期限：${formatDateUntil(coupon.expires || coupon.validUntil)}`,
    `使用日時：${formatDateTime(coupon.usedAt) || "-"}`,
    `予約ID：${coupon.reservationId || "-"}`,
    `カードID：${coupon.sourceId || coupon.cardHistoryId || "-"}`
  ].join("\n"));
}

async function updateMemberGachaStatus(drawId, status) {
  const draws = readJson(STORAGE_KEYS.monthlyGachaDraws, []);
  const history = readJson(STORAGE_KEYS.gachaCardHistory, []);
  const draw = draws.find((item) => item.drawId === drawId || item.cardHistoryId === drawId) || history.find((item) => item.drawId === drawId || item.cardHistoryId === drawId);
  if (!draw) return;
  const nextState = status === "使用済み" || status === "used" ? "used" : "available";
  if (nextState === "used" && getGachaLifecycleState(draw) === "used") {
    showToast("このカードはすでに使用済みです。");
    return;
  }
  if (nextState === "used" && getGachaLifecycleState(draw) === "expired") {
    showToast("期限切れカードは使用確定できません。");
    return;
  }
  if (nextState === "used") {
    const confirmationCode = window.prompt("お客様の確認コードを入力してください", "");
    if (!confirmationCode) return;
    const detailMessage = [
      "確認コードの対象クーポンを使用済みにします。",
      "",
      `会員：${draw.memberName || draw.memberId || "-"}`,
      `キャラクター：${draw.characterName || draw.cardName || "-"}`,
      `景品：${draw.prizeName || draw.title || "-"}`,
      `利用条件：${draw.usageCondition || draw.condition || "-"}`,
      `有効期限：${formatDateUntil(draw.validUntil || draw.expires)}`,
      `確認コード：${confirmationCode.trim()}`,
      "",
      "使用日時・確認スタッフが保存され、このコードは再利用できなくなります。"
    ].join("\n");
    if (!window.confirm(detailMessage)) return;
    if (isProductionApiMode() && draw.drawId) {
      try {
        const result = await apiRequest("confirmCouponUse", {
          drawId: draw.drawId,
          confirmationCode: confirmationCode.trim(),
          confirmedBy: getAdminSession()?.name || "TEAM LINK Console",
          storeName: getStoreSettings().shopName
        });
        const coupon = result.data?.coupon || result.coupon || {};
        updateGachaCardEverywhere(drawId, (item) => {
          item.lifecycleState = "used";
          item.useState = "used";
          item.status = "used";
          item.usedAt = coupon.confirmedAt || new Date().toISOString();
          item.usedByStaff = coupon.confirmedBy || getAdminSession()?.name || "";
          item.useConfirmedAt = item.usedAt;
          item.usedStore = coupon.storeName || getStoreSettings().shopName;
        });
        await refreshProductionGachaCoupons(draw.memberId || getProfile().memberId);
        addAdminLog("gacha_use", `${draw.prizeName || draw.title} を使用済みに変更`, getAdminSession()?.name, draw.memberId || "");
        showToast("確認コードが一致しました。クーポンを使用済みにしました。");
        renderApp();
        return;
      } catch (error) {
        console.error("[TEAM LINK GACHA USE CONFIRM FAILED]", error);
        showToast(error?.message || "確認コードが一致しません。");
        return;
      }
    }
    if (draw.confirmationCode && confirmationCode.trim() !== String(draw.confirmationCode)) {
      showToast("確認コードが一致しません。");
      return;
    }
  }
  const ok = window.confirm(nextState === "used" ? `${draw.prizeName || draw.title}を使用済みにしますか？` : "使用済みを取り消しますか？");
  if (!ok) return;
  draw.lifecycleState = nextState;
  draw.useState = nextState;
  draw.status = nextState;
  draw.usedAt = nextState === "used" ? new Date().toISOString() : "";
  draw.usedByStaff = nextState === "used" ? (getAdminSession()?.name || "") : "";
  draw.useConfirmedAt = nextState === "used" ? draw.usedAt : "";
  draw.usedStore = nextState === "used" ? getStoreSettings().shopName : "";
  draw.useNote = nextState === "used" ? (window.prompt("使用メニュー・備考を入力してください", draw.targetMenu || "") || "") : "";
  if (nextState === "used" && !draw.confirmationCode) draw.confirmationCode = createGachaConfirmCode(draw);
  [draws, history].forEach((list) => {
    const item = list.find((row) => row.drawId === draw.drawId || row.cardHistoryId === draw.cardHistoryId);
    if (item) Object.assign(item, draw);
  });
  writeJson(STORAGE_KEYS.monthlyGachaDraws, draws);
  writeJson(STORAGE_KEYS.gachaCardHistory, history);
  syncLinkedCouponFromGacha(draw, nextState);
  addAdminLog(nextState === "used" ? "gacha_use" : "gacha_undo", `${draw.prizeName || draw.title} を${gachaStateLabels[nextState]}に変更`, getAdminSession()?.name, draw.memberId || "");
  renderApp();
}

function syncLinkedCouponFromGacha(draw, state) {
  const coupons = readJson(STORAGE_KEYS.myCoupons, []);
  let changed = false;
  coupons.forEach((coupon) => {
    const linked = String(coupon.linkedCardHistoryId || coupon.sourceId || "") === String(draw.cardHistoryId || draw.drawId) ||
      (draw.linkedCouponId && String(coupon.couponId) === String(draw.linkedCouponId));
    if (!linked) return;
    if (state === "used") {
      coupon.status = "使用済み";
      coupon.usedAt = draw.usedAt || new Date().toISOString();
      coupon.usedShop = draw.usedStore || getStoreSettings().shopName;
      coupon.usedMenu = draw.useNote || draw.targetMenu || "";
      coupon.confirmedByStaff = draw.usedByStaff || getAdminSession()?.name || "";
    } else {
      coupon.status = "未使用";
      coupon.usedAt = "";
      coupon.usedShop = "";
      coupon.usedMenu = "";
      coupon.confirmedByStaff = "";
    }
    coupon.updatedAt = new Date().toISOString();
    changed = true;
  });
  if (changed) writeJson(STORAGE_KEYS.myCoupons, coupons);
}

function changeMemberGachaPrize(drawId) {
  const draws = readJson(STORAGE_KEYS.monthlyGachaDraws, []);
  const draw = draws.find((item) => item.drawId === drawId);
  if (!draw) return;
  const title = window.prompt("変更後の景品名を入力してください", draw.title);
  if (!title) return;
  draw.title = title;
  addAdminLog("gacha_prize_change", `ガチャ景品を${title}へ変更`, getAdminSession()?.name, draw.memberId || "");
  writeJson(STORAGE_KEYS.monthlyGachaDraws, draws);
  renderApp();
}

function createGachaMonth() {
  const month = window.prompt("作成する対象年月を入力してください（例: 2026-08）", currentMonthKey());
  if (!month) return;
  const settings = getGachaSettings();
  if (settings.some((setting) => setting.issueMonth === month.trim())) {
    showToast("その月の設定はすでに存在します。");
    return;
  }
  const source = getCurrentGachaSetting();
  settings.push({
    ...source,
    issueMonth: month.trim(),
    title: `${formatMonthLabel(month.trim())}カードガチャ`,
    status: "非公開",
    startAt: `${month.trim()}-01`,
    endAt: `${month.trim()}-${new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 0).getDate()}`,
    cards: source.cards.map((card) => ({ ...card }))
  });
  writeGachaSettings(settings);
  addAdminLog("gacha_month_create", `${month} のガチャ設定を作成`, getAdminSession()?.name);
  renderApp();
}

function duplicateGachaMonth() {
  const sourceMonth = window.prompt("複製元の対象年月を入力してください", currentMonthKey());
  if (!sourceMonth) return;
  const targetMonth = window.prompt("複製先の対象年月を入力してください", currentMonthKey());
  if (!targetMonth) return;
  const settings = getGachaSettings();
  const source = getGachaSetting(sourceMonth.trim());
  if (!source || settings.some((setting) => setting.issueMonth === targetMonth.trim())) {
    showToast("複製元がない、または複製先がすでに存在します。");
    return;
  }
  settings.push({
    ...source,
    issueMonth: targetMonth.trim(),
    title: `${formatMonthLabel(targetMonth.trim())}カードガチャ`,
    status: "非公開",
    cards: source.cards.map((card) => ({ ...card }))
  });
  writeGachaSettings(settings);
  renderApp();
}

function editGachaRarityRates() {
  const settings = getGachaSettings();
  const setting = settings.find((item) => item.issueMonth === currentMonthKey()) || settings[0];
  const nextRates = { ...(setting.rarityRates || defaultGachaRarityRates) };
  for (const rarity of Object.keys(rarityMeta)) {
    const value = promptNumber(`${rarity} ${rarityMeta[rarity].label} の排出率を入力してください`, nextRates[rarity] || 0);
    if (value === null) return;
    nextRates[rarity] = value;
  }
  const total = Object.values(nextRates).reduce((sum, value) => sum + Number(value || 0), 0);
  if (total !== 100) {
    showToast("排出率の合計を100％にしてください。");
    return;
  }
  setting.rarityRates = nextRates;
  setting.cards = recalculateMonthlyCardRates(setting.cards, nextRates);
  writeGachaSettings(settings);
  addAdminLog("gacha_rarity_rates", `${setting.issueMonth} のレア度排出率を変更`, getAdminSession()?.name);
  renderApp();
}

function recalculateMonthlyCardRates(cards, rates) {
  const drawableByRarity = cards.reduce((acc, card) => {
    if (card.isPublic !== false && card.isDrawable !== false) acc[card.rarity] = Number(acc[card.rarity] || 0) + Number(card.weight || 1);
    return acc;
  }, {});
  return cards.map((card) => {
    if (card.isPublic === false || card.isDrawable === false) return { ...card, winRate: 0 };
    const rarityRate = Number(rates[card.rarity] || 0);
    const weight = Number(card.weight || 1);
    return { ...card, winRate: Number(((rarityRate * weight) / Math.max(1, drawableByRarity[card.rarity])).toFixed(4)) };
  });
}

function resetMonthlyGachaTest() {
  const profile = getProfile();
  const month = currentMonthKey();
  const ok = window.confirm("テスト用に、現在の会員の今月ガチャ履歴を削除して再度引けるようにしますか？\n本番では使用しないでください。");
  if (!ok) return;
  const removeForProfile = (list) => list.filter((item) => {
    const itemMemberId = String(item.memberId || item.userId || "");
    const itemLineUserId = String(item.lineUserId || "");
    const itemMonth = normalizeServerYearMonth(item.issueMonth || item.targetYearMonth || item.month || "");
    const sameUser = itemMemberId === String(profile.memberId) || (profile.lineUserId && itemLineUserId === String(profile.lineUserId));
    return !(sameUser && itemMonth === String(month));
  });
  writeJson(STORAGE_KEYS.monthlyGachaDraws, removeForProfile(readJson(STORAGE_KEYS.monthlyGachaDraws, [])));
  writeJson(STORAGE_KEYS.gachaCardHistory, removeForProfile(readJson(STORAGE_KEYS.gachaCardHistory, [])));
  addAdminLog("gacha_test_reset", `${profile.memberId} の ${month} ガチャ権を再付与`, getAdminSession()?.name, profile.memberId);
  showToast("テスト用に今月のガチャ権を再付与しました。");
  renderApp();
}

function editGachaCharacter(characterId) {
  appState.gachaCharacterEditId = characterId;
  renderApp();
}

function toggleGachaCharacter(characterId) {
  const characters = getGachaCharacters();
  const character = characters.find((item) => item.characterId === characterId);
  if (!character) return;
  character.isDrawable = character.isDrawable === false;
  character.updatedAt = new Date().toISOString();
  writeGachaCharacters(characters);
  syncCharacterToCurrentMonth(character);
  renderApp();
}

function syncCharacterToCurrentMonth(character) {
  const settings = getGachaSettings();
  const setting = settings.find((item) => item.issueMonth === currentMonthKey()) || settings[0];
  const card = setting.cards.find((item) => item.characterId === character.characterId || item.cardId === character.characterId);
  if (!card) return;
  Object.assign(card, {
    cardName: character.name,
    characterName: character.name,
    rarity: character.rarity,
    intro: character.intro,
    effectName: character.effectName,
    effectDescription: character.effectDescription,
    imageUrl: character.imageUrl || "",
    imagePath: character.imagePath || `images/gacha/characters/${character.characterId}.png`,
    isDrawable: character.isDrawable !== false,
    isPublic: character.isPublic !== false
  });
  setting.cards = recalculateMonthlyCardRates(setting.cards, setting.rarityRates || defaultGachaRarityRates);
  writeGachaSettings(settings);
}

function editGachaPrizeMaster(prizeId) {
  const prizes = getGachaPrizes();
  let prize = prizes.find((item) => item.prizeId === prizeId);
  const isNew = !prize;
  if (!prize) {
    prize = {
      prizeId: createSlugId("prize"),
      title: "新しい景品",
      description: "",
      discountAmount: 0,
      discountRate: 0,
      targetMenu: "全メニュー",
      minimumAmount: 0,
      validDays: 35,
      condition: "",
      canCombine: false,
      usageLimit: 1,
      requiresUseConfirmation: true,
      isPublic: true,
      sortOrder: prizes.length + 1
    };
  }
  const fields = [
    ["title", "景品名"],
    ["description", "景品説明"],
    ["targetMenu", "対象メニュー"],
    ["condition", "利用条件"]
  ];
  fields.forEach(([key, label]) => {
    const value = window.prompt(label, prize[key] || "");
    if (value !== null) prize[key] = value.trim();
  });
  const amount = promptNumber("割引金額を入力してください", prize.discountAmount || 0);
  if (amount === null) return;
  prize.discountAmount = amount;
  const rate = promptNumber("割引率を入力してください", prize.discountRate || 0);
  if (rate === null) return;
  prize.discountRate = rate;
  const validDays = promptNumber("有効期限（日数）を入力してください", prize.validDays || 35);
  if (validDays === null) return;
  prize.validDays = validDays;
  prize.canCombine = window.confirm("他クーポンと併用可能にしますか？");
  prize.isPublic = window.confirm("公開しますか？");
  if (isNew) prizes.push(prize);
  writeGachaPrizes(prizes);
  addAdminLog("gacha_prize_master", `${prize.title} を${isNew ? "追加" : "編集"}`, getAdminSession()?.name, prize.prizeId);
  renderApp();
}

function toggleGachaPrizeMaster(prizeId) {
  const prizes = getGachaPrizes();
  const prize = prizes.find((item) => item.prizeId === prizeId);
  if (!prize) return;
  prize.isPublic = prize.isPublic === false;
  writeGachaPrizes(prizes);
  renderApp();
}

function editGachaPrize(cardId) {
  const settings = getGachaSettings();
  const setting = settings.find((item) => item.issueMonth === currentMonthKey()) || settings[0];
  const card = setting.cards.find((item) => item.cardId === cardId);
  if (!card) return;
  const fields = [
    ["cardName", "カード名"],
    ["rarity", "レア度（UR / SSR / SR / R / N）"],
    ["prizeName", "景品名"],
    ["prizeDescription", "景品説明"],
    ["imageUrl", "カード画像"],
    ["cardBackground", "カード背景"],
    ["validUntil", "利用期限"],
    ["usageCondition", "利用条件"],
    ["targetMenu", "対象メニュー"],
    ["benefitDetail", "割引金額または特典内容"],
    ["notice", "注意事項"]
  ];
  fields.forEach(([key, label]) => {
    const value = window.prompt(label, card[key] || "");
    if (value !== null) card[key] = value.trim();
  });
  const winRate = promptNumber("当選確率を入力してください", card.winRate);
  if (winRate === null) return;
  card.winRate = winRate;
  const weight = promptNumber("同レア度内の抽選ウェイトを入力してください", card.weight || 1);
  if (weight === null) return;
  card.weight = weight;
  const limit = promptNumber("月間当選上限を入力してください", card.monthlyWinLimit);
  if (limit === null) return;
  card.monthlyWinLimit = limit;
  const stock = promptNumber("在庫数を入力してください", card.stockCount ?? 999);
  if (stock === null) return;
  card.stockCount = stock;
  card.canCombine = window.confirm("他クーポンと併用可能にしますか？");
  card.issueAsCoupon = window.confirm("クーポンとして発行しますか？");
  card.isPublic = window.confirm("公開しますか？\n※確率合計が100％でない場合は公開扱いになりません。");
  if (card.isPublic && getGachaOddsTotal(setting) !== 100) {
    card.isPublic = false;
    showToast("確率合計が100％ではないため非公開にしました。");
  }
  writeGachaSettings(settings);
  addAdminLog("gacha_card_edit", `${card.cardName} を編集`, getAdminSession()?.name, card.cardId);
  renderApp();
}

function toggleGachaCard(cardId) {
  const settings = getGachaSettings();
  const setting = getCurrentGachaSetting();
  const targetSetting = settings.find((item) => item.issueMonth === setting.issueMonth);
  const card = targetSetting?.cards.find((item) => item.cardId === cardId);
  if (!card) return;
  card.isPublic = card.isPublic === false;
  if (card.isPublic && getGachaOddsTotal(targetSetting) !== 100) {
    card.isPublic = false;
    showToast("公開中カードの確率合計が100％ではないため公開できません。");
  }
  writeGachaSettings(settings);
  renderApp();
}

function showCardDetail(cardId) {
  const card = [...readJson(STORAGE_KEYS.gachaCardHistory, []), ...readJson(STORAGE_KEYS.monthlyGachaDraws, [])].find((item) => item.drawId === cardId || item.cardHistoryId === cardId);
  if (!card) return;
  window.alert([
    `カード: ${card.cardName}`,
    `レア度: ${card.rarity}`,
    `景品: ${card.prizeName}`,
    `説明: ${card.prizeDescription || ""}`,
    `利用条件: ${card.usageCondition || ""}`,
    `利用期限: ${formatDateUntil(card.validUntil || card.expires)}`,
    `取得日: ${formatDateTime(card.obtainedAt || card.drawnAt)}`,
    `状態: ${getCardUsageState(card)}`,
    `使用日: ${formatDateTime(card.usedAt) || "-"}`
  ].join("\n"));
}

async function updateCollectionRewardState(memberId, rewardId, state) {
  const rewards = getCollectionRewards();
  const reward = rewards.find((item) => item.rewardId === rewardId);
  if (!reward) return;
  if (state === "付与済み" && reward.issueAsCoupon && isProductionApiMode()) {
    const member = findMember(memberId);
    const base = getAdminCoupons().find((coupon) => coupon.source === "年間特典" && coupon.title === reward.title);
    if (!member || !base) {
      showToast("年間特典に対応する会員またはクーポンマスタが見つかりません。");
      return;
    }
    try {
      showToast("保存しています…");
      const result = await apiRequest("issueCollectionRewardCoupon", {
        memberId: member.memberId,
        lineUserId: member.lineUserId || "",
        couponId: base.couponId,
        collectionRewardId: reward.rewardId,
        targetYear: reward.year || currentYear(),
        rewardName: reward.title,
        transactionId: createTransactionId("COLLECTION-COUPON")
      });
      mergeServerMemberCoupon(result.memberCoupon);
    } catch (error) {
      showToast("通信に失敗しました。時間をおいてもう一度お試しください");
      return;
    }
  }
  const key = state === "受取済み" ? "receivedMembers" : "grantedMembers";
  reward[key] = Array.isArray(reward[key]) ? reward[key] : [];
  if (!reward[key].includes(memberId)) reward[key].push(memberId);
  writeJson(STORAGE_KEYS.collectionRewards, rewards);
  if (state === "付与済み" && reward.issueAsCoupon && !isProductionApiMode()) {
    issueCollectionRewardCoupon(memberId, reward);
  }
  addAdminLog("collection_reward", `${memberId} の${reward.title}を${state}に変更`, getAdminSession()?.name, memberId);
  renderApp();
}

function addMemberChartMemo(memberId) {
  const members = getMembers();
  const member = members.find((item) => item.memberId === memberId);
  if (!member) return;
  const body = window.prompt("管理メモを入力してください", "次回カラー提案");
  if (!body) return;
  const now = new Date().toISOString();
  member.memos = member.memos || [];
  member.memos.unshift({
    memoId: createId("MEMO"),
    body,
    author: getAdminSession()?.name || "",
    createdAt: now,
    updatedAt: now
  });
  member.adminMemo = body;
  member.updatedAt = jstDateKey();
  writeJson(STORAGE_KEYS.members, members);
  addAdminLog("memo_add", `${member.realName || member.memberId} にメモを追加`, getAdminSession()?.name, member.memberId);
  appState.memberChartTab = "memos";
  renderApp();
}

function editMemberChartMemo(memberId, index) {
  const members = getMembers();
  const member = members.find((item) => item.memberId === memberId);
  const memo = member?.memos?.[index];
  if (!memo) return;
  const body = window.prompt("メモを編集してください", memo.body);
  if (!body) return;
  memo.body = body;
  memo.updatedAt = new Date().toISOString();
  member.adminMemo = body;
  member.updatedAt = jstDateKey();
  writeJson(STORAGE_KEYS.members, members);
  addAdminLog("memo_edit", `${member.realName || member.memberId} のメモを編集`, getAdminSession()?.name, member.memberId);
  renderApp();
}

function addMemberMemo(memberId) {
  const members = getMembers();
  const member = members.find((item) => item.memberId === memberId);
  if (!member) return;
  const memo = window.prompt("管理者メモを入力してください", member.adminMemo || "");
  if (memo === null) return;
  member.adminMemo = memo;
  member.updatedAt = jstDateKey();
  writeJson(STORAGE_KEYS.members, members);
  addAdminLog("memo", `${member.realName} のメモを更新`, getAdminSession()?.name);
  renderAdmin();
}

function toggleMemberStatus(memberId) {
  const members = getMembers();
  const member = members.find((item) => item.memberId === memberId);
  if (!member) return;
  member.status = member.status === "停止" ? "有効" : "停止";
  member.updatedAt = jstDateKey();
  writeJson(STORAGE_KEYS.members, members);
  addAdminLog("member_status", `${member.realName} を${member.status}に変更`, getAdminSession()?.name);
  renderAdmin();
}

async function updateBookingStatus(requestId, status, options = {}) {
  const bookings = readJson(STORAGE_KEYS.bookings, []);
  const booking = bookings.find((item) => String(item.requestId || item.bookingRequestId || "") === String(requestId));
  if (!booking) {
    showToast("予約情報を取得できませんでした。画面を更新してもう一度お試しください。");
    return false;
  }
  const previousBookingState = {
    status: booking.status,
    currentStatus: booking.currentStatus,
    updatedAt: booking.updatedAt,
    adminReply: booking.adminReply,
    adminReplySentAt: booking.adminReplySentAt,
    adminReplySentBy: booking.adminReplySentBy,
    staffMessage: booking.staffMessage,
    staffMessageSentAt: booking.staffMessageSentAt,
    staffMessageSentBy: booking.staffMessageSentBy,
    proposedDateTime: booking.proposedDateTime,
    proposedAt: booking.proposedAt,
    confirmedDateTime: booking.confirmedDateTime,
    confirmedAt: booking.confirmedAt,
    confirmedChoice: booking.confirmedChoice
  };
  booking.status = status;
  booking.currentStatus = status;
  booking.updatedAt = new Date().toISOString();
  if (options.adminReply !== undefined) booking.adminReply = String(options.adminReply || "").trim();
  if (options.staffMessage !== undefined) booking.staffMessage = String(options.staffMessage || "").trim();
  if (options.proposedDateTime !== undefined) booking.proposedDateTime = options.proposedDateTime;
  if (options.proposedAt !== undefined) booking.proposedAt = options.proposedAt;
  if (options.confirmedDateTime !== undefined) booking.confirmedDateTime = options.confirmedDateTime;
  if (options.confirmedAt !== undefined) booking.confirmedAt = options.confirmedAt;
  if (options.confirmedChoice !== undefined) booking.confirmedChoice = options.confirmedChoice;
  if (status === "来店済み") booking.visitedAt = new Date().toISOString();
  if (normalizeBookingStatus(status) === "キャンセル") {
    booking.cancelledAt = new Date().toISOString();
    if (isProductionApiMode()) {
      try {
        showToast("保存しています…");
        await releaseBookingPlannedCouponsRemote(booking.reservationId || booking.requestId);
      } catch (error) {
        showToast("通信に失敗しました。時間をおいてもう一度お試しください");
        return;
      }
    } else {
      releaseBookingPlannedCoupons(booking.reservationId || booking.requestId);
    }
  }
  writeJson(STORAGE_KEYS.bookings, bookings);
  let notification = null;
  if (isProductionApiMode() && getAdminSession()) {
    try {
      const result = await apiRequest("updateBookingRequest", {
        requestId,
        status,
        currentStatus: status,
        proposedDateTime: booking.proposedDateTime || "",
        proposedAt: booking.proposedAt || "",
        confirmedDateTime: booking.confirmedDateTime || "",
        confirmedAt: booking.confirmedAt || "",
        confirmedChoice: booking.confirmedChoice || "",
        cancelledAt: booking.cancelledAt || "",
        visitedAt: booking.visitedAt || "",
        adminReply: booking.adminReply || "",
        staffMessage: booking.staffMessage || "",
        adminReplySentBy: getAdminSession()?.name || "スタッフ",
        staffMessageSentBy: getAdminSession()?.name || "スタッフ"
      });
      notification = result.data?.notification || result.notification || null;
      const serverBooking = result.data?.booking || result.booking || null;
      if (serverBooking) {
        booking.adminReply = serverBooking.adminReply || booking.adminReply || "";
        booking.adminReplySentAt = serverBooking.adminReplySentAt || booking.adminReplySentAt || "";
        booking.adminReplySentBy = serverBooking.adminReplySentBy || booking.adminReplySentBy || "";
        booking.staffMessage = serverBooking.staffMessage || booking.staffMessage || "";
        booking.staffMessageSentAt = serverBooking.staffMessageSentAt || booking.staffMessageSentAt || "";
        booking.staffMessageSentBy = serverBooking.staffMessageSentBy || booking.staffMessageSentBy || "";
        booking.proposedDateTime = serverBooking.proposedDateTime || booking.proposedDateTime || "";
        booking.proposedAt = serverBooking.proposedAt || booking.proposedAt || "";
        booking.confirmedDateTime = serverBooking.confirmedDateTime || booking.confirmedDateTime || "";
        booking.confirmedAt = serverBooking.confirmedAt || booking.confirmedAt || "";
        booking.confirmedChoice = serverBooking.confirmedChoice || booking.confirmedChoice || "";
      }
      applyBookingLineNotification(booking, notification);
      writeJson(STORAGE_KEYS.bookings, bookings);
    } catch (error) {
      Object.assign(booking, previousBookingState);
      writeJson(STORAGE_KEYS.bookings, bookings);
      showToast("管理データの保存に失敗しました。再度お試しください。");
      return false;
    }
  }
  addAdminLog("booking", `${booking.customerName || "お客様"} の予約を${status}に変更`, getAdminSession()?.name);
  renderApp();
  if (normalizeBookingStatus(status) === "別日時提案中") {
    showBookingLineNotificationToast("別日時を提案しました", notification);
  } else if (normalizeBookingStatus(status) === "予約確定") {
    showBookingLineNotificationToast("予約確定しました", notification);
  }
  return true;
}

function openBookingResponseModal(requestId, mode) {
  if (!requestId || appState.adminBookingActionBusyId) return;
  appState.adminBookingResponseRequestId = requestId;
  appState.adminBookingResponseMode = mode;
  renderApp();
  window.requestAnimationFrame(() => {
    const modal = document.querySelector(".admin-booking-response-modal");
    updateBookingDecisionPreview(modal);
    modal?.querySelector("[data-admin-booking-confirm-date]")?.focus({ preventScroll: true });
  });
}

function closeBookingResponseModal() {
  if (appState.adminBookingActionBusyId) return;
  appState.adminBookingResponseRequestId = "";
  appState.adminBookingResponseMode = "";
  renderApp();
}

async function submitBookingResponse(button, requestId, mode) {
  const modal = button.closest(".admin-booking-response-modal");
  const textarea = modal?.querySelector("[data-admin-booking-response-message]");
  const enteredMessage = String(textarea?.value || "").trim();
  const booking = readJson(STORAGE_KEYS.bookings, []).find((item) => String(item.bookingRequestId || item.requestId || "") === String(requestId));
  if (!booking) {
    showToast("予約情報を取得できませんでした。");
    return false;
  }
  const selectedDateTime = combineBookingDateTime(
    modal?.querySelector("[data-admin-booking-confirm-date]")?.value,
    modal?.querySelector("[data-admin-booking-confirm-time]")?.value
  );
  const validation = validateReservableDateTime(selectedDateTime);
  if (!selectedDateTime || !validation.ok) {
    showToast(selectedDateTime ? validation.message : "確定する日付と時間を入力してください。");
    modal?.querySelector("[data-admin-booking-confirm-date]")?.focus();
    return false;
  }
  const decision = decideBookingResponseAction(booking, selectedDateTime, mode);
  if (!decision.ok) {
    showToast(decision.message || "日時をご確認ください。");
    return false;
  }
  const now = new Date().toISOString();
  const status = decision.status;
  const message = status === "proposed"
    ? enteredMessage || buildDefaultBookingProposalMessage(decision.dateTime)
    : enteredMessage;
  const options = status === "confirmed"
    ? {
        staffMessage: message,
        confirmedDateTime: decision.dateTime,
        confirmedAt: now,
        confirmedChoice: decision.confirmedChoice
      }
    : {
        adminReply: message,
        proposedDateTime: decision.dateTime,
        proposedAt: now,
        confirmedDateTime: "",
        confirmedAt: "",
        confirmedChoice: ""
      };
  const updated = await runBookingStatusAction(button, requestId, status, options);
  if (updated) {
    appState.adminBookingResponseRequestId = "";
    appState.adminBookingResponseMode = "";
    renderApp();
  }
  return updated;
}

function buildDefaultBookingProposalMessage(dateTime) {
  return `ご希望いただいた時間でのご案内が難しいため、${formatDateTime(dateTime)}はいかがでしょうか？`;
}

function updateBookingDecisionPreview(modal) {
  if (!modal) return;
  const requestId = String(appState.adminBookingResponseRequestId || "");
  const booking = readJson(STORAGE_KEYS.bookings, []).find((item) => String(item.bookingRequestId || item.requestId || "") === requestId);
  const preview = modal.querySelector("[data-admin-booking-decision-preview]");
  const submitButton = modal.querySelector("[data-admin-action='submitBookingResponse']");
  if (!booking || !preview || !submitButton) return;
  const selectedDateTime = combineBookingDateTime(
    modal.querySelector("[data-admin-booking-confirm-date]")?.value,
    modal.querySelector("[data-admin-booking-confirm-time]")?.value
  );
  const mode = String(appState.adminBookingResponseMode || "");
  const decision = decideBookingResponseAction(booking, selectedDateTime, mode);
  const validation = selectedDateTime ? validateReservableDateTime(selectedDateTime) : { ok: false, message: "日付と時間を選択してください。" };
  if (!decision.ok || !validation.ok) {
    preview.textContent = decision.message || validation.message;
    submitButton.disabled = true;
    return;
  }
  submitButton.disabled = false;
  const formatted = formatDateTime(decision.dateTime);
  if (["needs_change", "propose", "proposed"].includes(mode)) {
    preview.textContent = `${formatted} を店舗からの案内日時としてLINEで送信します。`;
    submitButton.textContent = "この日時をお客様へ送る";
    return;
  }
  preview.textContent = `${decision.confirmedChoice}：${formatted} で予約を確定します。`;
  submitButton.textContent = decision.confirmedChoice === "店舗提案（了承済み）"
    ? "この日時で予約を確定してLINE通知"
    : "予約を確定してLINE通知";
}

async function runBookingStatusAction(button, requestId, status, options = {}) {
  if (!requestId || appState.adminBookingActionBusyId) return;
  appState.adminBookingActionBusyId = requestId;
  const actionGroup = button.closest(".admin-booking-response-actions, .admin-booking-actions");
  const buttons = actionGroup ? [...actionGroup.querySelectorAll("button")] : [button];
  buttons.forEach((item) => { item.disabled = true; });
  const originalLabel = button.textContent;
  button.textContent = "更新中…";
  button.setAttribute("aria-busy", "true");
  showToast(normalizeBookingStatus(status) === "別日時提案中" ? "提案日時を保存してLINE通知を確認しています…" : "予約を確定してLINE通知を確認しています…");
  try {
    return await updateBookingStatus(requestId, status, options);
  } finally {
    appState.adminBookingActionBusyId = "";
    if (button.isConnected) {
      button.textContent = originalLabel;
      button.removeAttribute("aria-busy");
      buttons.forEach((item) => { item.disabled = false; });
    } else {
      renderApp();
    }
  }
}

async function confirmBookingChoice(requestId, choice) {
  const bookings = readJson(STORAGE_KEYS.bookings, []);
  const booking = bookings.find((item) => String(item.requestId || item.bookingRequestId || "") === String(requestId));
  if (!booking) return;
  const selectedDateTime = choice === "third"
    ? booking.thirdDateTime
    : choice === "second"
      ? booking.secondDateTime
      : booking.firstDateTime;
  if (!selectedDateTime) {
    showToast("選択した希望日時が登録されていません。");
    return;
  }
  booking.confirmedDateTime = selectedDateTime;
  booking.confirmedChoice = choice === "third" ? "第3希望" : choice === "second" ? "第2希望" : "第1希望";
  await updateBookingStatus(requestId, "confirmed", {
    confirmedDateTime: selectedDateTime,
    confirmedAt: new Date().toISOString(),
    confirmedChoice: booking.confirmedChoice,
    proposedDateTime: "",
    proposedAt: ""
  });
}

async function confirmBookingAfterSalonBoard(requestId) {
  const bookings = readJson(STORAGE_KEYS.bookings, []);
  const booking = bookings.find((item) => item.requestId === requestId);
  if (!booking) return;
  const ok = window.confirm("サロンボードへ手動入力済みですか？\n確認後に予約確定へ変更します。");
  if (!ok) return;
  booking.status = "confirmed";
  booking.currentStatus = "confirmed";
  booking.confirmedDateTime = booking.confirmedDateTime || booking.firstDateTime;
  booking.confirmedAt = new Date().toISOString();
  booking.updatedAt = new Date().toISOString();
  writeJson(STORAGE_KEYS.bookings, bookings);
  let notification = null;
  if (isProductionApiMode()) {
    const result = await apiRequest("updateBookingRequest", { requestId, status: booking.status, currentStatus: booking.currentStatus, confirmedDateTime: booking.confirmedDateTime, confirmedAt: booking.confirmedAt });
    notification = result.data?.notification || result.notification || null;
    applyBookingLineNotification(booking, notification);
    writeJson(STORAGE_KEYS.bookings, bookings);
  }
  addAdminLog("booking_confirm", `${booking.customerName || "お客様"} の予約を確定`, getAdminSession()?.name, booking.memberId || "");
  renderApp();
  showBookingLineNotificationToast("予約確定しました", notification);
}

function applyBookingLineNotification(booking, notification) {
  if (!booking || !notification) return;
  booking.lineNotificationType = notification.type || booking.lineNotificationType || "";
  booking.lineNotificationStatus = notification.status || "";
  booking.lineNotificationSentAt = notification.sentAt || "";
  booking.lineNotificationError = notification.error || "";
}

function getBookingLineNotificationLabel(booking) {
  const status = String(booking?.lineNotificationStatus || "");
  if (status === "sent") return "送信済み";
  if (status === "skipped_unlinked") return "LINE未連携のため通知なし";
  if (status === "skipped_disabled") return "LINE通知OFFのため送信なし";
  if (status === "failed") return "通知失敗";
  return "";
}

function getBookingEmailNotificationLabel(booking) {
  const status = String(booking?.notificationStatus || "");
  const sentCount = Number(booking?.notificationSentCount || 0);
  const failedCount = Number(booking?.notificationFailedCount || 0);
  if (status === "sent") return sentCount ? `送信済み（${sentCount}件）` : "送信済み";
  if (status === "partial_failed") return `一部送信失敗（成功${sentCount}件・失敗${failedCount}件）`;
  if (status === "failed") return failedCount ? `送信失敗（${failedCount}件）` : "送信失敗";
  if (status === "skipped_no_recipient") return "通知先未設定";
  return "";
}

function showBookingLineNotificationToast(successMessage, notification) {
  const status = String(notification?.status || "");
  if (status === "skipped_unlinked") {
    showToast(`${successMessage}（LINE未連携のため通知なし）`);
    return;
  }
  if (status === "skipped_disabled") {
    showToast(`${successMessage}（LINE通知OFFのため送信なし）`);
    return;
  }
  if (status === "failed") {
    showToast(`${successMessage}が、LINE通知に失敗しました`);
    return;
  }
  if (status === "sent") {
    showToast(`${successMessage}。LINE通知を送信しました。`);
    return;
  }
  showToast(`${successMessage}。`);
}

function editBooking(requestId) {
  const bookings = readJson(STORAGE_KEYS.bookings, []);
  const booking = bookings.find((item) => item.requestId === requestId);
  if (!booking) return;
  const menu = window.prompt("メニューを修正してください", booking.menu || "");
  if (menu === null) return;
  const staff = window.prompt("担当者を修正してください", booking.staff || "");
  if (staff === null) return;
  const memo = window.prompt("備考を修正してください", booking.memo || "");
  if (memo === null) return;
  booking.menu = menu.trim();
  booking.staff = staff.trim();
  booking.memo = memo.trim();
  booking.updatedAt = new Date().toISOString();
  writeJson(STORAGE_KEYS.bookings, bookings);
  addAdminLog("booking_edit", `${booking.customerName || "お客様"} の予約内容を修正`, getAdminSession()?.name, booking.memberId || "");
  renderApp();
}

function showBookingDetail(requestId) {
  const booking = readJson(STORAGE_KEYS.bookings, []).find((item) => String(item.requestId || item.bookingRequestId || "") === String(requestId));
  if (!booking) return;
  const detail = [
    `予約ID: ${booking.reservationId || booking.requestId}`,
    `お客様: ${booking.customerName || ""}`,
    `会員ID: ${booking.memberId || ""}`,
    `予約元: ${booking.reservationSource || booking.source || ""}`,
    `第1希望: ${formatDateTime(booking.firstDateTime)}`,
    `第2希望: ${formatDateTime(booking.secondDateTime)}`,
    `第3希望: ${formatDateTime(booking.thirdDateTime)}`,
    `店舗提案日時: ${formatDateTime(booking.proposedDateTime) || "なし"}`,
    `確定日時: ${formatDateTime(booking.confirmedDateTime) || "未確定"}`,
    `担当者: ${booking.staff || ""}`,
    `メニュー: ${booking.menu || ""}`,
    `クーポン: ${booking.couponTitle || "なし"}`,
    `参考金額: ${formatYen(booking.referenceAmount)}`,
    `施術時間: ${formatMinutes(booking.totalMinutes || booking.totalDurationMinutes)}`,
    `状態: ${booking.status || ""}`,
    `備考: ${booking.memo || ""}`
  ].join("\n");
  window.alert(detail);
}

function requestBookingChange(requestId) {
  const original = readJson(STORAGE_KEYS.bookings, []).find((item) => item.requestId === requestId);
  if (!original) return;
  if (normalizeBookingSource(original) === "Hot Pepper") {
    showToast("ホットペッパーから予約した場合は、ホットペッパーから変更してください。");
    return;
  }
  const firstDateTime = window.prompt("第一希望の変更日時を入力してください（例: 2026-08-12T13:00）", original.firstDateTime || "");
  if (!firstDateTime) return;
  const secondDateTime = window.prompt("第二希望の変更日時を入力してください（例: 2026-08-13T15:00）", original.secondDateTime || "");
  if (!secondDateTime) return;
  const validation = validateBookingDatePair(firstDateTime, secondDateTime);
  if (!validation.ok) {
    showToast(validation.message);
    return;
  }
  const memo = window.prompt("変更相談の備考を入力してください", "") || "";
  const now = new Date().toISOString();
  const changeRequest = {
    ...original,
    requestId: createId("REQ"),
    parentReservationId: original.reservationId || original.requestId,
    reservationId: original.reservationId || createId("RSV"),
    requestType: "日時変更依頼",
    reservationSource: "TEAM LINK相談",
    source: "TEAM LINK相談",
    firstDateTime,
    secondDateTime,
    memo,
    status: "変更依頼",
    currentStatus: "変更依頼",
    createdAt: now,
    receivedAt: now,
    updatedAt: now
  };
  const bookings = readJson(STORAGE_KEYS.bookings, []);
  bookings.unshift(changeRequest);
  writeJson(STORAGE_KEYS.bookings, bookings);
  addAdminLog("booking_change_request", `${original.customerName || "お客様"} から日時変更依頼`, "お客様", original.memberId || "");
  renderApp();
  showToast("日時変更の相談を受け付けました。現在の予約はまだ変更されていません。");
}

function requestBookingCancel(requestId) {
  const original = readJson(STORAGE_KEYS.bookings, []).find((item) => item.requestId === requestId);
  if (!original) return;
  if (normalizeBookingSource(original) === "Hot Pepper") {
    showToast("ホットペッパーから予約した場合は、ホットペッパーからキャンセルしてください。");
    return;
  }
  const reason = window.prompt("キャンセル理由を入力してください", "");
  if (reason === null) return;
  const now = new Date().toISOString();
  const cancelRequest = {
    ...original,
    requestId: createId("REQ"),
    parentReservationId: original.reservationId || original.requestId,
    requestType: "キャンセル依頼",
    reservationSource: "TEAM LINK相談",
    source: "TEAM LINK相談",
    cancelReason: reason.trim(),
    memo: reason.trim(),
    status: "キャンセル依頼",
    currentStatus: "キャンセル依頼",
    createdAt: now,
    receivedAt: now,
    updatedAt: now
  };
  const bookings = readJson(STORAGE_KEYS.bookings, []);
  bookings.unshift(cancelRequest);
  writeJson(STORAGE_KEYS.bookings, bookings);
  addAdminLog("booking_cancel_request", `${original.customerName || "お客様"} からキャンセル依頼`, "お客様", original.memberId || "");
  renderApp();
  showToast("キャンセル依頼を受け付けました。スタッフ確認後に処理されます。");
}

function validateBookingDatePair(firstDateTime, secondDateTime) {
  if (firstDateTime === secondDateTime) return { ok: false, message: "第一希望と第二希望は別の日時を入力してください。" };
  const firstCheck = validateReservableDateTime(firstDateTime);
  if (!firstCheck.ok) return { ok: false, message: `第一希望：${firstCheck.message}` };
  const secondCheck = validateReservableDateTime(secondDateTime);
  if (!secondCheck.ok) return { ok: false, message: `第二希望：${secondCheck.message}` };
  return { ok: true };
}

function replyBooking(requestId) {
  const bookings = readJson(STORAGE_KEYS.bookings, []);
  const booking = bookings.find((item) => item.requestId === requestId);
  if (!booking) return;
  booking.status = "返信待ち";
  booking.adminReply = `予約番号 ${requestId} についてLINEで返信`;
  booking.updatedAt = new Date().toISOString();
  writeJson(STORAGE_KEYS.bookings, bookings);
  addAdminLog("line_reply", `${booking.customerName || "お客様"} へLINE返信準備`, getAdminSession()?.name);
  renderAdmin();
  showToast("LINE返信文を作成する設計です。");
}

function editReservationMenu(menuId) {
  const menus = getReservationMenus();
  const existing = menus.find((menu) => menu.menuId === menuId);
  const isNew = !existing;
  const base = existing || {
    menuId: createSlugId("menu"),
    type: "通常メニュー",
    title: "",
    description: "",
    regularPrice: 0,
    couponPrice: 0,
    durationMinutes: 60,
    targetStaff: ["no-preference"],
    targetWeekdays: [0, 2, 3, 4, 5, 6],
    condition: "",
    publishStartAt: jstDateKey(),
    publishEndAt: "",
    isPublic: true,
    sortOrder: nextReservationMenuSortOrder(menus),
    isRecommended: false,
    imageUrl: "",
    updatedAt: jstDateKey()
  };
  const next = { ...base };
  const idValue = window.prompt("menuIdを入力してください", next.menuId);
  if (!idValue) return;
  const normalizedId = idValue.trim();
  if (isNew && menus.some((menu) => menu.menuId === normalizedId)) {
    showToast("同じmenuIdがすでに存在します。");
    return;
  }
  next.menuId = normalizedId;
  next.type = "通常メニュー";
  const title = window.prompt("表示名を入力してください", next.title || "");
  if (!title) return;
  next.title = title.trim();
  const description = window.prompt("説明を入力してください", next.description || "");
  if (description === null) return;
  next.description = description.trim();
  next.regularPrice = promptNumber("通常価格を入力してください", next.regularPrice);
  if (next.regularPrice === null) return;
  next.couponPrice = promptNumber("クーポン価格を入力してください。通常メニューは0でOKです", next.couponPrice);
  if (next.couponPrice === null) return;
  next.durationMinutes = promptNumber("施術時間（分）を入力してください", next.durationMinutes);
  if (next.durationMinutes === null) return;
  const targetStaff = window.prompt("対象スタッフIDをカンマ区切りで入力してください\n例: boss-muramatsu,kanda-kana,matsumoto-ai,no-preference", (next.targetStaff || []).join(","));
  if (targetStaff === null) return;
  next.targetStaff = parseCsv(targetStaff);
  const targetWeekdays = window.prompt("対象曜日を数字で入力してください（日=0, 月=1, 火=2, 水=3, 木=4, 金=5, 土=6）", (next.targetWeekdays || []).join(","));
  if (targetWeekdays === null) return;
  next.targetWeekdays = parseCsv(targetWeekdays).map(Number).filter((day) => day >= 0 && day <= 6);
  const condition = window.prompt("利用条件を入力してください", next.condition || "");
  if (condition === null) return;
  next.condition = condition.trim();
  const startAt = window.prompt("公開開始日を入力してください（例: 2026-08-01）", next.publishStartAt || "");
  if (startAt === null) return;
  next.publishStartAt = startAt.trim();
  const endAt = window.prompt("公開終了日を入力してください。未設定なら空欄", next.publishEndAt || "");
  if (endAt === null) return;
  next.publishEndAt = endAt.trim();
  next.isPublic = window.confirm("公開しますか？ OK=公開 / キャンセル=非公開");
  next.isRecommended = window.confirm("おすすめ表示にしますか？ OK=おすすめ / キャンセル=通常");
  const imageUrl = window.prompt("画像URLを入力してください。未設定なら空欄", next.imageUrl || "");
  if (imageUrl === null) return;
  next.imageUrl = imageUrl.trim();
  next.sortOrder = promptNumber("並び順を入力してください", next.sortOrder);
  if (next.sortOrder === null) return;
  next.updatedAt = new Date().toISOString();
  if (isNew) {
    menus.push(next);
  } else {
    const index = menus.findIndex((menu) => menu.menuId === menuId);
    menus[index] = next;
  }
  writeReservationMenus(menus);
  addAdminLog(isNew ? "reservation_menu_add" : "reservation_menu_edit", `${next.title} を${isNew ? "作成" : "編集"}`, getAdminSession()?.name, next.menuId);
  renderApp();
  showToast(`${next.title}を保存しました。`);
}

function duplicateReservationMenu(menuId) {
  const menus = getReservationMenus();
  const source = menus.find((menu) => menu.menuId === menuId);
  if (!source) return;
  const copyId = window.prompt("複製後のmenuIdを入力してください", `${source.menuId}-copy`);
  if (!copyId) return;
  if (menus.some((menu) => menu.menuId === copyId.trim())) {
    showToast("同じmenuIdがすでに存在します。");
    return;
  }
  const copy = {
    ...source,
    menuId: copyId.trim(),
    title: `${source.title} コピー`,
    isPublic: false,
    sortOrder: nextReservationMenuSortOrder(menus),
    updatedAt: new Date().toISOString()
  };
  menus.push(copy);
  writeReservationMenus(menus);
  addAdminLog("reservation_menu_duplicate", `${source.title} を複製`, getAdminSession()?.name, copy.menuId);
  renderApp();
}

function toggleReservationMenuPublic(menuId) {
  const menus = getReservationMenus();
  const menu = menus.find((item) => item.menuId === menuId);
  if (!menu) return;
  menu.isPublic = menu.isPublic === false;
  menu.updatedAt = new Date().toISOString();
  writeReservationMenus(menus);
  addAdminLog("reservation_menu_public", `${menu.title} を${menu.isPublic ? "公開" : "非公開"}に変更`, getAdminSession()?.name, menu.menuId);
  renderApp();
}

function moveReservationMenu(menuId, direction) {
  const menus = getReservationMenus();
  const sameTypeMenus = menus.filter((menu) => menu.type === menus.find((item) => item.menuId === menuId)?.type).sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
  const currentIndex = sameTypeMenus.findIndex((menu) => menu.menuId === menuId);
  const swap = sameTypeMenus[currentIndex + direction];
  const current = sameTypeMenus[currentIndex];
  if (!current || !swap) return;
  const currentOrder = current.sortOrder;
  current.sortOrder = swap.sortOrder;
  swap.sortOrder = currentOrder;
  current.updatedAt = new Date().toISOString();
  swap.updatedAt = current.updatedAt;
  writeReservationMenus(menus);
  addAdminLog("reservation_menu_sort", `${current.title} の並び順を変更`, getAdminSession()?.name, current.menuId);
  renderApp();
}

function deleteReservationMenu(menuId) {
  const menus = getReservationMenus();
  const menu = menus.find((item) => item.menuId === menuId);
  if (!menu) return;
  const ok = window.confirm(`${menu.title}を削除しますか？\n過去の予約履歴に保存済みのメニュー名・価格・時間は変更されません。`);
  if (!ok) return;
  writeReservationMenus(menus.filter((item) => item.menuId !== menuId));
  addAdminLog("reservation_menu_delete", `${menu.title} を削除`, getAdminSession()?.name, menu.menuId);
  renderApp();
}

function addAdminCoupon() {
  editAdminCoupon("");
}

async function editAdminCoupon(couponId) {
  const coupons = getAdminCoupons();
  const existing = coupons.find((item) => item.couponId === couponId);
  if (!existing || isLineCouponDefinition(existing)) {
    await editLineCouponDefinition(existing, coupons);
    return;
  }
  const now = new Date().toISOString();
  const next = { ...existing };
  const title = window.prompt("クーポン名を入力してください", next.title);
  if (!title) return;
  next.title = title;
  const type = window.prompt("クーポン種類を入力してください", next.couponType || "全会員向けクーポン");
  if (!type) return;
  next.couponType = type;
  next.category = window.prompt("カテゴリを入力してください", next.category || "おすすめ") || next.category || "おすすめ";
  next.description = window.prompt("説明を入力してください", next.description || "") || "";
  const regularPrice = promptNumber("通常価格を入力してください", next.regularPrice);
  if (regularPrice === null) return;
  next.regularPrice = regularPrice;
  const couponPrice = promptNumber("クーポン価格を入力してください", next.couponPrice);
  if (couponPrice === null) return;
  next.couponPrice = couponPrice;
  const discountAmount = promptNumber("割引額を入力してください", next.discountAmount);
  if (discountAmount === null) return;
  next.discountAmount = discountAmount;
  const discountRate = promptNumber("割引率を入力してください。不要なら0", next.discountRate);
  if (discountRate === null) return;
  next.discountRate = discountRate;
  const validation = validateCouponDefinition(next);
  if (!validation.ok) {
    showToast(validation.message);
    return;
  }
  next.targetMenu = window.prompt("対象メニューを入力してください", next.targetMenu || "全メニュー") || "全メニュー";
  next.targetWeekdays = parseWeekdayList(window.prompt("対象曜日を数字で入力してください（日0,月1...土6）", (next.targetWeekdays || [0, 2, 3, 4, 5, 6]).join(",")));
  next.condition = window.prompt("利用条件を入力してください", next.condition || "1会計につき1枚") || "";
  next.publishStartAt = window.prompt("公開開始日を入力してください", next.publishStartAt || jstDateKey()) || jstDateKey();
  next.publishEndAt = window.prompt("公開終了日を入力してください。空欄可", next.publishEndAt || "") || "";
  next.validStartAt = window.prompt("利用開始日を入力してください", next.validStartAt || jstDateKey()) || jstDateKey();
  next.validUntil = window.prompt("利用期限を入力してください", next.validUntil || endOfMonthDateKey()) || endOfMonthDateKey();
  next.perUserLimit = promptNumber("一人あたり利用回数を入力してください", next.perUserLimit || 1);
  next.canCombine = window.confirm("他クーポンと併用可能にしますか？");
  next.selectableOnBooking = window.confirm("予約時に選択可能にしますか？");
  next.isRecommended = window.confirm("おすすめ表示にしますか？");
  next.isPublic = window.confirm("公開しますか？");
  next.source = window.prompt("発行元を入力してください", next.source || "Console作成") || "Console作成";
  next.autoGrantCondition = window.prompt("自動付与条件を入力してください。不要なら空欄", next.autoGrantCondition || "") || "";
  next.sortOrder = promptNumber("並び順を入力してください", next.sortOrder || nextCouponSortOrder(coupons));
  next.status = next.isPublic ? "公開" : "非公開";
  next.updatedAt = now;
  try {
    if (isProductionApiMode()) {
      showToast("保存しています…");
      const action = existing ? "updateCouponMaster" : "createCouponMaster";
      await apiRequest(action, {
        ...next,
        couponName: next.title,
        validFrom: next.validStartAt,
        usageLimit: next.perUserLimit,
        allowCombination: next.canCombine,
        issueType: next.source,
        displayOrder: next.sortOrder,
        status: next.isPublic ? "active" : "stopped",
        transactionId: createTransactionId("COUPON-SAVE")
      });
    }
  } catch (error) {
    showToast("通信に失敗しました。時間をおいてもう一度お試しください");
    return;
  }
  if (existing) {
    Object.assign(existing, normalizeCouponDefinition(next));
  } else {
    coupons.unshift(normalizeCouponDefinition(next));
  }
  writeJson(STORAGE_KEYS.adminCoupons, coupons);
  addAdminLog("coupon_save", `${next.title} を保存`, getAdminSession()?.name, next.couponId);
  renderAdmin();
}

async function editLineCouponDefinition(existing, coupons) {
  const now = new Date().toISOString();
  const next = normalizeCouponDefinition(existing || {
    couponId: createId("LINE-COUPON"),
    title: "",
    description: "",
    imageUrl: "",
    lineCouponUrl: "",
    couponType: "LINE公式クーポン",
    category: "LINEクーポン",
    source: "LINE公式アカウント",
    startDate: jstDateKey(),
    endDate: "",
    isPublic: false,
    selectableOnBooking: true,
    createdAt: now
  });
  const title = window.prompt("LINEクーポン名を入力してください", next.title || "");
  if (!title) return;
  next.title = title.trim();
  const description = window.prompt("簡単な説明を入力してください", next.description || "LINE限定クーポン");
  if (description === null) return;
  next.description = description.trim();
  const imageUrl = window.prompt("クーポン画像URLを入力してください", next.imageUrl || "");
  if (imageUrl === null) return;
  next.imageUrl = imageUrl.trim();
  const lineCouponUrl = window.prompt("LINE公式アカウントのクーポン共有URL（https://lin.ee/...）を入力してください", next.lineCouponUrl || "");
  if (lineCouponUrl === null) return;
  if (!isSafeLineCouponUrl(lineCouponUrl.trim())) {
    showToast("https://lin.ee/ から始まるLINEクーポン共有URLを入力してください。");
    return;
  }
  next.lineCouponUrl = lineCouponUrl.trim();
  const startDate = window.prompt("公開・利用開始日を入力してください（YYYY-MM-DD）", next.startDate || next.validStartAt || jstDateKey());
  if (!startDate) return;
  const endDate = window.prompt("公開・利用終了日を入力してください（YYYY-MM-DD）", next.endDate || next.validUntil || "");
  if (!endDate) return;
  next.startDate = startDate.trim();
  next.endDate = endDate.trim();
  next.publishStartAt = next.startDate;
  next.validStartAt = next.startDate;
  next.publishEndAt = next.endDate;
  next.validUntil = next.endDate;
  next.isPublic = window.confirm("TEAM LINKに公開しますか？ OK=公開 / キャンセル=非公開");
  next.status = next.isPublic ? "公開" : "非公開";
  next.sortOrder = promptNumber("並び順を入力してください", next.sortOrder || nextCouponSortOrder(coupons));
  if (next.sortOrder === null) return;
  next.couponType = "LINE公式クーポン";
  next.category = "LINEクーポン";
  next.source = "LINE公式アカウント";
  next.selectableOnBooking = true;
  next.updatedAt = now;
  try {
    if (isProductionApiMode()) {
      showToast("保存しています…");
      await apiRequest(existing ? "updateCouponMaster" : "createCouponMaster", {
        ...next,
        couponName: next.title,
        validFrom: next.startDate,
        validUntil: next.endDate,
        issueType: next.source,
        displayOrder: next.sortOrder,
        status: next.isPublic ? "active" : "stopped",
        transactionId: createTransactionId("LINE-COUPON-SAVE")
      });
    }
  } catch (error) {
    showToast("通信に失敗しました。時間をおいてもう一度お試しください");
    return;
  }
  if (existing) Object.assign(existing, next);
  else coupons.unshift(next);
  writeJson(STORAGE_KEYS.adminCoupons, coupons);
  addAdminLog("line_coupon_save", `${next.title} を保存`, getAdminSession()?.name, next.couponId);
  renderApp();
  showToast(`${next.title}を保存しました。`);
}

async function duplicateAdminCoupon(couponId) {
  const coupons = getAdminCoupons();
  const coupon = coupons.find((item) => item.couponId === couponId);
  if (!coupon) return;
  const copy = normalizeCouponDefinition({
    ...coupon,
    couponId: createId("COUPON"),
    title: `${coupon.title} コピー`,
    isPublic: false,
    status: "非公開",
    sortOrder: nextCouponSortOrder(coupons),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  coupons.unshift(copy);
  if (isProductionApiMode()) {
    try {
      showToast("保存しています…");
      await apiRequest("createCouponMaster", {
        ...copy,
        couponName: copy.title,
        validFrom: copy.validStartAt,
        usageLimit: copy.perUserLimit,
        allowCombination: copy.canCombine,
        issueType: copy.source,
        displayOrder: copy.sortOrder,
        status: "stopped",
        transactionId: createTransactionId("COUPON-DUP")
      });
    } catch (error) {
      showToast("通信に失敗しました。時間をおいてもう一度お試しください");
      return;
    }
  }
  writeJson(STORAGE_KEYS.adminCoupons, coupons);
  addAdminLog("coupon_duplicate", `${coupon.title} を複製`, getAdminSession()?.name, copy.couponId);
  renderAdmin();
}

async function toggleAdminCoupon(couponId) {
  const coupons = getAdminCoupons();
  const coupon = coupons.find((item) => item.couponId === couponId);
  if (!coupon) return;
  coupon.isPublic = !coupon.isPublic;
  coupon.status = coupon.isPublic ? "公開" : "非公開";
  coupon.updatedAt = new Date().toISOString();
  if (isProductionApiMode()) {
    try {
      showToast("保存しています…");
      if (coupon.isPublic) {
        await apiRequest("updateCouponMaster", {
          ...coupon,
          couponName: coupon.title,
          validFrom: coupon.validStartAt,
          usageLimit: coupon.perUserLimit,
          allowCombination: coupon.canCombine,
          issueType: coupon.source,
          displayOrder: coupon.sortOrder,
          status: "active",
          transactionId: createTransactionId("COUPON-PUBLIC")
        });
      } else {
        await apiRequest("stopCouponMaster", { couponId, transactionId: createTransactionId("COUPON-STOP") });
      }
    } catch (error) {
      showToast("通信に失敗しました。時間をおいてもう一度お試しください");
      return;
    }
  }
  writeJson(STORAGE_KEYS.adminCoupons, coupons);
  addAdminLog("coupon", `${coupon.title} を${coupon.isPublic ? "公開" : "停止"}`, getAdminSession()?.name);
  renderAdmin();
}

async function endAdminCoupon(couponId) {
  const coupons = getAdminCoupons();
  const coupon = coupons.find((item) => item.couponId === couponId);
  if (!coupon) return;
  coupon.status = "終了";
  coupon.isPublic = false;
  coupon.publishEndAt = jstDateKey();
  coupon.updatedAt = new Date().toISOString();
  if (isProductionApiMode()) {
    try {
      showToast("保存しています…");
      await apiRequest("stopCouponMaster", { couponId, transactionId: createTransactionId("COUPON-END") });
    } catch (error) {
      showToast("通信に失敗しました。時間をおいてもう一度お試しください");
      return;
    }
  }
  writeJson(STORAGE_KEYS.adminCoupons, coupons);
  addAdminLog("coupon_end", `${coupon.title} を終了`, getAdminSession()?.name, coupon.couponId);
  renderAdmin();
}

async function deleteAdminCoupon(couponId) {
  const coupons = getAdminCoupons();
  const coupon = coupons.find((item) => item.couponId === couponId);
  if (!coupon) return;
  if (!window.confirm(`${coupon.title}を停止しますか？\n本番では物理削除せず、停止扱いにします。`)) return;
  if (isProductionApiMode()) {
    try {
      showToast("保存しています…");
      await apiRequest("stopCouponMaster", { couponId, transactionId: createTransactionId("COUPON-SOFTDELETE") });
    } catch (error) {
      showToast("通信に失敗しました。時間をおいてもう一度お試しください");
      return;
    }
  }
  coupon.isPublic = false;
  coupon.status = "非公開";
  writeJson(STORAGE_KEYS.adminCoupons, coupons);
  addAdminLog("coupon_stop", `${coupon.title} を停止`, getAdminSession()?.name, coupon.couponId);
  renderAdmin();
}

async function grantCouponToMember(couponId) {
  const coupons = getAdminCoupons();
  let coupon = coupons.find((item) => item.couponId === couponId);
  if (!coupon) {
    const list = coupons.map((item, index) => `${index + 1}: ${item.title}`).join("\n");
    const selected = window.prompt(`付与するクーポン番号を入力してください\n${list}`, "1");
    const index = Number(selected) - 1;
    coupon = coupons[index];
  }
  if (!coupon) return;
  const memberId = window.prompt("付与するTEAM LINK会員IDを入力してください", appState.adminMemberDetailId || getProfile().memberId);
  const member = findMember(memberId);
  if (!member) {
    showToast("会員が見つかりません。");
    return;
  }
  const reason = window.prompt("付与理由を入力してください", "スタッフ手動付与") || "スタッフ手動付与";
  const memo = window.prompt("備考を入力してください", "") || "";
  if (isProductionApiMode()) {
    try {
      showToast("保存しています…");
      const result = await apiRequest("grantMemberCoupon", {
        memberId: member.memberId,
        lineUserId: member.lineUserId || "",
        couponId: coupon.couponId,
        validUntil: coupon.validUntil,
        sourceType: "manual",
        note: `${reason} ${memo}`.trim(),
        transactionId: createTransactionId("COUPON-GRANT")
      });
      mergeServerMemberCoupon(result.memberCoupon);
    } catch (error) {
      showToast("通信に失敗しました。時間をおいてもう一度お試しください");
      return;
    }
  } else {
    grantCouponDefinitionToMember(coupon, member, {
      reason,
      memo,
      staffName: getAdminSession()?.name || "スタッフ"
    });
  }
  appState.memberChartTab = "coupons";
  appState.adminMemberDetailId = member.memberId;
  addAdminLog("coupon_grant", `${member.realName || member.memberId} に${coupon.title}を付与`, getAdminSession()?.name, member.memberId);
  renderAdmin();
}

function showCouponUsage(couponId) {
  const coupon = getAdminCoupons().find((item) => item.couponId === couponId);
  const issued = readJson(STORAGE_KEYS.myCoupons, []).filter((item) => item.parentCouponId === couponId || item.couponDefinitionId === couponId);
  if (!coupon) return;
  window.alert(`${coupon.title} の利用状況\n発行数：${issued.length}\n使用済み：${issued.filter((item) => getCouponStatus(item) === "使用済み").length}\n未使用：${issued.filter((item) => getCouponStatus(item) === "使用可能").length}\n予約使用予定：${issued.filter((item) => getCouponStatus(item) === "予約で使用予定").length}`);
}

function cancelLoungeEntry(entryId) {
  const entries = readJson(STORAGE_KEYS.loungeEntries, []);
  const entry = entries.find((item) => item.entryId === entryId);
  if (!entry) return;
  entry.status = "取り消し";
  writeJson(STORAGE_KEYS.loungeEntries, entries);
  addAdminLog("lounge", `${entry.nickname} の事前登録を取り消し`, getAdminSession()?.name);
  renderApp();
}

function addAdminNotice() {
  const notices = readJson(STORAGE_KEYS.adminNotices, []);
  const title = window.prompt("お知らせタイトルを入力してください", "新しいお知らせ");
  if (!title) return;
  notices.unshift({
    noticeId: createId("NOTICE"),
    title,
    body: "本文を管理画面で編集します。",
    imageUrl: "",
    startAt: jstDateKey(),
    endAt: "",
    audience: "全会員",
    isImportant: false,
    lineNotify: false,
    status: "下書き"
  });
  writeJson(STORAGE_KEYS.adminNotices, notices);
  addAdminLog("notice", `${title} を作成`, getAdminSession()?.name);
  renderAdmin();
}

function toggleAdminNotice(noticeId) {
  const notices = readJson(STORAGE_KEYS.adminNotices, []);
  const notice = notices.find((item) => item.noticeId === noticeId);
  if (!notice) return;
  notice.status = notice.status === "公開" ? "下書き" : "公開";
  writeJson(STORAGE_KEYS.adminNotices, notices);
  addAdminLog("notice", `${notice.title} を${notice.status}に変更`, getAdminSession()?.name);
  renderAdmin();
}

function applyMemberFilter() {
  appState.adminMemberQuery = document.getElementById("adminMemberSearch")?.value || "";
  appState.adminMemberFilter = document.getElementById("adminMemberFilter")?.value || "all";
  renderAdmin();
}

function getMembers() {
  return readJson(STORAGE_KEYS.members, []);
}

function findMember(memberId) {
  return getMembers().find((member) => String(member.memberId) === String(memberId));
}

function getVisitReceptions() {
  return readJson(STORAGE_KEYS.visitReceptions, []);
}

function getLoungeEntries() {
  return readJson(STORAGE_KEYS.loungeEntries, []);
}

function getAdminCoupons() {
  return readJson(STORAGE_KEYS.adminCoupons, defaultManagedCoupons).map(normalizeCouponDefinition);
}

function getAdminFortunes() {
  return readJson(STORAGE_KEYS.adminFortunes, fortuneTypes.map((type, index) => ({
    fortuneId: `FORTUNE-${index + 1}`,
    date: jstDateKey(),
    type,
    total: 72 + index,
    work: 68 + index,
    love: 66 + index,
    beauty: 80 + index,
    luckyColor: luckyColors[index % luckyColors.length],
    advice: fortuneMessages[index % fortuneMessages.length],
    recommendedMenu: ["透明感カラー", "髪質改善トリートメント", "ヘッドスパ"][index % 3],
    recommendedCoupon: "おすすめクーポン"
  })));
}

function filterMembers(members) {
  const query = normalizeSearchText(appState.adminMemberQuery);
  return members.filter((member) => {
    const haystack = normalizeSearchText([member.memberId, member.realName, member.nickname, member.lineDisplayName, member.phone].join(" "));
    if (query && !haystack.includes(query)) return false;
    if (appState.adminMemberFilter === "new") return member.memberStatus === "仮会員";
    if (appState.adminMemberFilter === "visited") return Number(member.visitCount || 0) > 0;
    if (appState.adminMemberFilter === "inactive") return member.lastVisitDate && daysSince(member.lastVisitDate) >= 60;
    if (appState.adminMemberFilter === "gachaUnused") return !getMemberGachaStatus(member).used;
    if (appState.adminMemberFilter === "coupon") return getMemberCoupons(member).some((coupon) => coupon.status === "未使用");
    if (appState.adminMemberFilter === "lounge") return getLoungeEntries().some((entry) => entry.lineUserId === member.lineUserId || entry.memberId === member.memberId);
    return true;
  });
}

function getMemberBookings(member) {
  return readJson(STORAGE_KEYS.bookings, []).filter((booking) => (
    booking.memberId === member.memberId ||
    booking.lineUserId === member.lineUserId ||
    booking.customerName === member.realName ||
    booking.customerName === member.nickname
  ));
}

function getMemberCoupons(member) {
  return readJson(STORAGE_KEYS.myCoupons, []).filter((coupon) => (
    !coupon.memberId ||
    coupon.memberId === member.memberId ||
    coupon.lineUserId === member.lineUserId
  ));
}

function getMemberGachaStatus(member) {
  const month = currentMonthKey();
  const draws = readJson(STORAGE_KEYS.monthlyGachaDraws, []);
  const draw = draws.find((item) => (
    String(item.issueMonth || "") === month &&
    (
      String(item.memberId || "") === String(member?.memberId || "") ||
      (member?.lineUserId && String(item.lineUserId || "") === String(member.lineUserId))
    )
  ));
  return { used: Boolean(draw), state: draw ? "利用済み" : "利用可能", draw: draw || null };
}

function getStoreSettings() {
  const settings = {
    ...defaultStoreSettings,
    ...readJson(STORAGE_KEYS.storeSettings, {})
  };
  settings.staff = (Array.isArray(settings.staff) ? settings.staff : defaultStoreSettings.staff).map((staff) => ({
    ...staff,
    name: formatStaffDisplayName(staff.name)
  }));
  return settings;
}

function getReservationMenus() {
  const fallback = isProductionApiMode() ? [] : defaultReservationMenus;
  const storedMenus = isProductionApiMode() && appState.menuMasterSyncStatus === "pending"
    ? []
    : readJson(STORAGE_KEYS.reservationMenus, fallback);
  return storedMenus
    .map((menu) => ({
      ...menu,
      regularPrice: Number(menu.regularPrice || 0),
      couponPrice: Number(menu.couponPrice || 0),
      durationMinutes: Number(menu.durationMinutes || 0),
      sortOrder: Number(menu.sortOrder || 0),
      targetStaff: Array.isArray(menu.targetStaff) ? menu.targetStaff : parseCsv(menu.targetStaff),
      targetWeekdays: Array.isArray(menu.targetWeekdays) ? menu.targetWeekdays.map(Number) : parseCsv(menu.targetWeekdays).map(Number)
    }))
    .filter((menu) => menu.type === "通常メニュー")
    .sort((a, b) => (String(a.type).localeCompare(String(b.type), "ja")) || Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
}

function writeReservationMenus(menus) {
  writeJson(STORAGE_KEYS.reservationMenus, menus.map((menu) => ({
    ...menu,
    updatedAt: menu.updatedAt || new Date().toISOString()
  })));
  renderBookingFormOptions();
}

function getBookingMenuContext() {
  return {
    staffId: document.getElementById("bookingStaffSelect")?.value || "",
    dateTime: document.getElementById("bookingFirstDateTime")?.value || ""
  };
}

function getPublicReservationMenus(context = {}) {
  const today = jstDateKey();
  return getReservationMenus()
    .filter((menu) => menu.isPublic !== false)
    .filter((menu) => !menu.publishStartAt || String(menu.publishStartAt).slice(0, 10) <= today)
    .filter((menu) => !menu.publishEndAt || String(menu.publishEndAt).slice(0, 10) >= today)
    .filter((menu) => isReservationMenuForStaff(menu, context.staffId))
    .filter((menu) => isReservationMenuForDate(menu, context.dateTime))
    .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
}

function isReservationMenuForStaff(menu, staffId) {
  const id = String(staffId || "");
  if (!id || id === "no-preference" || id === "consult") return true;
  const staffIds = Array.isArray(menu.targetStaff) ? menu.targetStaff.map(String) : parseCsv(menu.targetStaff);
  return !staffIds.length || staffIds.includes(id) || staffIds.includes("no-preference");
}

function isReservationMenuForDate(menu, dateTime) {
  if (!dateTime) return true;
  const date = new Date(dateTime);
  if (Number.isNaN(date.getTime())) return true;
  const weekdays = Array.isArray(menu.targetWeekdays) ? menu.targetWeekdays.map(Number) : parseCsv(menu.targetWeekdays).map(Number);
  return !weekdays.length || weekdays.includes(date.getDay());
}

function formatTargetStaff(staffIds) {
  const settings = getStoreSettings();
  const ids = Array.isArray(staffIds) ? staffIds : parseCsv(staffIds);
  if (!ids.length) return "全スタッフ";
  return ids.map((id) => settings.staff.find((staff) => staff.staffId === id)?.name || id).join("、");
}

function formatTargetWeekdays(days) {
  const labels = ["日", "月", "火", "水", "木", "金", "土"];
  const values = Array.isArray(days) ? days.map(Number) : parseCsv(days).map(Number);
  if (!values.length) return "全曜日";
  return values.map((day) => labels[day] || day).join("、");
}

function formatPublishPeriod(menu) {
  const start = menu.publishStartAt || "指定なし";
  const end = menu.publishEndAt || "期限なし";
  return `${start}〜${end}`;
}

function parseCsv(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function promptNumber(message, currentValue) {
  const value = window.prompt(message, Number(currentValue || 0));
  if (value === null) return null;
  const number = Number(String(value).replace(/,/g, ""));
  if (Number.isNaN(number)) {
    showToast("数値を入力してください。");
    return null;
  }
  return number;
}

function nextReservationMenuSortOrder(menus) {
  return menus.reduce((max, menu) => Math.max(max, Number(menu.sortOrder || 0)), 0) + 10;
}

function createSlugId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function ensureDefaultReservationMenus() {
  const menus = getReservationMenus();
  let changed = false;
  defaultReservationMenus.filter((menu) => menu.type === "通常メニュー").forEach((defaultMenu) => {
    if (!menus.some((menu) => menu.menuId === defaultMenu.menuId)) {
      menus.push(defaultMenu);
      changed = true;
    }
  });
  if (changed) writeJson(STORAGE_KEYS.reservationMenus, menus);
}

function ensureDefaultAdminCoupons() {
  const coupons = getAdminCoupons();
  let changed = false;
  defaultManagedCoupons.forEach((defaultCoupon) => {
    if (!coupons.some((coupon) => coupon.couponId === defaultCoupon.couponId)) {
      coupons.push(defaultCoupon);
      changed = true;
    }
  });
  if (changed) writeJson(STORAGE_KEYS.adminCoupons, coupons.map(normalizeCouponDefinition));
}

function ensureDefaultCollectionRewards() {
  const rewards = getCollectionRewards();
  let changed = false;
  defaultCollectionRewards.forEach((defaultReward) => {
    if (!rewards.some((reward) => reward.rewardId === defaultReward.rewardId)) {
      rewards.push(defaultReward);
      changed = true;
    }
  });
  if (changed) writeJson(STORAGE_KEYS.collectionRewards, rewards);
}

function ensureCollectionGachaSettings() {
  const settings = getGachaSettings();
  let changed = false;
  const month = currentMonthKey();
  let current = settings.find((setting) => setting.issueMonth === month);
  if (!current) {
    settings.push(defaultMonthlyGachaSettings[0]);
    changed = true;
  } else if (!current.cards || current.cards.length < 30) {
    const previousCards = Array.isArray(current.cards) ? current.cards : [];
    current.cards = buildDefaultMonthlyGachaCards(month).map((card) => {
      const old = previousCards.find((item) => item.cardId === card.cardId || item.characterId === card.characterId);
      return old ? { ...card, ...old, cardId: card.cardId, characterId: card.characterId } : card;
    });
    current.title = current.title || `${formatMonthLabel(month)}レアキャラクターガチャ`;
    current.description = current.description || "月に1枚、TEAM LINKのキャラクターカードを獲得できます。";
    current.rarityRates = current.rarityRates || { ...defaultGachaRarityRates };
    changed = true;
  } else if (!current.rarityRates) {
    current.rarityRates = { ...defaultGachaRarityRates };
    changed = true;
  }
  settings.forEach((setting) => {
    (setting.cards || []).forEach((card) => {
      const defaultPath = `images/gacha/characters/${card.characterId || card.cardId}.png`;
      const monthEnd = endOfMonthDateKeyFor(setting.issueMonth || currentMonthKey());
      if (!card.imagePath) {
        card.imagePath = defaultPath;
        changed = true;
      }
      if (card.validUntil !== monthEnd || card.expires !== monthEnd) {
        card.validUntil = monthEnd;
        card.expires = monthEnd;
        changed = true;
      }
      if (card.stockCount === undefined) {
        card.stockCount = 999;
        changed = true;
      }
      if (card.canCombine === undefined) {
        card.canCombine = false;
        changed = true;
      }
      if (card.notice === undefined) {
        card.notice = "";
        changed = true;
      }
      if (!card.imageUrl && ["character-01", "character-02", "character-03"].includes(String(card.characterId || card.cardId))) {
        card.imageUrl = defaultPath;
        changed = true;
      }
    });
  });
  if (changed) writeGachaSettings(settings);
}

function normalizeGachaCharacterImages() {
  const characters = getGachaCharacters();
  let changed = false;
  characters.forEach((character) => {
    const defaultPath = `images/gacha/characters/${character.characterId}.png`;
    if (!character.imagePath) {
      character.imagePath = defaultPath;
      changed = true;
    }
    if (!character.imageUrl && ["character-01", "character-02", "character-03"].includes(String(character.characterId))) {
      character.imageUrl = defaultPath;
      changed = true;
    }
  });
  if (changed) writeGachaCharacters(characters);
}

function syncGachaCharacterNames() {
  const nameById = Object.fromEntries(defaultGachaCharacters.map((character) => [character.characterId, character.name]));
  const characters = getGachaCharacters();
  let charactersChanged = false;
  characters.forEach((character) => {
    const defaultName = nameById[character.characterId];
    if (defaultName && character.name !== defaultName) {
      character.name = defaultName;
      charactersChanged = true;
    }
  });
  if (charactersChanged) writeGachaCharacters(characters);

  const settings = getGachaSettings();
  let settingsChanged = false;
  settings.forEach((setting) => {
    (setting.cards || []).forEach((card) => {
      const defaultName = nameById[card.characterId || card.cardId];
      if (!defaultName) return;
      if (card.cardName !== defaultName) {
        card.cardName = defaultName;
        settingsChanged = true;
      }
      if (card.characterName !== defaultName) {
        card.characterName = defaultName;
        settingsChanged = true;
      }
    });
  });
  if (settingsChanged) writeGachaSettings(settings);
}

function normalizeStoredMyCoupons() {
  const coupons = readJson(STORAGE_KEYS.myCoupons, []);
  let changed = false;
  const normalized = coupons.map((coupon) => {
    const next = { ...coupon };
    if (!next.validUntil && next.expires) {
      next.validUntil = next.expires;
      changed = true;
    }
    if (!next.expires && next.validUntil) {
      next.expires = next.validUntil;
      changed = true;
    }
    if (!next.couponType) {
      next.couponType = next.sourceType === "gacha-card" ? "ガチャ当選クーポン" : next.sourceType === "collection-reward" ? "年間カードコレクション特典" : "個別付与クーポン";
      changed = true;
    }
    if (!next.source) {
      next.source = next.sourceType === "gacha-card" ? "ガチャ" : next.sourceType === "collection-reward" ? "年間特典" : "Console作成";
      changed = true;
    }
    if (!next.selectableOnBooking) {
      next.selectableOnBooking = true;
      changed = true;
    }
    return next;
  });
  if (changed) writeJson(STORAGE_KEYS.myCoupons, normalized);
}

function issueCollectionRewardCoupon(memberId, reward) {
  const member = findMember(memberId);
  if (!member || !reward.issueAsCoupon) return null;
  const exists = readJson(STORAGE_KEYS.myCoupons, []).some((coupon) => (
    coupon.memberId === member.memberId &&
    coupon.sourceType === "collection-reward" &&
    coupon.linkedRewardId === reward.rewardId
  ));
  if (exists) return null;
  const base = getAdminCoupons().find((coupon) => coupon.source === "年間特典" && coupon.title === reward.title) || normalizeCouponDefinition({
    couponId: `COLLECTION-COUPON-${reward.rewardId}`,
    title: reward.title,
    description: reward.description,
    couponType: "年間カードコレクション特典",
    category: "年間特典",
    validUntil: reward.validUntil,
    condition: `${reward.requiredCount}枚達成特典`,
    source: "年間特典",
    isPublic: true,
    selectableOnBooking: true
  });
  if (isProductionApiMode()) {
    apiRequest("issueCollectionRewardCoupon", {
      memberId: member.memberId,
      lineUserId: member.lineUserId || "",
      couponId: base.couponId,
      collectionRewardId: reward.rewardId,
      targetYear: reward.year || currentYear(),
      rewardName: reward.title,
      transactionId: createTransactionId("COLLECTION-COUPON")
    }).then((result) => {
      mergeServerMemberCoupon(result.memberCoupon);
      renderApp();
    }).catch(() => {
      showToast("通信に失敗しました。時間をおいてもう一度お試しください");
    });
    return null;
  }
  return grantCouponDefinitionToMember(base, member, {
    source: "年間特典",
    sourceType: "collection-reward",
    sourceId: reward.rewardId,
    linkedRewardId: reward.rewardId,
    expires: reward.validUntil,
    reason: `${reward.requiredCount}枚達成`,
    staffName: "自動発行"
  });
}

function getStaffName(staffId) {
  return formatStaffDisplayName(getStoreSettings().staff.find((staff) => String(staff.staffId) === String(staffId))?.name || "");
}

function formatStaffDisplayName(value) {
  return String(value || "").replace(/^BOSS[\s　]*/i, "").trim();
}

function normalizeBookingSource(booking) {
  return String(booking?.reservationSource || booking?.source || "").trim();
}

function formatYen(value) {
  const amount = Number(value || 0);
  if (!amount) return "店舗確認";
  return `${amount.toLocaleString("ja-JP")}円`;
}

function formatMinutes(value) {
  const minutes = Number(value || 0);
  if (!minutes) return "店舗確認";
  const hours = Math.floor(minutes / 60);
  const remain = minutes % 60;
  if (!hours) return `${remain}分`;
  return remain ? `${hours}時間${remain}分` : `${hours}時間`;
}

function toDatetimeLocalValue(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function toTimeValue(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function completeSingleTodayBookingForMember(member) {
  const bookings = readJson(STORAGE_KEYS.bookings, []);
  const todayBookings = bookings.filter((booking) => (
    String(booking.memberId || "") === String(member.memberId || "") &&
    normalizeBookingStatus(booking.status) === "予約確定" &&
    isToday(getBookingDisplayDateTime(booking))
  ));
  if (todayBookings.length !== 1) return;
  todayBookings[0].status = "来店済み";
  todayBookings[0].currentStatus = "来店済み";
  todayBookings[0].visitedAt = new Date().toISOString();
  todayBookings[0].updatedAt = new Date().toISOString();
  writeJson(STORAGE_KEYS.bookings, bookings);
  addAdminLog("booking_auto_visit", `${member.realName || member.memberId} の当日予約を来店済みに変更`, getAdminSession()?.name, member.memberId);
}

function buildMemberTimeline(member) {
  const rows = [];
  (member.visitHistory || []).forEach((visit) => rows.push({ date: visit.date, text: `来店確認: ${visit.source}` }));
  getMemberBookings(member).forEach((booking) => rows.push({ date: booking.createdAt || "", text: `予約: ${booking.menu} / ${normalizeBookingStatus(booking.status)}` }));
  getMemberCoupons(member).forEach((coupon) => rows.push({ date: coupon.drawnAt || coupon.createdAt || "", text: `クーポン: ${coupon.title} / ${coupon.status}` }));
  return rows.sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 5);
}

function getMemberLogs(member) {
  return readJson(STORAGE_KEYS.adminLogs, []).filter((log) => (
    String(log.targetId || "") === String(member.memberId || "") ||
    String(log.message || "").includes(member.realName || "") ||
    String(log.message || "").includes(member.memberId || "")
  ));
}

function normalizeBookingStatus(status) {
  const value = String(status || "").trim();
  if (["pending", "staff_checking", "スタッフ確認待ち", "返信待ち", "予約希望", "確認待ち", ""].includes(value)) return "予約希望";
  if (["needs_change", "日時変更相談"].includes(value)) return "日時変更相談";
  if (["proposed", "alternative_proposed", "別日時提案中"].includes(value)) return "別日時提案中";
  if (["waiting_customer", "お客様返答待ち"].includes(value)) return "お客様返答待ち";
  if (["salon_board_entered", "サロンボード入力済み"].includes(value)) return "サロンボード入力済み";
  if (["confirmed", "予約確定"].includes(value)) return "予約確定";
  if (["change_requested", "変更依頼"].includes(value)) return "変更依頼";
  if (["cancel_requested", "キャンセル依頼"].includes(value)) return "キャンセル依頼";
  if (["visited", "来店済み"].includes(value)) return "来店済み";
  if (["cancelled", "キャンセル"].includes(value)) return "キャンセル";
  if (["done", "対応完了"].includes(value)) return "対応完了";
  return value || "予約希望";
}

function formatReceptionTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return formatDateTime(value);
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function statusTone(status) {
  if (status === "確認待ち") return "warning";
  if (status === "確認済み") return "success";
  if (status === "通常メッセージ") return "neutral";
  if (status === "取り消し") return "muted";
  return "neutral";
}

function syncProfileFromMember(member) {
  const profile = getProfile();
  if (String(profile.memberId) !== String(member.memberId) && profile.lineUserId !== member.lineUserId) return;
  writeJson(STORAGE_KEYS.profile, {
    ...profile,
    memberId: member.memberId,
    lineUserId: member.lineUserId,
    nickname: member.nickname || member.realName || profile.nickname,
    lastVisitDate: member.lastVisitDate,
    visitCount: Number(member.visitCount || 0)
  });
}

function addAdminLog(action, message, adminName = "system", targetId = "") {
  const logs = readJson(STORAGE_KEYS.adminLogs, []);
  logs.unshift({
    logId: createId("LOG"),
    action,
    message,
    adminName,
    targetId,
    createdAt: new Date().toISOString()
  });
  writeJson(STORAGE_KEYS.adminLogs, logs.slice(0, 80));
}

function emptyAdminState(message) {
  return `<article class="admin-empty"><p>${escapeHtml(message)}</p></article>`;
}

function renderAdminDataState(title, status, errorMessage) {
  const loading = status === "pending" || status === "loading";
  return `
    <section class="admin-section-head"><div><h3>${escapeHtml(title)}</h3></div></section>
    ${emptyAdminState(loading ? "本番データを取得しています…" : errorMessage)}
  `;
}

function normalizeSearchText(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, "");
}

function createGuestId() {
  const uuid = globalThis.crypto?.randomUUID?.()
    || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
  return `guest_${String(uuid).replace(/[^a-zA-Z0-9]/g, "")}`;
}

function getOrCreateGuestId() {
  const stored = String(localStorage.getItem(STORAGE_KEYS.guestId) || "").trim();
  if (stored) return stored;
  const guestId = createGuestId();
  localStorage.setItem(STORAGE_KEYS.guestId, guestId);
  return guestId;
}

function migrateLegacyFixedProfileToGuest(profile = {}) {
  const memberId = String(profile.memberId || "").trim();
  const lineUserId = String(profile.lineUserId || "").trim();
  const linkedMemberId = String(profile.linkedMemberId || "").trim();
  const isLegacyFixedProfile = memberId === LEGACY_FIXED_PROFILE.memberId
    && lineUserId === LEGACY_FIXED_PROFILE.lineUserId
    && !linkedMemberId;
  if (!isLegacyFixedProfile) return profile;

  const guestId = createGuestId();
  localStorage.setItem(STORAGE_KEYS.guestId, guestId);
  const guestProfile = {
    ...defaultProfile,
    memberId: guestId,
    guestId,
    identityType: "guest"
  };
  writeJson(STORAGE_KEYS.profile, guestProfile);
  console.info("[TEAM LINK IDENTITY] legacy fixed profile migrated", { userId: guestId });
  return guestProfile;
}

function removeRetiredDevelopmentGachaCache() {
  const isRetiredDraw = (item) => [
    item?.drawId,
    item?.cardHistoryId,
    item?.gachaHistoryId,
    item?.linkedCardHistoryId,
    item?.sourceId
  ].some((value) => RETIRED_DEVELOPMENT_DRAW_IDS.has(String(value || "")));
  [STORAGE_KEYS.monthlyGachaDraws, STORAGE_KEYS.gachaCardHistory].forEach((key) => {
    const items = readJson(key, []);
    const filtered = items.filter((item) => !isRetiredDraw(item));
    if (filtered.length !== items.length) writeJson(key, filtered);
  });
  const coupons = readJson(STORAGE_KEYS.myCoupons, []);
  const filteredCoupons = coupons.filter((coupon) => !isRetiredDraw(coupon));
  if (filteredCoupons.length !== coupons.length) writeJson(STORAGE_KEYS.myCoupons, filteredCoupons);
  const selections = readJson(STORAGE_KEYS.mySelections, []);
  const filteredSelections = selections.filter((item) => !isRetiredDraw(item));
  if (filteredSelections.length !== selections.length) writeJson(STORAGE_KEYS.mySelections, filteredSelections);
}

function removeProductionDemoCaches() {
  if (!isProductionApiMode()) return;
  const isDemoMember = (member) => (
    String(member?.lineUserId || "").startsWith("U-demo-") ||
    ["山田 花子", "佐藤 美咲", "鈴木 玲奈"].includes(String(member?.realName || "")) ||
    String(member?.phone || "").startsWith("090-0000-")
  );
  const members = readJson(STORAGE_KEYS.members, []);
  const productionMembers = members.filter((member) => !isDemoMember(member));
  if (productionMembers.length !== members.length) writeJson(STORAGE_KEYS.members, productionMembers);

  const receptions = readJson(STORAGE_KEYS.visitReceptions, []);
  const productionReceptions = receptions.filter((item) => (
    !String(item?.receptionId || "").startsWith("VISIT-DEMO-") &&
    !String(item?.lineUserId || "").startsWith("U-demo-")
  ));
  if (productionReceptions.length !== receptions.length) writeJson(STORAGE_KEYS.visitReceptions, productionReceptions);
}

function resolveCurrentUserKey(profile = {}, guestId = getOrCreateGuestId()) {
  const linkedMemberId = String(profile.linkedMemberId || "").trim();
  if (linkedMemberId) return linkedMemberId;
  const memberId = String(profile.memberId || "").trim();
  if (memberId && memberId !== "demo-member") return memberId;
  return String(profile.guestId || guestId).trim() || guestId;
}

function getCurrentUserKey() {
  return resolveCurrentUserKey(readJson(STORAGE_KEYS.profile, {}), getOrCreateGuestId());
}

async function linkGuestToMemberIdentity(memberId, lineUserId = "") {
  const nextMemberId = String(memberId || "").trim();
  if (!nextMemberId) throw new Error("会員IDが必要です。");
  const storedProfile = readJson(STORAGE_KEYS.profile, {});
  const guestId = String(storedProfile.guestId || getOrCreateGuestId()).trim();
  if (isProductionApiMode() && guestId && guestId !== nextMemberId) {
    await apiRequest("linkGuestUser", {
      guestId,
      userId: nextMemberId,
      memberId: nextMemberId,
      lineUserId: String(lineUserId || "").trim()
    });
  }
  writeJson(STORAGE_KEYS.profile, {
    ...defaultProfile,
    ...storedProfile,
    guestId,
    memberId: nextMemberId,
    linkedMemberId: nextMemberId,
    lineUserId: String(lineUserId || storedProfile.lineUserId || "").trim(),
    identityType: "member"
  });
  return nextMemberId;
}

function isToday(value) {
  if (!value) return false;
  return String(value).slice(0, 10) === jstDateKey();
}

function daysBetween(fromDate, toDate) {
  const from = new Date(`${fromDate}T00:00:00+09:00`);
  const to = new Date(`${toDate}T00:00:00+09:00`);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return 0;
  return Math.max(0, Math.round((to.getTime() - from.getTime()) / 86400000));
}

function ensureDemoState() {
  removeRetiredDevelopmentGachaCache();
  removeProductionDemoCaches();
  const migratedProfile = migrateLegacyFixedProfileToGuest(readJson(STORAGE_KEYS.profile, {}));
  const guestId = String(migratedProfile.guestId || getOrCreateGuestId()).trim();
  const storedProfile = migratedProfile;
  if (!localStorage.getItem(STORAGE_KEYS.profile) || !storedProfile.memberId || storedProfile.memberId === "demo-member") {
    writeJson(STORAGE_KEYS.profile, {
      ...defaultProfile,
      ...storedProfile,
      memberId: guestId,
      guestId,
      lineUserId: "",
      identityType: "guest",
      nickname: storedProfile.nickname && storedProfile.nickname !== "花子" ? storedProfile.nickname : "お客様"
    });
  } else if (!storedProfile.guestId || !storedProfile.identityType) {
    writeJson(STORAGE_KEYS.profile, {
      ...defaultProfile,
      ...storedProfile,
      guestId: storedProfile.guestId || guestId,
      identityType: String(storedProfile.memberId).startsWith("guest_") ? "guest" : "member"
    });
  }
  if (!localStorage.getItem(STORAGE_KEYS.storeSettings)) {
    writeJson(STORAGE_KEYS.storeSettings, defaultStoreSettings);
  }
  if (isProductionApiMode()) {
    writeJson(STORAGE_KEYS.reservationMenus, []);
  } else if (!localStorage.getItem(STORAGE_KEYS.reservationMenus)) {
    writeJson(STORAGE_KEYS.reservationMenus, defaultReservationMenus.filter((menu) => menu.type === "通常メニュー"));
  } else {
    ensureDefaultReservationMenus();
  }
  if (!localStorage.getItem(STORAGE_KEYS.gachaCharacters)) {
    writeJson(STORAGE_KEYS.gachaCharacters, defaultGachaCharacters);
  }
  normalizeGachaCharacterImages();
  if (!localStorage.getItem(STORAGE_KEYS.gachaPrizes)) {
    writeJson(STORAGE_KEYS.gachaPrizes, defaultGachaPrizes);
  }
  if (!localStorage.getItem(STORAGE_KEYS.monthlyGachaSettings)) {
    writeJson(STORAGE_KEYS.monthlyGachaSettings, defaultMonthlyGachaSettings);
  } else {
    ensureCollectionGachaSettings();
  }
  syncGachaCharacterNames();
  if (isProductionApiMode()) {
    writeJson(STORAGE_KEYS.collectionRewards, []);
  } else if (!localStorage.getItem(STORAGE_KEYS.collectionRewards)) {
    writeJson(STORAGE_KEYS.collectionRewards, defaultCollectionRewards);
  } else {
    ensureDefaultCollectionRewards();
  }
  if (isProductionApiMode()) {
    writeJson(STORAGE_KEYS.adminCoupons, []);
    writeJson(STORAGE_KEYS.gachaAdminRewards, []);
    writeJson(STORAGE_KEYS.adminCouponUsageHistory, []);
  } else if (!localStorage.getItem(STORAGE_KEYS.adminCoupons)) {
    writeJson(STORAGE_KEYS.adminCoupons, defaultManagedCoupons);
  } else {
    ensureDefaultAdminCoupons();
  }
  if (!localStorage.getItem(STORAGE_KEYS.gachaCardHistory)) {
    writeJson(STORAGE_KEYS.gachaCardHistory, []);
  }
  if (!localStorage.getItem(STORAGE_KEYS.gachaTestLog)) {
    writeJson(STORAGE_KEYS.gachaTestLog, []);
  }
  refreshGachaCardStates();
  if (!isProductionApiMode() && !localStorage.getItem(STORAGE_KEYS.members)) {
    writeJson(STORAGE_KEYS.members, [
      {
        memberId: "TL-000001",
        lineUserId: "U-demo-1",
        lineDisplayName: "花子",
        nickname: "花子",
        realName: "山田 花子",
        phone: "090-0000-0001",
        createdAt: "2026-06-01",
        updatedAt: "2026-07-20",
        lastVisitDate: "2026-06-18",
        visitCount: 4,
        visitHistory: [{ date: "2026-06-18", source: "手動登録" }],
        memberStatus: "既存会員",
        status: "有効",
        staff: "神田 加奈",
        visitCycle: "40日前後",
        recommendedMenu: "透明感カラー",
        caution: "夕方以降の連絡がつながりやすい",
        adminMemo: "カラー周期は40日前後",
        memos: [
          {
            memoId: "MEMO-DEMO-1",
            body: "次回カラー提案。ベージュ系が好み。",
            author: "村松 剛好",
            createdAt: "2026-06-18T10:00:00+09:00",
            updatedAt: "2026-06-18T10:00:00+09:00"
          }
        ]
      },
      {
        memberId: "TL-000002",
        lineUserId: "U-demo-2",
        lineDisplayName: "Misaki",
        nickname: "美咲",
        realName: "佐藤 美咲",
        phone: "090-0000-0002",
        createdAt: "2026-07-04",
        updatedAt: "2026-07-12",
        lastVisitDate: "2026-07-12",
        visitCount: 1,
        visitHistory: [{ date: "2026-07-12", source: "LINE来店受付" }],
        memberStatus: "既存会員",
        staff: "村松剛好",
        visitCycle: "60日前後",
        recommendedMenu: "髪質改善トリートメント",
        caution: "",
        status: "有効",
        adminMemo: ""
      }
    ]);
  }
  if (!isProductionApiMode() && !localStorage.getItem(STORAGE_KEYS.visitReceptions)) {
    writeJson(STORAGE_KEYS.visitReceptions, [
      {
        receptionId: "VISIT-DEMO-1",
        lineUserId: "U-demo-1",
        memberId: "TL-000001",
        sentName: "山田 花子",
        registeredName: "山田 花子",
        lineDisplayName: "花子",
        receptionType: "既存",
        receivedAt: new Date().toISOString(),
        status: "確認待ち"
      },
      {
        receptionId: "VISIT-DEMO-2",
        lineUserId: "U-demo-3",
        memberId: "TL-000003",
        sentName: "鈴木 玲奈",
        registeredName: "鈴木 玲奈",
        lineDisplayName: "Rena",
        receptionType: "新規",
        receivedAt: new Date(Date.now() - 3600000).toISOString(),
        status: "確認待ち"
      },
      {
        receptionId: "VISIT-DEMO-3",
        lineUserId: "U-demo-2",
        memberId: "TL-000002",
        sentName: "今日は空いていますか？",
        registeredName: "佐藤 美咲",
        lineDisplayName: "Misaki",
        receptionType: "既存",
        receivedAt: new Date(Date.now() - 7200000).toISOString(),
        status: "通常メッセージ"
      }
    ]);
    if (!getMembers().some((member) => member.memberId === "TL-000003")) {
      const members = getMembers();
      members.push({
        memberId: "TL-000003",
        lineUserId: "U-demo-3",
        lineDisplayName: "Rena",
        nickname: "玲奈",
        realName: "鈴木 玲奈",
        phone: "",
        createdAt: jstDateKey(),
        updatedAt: jstDateKey(),
        lastVisitDate: "",
        visitCount: 0,
        memberStatus: "仮会員",
        status: "有効",
        adminMemo: ""
      });
      writeJson(STORAGE_KEYS.members, members);
    }
  }
  if (!localStorage.getItem(STORAGE_KEYS.adminNotices)) {
    writeJson(STORAGE_KEYS.adminNotices, [
      { noticeId: "NOTICE-1", title: "8月のおすすめカラー", body: "透明感カラーのご相談受付中です。", imageUrl: "", startAt: "2026-08-01", endAt: "2026-08-31", audience: "全会員", isImportant: false, lineNotify: true, status: "下書き" },
      { noticeId: "NOTICE-2", title: "お盆期間の営業について", body: "予約枠に限りがあります。", imageUrl: "", startAt: "2026-08-01", endAt: "2026-08-16", audience: "全会員", isImportant: true, lineNotify: false, status: "公開" }
    ]);
  }
  if (!localStorage.getItem(STORAGE_KEYS.myCoupons)) {
    writeJson(STORAGE_KEYS.myCoupons, isProductionApiMode() ? [] : [
      {
        couponId: "MYCOUPON-DEMO-1",
        parentCouponId: "COUPON-500-OFF",
        couponDefinitionId: "COUPON-500-OFF",
        memberId: "TL-000001",
        lineUserId: "U-demo-1",
        title: "500円OFF",
        couponType: "全会員向けクーポン",
        category: "おすすめ",
        regularPrice: 0,
        couponPrice: 0,
        discountAmount: 500,
        discountRate: 0,
        targetMenu: "全メニュー",
        message: "1会計につき1枚利用できます",
        condition: "施術メニューと併用",
        source: "Console作成",
        sourceType: "Console作成",
        expires: endOfMonthDateKey(),
        validUntil: endOfMonthDateKey(),
        status: "未使用",
        selectableOnBooking: true,
        createdAt: "2026-07-20T10:00:00+09:00",
        updatedAt: "2026-07-20T10:00:00+09:00"
      },
      {
        couponId: "MYCOUPON-DEMO-2",
        parentCouponId: "COUPON-BIRTHDAY-500",
        couponDefinitionId: "COUPON-BIRTHDAY-500",
        memberId: "TL-000001",
        lineUserId: "U-demo-1",
        title: "誕生日500円OFF",
        couponType: "誕生日クーポン",
        category: "誕生日",
        discountAmount: 500,
        targetMenu: "全メニュー",
        message: "お誕生日月に使えるお祝いクーポンです。",
        condition: "誕生日月のみ利用できます",
        source: "誕生日",
        sourceType: "birthday",
        expires: "2026-12-31",
        validUntil: "2026-12-31",
        status: "未使用",
        selectableOnBooking: true,
        createdAt: "2026-07-20T10:00:00+09:00",
        updatedAt: "2026-07-20T10:00:00+09:00"
      }
    ]);
  } else {
    normalizeStoredMyCoupons();
  }
  if (!localStorage.getItem(STORAGE_KEYS.monthlyGachaDraws) && isProductionApiMode()) {
    writeJson(STORAGE_KEYS.monthlyGachaDraws, []);
  } else if (!localStorage.getItem(STORAGE_KEYS.monthlyGachaDraws)) {
    const demoCard = defaultMonthlyGachaSettings[0].cards.find((card) => card.cardId === "character-08") || defaultMonthlyGachaSettings[0].cards[0];
    writeJson(STORAGE_KEYS.monthlyGachaDraws, [
      {
        drawId: "GACHA-DEMO-1",
        cardHistoryId: "CARD-DEMO-1",
        memberId: "TL-000001",
        lineUserId: "U-demo-1",
        issueMonth: previousMonthKey(),
        cardId: demoCard.cardId,
        characterId: demoCard.characterId,
        cardNo: demoCard.cardNo,
        cardName: demoCard.cardName,
        characterName: demoCard.characterName,
        rarity: demoCard.rarity,
        intro: demoCard.intro,
        effectName: demoCard.effectName,
        effectDescription: demoCard.effectDescription,
        prizeId: demoCard.prizeId,
        prizeName: demoCard.prizeName,
        title: demoCard.prizeName,
        prizeDescription: demoCard.prizeDescription,
        message: demoCard.prizeDescription,
        validUntil: demoCard.validUntil,
        expires: demoCard.validUntil,
        usageCondition: demoCard.usageCondition,
        condition: demoCard.usageCondition,
        snapshotPrize: JSON.stringify(demoCard),
        snapshotRarity: demoCard.rarity,
        snapshotSetting: JSON.stringify(defaultMonthlyGachaSettings[0]),
        drawnAt: "2026-07-20T11:00:00+09:00",
        obtainedAt: "2026-07-20T11:00:00+09:00",
        status: "未使用"
      }
    ]);
  }
  const demoDraws = readJson(STORAGE_KEYS.monthlyGachaDraws, []);
  const demoHistory = readJson(STORAGE_KEYS.gachaCardHistory, []);
  if (!demoHistory.length && demoDraws.length) writeJson(STORAGE_KEYS.gachaCardHistory, demoDraws);
  if (!localStorage.getItem(STORAGE_KEYS.bookings)) {
    writeJson(STORAGE_KEYS.bookings, []);
  } else {
    removeLegacyHomeDemoBooking();
  }
}

function removeLegacyHomeDemoBooking() {
  const bookings = readJson(STORAGE_KEYS.bookings, []);
  const filtered = bookings.filter((booking) => !(
    booking?.requestId === "REQ-DEMO-1" ||
    booking?.reservationId === "RSV-DEMO-1"
  ));
  if (filtered.length !== bookings.length) writeJson(STORAGE_KEYS.bookings, filtered);
}

function getProfile() {
  const storedProfile = readJson(STORAGE_KEYS.profile, {});
  const guestId = String(storedProfile.guestId || getOrCreateGuestId()).trim();
  const memberId = resolveCurrentUserKey(storedProfile, guestId);
  return {
    ...defaultProfile,
    ...storedProfile,
    guestId,
    memberId,
    identityType: String(memberId).startsWith("guest_") ? "guest" : (storedProfile.identityType || "member")
  };
}

function formatMemberDisplayName(nickname) {
  const name = String(nickname || "").trim();
  if (!name || name === "お客様" || name === "ゲスト") return "お客様";
  return `${name}さん`;
}

function formatHomeMemberName(nickname) {
  const name = String(nickname || "").trim();
  if (!name || name === "お客様" || name === "ゲスト") return "お客様";
  return `${name}様`;
}

function getTimeGreeting() {
  const hour = Number(new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    hour: "2-digit",
    hour12: false
  }).format(new Date()));
  if (hour >= 5 && hour < 11) {
    return { label: "Good morning.", message: "今日の髪に、光を。" };
  }
  if (hour >= 11 && hour < 17) {
    return { label: "Welcome back.", message: "今日も、あなたらしく。" };
  }
  if (hour >= 17 && hour < 22) {
    return { label: "Good evening.", message: "夜の余白に、美容を。" };
  }
  return { label: "Private night.", message: "静かに、整える時間。" };
}

function getNextReservation() {
  const profile = getProfile();
  const bookings = readJson(STORAGE_KEYS.bookings, []);
  const todayStart = new Date(`${jstDateKey()}T00:00:00+09:00`).getTime();
  return bookings
    .filter((booking) => (
      String(booking.memberId || "") === String(profile.memberId || "") ||
      (profile.lineUserId && String(booking.lineUserId || "") === String(profile.lineUserId)) ||
      (profile.lineUserId && String(booking.userId || "") === String(profile.lineUserId)) ||
      String(booking.userId || "") === String(profile.memberId || "")
    ))
    .filter((booking) => !["キャンセル", "対応完了", "来店済み"].includes(normalizeBookingStatus(booking.status)))
    .map((booking) => ({
      ...booking,
      nextReservationTime: new Date(getBookingDisplayDateTime(booking) || booking.createdAt || "").getTime()
    }))
    .filter((booking) => Number.isFinite(booking.nextReservationTime) && booking.nextReservationTime >= todayStart)
    .sort((a, b) => a.nextReservationTime - b.nextReservationTime)[0] || null;
}

function getMonthlyGachaStatus() {
  const profile = getProfile();
  const userKey = getCurrentUserKey();
  const month = currentMonthKey();
  const draws = readJson(STORAGE_KEYS.monthlyGachaDraws, []);
  const draw = draws.find((item) => (
    String(item.issueMonth || "") === month &&
    (
      String(item.memberId || item.userId || "") === String(userKey) ||
      (profile.lineUserId && String(item.lineUserId || "") === String(profile.lineUserId))
    )
  ));
  const setting = getGachaSetting(month);
  const state = draw ? "利用済み" : setting?.status === "公開" ? "利用可能" : "未付与";
  return {
    month,
    monthLabel: formatMonthLabel(month),
    expiresLabel: endOfMonthLabel(),
    state,
    used: Boolean(draw),
    draw: draw || null
  };
}

function getGachaSettings() {
  return readJson(STORAGE_KEYS.monthlyGachaSettings, defaultMonthlyGachaSettings);
}

function writeGachaSettings(settings) {
  writeJson(STORAGE_KEYS.monthlyGachaSettings, settings);
}

function getCurrentGachaSetting() {
  return getGachaSetting(currentMonthKey());
}

function getGachaSetting(issueMonth) {
  const settings = getGachaSettings();
  return settings.find((setting) => setting.issueMonth === issueMonth) || defaultMonthlyGachaSettings[0];
}

function getGachaCharacters() {
  return readJson(STORAGE_KEYS.gachaCharacters, defaultGachaCharacters)
    .slice()
    .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
}

function writeGachaCharacters(characters) {
  writeJson(STORAGE_KEYS.gachaCharacters, characters);
}

function getGachaPrizes() {
  return readJson(STORAGE_KEYS.gachaPrizes, defaultGachaPrizes)
    .slice()
    .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
}

function writeGachaPrizes(prizes) {
  writeJson(STORAGE_KEYS.gachaPrizes, prizes);
}

function buildDefaultMonthlyGachaCards(issueMonth = currentMonthKey()) {
  const prizes = defaultGachaPrizes;
  const characters = defaultGachaCharacters;
  const countByRarity = characters.reduce((acc, character) => {
    acc[character.rarity] = Number(acc[character.rarity] || 0) + 1;
    return acc;
  }, {});
  return characters.map((character) => {
    const prize = prizes.find((item) => String(item.cardId || item.prizeId) === String(character.characterId)) ||
      prizes.find((item) => item.prizeId === character.currentPrizeId) ||
      prizes[0];
    const rarityRate = Number(defaultGachaRarityRates[character.rarity] || 0);
    const winRate = Number((rarityRate / Math.max(1, countByRarity[character.rarity])).toFixed(4));
    return monthlyCardFromCharacter(character, prize, issueMonth, winRate);
  });
}

function monthlyCardFromCharacter(character, prize, issueMonth = currentMonthKey(), winRate = 0) {
  const validUntil = endOfMonthDateKeyFor(issueMonth);
  return {
    cardId: character.characterId,
    characterId: character.characterId,
    cardNo: character.cardNo,
    cardName: character.name,
    characterName: character.name,
    rarity: character.rarity,
    intro: character.intro,
    effectName: character.effectName,
    effectDescription: character.effectDescription,
    imageUrl: character.imageUrl || "",
    imagePath: character.imagePath || `images/gacha/characters/${character.characterId}.png`,
    cardBackground: character.rarity.toLowerCase(),
    prizeId: prize.prizeId || prize.cardId,
    prizeName: prize.prizeName || prize.title,
    prizeDescription: prize.prizeDescription || prize.description,
    discountAmount: prize.discountAmount || 0,
    discountRate: prize.discountRate || 0,
    winRate,
    weight: character.weight || 1,
    monthlyWinLimit: prize.monthlyWinLimit || 999,
    validUntil,
    usageCondition: prize.usageCondition || prize.condition || "",
    targetMenu: prize.targetMenu || "",
    animationPreset: prize.animationPreset || "",
    issueAsCoupon: Boolean(prize.discountAmount || prize.discountRate || prize.requiresUseConfirmation),
    isDrawable: character.isDrawable !== false,
    isPublic: character.isPublic !== false,
    sortOrder: character.sortOrder || Number(character.cardNo || 0)
  };
}

function calculatePrizeValidUntil(prize, issueMonth = currentMonthKey()) {
  if (prize.validUntil) return prize.validUntil;
  const [year, month] = String(issueMonth).split("-").map(Number);
  const days = Number(prize.validDays || 35);
  const base = new Date(year, month - 1, 1);
  base.setDate(base.getDate() + days - 1);
  return `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, "0")}-${String(base.getDate()).padStart(2, "0")}`;
}

function getGachaCards(setting) {
  return (setting?.cards || []).slice().sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
}

function getGachaOddsTotal(setting) {
  const total = getGachaCards(setting)
    .filter((card) => card.isPublic !== false && card.isDrawable !== false)
    .reduce((sum, card) => sum + Number(card.winRate || 0), 0);
  return Math.round(total * 100) / 100;
}

function getRarityOddsTotal(setting) {
  const rates = setting?.rarityRates || {};
  return Object.keys(rarityMeta).reduce((sum, key) => sum + Number(rates[key] || 0), 0);
}

function getMemberCardHistory(member) {
  const history = readJson(STORAGE_KEYS.gachaCardHistory, []);
  const draws = readJson(STORAGE_KEYS.monthlyGachaDraws, []);
  const merged = [...history, ...draws];
  const seen = new Set();
  return merged.filter((card) => {
    const key = card.cardHistoryId || card.drawId;
    if (seen.has(key)) return false;
    seen.add(key);
    return String(card.memberId || "") === String(member.memberId || "");
  }).sort((a, b) => String(b.obtainedAt || b.drawnAt).localeCompare(String(a.obtainedAt || a.drawnAt)));
}

function getGachaCardYear(card) {
  return Number(card.binderYear || card.year || String(card.issueMonth || card.obtainedAt || card.drawnAt || "").slice(0, 4));
}

function getBinderYears(cards) {
  return [...new Set([
    currentYear(),
    ...cards.filter((card) => card.inBinder === true).map(getGachaCardYear).filter(Number.isFinite)
  ])].sort((a, b) => b - a);
}

function getBinderCards(cards, year) {
  const targetYear = Number(year);
  return cards.filter((card) => (
    card.inBinder === true &&
    getGachaLifecycleState(card) === "used" &&
    getGachaCardYear(card) === targetYear &&
    normalizeServerYearMonth(card.issueMonth || card.usedAt || card.obtainedAt) < currentMonthKey()
  ));
}

function getGachaCollectionIdentity(card) {
  return String(
    card.drawId ||
    card.cardHistoryId ||
    card.binderId ||
    card.testId ||
    `${card.memberId || card.userId || "unknown"}:${card.issueMonth || card.obtainedAt || "unknown"}:${card.cardId || card.characterId || "unknown"}`
  );
}

function getUsedCollectionCards(cards, year) {
  const targetYear = Number(year);
  const unique = new Map();
  (Array.isArray(cards) ? cards : []).forEach((card) => {
    const isTestCard = card.dataMode === "TEST";
    const isUsed = isTestCard
      ? normalizeGachaState(card.testStatus) === "used"
      : getGachaLifecycleState(card) === "used";
    if (!isUsed || getGachaCardYear(card) !== targetYear) return;
    const identity = getGachaCollectionIdentity(card);
    const existing = unique.get(identity);
    if (!existing || (card.inBinder === true && existing.inBinder !== true)) unique.set(identity, card);
  });
  return Array.from(unique.values()).sort((a, b) => (
    String(b.usedAt || b.obtainedAt || b.drawnAt || "").localeCompare(String(a.usedAt || a.obtainedAt || a.drawnAt || ""))
  ));
}

function getCardUsageState(card) {
  return getGachaStateLabel(card);
}

function buildCollectionSummary(cards, year) {
  const yearly = getUsedCollectionCards(cards, year);
  const rarity = { UR: 0, SSR: 0, SR: 0, R: 0, N: 0 };
  yearly.forEach((card) => { rarity[card.rarity] = Number(rarity[card.rarity] || 0) + 1; });
  const rewards = getCollectionRewards().filter((reward) => Number(reward.year) === Number(year) && reward.isPublic !== false).sort((a, b) => Number(a.requiredCount) - Number(b.requiredCount));
  const nextReward = rewards.find((reward) => !getCollectionRewardProgress(reward, yearly).achieved);
  const nextProgress = nextReward ? getCollectionRewardProgress(nextReward, yearly) : null;
  return {
    total: yearly.length,
    rarity,
    nextRemaining: nextProgress ? Math.max(0, Number(nextProgress.target) - Number(nextProgress.current)) : 0
  };
}

function getCollectionRewards() {
  const fallback = isProductionApiMode() ? [] : defaultCollectionRewards;
  return readJson(STORAGE_KEYS.collectionRewards, fallback)
    .slice()
    .sort((a, b) => Number(a.sortOrder || 999) - Number(b.sortOrder || 999));
}

function getCollectionRewardStates(member, cards) {
  return getCollectionRewards().filter((reward) => Number(reward.year) === currentYear()).map((reward) => ({
    ...reward,
    state: isCollectionRewardAchieved(reward, cards)
      ? (reward.receivedMembers?.includes?.(member.memberId) ? "受取済み" : reward.grantedMembers?.includes?.(member.memberId) ? "付与済み" : "達成")
      : "未付与"
  }));
}

function getCollectionRewardProgress(reward, cards) {
  const yearCards = getUsedCollectionCards(cards, Number(reward.year || currentYear()));
  const conditionType = String(reward.conditionType || (
    reward.requireAllRarities ? "all_rarities" :
      reward.requireCompleteCollection ? "unique_card_count" :
        reward.requiredRarity ? "rarity_count" : "total_card_count"
  ));
  const conditionValue = Math.max(1, Number(reward.conditionValue || reward.requiredCount || 1));
  const rarity = String(reward.rarity || reward.requiredRarity || "").trim();
  let current = 0;
  let target = conditionValue;
  if (conditionType === "rarity_count") {
    current = yearCards.filter((card) => String(card.rarity || "") === rarity).length;
  } else if (conditionType === "unique_card_count" || conditionType === "unique_count") {
    current = new Set(yearCards.map((card) => card.characterId || card.cardId).filter(Boolean)).size;
  } else if (conditionType === "specific_card") {
    current = yearCards.some((card) => String(card.characterId || card.cardId) === String(reward.targetCardId || "")) ? 1 : 0;
    target = 1;
  } else if (conditionType === "all_rarities") {
    current = Object.keys(rarityMeta).filter((key) => yearCards.filter((card) => card.rarity === key).length >= conditionValue).length;
    target = Object.keys(rarityMeta).length;
  } else {
    current = yearCards.length;
  }
  return { current, target, achieved: current >= target, conditionType, rarity };
}

function isCollectionRewardAchieved(reward, cards) {
  return getCollectionRewardProgress(reward, cards).achieved;
}

function endOfMonthDateKey() {
  const now = new Date();
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return `${last.getFullYear()}-${String(last.getMonth() + 1).padStart(2, "0")}-${String(last.getDate()).padStart(2, "0")}`;
}

function currentYear() {
  const parts = new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", year: "numeric" }).formatToParts(new Date());
  return Number(parts.find((part) => part.type === "year")?.value || new Date().getFullYear());
}

function previousMonthKey() {
  const now = new Date();
  const previous = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return `${previous.getFullYear()}-${String(previous.getMonth() + 1).padStart(2, "0")}`;
}

function isPastDateLabel(value) {
  const text = String(value || "");
  if (!/\\d{4}-\\d{2}-\\d{2}/.test(text)) return false;
  return text < jstDateKey();
}

function hasReachedMonthlyLimit(prize, issueMonth) {
  const limit = Number(prize.monthlyWinLimit || 0);
  if (!limit) return false;
  const draws = readJson(STORAGE_KEYS.monthlyGachaDraws, []);
  const count = draws.filter((draw) => (
    String(draw.issueMonth || "") === String(issueMonth || "") &&
    String(draw.cardId || draw.prizeId || "") === String(prize.cardId || prize.prizeId || "")
  )).length;
  return count >= limit;
}

function getLoungeCount() {
  const baseCount = 18;
  const entries = readJson(STORAGE_KEYS.loungeEntries, []);
  return Math.min(50, baseCount + entries.length);
}

function daysSince(dateValue) {
  const date = new Date(`${dateValue}T00:00:00+09:00`);
  if (Number.isNaN(date.getTime())) return 0;
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return Math.max(0, Math.floor(diff / 86400000));
}

function daysUntilDate(dateValue) {
  if (!dateValue) return null;
  const target = new Date(dateValue);
  if (Number.isNaN(target.getTime())) return null;
  const todayKey = jstDateKey();
  const targetKey = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(target).replaceAll("/", "-");
  const today = new Date(`${todayKey}T00:00:00+09:00`);
  const targetDate = new Date(`${targetKey}T00:00:00+09:00`);
  return Math.ceil((targetDate.getTime() - today.getTime()) / 86400000);
}

function saveFortuneHistory(fortune) {
  const history = readJson(STORAGE_KEYS.fortuneHistory, []);
  if (history[0]?.date === jstDateKey()) return;
  writeJson(STORAGE_KEYS.fortuneHistory, [{ date: jstDateKey(), ...fortune }, ...history].slice(0, 30));
}

function currentMonthKey() {
  const parts = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit"
  }).formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value || "";
  const month = parts.find((part) => part.type === "month")?.value || "";
  return `${year}-${month}`;
}

function formatMonthLabel(monthKeyValue) {
  const [year, month] = String(monthKeyValue || currentMonthKey()).split("-");
  return `${Number(year)}年${Number(month)}月`;
}

function endOfMonthLabel() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "numeric"
  }).formatToParts(now);
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const lastDay = new Date(year, month, 0).getDate();
  return `${month}月${lastDay}日`;
}

async function apiRequest(action, payload = {}, options = {}) {
  const apiUrl = options.apiUrl || TEAM_LINK_API_URL;
  if (!apiUrl) throw new Error("TEAM LINK APIが設定されていません。");
  const requestPayload = { action, payload: payload || {}, sessionToken: getApiSessionToken() };
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), getApiTimeoutMs(action));
  try {
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(requestPayload),
        redirect: "follow",
        cache: "no-store",
        signal: controller.signal
      });
      const text = await response.text();
      const contentType = String(response.headers.get("content-type") || "");
      if (!response.ok || !contentType.includes("application/json")) {
        const retryableDeploymentResponse = response.status === 404 || /text\/html/i.test(contentType) || /^\s*<!doctype html/i.test(text);
        if (retryableDeploymentResponse && attempt < 3) {
          console.warn("[TEAM LINK API RETRY]", { action, attempt, status: response.status, url: response.url || apiUrl });
          await new Promise((resolve) => window.setTimeout(resolve, 350 * attempt));
          continue;
        }
        const error = new Error(response.status === 404 ? "TEAM LINK APIが見つかりません。" : "TEAM LINK APIからJSONを取得できませんでした。");
        logApiFailure({ action, url: response.url || apiUrl, status: response.status, body: text.slice(0, 500), error, transport: "POST" });
        throw error;
      }
      const data = JSON.parse(text);
      if (!data.success) {
        const error = new Error(data.message || "処理に失敗しました。");
        error.errorCode = data.errorCode || "";
        logApiFailure({ action, url: response.url || apiUrl, status: response.status, body: text.slice(0, 500), error, transport: "POST" });
        throw error;
      }
      return data;
    }
    throw new Error("TEAM LINK APIへ接続できませんでした。");
  } catch (error) {
    if (error?.name === "AbortError") {
      const timeoutError = new Error("TEAM LINK APIの応答がタイムアウトしました。");
      logApiFailure({ action, url: apiUrl, error: timeoutError, transport: "POST" });
      throw timeoutError;
    }
    if (!error?.errorCode) logApiFailure({ action, url: apiUrl, error, transport: "POST", cors: isFetchCorsLikeError(error) });
    throw error;
  } finally {
    window.clearTimeout(timer);
  }
}

async function submitBookingRequestSafely(request) {
  try {
    return await apiRequest("submitBookingRequest", request);
  } catch (error) {
    if (error?.errorCode) throw error;
    console.warn("[TEAM LINK BOOKING RESPONSE RECOVERY]", {
      requestId: request.requestId,
      message: String(error?.message || error)
    });
    await new Promise((resolve) => window.setTimeout(resolve, 500));
    return apiRequest("submitBookingRequest", request);
  }
}

function getApiTimeoutMs(action) {
  const slowActions = new Set([
    "getAdminProductionData",
    "getBookingCatalog",
    "listCouponMasters",
    "listMenuMasters",
    "listMemberCoupons",
    "listBookingRequests",
    "submitBookingRequest",
    "drawMonthlyGacha",
    "getGachaConfig",
    "getPublishedRewards",
    "checkMonthlyDrawStatus",
    "getUserCoupons",
    "getUserBinder",
    "getCollectionRewards"
  ]);
  return slowActions.has(action) ? 45000 : 15000;
}

function logApiFailure({ action, url, status = "", body = "", error, transport, cors = false }) {
  const message = String(error?.message || error || "");
  const isCors = cors || isFetchCorsLikeError(error) || /cors|failed to fetch|load failed|script load failed/i.test(message);
  console.error("[TEAM LINK API ERROR]", {
    transport,
    url: error?.requestUrl || url,
    action,
    httpStatus: status || "unknown",
    responseBody: body || error?.responseBody || "",
    error: message,
    errorCode: error?.errorCode || "",
    corsOrFailedToFetch: isCors
  });
}

function isFetchCorsLikeError(error) {
  return /failed to fetch|load failed|networkerror|cors/i.test(String(error?.message || error || ""));
}

function isProductionApiMode() {
  return TEAM_LINK_DATA_MODE === "production" && Boolean(TEAM_LINK_API_URL);
}

function getApiSessionToken() {
  const admin = getAdminSession?.();
  if (admin?.adminId) return `${admin.role || "staff"}:${admin.adminId}:${admin.name || ""}`;
  const profile = getProfile?.();
  return profile?.memberId ? `member:${profile.memberId}` : "guest";
}

function createTransactionId(prefix = "TX") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

async function syncProductionState() {
  if (!isProductionApiMode()) return;
  try {
    const profile = getProfile();
    const userKey = getCurrentUserKey();
    if (isLineLinkedCustomer(profile)) {
      try {
        await syncProductionCustomerBookings(profile, { render: false });
      } catch (error) {
        console.warn("[TEAM LINK CUSTOMER BOOKING SYNC FAILED]", error);
      }
    }
    appState.menuMasterSyncStatus = "loading";
    appState.couponMasterSyncStatus = "loading";
    appState.memberCouponSyncStatus = "loading";
    try {
      const catalogResult = await apiRequest("getBookingCatalog", { memberId: userKey });
      const coupons = catalogResult.coupons || catalogResult.data?.coupons;
      const serverMenus = catalogResult.menus || catalogResult.data?.menus;
      const memberCoupons = catalogResult.memberCoupons || catalogResult.data?.memberCoupons;
      if (!Array.isArray(coupons)) throw new Error("クーポンマスタの形式が正しくありません。");
      if (!Array.isArray(serverMenus)) throw new Error("MenuMasterの形式が正しくありません。");
      if (!Array.isArray(memberCoupons)) throw new Error("会員クーポンの形式が正しくありません。");
      writeJson(STORAGE_KEYS.adminCoupons, coupons.map(mapServerCouponMasterToLocal));
      writeJson(STORAGE_KEYS.reservationMenus, serverMenus.map(mapServerMenuMasterToLocal));
      writeJson(STORAGE_KEYS.myCoupons, memberCoupons.map(mapServerMemberCouponToLocal));
      appState.couponMasterSyncStatus = "synced";
      appState.menuMasterSyncStatus = "synced";
      appState.memberCouponSyncStatus = "synced";
    } catch (error) {
      writeJson(STORAGE_KEYS.adminCoupons, []);
      writeJson(STORAGE_KEYS.reservationMenus, []);
      writeJson(STORAGE_KEYS.myCoupons, []);
      appState.couponMasterSyncStatus = "unavailable";
      appState.menuMasterSyncStatus = "unavailable";
      appState.memberCouponSyncStatus = "unavailable";
      console.warn("[TEAM LINK BOOKING CATALOG SYNC FAILED]", error);
    }
    renderBookingMenuChoices();
    renderBookingCouponChoices();
    renderBookingMySelectionChoices();
    updateBookingConfirm();
    renderApp();

    const results = await Promise.allSettled([
      apiRequest("getGachaConfig", {}),
      apiRequest("getPublishedRewards", {}),
      apiRequest("getUserCoupons", { userId: userKey }),
      apiRequest("checkMonthlyDrawStatus", { userId: userKey, memberId: userKey, lineUserId: profile.lineUserId || "", targetYearMonth: currentMonthKey() }),
      apiRequest("getUserBinder", { userId: userKey, year: String(currentYear()) }),
      apiRequest("getPastBinderHistory", { userId: userKey, currentYear: String(currentYear()) }),
      apiRequest("getCollectionRewards", { userId: userKey, targetYear: String(currentYear()) })
    ]);
    const [gachaConfig, gachaRewards, gachaCoupons, drawStatus, binder, pastBinders, collectionRewards] = results.map((result, index) => {
      if (result.status === "fulfilled") return result.value;
      console.warn("[TEAM LINK API PARTIAL SYNC FAILED]", { index, reason: result.reason });
      return {};
    });
    if (gachaRewards.data?.rewards) mergeServerGachaRewards(gachaRewards.data.rewards);
    if (gachaCoupons.data?.coupons) replaceServerGachaCoupons(gachaCoupons.data.coupons, userKey);
    if (drawStatus.data?.canDraw === true && drawStatus.data?.alreadyDrawn === false) {
      removeLocalGachaDrawForUserMonth(userKey, drawStatus.data.targetYearMonth || currentMonthKey());
    } else if (drawStatus.data?.draw) {
      upsertLocalGachaDraw(mapServerGachaDrawToLocal(drawStatus.data.draw, drawStatus.data.coupon || {}));
    }
    if (binder.data?.cards) mergeServerBinderCards(binder.data.cards);
    if (pastBinders.data?.years) Object.values(pastBinders.data.years).forEach(mergeServerBinderCards);
    if (collectionRewards.data?.rewards) mergeServerCollectionRewards(collectionRewards.data.rewards);
    if (gachaConfig.data?.config?.currentYearMonth) {
      const settings = getGachaSettings();
      if (!settings.some((setting) => setting.issueMonth === gachaConfig.data.config.currentYearMonth)) {
        writeGachaSettings([{ issueMonth: gachaConfig.data.config.currentYearMonth, title: "本番ガチャ", status: "公開" }, ...settings]);
      }
    }
    if (appState.currentView === "adminView" && getAdminSession()) await syncProductionAdminState({ render: false });
    renderApp();
  } catch (error) {
    showToast("通信に失敗しました。時間をおいてもう一度お試しください");
  }
}

async function syncProductionCustomerBookings(profile = getProfile(), options = {}) {
  if (!isProductionApiMode() || !isLineLinkedCustomer(profile)) return [];
  const result = await apiRequest("getMyBookingRequests", {
    memberId: profile.memberId || profile.linkedMemberId,
    lineUserId: profile.lineUserId,
    memberToken: profile.memberToken
  });
  const serverBookings = result.bookings || result.data?.bookings;
  if (!Array.isArray(serverBookings)) throw new Error("予約確認データの形式が正しくありません。");
  const bookings = serverBookings.map(mapServerBookingToLocal);
  writeJson(STORAGE_KEYS.bookings, bookings);
  if (options.render !== false) renderApp();
  return bookings;
}

function parseServerJsonArray(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(String(value));
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

async function syncProductionBookingRequests(options = {}) {
  if (!isProductionApiMode() || !getAdminSession()) return [];
  appState.adminDataStatus.bookings = "loading";
  try {
    const result = await apiRequest("listBookingRequests", {});
    const serverBookings = result.bookings || result.data?.bookings;
    if (!Array.isArray(serverBookings)) throw new Error("予約一覧の形式が正しくありません。");
    const bookings = serverBookings.map(mapServerBookingToLocal);
    writeJson(STORAGE_KEYS.bookings, bookings);
    appState.adminDataStatus.bookings = "ready";
    if (options.render !== false) renderApp();
    return bookings;
  } catch (error) {
    appState.adminDataStatus.bookings = "error";
    if (options.render !== false) renderApp();
    throw error;
  }
}

function normalizeLineNotificationSettings(value) {
  const source = value && typeof value === "object" ? value : {};
  return {
    enabled: source.enabled === true,
    bookingConfirmed: source.bookingConfirmed === true,
    bookingNeedsChange: source.bookingNeedsChange === true,
    bookingConsultationReply: source.bookingConsultationReply === true,
    staffMessage: source.staffMessage === true,
    updatedAt: source.updatedAt || ""
  };
}

async function syncProductionLineNotificationSettings(options = {}) {
  if (!isProductionApiMode() || !getAdminSession()) return null;
  appState.lineNotificationSettingsStatus = "loading";
  if (options.render !== false) renderApp();
  try {
    const result = await requestAdminSettingWithRetry("getLineNotificationSettings", {});
    const settings = result.settings || result.data?.settings;
    if (!settings || typeof settings !== "object") throw new Error("LINE通知設定の形式が正しくありません。");
    appState.lineNotificationSettings = normalizeLineNotificationSettings(settings);
    appState.lineNotificationSettingsStatus = "ready";
    if (options.render !== false) renderApp();
    return appState.lineNotificationSettings;
  } catch (error) {
    appState.lineNotificationSettings = null;
    appState.lineNotificationSettingsStatus = "error";
    if (options.render !== false) renderApp();
    throw error;
  }
}

async function saveLineNotificationSettings(button) {
  if (!isProductionApiMode() || !getAdminSession() || appState.lineNotificationSettingsBusy) return false;
  const panel = button.closest(".line-notification-settings");
  const readToggle = (key) => Boolean(panel?.querySelector(`[data-line-notification-setting="${key}"]`)?.checked);
  const nextSettings = {
    enabled: readToggle("enabled"),
    bookingConfirmed: readToggle("bookingConfirmed"),
    bookingNeedsChange: readToggle("bookingNeedsChange"),
    bookingConsultationReply: readToggle("bookingConsultationReply"),
    staffMessage: readToggle("staffMessage")
  };
  appState.lineNotificationSettingsBusy = true;
  renderApp();
  try {
    const result = await apiRequest("updateLineNotificationSettings", nextSettings);
    const settings = result.settings || result.data?.settings;
    if (!settings || typeof settings !== "object") throw new Error("保存後のLINE通知設定を取得できませんでした。");
    appState.lineNotificationSettings = normalizeLineNotificationSettings(settings);
    appState.lineNotificationSettingsStatus = "ready";
    addAdminLog("line_notification_settings", `LINE自動通知を${appState.lineNotificationSettings.enabled ? "ON" : "OFF"}に更新`, getAdminSession()?.name);
    showToast("LINE自動通知設定を保存しました。");
    return true;
  } catch (error) {
    console.error("[TEAM LINK LINE NOTIFICATION SETTINGS SAVE FAILED]", error);
    showToast("LINE通知設定を保存できませんでした。");
    return false;
  } finally {
    appState.lineNotificationSettingsBusy = false;
    renderApp();
  }
}

function normalizeBookingNotificationEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function isValidBookingNotificationEmail(value) {
  const email = normalizeBookingNotificationEmail(value);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

function normalizeBookingNotificationSettings(value) {
  const source = value && typeof value === "object" ? value : {};
  const rawEmails = Array.isArray(source.emails)
    ? source.emails
    : String(source.value || "").split(/[;,\s]+/).filter(Boolean);
  const emails = [];
  rawEmails.forEach((value) => {
    const email = normalizeBookingNotificationEmail(value);
    if (isValidBookingNotificationEmail(email) && !emails.includes(email)) emails.push(email);
  });
  return { emails, updatedAt: source.updatedAt || "" };
}

async function syncProductionBookingNotificationSettings(options = {}) {
  if (!isProductionApiMode() || !getAdminSession()) return null;
  appState.bookingNotificationSettingsStatus = "loading";
  if (options.render !== false) renderApp();
  try {
    const result = await requestAdminSettingWithRetry("getBookingNotificationSettings", {});
    const settings = result.settings || result.data?.settings || result.data || result;
    appState.bookingNotificationSettings = normalizeBookingNotificationSettings(settings);
    appState.bookingNotificationSettingsStatus = "ready";
    if (options.render !== false) renderApp();
    return appState.bookingNotificationSettings;
  } catch (error) {
    appState.bookingNotificationSettings = null;
    appState.bookingNotificationSettingsStatus = "error";
    if (options.render !== false) renderApp();
    throw error;
  }
}

async function syncProductionAdminSettings(options = {}) {
  const results = [];
  for (const syncSettings of [syncProductionLineNotificationSettings, syncProductionBookingNotificationSettings]) {
    try {
      results.push({ status: "fulfilled", value: await syncSettings({ render: false }) });
    } catch (reason) {
      results.push({ status: "rejected", reason });
    }
  }
  if (options.render !== false) renderApp();
  const rejected = results.find((result) => result.status === "rejected");
  if (rejected) throw rejected.reason;
  return results.map((result) => result.value);
}

async function requestAdminSettingWithRetry(action, payload) {
  let lastError = null;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      return await apiRequest(action, payload);
    } catch (error) {
      lastError = error;
      if (error?.errorCode || attempt >= 2) break;
      await new Promise((resolve) => window.setTimeout(resolve, 700));
    }
  }
  throw lastError || new Error("通知設定を取得できませんでした。");
}

function addBookingNotificationEmail(button) {
  const panel = button.closest(".booking-notification-email-settings");
  const input = panel?.querySelector("[data-booking-notification-email-input]");
  const email = normalizeBookingNotificationEmail(input?.value);
  if (!email) {
    showToast("メールアドレスを入力してください。");
    input?.focus();
    return false;
  }
  if (!isValidBookingNotificationEmail(email)) {
    showToast("正しいメールアドレス形式で入力してください。");
    input?.focus();
    return false;
  }
  const current = normalizeBookingNotificationSettings(appState.bookingNotificationSettings);
  if (current.emails.includes(email)) {
    showToast("同じメールアドレスは登録できません。");
    input?.focus();
    return false;
  }
  appState.bookingNotificationSettings = { ...current, emails: [...current.emails, email] };
  renderAdmin();
  showToast("通知先へ追加しました。保存すると本番へ反映されます。");
  return true;
}

function removeBookingNotificationEmail(button) {
  const index = Number(button.dataset.index);
  const current = normalizeBookingNotificationSettings(appState.bookingNotificationSettings);
  if (!Number.isInteger(index) || index < 0 || index >= current.emails.length) return false;
  appState.bookingNotificationSettings = {
    ...current,
    emails: current.emails.filter((_, emailIndex) => emailIndex !== index)
  };
  renderAdmin();
  showToast("通知先から削除しました。保存すると本番へ反映されます。");
  return true;
}

async function saveBookingNotificationSettings(button) {
  if (!isProductionApiMode() || !getAdminSession() || appState.bookingNotificationSettingsBusy) return false;
  const current = normalizeBookingNotificationSettings(appState.bookingNotificationSettings);
  if (!current.emails.length) {
    showToast("通知先メールアドレスを1件以上登録してください。");
    return false;
  }
  if (current.emails.some((email) => !isValidBookingNotificationEmail(email))) {
    showToast("正しいメールアドレス形式で入力してください。");
    return false;
  }
  if (new Set(current.emails).size !== current.emails.length) {
    showToast("同じメールアドレスは登録できません。");
    return false;
  }
  appState.bookingNotificationSettingsBusy = true;
  renderAdmin();
  try {
    const result = await apiRequest("updateBookingNotificationSettings", { emails: current.emails });
    const settings = result.settings || result.data?.settings || result.data || result;
    appState.bookingNotificationSettings = normalizeBookingNotificationSettings(settings);
    appState.bookingNotificationSettingsStatus = "ready";
    addAdminLog("booking_notification_settings", `予約通知メールを${appState.bookingNotificationSettings.emails.length}件に更新`, getAdminSession()?.name);
    showToast("予約通知メール設定を保存しました。");
    return true;
  } catch (error) {
    console.error("[TEAM LINK BOOKING NOTIFICATION SETTINGS SAVE FAILED]", error);
    showToast(error?.message || "予約通知メール設定を保存できませんでした。");
    return false;
  } finally {
    appState.bookingNotificationSettingsBusy = false;
    renderAdmin();
  }
}

function mapServerBookingToLocal(booking) {
  return {
    ...booking,
    requestId: booking.requestId || booking.bookingRequestId,
    bookingRequestId: booking.bookingRequestId || booking.requestId,
    staff: formatStaffDisplayName(booking.staff || booking.staffDisplayName),
    selectedMenus: parseServerJsonArray(booking.selectedMenus),
    selectedCoupons: parseServerJsonArray(booking.selectedCoupons),
    menuIds: parseServerJsonArray(booking.menuIds),
    couponIds: parseServerJsonArray(booking.couponIds)
  };
}

function normalizeVisitReceptionStatus(status) {
  const value = String(status || "pending");
  if (["visited", "confirmed", "確認済み", "来店済み"].includes(value)) return "来店済み";
  if (["identified", "本人確認済み"].includes(value)) return "本人確認済み";
  if (["excluded", "通常メッセージ", "対象外"].includes(value)) return "対象外";
  return "未確認";
}

async function syncProductionVisitReceptions(options = {}) {
  if (!isProductionApiMode() || !getAdminSession()) return [];
  appState.adminDataStatus.visits = "loading";
  try {
    const result = await apiRequest("listVisitReceptions", { date: jstDateKey(), includeHistory: appState.adminVisitShowHistory });
    const rows = result.receptions || result.data?.receptions;
    if (!Array.isArray(rows)) throw new Error("来店一覧の形式が正しくありません。");
    const receptions = rows.map((item) => ({ ...item, status: normalizeVisitReceptionStatus(item.status) }));
    writeJson(STORAGE_KEYS.visitReceptions, receptions);
    appState.adminDataStatus.visits = "ready";
    if (options.render !== false) renderApp();
    return receptions;
  } catch (error) {
    appState.adminDataStatus.visits = "error";
    if (options.render !== false) renderApp();
    throw error;
  }
}

async function syncProductionAdminSection(options = {}) {
  if (appState.adminTab === "bookings") return syncProductionBookingRequests(options);
  if (appState.adminTab === "settings") return syncProductionAdminSettings(options);
  return syncProductionAdminState(options);
}

async function syncProductionAdminState(options = {}) {
  if (!isProductionApiMode() || !getAdminSession()) return;
  Object.keys(appState.adminDataStatus).forEach((key) => { appState.adminDataStatus[key] = "loading"; });
  try {
    const result = await apiRequest("getAdminProductionData", {
      date: jstDateKey(),
      includeHistory: appState.adminVisitShowHistory,
      targetYearMonth: currentMonthKey()
    });
    const data = result.data || result;
    const members = data.members;
    const bookings = data.bookings;
    const receptions = data.receptions;
    const couponUsageHistory = data.couponUsageHistory;
    const gachaRewards = data.gachaRewards || data.rewards;
    const gachaUsageHistory = data.gachaUsageHistory || data.gachaHistory;
    if (![members, bookings, receptions, couponUsageHistory, gachaRewards].every(Array.isArray)) {
      throw new Error("管理データの形式が正しくありません。");
    }
    writeJson(STORAGE_KEYS.members, members);
    writeJson(STORAGE_KEYS.bookings, bookings.map(mapServerBookingToLocal));
    writeJson(STORAGE_KEYS.visitReceptions, receptions.map((item) => ({ ...item, status: normalizeVisitReceptionStatus(item.status) })));
    writeJson(STORAGE_KEYS.adminCouponUsageHistory, couponUsageHistory);
    writeJson(STORAGE_KEYS.gachaAdminRewards, gachaRewards.map((reward) => mapServerGachaRewardToLocal(reward)));
    if (Array.isArray(gachaUsageHistory)) mergeServerGachaCoupons(gachaUsageHistory);
    Object.keys(appState.adminDataStatus).forEach((key) => { appState.adminDataStatus[key] = "ready"; });
  } catch (error) {
    Object.keys(appState.adminDataStatus).forEach((key) => { appState.adminDataStatus[key] = "error"; });
    console.error("[TEAM LINK PRODUCTION ADMIN SYNC FAILED]", error);
    showToast("管理データの取得に失敗しました。");
  } finally {
    if (options.render !== false) renderApp();
  }
}

function mergeServerGachaRewards(rewards) {
  if (!Array.isArray(rewards)) return;
  const local = getGachaPrizes();
  const byId = new Map(local.map((item) => [String(item.prizeId || item.cardId), item]));
  rewards.forEach((reward) => {
    byId.set(String(reward.cardId), mapServerGachaRewardToLocal(reward, byId.get(String(reward.cardId)) || {}));
  });
  writeGachaPrizes(Array.from(byId.values()));
  const settings = getGachaSettings();
  const targetMonth = normalizeServerYearMonth(rewards[0]?.targetYearMonth || currentMonthKey());
  const current = settings.find((setting) => setting.issueMonth === targetMonth);
  if (current) {
    current.cards = rewards.map((reward) => mapServerGachaRewardToLocal(reward, getOfficialGachaCard(reward.cardId, targetMonth) || {}));
    writeGachaSettings(settings);
  }
}

function mapServerGachaRewardToLocal(reward, existing = {}) {
  return {
      ...existing,
      prizeId: reward.cardId,
      cardId: reward.cardId,
      cardNo: String(reward.cardNumber || existing.cardNo || "").padStart(2, "0"),
      characterName: reward.characterName || existing.characterName || existing.cardName || "",
      cardName: reward.characterName || existing.cardName || existing.characterName || "",
      rarity: reward.rarity || existing.rarity || "N",
      prizeName: reward.rewardName,
      prizeDescription: reward.rewardDetail,
      targetMenu: reward.targetMenu,
      discountAmount: Number(reward.discountAmount || 0),
      validUntil: reward.expiryDate,
      usageCondition: reward.notes || reward.usageCondition || reward.rewardDetail || "",
      animationPreset: reward.animation || reward.animationPreset || "",
      effectName: reward.effectName || existing.effectName || "",
      description: reward.description || existing.description || "",
      probability: Number(reward.probability || existing.probability || 0),
      weight: Number(reward.weight || existing.weight || reward.probability || 0),
      remainingStock: reward.remainingStock,
      canCombine: reward.canCombine === true || String(reward.canCombine).toUpperCase() === "TRUE",
      isPublic: reward.isPublished === true || String(reward.isPublished).toUpperCase() === "TRUE",
      sortOrder: Number(reward.cardNumber || reward.sortOrder || 999),
      updatedAt: reward.updatedAt || ""
    };
}

function mergeServerGachaCoupons(coupons) {
  if (!Array.isArray(coupons)) return;
  const local = readJson(STORAGE_KEYS.gachaCardHistory, []);
  const byId = new Map(local.map((item) => [String(item.drawId || item.cardHistoryId), item]));
  coupons.forEach((coupon) => {
    const id = String(coupon.drawId || coupon.usageId || "");
    if (!id) return;
    const issueMonth = normalizeServerYearMonth(coupon.targetYearMonth || coupon.issueMonth || coupon.createdAt);
    const officialCard = getOfficialGachaCard(coupon.cardId, issueMonth);
    const characterId = officialCard?.characterId || normalizeGachaCharacterId(coupon.cardId);
    byId.set(id, {
      ...(officialCard || {}),
      ...(byId.get(id) || {}),
      drawId: coupon.drawId,
      cardHistoryId: coupon.drawId,
      memberId: coupon.userId,
      cardId: officialCard?.cardId || characterId || coupon.cardId,
      characterId,
      serverCardId: coupon.cardId,
      issueMonth,
      cardName: officialCard?.cardName || officialCard?.characterName || coupon.characterName || "",
      characterName: officialCard?.characterName || officialCard?.cardName || coupon.characterName || "",
      rarity: officialCard?.rarity || coupon.rarity || "",
      prizeName: coupon.rewardName || "",
      prizeDescription: coupon.rewardDetail || "",
      validUntil: coupon.expiryDate,
      expires: coupon.expiryDate,
      usageCondition: coupon.notes || coupon.rewardDetail || "",
      condition: coupon.notes || coupon.rewardDetail || "",
      targetMenu: coupon.targetMenu || "",
      animationPreset: coupon.animation || "",
      lifecycleState: coupon.status,
      useState: coupon.status,
      status: coupon.status,
      confirmationCode: coupon.confirmationCode || "",
      useRequestedAt: coupon.requestedAt || "",
      usedAt: coupon.confirmedAt || "",
      usedByStaff: coupon.confirmedBy || "",
      serverSaved: true
    });
  });
  writeJson(STORAGE_KEYS.gachaCardHistory, Array.from(byId.values()));
}

function mapServerGachaCouponToLocal(coupon) {
  const issueMonth = normalizeServerYearMonth(coupon.targetYearMonth || coupon.issueMonth || coupon.createdAt);
  const officialCard = getOfficialGachaCard(coupon.cardId, issueMonth);
  const characterId = officialCard?.characterId || normalizeGachaCharacterId(coupon.cardId);
  return {
    ...(officialCard || {}),
    drawId: coupon.drawId,
    cardHistoryId: coupon.drawId || coupon.usageId,
    memberId: coupon.userId,
    cardId: officialCard?.cardId || characterId || coupon.cardId,
    characterId,
    serverCardId: coupon.cardId,
    issueMonth,
    cardName: officialCard?.cardName || officialCard?.characterName || coupon.characterName || "",
    characterName: officialCard?.characterName || officialCard?.cardName || coupon.characterName || "",
    rarity: officialCard?.rarity || coupon.rarity || "",
    prizeName: coupon.rewardName || "",
    prizeDescription: coupon.rewardDetail || "",
    validUntil: coupon.expiryDate,
    expires: coupon.expiryDate,
    usageCondition: coupon.notes || "",
    condition: coupon.notes || "",
    targetMenu: coupon.targetMenu || "",
    animationPreset: coupon.animation || "",
    lifecycleState: coupon.status,
    useState: coupon.status,
    status: coupon.status,
    confirmationCode: coupon.confirmationCode || "",
    useRequestedAt: coupon.requestedAt || "",
    usedAt: coupon.confirmedAt || "",
    usedByStaff: coupon.confirmedBy || "",
    obtainedAt: coupon.createdAt || "",
    drawnAt: coupon.createdAt || "",
    serverSaved: true
  };
}

function replaceServerGachaCoupons(coupons, userId) {
  if (!Array.isArray(coupons)) return;
  const mapped = coupons.map(mapServerGachaCouponToLocal).filter((card) => card.drawId || card.cardHistoryId);
  const sameUser = (card) => String(card.memberId || "") === String(userId || "");
  const history = readJson(STORAGE_KEYS.gachaCardHistory, []).filter((card) => !sameUser(card));
  const draws = readJson(STORAGE_KEYS.monthlyGachaDraws, []).filter((card) => !sameUser(card));
  writeJson(STORAGE_KEYS.gachaCardHistory, [...mapped, ...history]);
  writeJson(STORAGE_KEYS.monthlyGachaDraws, [...mapped, ...draws]);
}

function mergeServerBinderCards(cards) {
  if (!Array.isArray(cards)) return;
  const history = readJson(STORAGE_KEYS.gachaCardHistory, []);
  const byId = new Map(history.map((item) => [String(item.drawId || item.cardHistoryId), item]));
  cards.forEach((card) => {
    const id = String(card.drawId || card.binderId || "");
    if (!id) return;
    const existing = byId.get(id) || {};
    const issueMonth = normalizeServerYearMonth(card.targetYearMonth || card.issueMonth || existing.issueMonth || card.usedAt || card.createdAt);
    const officialCard = getOfficialGachaCard(card.cardId, issueMonth);
    const characterId = officialCard?.characterId || normalizeGachaCharacterId(card.cardId);
    byId.set(id, {
      ...(officialCard || {}),
      ...existing,
      drawId: card.drawId,
      cardHistoryId: card.drawId,
      binderId: card.binderId || "",
      memberId: card.userId,
      cardId: officialCard?.cardId || characterId || card.cardId,
      characterId,
      serverCardId: card.cardId,
      issueMonth,
      year: Number(card.year || issueMonth.slice(0, 4)),
      binderYear: Number(card.year || issueMonth.slice(0, 4)),
      rarity: officialCard?.rarity || card.rarity,
      usedAt: card.usedAt,
      inBinder: true,
      binderStoredAt: card.createdAt || "",
      lifecycleState: "used",
      useState: "used",
      status: "used",
      serverSaved: true
    });
  });
  writeJson(STORAGE_KEYS.gachaCardHistory, Array.from(byId.values()));
}

function mergeServerCollectionRewards(rewards) {
  if (!Array.isArray(rewards)) return;
  const local = getCollectionRewards();
  const byId = new Map(local.map((item) => [String(item.rewardId || item.rewardRuleId), item]));
  rewards.forEach((reward) => {
    const id = String(reward.rewardRuleId || reward.rewardId || "");
    if (!id) return;
    byId.set(id, {
      ...(byId.get(id) || {}),
      rewardId: id,
      rewardRuleId: id,
      title: reward.rewardTitle,
      description: reward.rewardDescription,
      year: reward.targetYear,
      requiredRarity: reward.rarity || reward.targetRarity,
      requiredCount: Number(reward.conditionValue || reward.requiredCount || 0),
      requireAllRarities: reward.requireAllRarities === true || String(reward.requireAllRarities).toUpperCase() === "TRUE",
      requireCompleteCollection: reward.requireCompleteCollection === true || String(reward.requireCompleteCollection).toUpperCase() === "TRUE",
      conditionType: reward.conditionType || "",
      conditionValue: Number(reward.conditionValue || reward.requiredCount || 0),
      rarity: reward.rarity || reward.targetRarity || "",
      targetCardId: reward.targetCardId || "",
      prizeName: reward.prizeName || "",
      prizeDescription: reward.prizeDescription || "",
      active: reward.active === true || String(reward.active).toUpperCase() === "TRUE",
      isPublic: (reward.active === true || String(reward.active).toUpperCase() === "TRUE") && (reward.isPublished === true || String(reward.isPublished).toUpperCase() === "TRUE"),
      sortOrder: Number(reward.sortOrder || 999),
      achieved: reward.achieved === true,
      validUntil: reward.expiryDate || ""
    });
  });
  writeJson(STORAGE_KEYS.collectionRewards, Array.from(byId.values()));
}

function mapServerMenuMasterToLocal(menu) {
  return {
    menuId: String(menu.menuId || ""),
    type: "通常メニュー",
    category: menu.category || "その他",
    title: menu.menuName || menu.title || "",
    description: menu.description || "",
    regularPrice: Number(menu.price || menu.regularPrice || 0),
    couponPrice: 0,
    durationMinutes: Number(menu.duration || menu.durationMinutes || 0),
    isPublic: menu.active === true || String(menu.active).toUpperCase() === "TRUE" || menu.status === "active",
    sortOrder: Number(menu.sortOrder || menu.displayOrder || 999),
    source: "MenuMaster",
    updatedAt: menu.updatedAt || ""
  };
}

function mapServerCouponMasterToLocal(coupon) {
  const validFrom = normalizeApiDateKey(coupon.startDate || coupon.validFrom);
  const validUntil = normalizeApiDateKey(coupon.endDate || coupon.validUntil);
  const bookingDetails = extractCouponBookingDetails(coupon);
  return normalizeCouponDefinition({
    couponId: coupon.couponId,
    title: coupon.couponName || coupon.title,
    description: coupon.description,
    imageUrl: coupon.imageUrl,
    lineCouponUrl: coupon.lineCouponUrl,
    couponType: coupon.couponType,
    type: "LINEクーポン",
    regularPrice: bookingDetails.regularPrice,
    couponPrice: bookingDetails.couponPrice,
    durationMinutes: bookingDetails.durationMinutes,
    bookingPriceKnown: bookingDetails.priceKnown,
    bookingDurationKnown: bookingDetails.durationKnown,
    discountAmount: coupon.discountAmount,
    discountRate: coupon.discountRate,
    targetMenu: coupon.targetMenu,
    minimumAmount: coupon.minimumAmount,
    startDate: validFrom,
    endDate: validUntil,
    validStartAt: validFrom,
    validUntil,
    perUserLimit: coupon.usageLimit,
    canCombine: coupon.allowCombination,
    isPublic: coupon.status === "active",
    status: coupon.status === "active" ? "公開" : coupon.status === "stopped" ? "非公開" : coupon.status,
    source: coupon.issueType,
    sortOrder: coupon.displayOrder,
    createdAt: coupon.createdAt,
    updatedAt: coupon.updatedAt
  });
}

function extractCouponBookingDetails(coupon = {}) {
  const text = [coupon.couponName, coupon.title, coupon.description].filter(Boolean).join(" ");
  const arrowPrice = text.match(/[¥￥]\s*([\d,]+)\s*(?:円)?\s*(?:→|⇒|->)\s*[¥￥]\s*([\d,]+)/i);
  const explicitRegularPrice = Number(coupon.regularPrice || coupon.originalPrice || 0);
  const explicitCouponPrice = Number(coupon.couponPrice || coupon.discountedPrice || coupon.salePrice || coupon.price || 0);
  const explicitDuration = Number(coupon.durationMinutes || coupon.duration || 0);
  const minuteMatch = text.match(/(\d+)\s*分/);
  const hourMatch = text.match(/(\d+(?:\.\d+)?)\s*時間/);
  const parsedDuration = minuteMatch ? Number(minuteMatch[1]) : (hourMatch ? Math.round(Number(hourMatch[1]) * 60) : 0);
  return {
    regularPrice: explicitRegularPrice || (arrowPrice ? Number(arrowPrice[1].replace(/,/g, "")) : 0),
    couponPrice: explicitCouponPrice || (arrowPrice ? Number(arrowPrice[2].replace(/,/g, "")) : 0),
    durationMinutes: explicitDuration || parsedDuration,
    priceKnown: Boolean(explicitCouponPrice || arrowPrice),
    durationKnown: Boolean(explicitDuration || parsedDuration)
  };
}

function normalizeApiDateKey(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const plainDate = raw.match(/^(\d{4})[/-](\d{2})[/-](\d{2})$/);
  if (plainDate) return `${plainDate[1]}-${plainDate[2]}-${plainDate[3]}`;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date).reduce((result, part) => ({ ...result, [part.type]: part.value }), {});
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function mapServerMemberCouponToLocal(coupon) {
  const statusMap = {
    available: "未使用",
    reserved: "予約で使用予定",
    used: "使用済み",
    expired: "期限切れ",
    cancelled: "取消済み"
  };
  return {
    couponId: coupon.memberCouponId,
    memberCouponId: coupon.memberCouponId,
    parentCouponId: coupon.couponId,
    couponDefinitionId: coupon.couponId,
    memberId: coupon.memberId,
    lineUserId: coupon.lineUserId,
    title: coupon.title,
    description: coupon.description,
    message: coupon.description,
    discountAmount: coupon.discountAmount,
    discountRate: coupon.discountRate,
    targetMenu: coupon.targetMenu,
    source: coupon.sourceType,
    sourceType: coupon.sourceType,
    sourceId: coupon.sourceId,
    linkedCardHistoryId: coupon.gachaHistoryId,
    linkedRewardId: coupon.collectionRewardId,
    expires: coupon.validUntil,
    validUntil: coupon.validUntil,
    status: statusMap[coupon.status] || coupon.statusLabel || "未使用",
    reservationId: coupon.reservedBookingId,
    usedAt: coupon.usedAt,
    usedShop: coupon.usedStore,
    usedStaff: coupon.usedByStaff,
    createdAt: coupon.issuedAt,
    updatedAt: coupon.updatedAt,
    selectableOnBooking: true
  };
}

function mergeServerMemberCoupon(serverCoupon) {
  if (!serverCoupon) return null;
  const localCoupon = mapServerMemberCouponToLocal(serverCoupon);
  const coupons = readJson(STORAGE_KEYS.myCoupons, []);
  const index = coupons.findIndex((coupon) => (
    String(coupon.memberCouponId || coupon.couponId) === String(localCoupon.memberCouponId || localCoupon.couponId)
  ));
  if (index >= 0) coupons[index] = { ...coupons[index], ...localCoupon };
  else coupons.unshift(localCoupon);
  writeJson(STORAGE_KEYS.myCoupons, coupons);
  return localCoupon;
}

function summaryRows(rows) {
  return rows.map(([label, value]) => `<div><small>${escapeHtml(label)}</small><strong>${escapeHtml(value)}</strong></div>`).join("");
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_) {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function createId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

function jstDateKey() {
  const formatter = new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit" });
  return formatter.format(new Date()).replaceAll("/", "-");
}

function jstDateLabel() {
  return new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", month: "long", day: "numeric", weekday: "short" }).format(new Date());
}

function formatDateTime(value) {
  if (!value) return "";
  const raw = String(value).trim();
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw.replace("T", " ");
  const parts = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(date);
  const pick = (type) => parts.find((part) => part.type === type)?.value || "";
  return `${pick("year")}年${Number(pick("month"))}月${Number(pick("day"))}日 ${pick("hour")}:${pick("minute")}`;
}

function formatDateUntil(value) {
  if (!value) return "-";
  const raw = String(value).trim();
  const date = /^\d{4}-\d{2}-\d{2}$/.test(raw) ? new Date(`${raw}T00:00:00+09:00`) : new Date(raw);
  if (Number.isNaN(date.getTime())) {
    if (raw === "-" || raw.endsWith("まで")) return raw;
    return `${raw}まで`;
  }
  const parts = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "numeric",
    day: "numeric"
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value || "";
  const month = parts.find((part) => part.type === "month")?.value || "";
  const day = parts.find((part) => part.type === "day")?.value || "";
  return `${year}年${Number(month)}月${Number(day)}日まで`;
}

function hashString(value) {
  return String(value).split("").reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) >>> 0, 2166136261);
}

function setButtonLoading(button, isLoading, label) {
  if (!button) return;
  button.disabled = isLoading;
  button.textContent = label;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 3600);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}
