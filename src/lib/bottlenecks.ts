import type { DimensionKey } from "./quiz-data";

export interface BottleneckResult {
  key: DimensionKey;
  title: string;
  diagnosis: string;
  symptoms: string[];
  nextStep: string;
}

export const bottleneckPriority: DimensionKey[] = [
  "money_clarity",
  "offer_clarity",
  "funnel_visibility",
  "conversion_evidence",
  "icp_clarity",
  "execution_rhythm",
  "decision_system",
];

export const bottlenecks: Record<DimensionKey, BottleneckResult> = {
  money_clarity: {
    key: "money_clarity",
    title: "შენი მთავარი bottleneck შეიძლება იყოს Money Clarity",
    diagnosis:
      "შესაძლოა ბიზნესი ვერ ხედავს ზუსტად რომელი offer, არხი ან მომხმარებლის სეგმენტი ქმნის რეალურ ფულს.",
    symptoms: [
      "ბევრ აქტივობას აკეთებთ, მაგრამ ROI ბუნდოვანია",
      "რთულია ბიუჯეტის განაწილება",
      "არ ჩანს რომელი არხი იმსახურებს გაძლიერებას",
    ],
    nextStep:
      "სრულ Marketing MRI-ში პირველი ნაბიჯი იქნებოდა money map-ის და revenue source logic-ის გაშლა.",
  },
  offer_clarity: {
    key: "offer_clarity",
    title: "შენი მთავარი bottleneck შეიძლება იყოს Offer Clarity",
    diagnosis:
      "შესაძლოა პრობლემა არა traffic-ში, არამედ შეთავაზების სიმკვეთრეშია.",
    symptoms: [
      "ადამიანები ინტერესდებიან, მაგრამ არ ყიდულობენ",
      "ფასზე ბევრი წინააღმდეგობაა",
      "კონკურენტებისგან მკაფიო განსხვავება არ ჩანს",
    ],
    nextStep:
      "საჭიროა offer-ის კომერციული გაშლა: ვისთვისაა, რა პრობლემას ხსნის, რატომ ახლა, რატომ შენგან.",
  },
  icp_clarity: {
    key: "icp_clarity",
    title: "შენი მთავარი bottleneck შეიძლება იყოს ICP Clarity",
    diagnosis:
      "შესაძლოა მარკეტინგი ზედმეტად ფართო აუდიტორიას ელაპარაკება.",
    symptoms: [
      "კონტენტი ზოგადია",
      "მესიჯი ყველასთვისაა და არავის ურტყამს ზუსტად",
      "lead quality არასტაბილურია",
    ],
    nextStep: "საჭიროა high-value segment-ის, buying triggers-ის და objections-ის გაშლა.",
  },
  funnel_visibility: {
    key: "funnel_visibility",
    title: "შენი მთავარი bottleneck შეიძლება იყოს Funnel Visibility",
    diagnosis: "შესაძლოა არ ჩანს სად გადადის ადამიანი awareness-დან sale-მდე.",
    symptoms: [
      "არხები ცალკე მუშაობს",
      "sales და marketing disconnected არის",
      "არ ჩანს რომელი ეტაპი ტეხავს ზრდას",
    ],
    nextStep: "საჭიროა funnel path-ის რუკა: source → lead → conversation → sale → repeat.",
  },
  conversion_evidence: {
    key: "conversion_evidence",
    title: "შენი მთავარი bottleneck შეიძლება იყოს Conversion Evidence",
    diagnosis:
      "შესაძლოა გაქვთ მოთხოვნა ან ინტერესი, მაგრამ არ იცით სად იკარგება გაყიდვა.",
    symptoms: [
      "leads მოდის, მაგრამ sales არ იზრდება შესაბამისი ტემპით",
      "ბევრი follow-up იკარგება",
      "landing, offer, sales conversation ან trust layer შეიძლება სუსტია",
    ],
    nextStep: "საჭიროა conversion path-ის ანალიზი და bottleneck priority map.",
  },
  execution_rhythm: {
    key: "execution_rhythm",
    title: "შენი მთავარი bottleneck შეიძლება იყოს Execution Rhythm",
    diagnosis:
      "შესაძლოა პრობლემა სტრატეგიაში კი არა, მარკეტინგის მართვის რიტმშია.",
    symptoms: [
      "კამპანიები იწყება და ქრება",
      "პასუხისმგებლობები ბუნდოვანია",
      "ბევრი საქმეა, მაგრამ პროგრესი არ გროვდება",
    ],
    nextStep:
      "საჭიროა weekly marketing control system: priorities, owners, KPI review, next actions.",
  },
  decision_system: {
    key: "decision_system",
    title: "შენი მთავარი bottleneck შეიძლება იყოს Decision System",
    diagnosis:
      "შესაძლოა მარკეტინგული გადაწყვეტილებები ძალიან ბევრ ინტუიციაზეა დამოკიდებული.",
    symptoms: [
      "ხშირად იცვლება მიმართულება",
      "ახალი იდეები ძველს ანაცვლებს მტკიცებულების გარეშე",
      "რთულია პრიორიტეტის დადგენა",
    ],
    nextStep:
      "საჭიროა decision framework: რა ვზომავთ, რას ვადარებთ, როდის ვცვლით და ვინ იღებს გადაწყვეტილებას.",
  },
};
