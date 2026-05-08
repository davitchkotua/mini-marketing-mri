// Mini Marketing MRI v2 — 14 diagnostic questions + lead form

export type SuspectedLossPoint =
  | "BEFORE_CONTACT"
  | "CONTACT_TO_CONVERSATION"
  | "CONVERSATION_TO_OFFER"
  | "OFFER_TO_SALE"
  | "FOLLOW_UP"
  | "MONEY_SOURCE"
  | "CONTROL_SYSTEM";

export type ContextField =
  | "business_type"
  | "sales_method"
  | "monthly_potential_customers"
  | "average_sale_value";

export interface ScoreModifier {
  risk?: number;
  visibility?: number;
  readiness?: number;
}

export interface QuizOption {
  key: string;
  label: string;
  contextValue?: string;
  modifier?: ScoreModifier;
  suspectedLossPoint?: SuspectedLossPoint;
}

export interface QuizQuestion {
  id: string;
  number: number;
  title: string;
  contextField?: ContextField;
  options: QuizOption[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    number: 1,
    title: "რა ტიპის ბიზნესია?",
    contextField: "business_type",
    options: [
      { key: "A", label: "სერვისული ბიზნესი", contextValue: "service" },
      { key: "B", label: "ონლაინ მაღაზია", contextValue: "ecommerce" },
      { key: "C", label: "ფიზიკური მაღაზია ან ლოკალური ბიზნესი", contextValue: "local" },
      { key: "D", label: "B2B კომპანია", contextValue: "b2b" },
      { key: "E", label: "განათლება, კურსები ან ტრენინგები", contextValue: "education" },
      { key: "F", label: "უძრავი ქონება", contextValue: "real_estate" },
      { key: "G", label: "სხვა", contextValue: "other" },
    ],
  },
  {
    id: "q2",
    number: 2,
    title: "ძირითადად როგორ ყიდით?",
    contextField: "sales_method",
    options: [
      { key: "A", label: "ვებსაიტზე პირდაპირი ყიდვით", contextValue: "website_direct" },
      { key: "B", label: "ზარით ან შეხვედრით", contextValue: "call_meeting" },
      { key: "C", label: "Facebook/Instagram შეტყობინებებით", contextValue: "social_dm" },
      { key: "D", label: "WhatsApp/Viber/Telegram-ით", contextValue: "messenger" },
      { key: "E", label: "გაყიდვების გუნდით", contextValue: "sales_team" },
      { key: "F", label: "პარტნიორებით ან რეკომენდაციებით", contextValue: "partners" },
      { key: "G", label: "შერეულად", contextValue: "mixed" },
    ],
  },
  {
    id: "q3",
    number: 3,
    title: "თვეში საშუალოდ რამდენი პოტენციური კლიენტი გიკავშირდებათ?",
    contextField: "monthly_potential_customers",
    options: [
      { key: "A", label: "ზუსტად არ ვიცით", contextValue: "unknown", modifier: { visibility: -20, readiness: -10, risk: 15 } },
      { key: "B", label: "1–10", contextValue: "1_10", modifier: { readiness: 5 } },
      { key: "C", label: "11–30", contextValue: "11_30", modifier: { readiness: 10 } },
      { key: "D", label: "31–100", contextValue: "31_100", modifier: { readiness: 15, risk: 10 } },
      { key: "E", label: "100+", contextValue: "100_plus", modifier: { readiness: 20, risk: 15 } },
    ],
  },
  {
    id: "q4",
    number: 4,
    title: "საშუალოდ ერთი გაყიდვა რამდენია?",
    contextField: "average_sale_value",
    options: [
      { key: "A", label: "ზუსტად არ ვიცით", contextValue: "unknown", modifier: { visibility: -20, readiness: -5, risk: 10 } },
      { key: "B", label: "100 ₾-ზე ნაკლები", contextValue: "lt_100" },
      { key: "C", label: "100–500 ₾", contextValue: "100_500" },
      { key: "D", label: "500–2,000 ₾", contextValue: "500_2k", modifier: { readiness: 10, risk: 10 } },
      { key: "E", label: "2,000–10,000 ₾", contextValue: "2k_10k", modifier: { readiness: 10, risk: 10 } },
      { key: "F", label: "10,000+ ₾", contextValue: "10k_plus", modifier: { readiness: 10, risk: 10 } },
    ],
  },
  {
    id: "q5",
    number: 5,
    title: "იცით, რომელი არხიდან მოდის ყველაზე ხარისხიანი პოტენციური კლიენტი?",
    options: [
      { key: "A", label: "არა", modifier: { visibility: -25, risk: 20, readiness: -10 }, suspectedLossPoint: "MONEY_SOURCE" },
      { key: "B", label: "ზოგადად ვხვდებით", modifier: { visibility: -10, risk: 10 } },
      { key: "C", label: "ვიცით, საიდან მოდის ბევრი ადამიანი, მაგრამ არა რომელი მოდის ყველაზე ხარისხიანი", modifier: { visibility: -5, risk: 10 }, suspectedLossPoint: "MONEY_SOURCE" },
      { key: "D", label: "ვიცით მთავარი ხარისხიანი არხები", modifier: { visibility: 15, readiness: 10 } },
      { key: "E", label: "ვიცით არხების მიხედვით: რაოდენობა, ხარისხი, გაყიდვა და საშუალო ჩეკი", modifier: { visibility: 25, readiness: 20, risk: -10 } },
    ],
  },
  {
    id: "q6",
    number: 6,
    title: "იმ ადამიანებიდან, ვინც გიკავშირდებათ, დაახლოებით რამდენი გადადის რეალურ საუბარში?",
    options: [
      { key: "A", label: "არ ვიცით", modifier: { visibility: -20, risk: 20, readiness: -5 }, suspectedLossPoint: "CONTACT_TO_CONVERSATION" },
      { key: "B", label: "ძალიან ცოტა", modifier: { risk: 25 }, suspectedLossPoint: "CONTACT_TO_CONVERSATION" },
      { key: "C", label: "დაახლოებით 25%-ზე ნაკლები", modifier: { risk: 15 }, suspectedLossPoint: "CONTACT_TO_CONVERSATION" },
      { key: "D", label: "დაახლოებით 25–50%", modifier: { visibility: 10, readiness: 5 } },
      { key: "E", label: "დაახლოებით 50%+", modifier: { visibility: 15, risk: -10, readiness: 10 } },
    ],
  },
  {
    id: "q7",
    number: 7,
    title: "საუბრის შემდეგ რამდენ ადამიანს უგზავნით კონკრეტულ შეთავაზებას?",
    options: [
      { key: "A", label: "არ ვიცით", modifier: { visibility: -20, risk: 20, readiness: -5 }, suspectedLossPoint: "CONVERSATION_TO_OFFER" },
      { key: "B", label: "ძალიან ცოტას", modifier: { risk: 25 }, suspectedLossPoint: "CONVERSATION_TO_OFFER" },
      { key: "C", label: "დაახლოებით 25%-ზე ნაკლებს", modifier: { risk: 15 }, suspectedLossPoint: "CONVERSATION_TO_OFFER" },
      { key: "D", label: "დაახლოებით 25–50%-ს", modifier: { visibility: 10, readiness: 5 } },
      { key: "E", label: "დაახლოებით 50%+-ს", modifier: { visibility: 15, risk: -10, readiness: 10 } },
    ],
  },
  {
    id: "q8",
    number: 8,
    title: "გაგზავნილი შეთავაზებებიდან დაახლოებით რამდენი სრულდება გაყიდვით?",
    options: [
      { key: "A", label: "არ ვიცით", modifier: { visibility: -25, risk: 20, readiness: -5 }, suspectedLossPoint: "OFFER_TO_SALE" },
      { key: "B", label: "10%-ზე ნაკლები", modifier: { risk: 30 }, suspectedLossPoint: "OFFER_TO_SALE" },
      { key: "C", label: "დაახლოებით 10–25%", modifier: { risk: 15 }, suspectedLossPoint: "OFFER_TO_SALE" },
      { key: "D", label: "დაახლოებით 25–50%", modifier: { visibility: 10, readiness: 10 } },
      { key: "E", label: "50%+", modifier: { visibility: 20, risk: -15, readiness: 15 } },
    ],
  },
  {
    id: "q9",
    number: 9,
    title: "ბოლო 10 დაკარგული პოტენციური კლიენტიდან იცით, რატომ დაიკარგნენ?",
    options: [
      { key: "A", label: "არა", modifier: { visibility: -30, risk: 25, readiness: -10 } },
      { key: "B", label: "ზოგადად ვხვდებით, მაგრამ არ გვაქვს ჩაწერილი", modifier: { visibility: -15, risk: 15 } },
      { key: "C", label: "ნაწილობრივ ვიცით", modifier: { visibility: 5, risk: 5, readiness: 5 } },
      { key: "D", label: "მიზეზები ჩაწერილია", modifier: { visibility: 20, readiness: 15 } },
      { key: "E", label: "მიზეზებს ვაანალიზებთ და ამის მიხედვით ვცვლით პროცესს", modifier: { visibility: 30, readiness: 25, risk: -10 } },
    ],
  },
  {
    id: "q10",
    number: 10,
    title: "სად გგონია, ყველაზე ხშირად იკარგება პოტენციური კლიენტი?",
    options: [
      { key: "A", label: "არ ვიცით", modifier: { visibility: -25, risk: 20 } },
      { key: "B", label: "სანამ დაგვიკავშირდება", suspectedLossPoint: "BEFORE_CONTACT" },
      { key: "C", label: "დაკავშირების შემდეგ, სანამ რეალურ საუბარში გადავა", suspectedLossPoint: "CONTACT_TO_CONVERSATION" },
      { key: "D", label: "საუბრის შემდეგ, სანამ შეთავაზებას მიიღებს", suspectedLossPoint: "CONVERSATION_TO_OFFER" },
      { key: "E", label: "შეთავაზების შემდეგ, სანამ გადაწყვეტილებას მიიღებს", suspectedLossPoint: "OFFER_TO_SALE" },
      { key: "F", label: "განმეორებითი დაკავშირების ეტაპზე", suspectedLossPoint: "FOLLOW_UP" },
    ],
  },
  {
    id: "q11",
    number: 11,
    title: "გაქვთ თუ არა განმეორებითი დაკავშირების პროცესი?",
    options: [
      { key: "A", label: "არა", modifier: { risk: 30, visibility: -15, readiness: -5 }, suspectedLossPoint: "FOLLOW_UP" },
      { key: "B", label: "ზოგჯერ ვწერთ ან ვურეკავთ", modifier: { risk: 20 }, suspectedLossPoint: "FOLLOW_UP" },
      { key: "C", label: "გვაქვს ზოგადი წესი, მაგრამ არ სრულდება სტაბილურად", modifier: { risk: 10, visibility: 5 }, suspectedLossPoint: "FOLLOW_UP" },
      { key: "D", label: "გვაქვს პროცესი და პასუხისმგებელი პირი", modifier: { visibility: 15, readiness: 10 } },
      { key: "E", label: "გვაქვს პროცესი, პასუხისმგებელი პირი და ვზომავთ შედეგს", modifier: { visibility: 25, readiness: 20, risk: -10 } },
    ],
  },
  {
    id: "q12",
    number: 12,
    title: "კვირაში ერთხელ მაინც უყურებთ მარკეტინგისა და გაყიდვების ძირითად ციფრებს?",
    options: [
      { key: "A", label: "არა", modifier: { visibility: -20, risk: 20, readiness: -10 }, suspectedLossPoint: "CONTROL_SYSTEM" },
      { key: "B", label: "იშვიათად", modifier: { visibility: -10, risk: 10 }, suspectedLossPoint: "CONTROL_SYSTEM" },
      { key: "C", label: "ვუყურებთ, მაგრამ არარეგულარულად", modifier: { risk: 5, visibility: 5 } },
      { key: "D", label: "ვუყურებთ ყოველკვირეულად", modifier: { visibility: 15, readiness: 10 } },
      { key: "E", label: "ვუყურებთ ყოველკვირეულად და ამის მიხედვით ვცვლით მოქმედებებს", modifier: { visibility: 25, readiness: 20, risk: -10 } },
    ],
  },
  {
    id: "q13",
    number: 13,
    title: "გაყიდვამდე გზის თითოეულ ეტაპზე იცით, ვინ არის პასუხისმგებელი?",
    options: [
      { key: "A", label: "არა", modifier: { risk: 20, visibility: -15 }, suspectedLossPoint: "CONTROL_SYSTEM" },
      { key: "B", label: "ზოგადად ვიცით", modifier: { risk: 10 } },
      { key: "C", label: "ნაწილობრივ გაწერილია", modifier: { visibility: 5, readiness: 5 } },
      { key: "D", label: "ძირითადად გაწერილია", modifier: { visibility: 15, readiness: 10 } },
      { key: "E", label: "ყველა მთავარ ეტაპს ჰყავს პასუხისმგებელი პირი", modifier: { visibility: 25, readiness: 15, risk: -10 } },
    ],
  },
  {
    id: "q14",
    number: 14,
    title: "როცა შედეგი არ მოდის, იცით პირველ რიგში რას ცვლით?",
    options: [
      { key: "A", label: "არა, ძირითადად ახალ იდეას ვცდით", modifier: { visibility: -25, risk: 25, readiness: -10 }, suspectedLossPoint: "CONTROL_SYSTEM" },
      { key: "B", label: "ზოგადად ვხვდებით", modifier: { visibility: -10, risk: 10 } },
      { key: "C", label: "ხანდახან ვიცით, მაგრამ სისტემურად არა", modifier: { visibility: 5 } },
      { key: "D", label: "ხშირად ვიცით, რომელ ეტაპს უნდა შევეხოთ", modifier: { visibility: 15, readiness: 10 } },
      { key: "E", label: "გვაქვს მკაფიო წესი, რა მონაცემით ვიღებთ ცვლილების გადაწყვეტილებას", modifier: { visibility: 30, readiness: 20, risk: -15 } },
    ],
  },
];

export const revenueRanges = [
  "< 5,000 ₾ / თვე",
  "5,000–20,000 ₾ / თვე",
  "20,000–50,000 ₾ / თვე",
  "50,000–150,000 ₾ / თვე",
  "150,000+ ₾ / თვე",
];

export const teamSizeRanges = ["1 (მხოლოდ მე)", "2–5", "6–15", "16–50", "50+"];
