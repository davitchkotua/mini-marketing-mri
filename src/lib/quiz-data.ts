export type DimensionKey =
  | "money_clarity"
  | "offer_clarity"
  | "icp_clarity"
  | "funnel_visibility"
  | "conversion_evidence"
  | "execution_rhythm"
  | "decision_system";

export interface QuizAnswer {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
}

export interface QuizQuestion {
  key: DimensionKey;
  dimensionLabel: string;
  question: string;
  answers: QuizAnswer[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    key: "money_clarity",
    dimensionLabel: "Money Clarity",
    question:
      "რამდენად ზუსტად იცი, საიდან მოდის შენი ბიზნესის ძირითადი შემოსავალი?",
    answers: [
      { score: 0, label: "ზუსტად არ ვიცი, ზოგადი შეგრძნება მაქვს" },
      { score: 1, label: "დაახლოებით ვიცი, მაგრამ ციფრებით ვერ ვამტკიცებ" },
      { score: 2, label: "ვიცი ძირითადი წყაროები, მაგრამ არ მაქვს რეგულარული ანალიზი" },
      { score: 3, label: "ვიცი პროდუქტების/არხების მიხედვით" },
      { score: 4, label: "ზუსტად მაქვს გაშლილი: offer, არხი, margin, conversion და repeat purchase" },
    ],
  },
  {
    key: "offer_clarity",
    dimensionLabel: "Offer Clarity",
    question: "რამდენად მკაფიოა შენი მთავარი offer მომხმარებლისთვის?",
    answers: [
      { score: 0, label: "არ გვაქვს მკაფიო offer" },
      { score: 1, label: "გვაქვს პროდუქტი/სერვისი, მაგრამ შეთავაზება ბუნდოვანია" },
      { score: 2, label: "offer გასაგებია, მაგრამ საკმარისად ძლიერი არ არის" },
      { score: 3, label: "offer მკაფიოა და ხშირად იყიდება" },
      { score: 4, label: "offer მკაფიოა, დიფერენცირებულია და კომერციულად დატესტილია" },
    ],
  },
  {
    key: "icp_clarity",
    dimensionLabel: "ICP Clarity",
    question: "რამდენად ზუსტად იცი ვის ყიდი?",
    answers: [
      { score: 0, label: "ყველას ვყიდით" },
      { score: 1, label: "გვაქვს ზოგადი აუდიტორია" },
      { score: 2, label: "გვაქვს რამდენიმე სეგმენტი, მაგრამ პრიორიტეტი არ არის მკაფიო" },
      { score: 3, label: "ვიცით მთავარი ICP" },
      { score: 4, label: "ვიცით ICP, buying triggers, objections, decision logic და high-value segment" },
    ],
  },
  {
    key: "funnel_visibility",
    dimensionLabel: "Funnel Visibility",
    question: "ხედავ თუ არა, როგორ მოძრაობს ადამიანი პირველი შეხებიდან ყიდვამდე?",
    answers: [
      { score: 0, label: "არა, funnel საერთოდ არ გვაქვს რუკაზე" },
      { score: 1, label: "ზოგადად ვიცით, მაგრამ ციფრები არ გვაქვს" },
      { score: 2, label: "ზოგი ეტაპი ჩანს, ზოგი არა" },
      { score: 3, label: "ძირითადი funnel stages გაზომილია" },
      { score: 4, label: "მთელი path ჩანს: source → lead → conversation → sale → repeat/referral" },
    ],
  },
  {
    key: "conversion_evidence",
    dimensionLabel: "Conversion Evidence",
    question: "იცი სად იკარგება ყველაზე მეტი პოტენციური გაყიდვა?",
    answers: [
      { score: 0, label: "არა" },
      { score: 1, label: "ვხვდებით, მაგრამ არ გვაქვს მტკიცებულება" },
      { score: 2, label: "რამდენიმე სუსტი წერტილი ვიცით" },
      { score: 3, label: "ვიცით მთავარი conversion bottleneck" },
      { score: 4, label: "ვზომავთ bottleneck-ებს და რეგულარულად ვასწორებთ" },
    ],
  },
  {
    key: "execution_rhythm",
    dimensionLabel: "Execution Rhythm",
    question: "როგორ იმართება მარკეტინგის შესრულება კვირიდან კვირამდე?",
    answers: [
      { score: 0, label: "ქაოსურად" },
      { score: 1, label: "ვაკეთებთ რაღაცებს, მაგრამ რიტმი არ გვაქვს" },
      { score: 2, label: "გვაქვს გეგმა, მაგრამ ხშირად იცვლება" },
      { score: 3, label: "გვაქვს weekly rhythm და პასუხისმგებლობები" },
      { score: 4, label: "გვაქვს operating rhythm, KPI review, owners და decision cadence" },
    ],
  },
  {
    key: "decision_system",
    dimensionLabel: "Decision System",
    question: "როგორ იღებთ მარკეტინგულ გადაწყვეტილებებს?",
    answers: [
      { score: 0, label: "ძირითადად შეგრძნებით" },
      { score: 1, label: "ხანდახან მონაცემით, მაგრამ უმეტესად ინტუიციით" },
      { score: 2, label: "ვუყურებთ ციფრებს, მაგრამ გადაწყვეტილების სისტემა არ გვაქვს" },
      { score: 3, label: "გადაწყვეტილებები ძირითადად მონაცემს და მიზანს ეყრდნობა" },
      { score: 4, label: "გვაქვს მკაფიო decision system: data, priority, owner, next action" },
    ],
  },
];

export const MAX_SCORE = quizQuestions.length * 4;

export const revenueRanges = [
  "< 5,000 ₾ / თვე",
  "5,000–20,000 ₾ / თვე",
  "20,000–50,000 ₾ / თვე",
  "50,000–150,000 ₾ / თვე",
  "150,000+ ₾ / თვე",
];

export const teamSizeRanges = ["1 (მხოლოდ მე)", "2–5", "6–15", "16–50", "50+"];
