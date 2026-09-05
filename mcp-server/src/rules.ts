export type RiskLevel = "low" | "medium" | "high" | "critical";

export type RuleHit = {
  ruleId: string;
  domain: "medicine_safety" | "food_safety";
  issueType: string;
  risk: RiskLevel;
  title: string;
  explanation: string;
  evidenceRequests: string[];
  recommendedNextStep: string;
};

type Rule = RuleHit & {
  matches: (normalised: string) => boolean;
};

function normalise(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

const RULES: Rule[] = [
  {
    ruleId: "MED-EXP-001",
    domain: "medicine_safety",
    issueType: "suspected_expired_medicine",
    risk: "high",
    title: "Possible expired medicine",
    explanation:
      "The report contains language suggesting that a medicine may be past its labelled expiry date. This is a safety signal, not a confirmed finding.",
    evidenceRequests: [
      "Photo of the medicine packaging and visible expiry date",
      "Medicine name, if visible",
      "Date the medicine was supplied or purchased",
      "Supplying location or organisation",
      "Whether the medicine has already been taken",
    ],
    recommendedNextStep:
      "Preserve the original report and packaging evidence, then request authorised medicine-safety review.",
    matches: (text) =>
      /expired|expiry|expiry date|past.*expiry|out of date|medicine.*date|drug.*date|ogun.*ojo|oògùn.*ojo|ojo.*koja/.test(
        text,
      ),
  },
  {
    ruleId: "MED-ID-002",
    domain: "medicine_safety",
    issueType: "possible_medicine_identity_mismatch",
    risk: "high",
    title: "Possible medicine identity mismatch",
    explanation:
      "The reporter says the medicine or tablets appear different or may be the wrong medicine. SafeVoice does not determine whether the medicine is clinically correct.",
    evidenceRequests: [
      "Photo of the medicine and packaging",
      "Medicine name and strength shown on the label",
      "What the reporter expected to receive",
      "Supplying location or organisation",
    ],
    recommendedNextStep:
      "Request authorised pharmacy or medicine-safety review before any consequential conclusion.",
    matches: (text) =>
      /wrong medicine|wrong drug|different tablets|different pills|not my medicine|medicine looks different|tablets look different/.test(
        text,
      ),
  },
  {
    ruleId: "FOOD-ALG-001",
    domain: "food_safety",
    issueType: "allergen_safety_concern",
    risk: "critical",
    title: "Potential allergen exposure",
    explanation:
      "The report mentions an allergy or allergen together with a relevant food or ingredient signal. This requires urgent human review because allergen mistakes can be serious.",
    evidenceRequests: [
      "Food or menu item involved",
      "Known or declared allergen",
      "Approved allergen information or matrix, if available",
      "Time and location of service",
      "Whether the affected person has consumed the item",
    ],
    recommendedNextStep:
      "Stop relying on assumptions about ingredients and request immediate authorised allergen-safety review.",
    matches: (text) =>
      /(allergy|allergic|allergen).*(peanut|nut|milk|egg|sesame|shellfish|soy|soya|wheat|gluten)|(?:peanut|nut).*(allergy|allergic|allergen)/.test(
        text,
      ),
  },
  {
    ruleId: "FOOD-TEMP-002",
    domain: "food_safety",
    issueType: "temperature_control_concern",
    risk: "high",
    title: "Possible unsafe food temperature control",
    explanation:
      "The report contains temperature-control language involving food that may require chilled, hot-holding or controlled storage. This is a safety signal, not a confirmed breach.",
    evidenceRequests: [
      "Food item involved",
      "Observed or measured temperature, if available",
      "How long the food may have been outside controlled storage",
      "Time and location",
      "Any available temperature log",
    ],
    recommendedNextStep:
      "Preserve available temperature evidence and request authorised food-safety review.",
    matches: (text) =>
      /(chicken|meat|food|fish|dairy).*(warm|temperature|left out|outside fridge|not chilled)|(?:temperature|left out|outside fridge).*(chicken|meat|food|fish|dairy)/.test(
        text,
      ),
  },
  {
    ruleId: "FOOD-CROSS-003",
    domain: "food_safety",
    issueType: "cross_contamination_concern",
    risk: "high",
    title: "Possible cross-contamination",
    explanation:
      "The report suggests raw food, utensils or preparation surfaces may be creating a cross-contamination risk.",
    evidenceRequests: [
      "Foods and surfaces involved",
      "Photo of the preparation area, if safe and permitted",
      "Time and location",
      "Cleaning or separation controls observed",
    ],
    recommendedNextStep:
      "Preserve evidence and request authorised food-safety review of separation and hygiene controls.",
    matches: (text) =>
      /raw chicken.*(?:surface|board|knife|ready to eat|salad)|(?:surface|board|knife).*raw chicken|cross.?contamination/.test(
        text,
      ),
  },
];

const riskWeight: Record<RiskLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

export function evaluateSafetyRules(statement: string) {
  const normalised = normalise(statement);
  const hits = RULES.filter((rule) => rule.matches(normalised)).map(({ matches: _matches, ...hit }) => hit);

  if (hits.length === 0) {
    return {
      hits: [] as RuleHit[],
      overallRisk: "medium" as RiskLevel,
      primaryDomain: "unclassified" as const,
      humanReviewRequired: true,
      confidence: 0.4,
      explanation:
        "No deterministic demo rule matched. The report remains queued for human review rather than being treated as safe.",
    };
  }

  const highest = [...hits].sort((a, b) => riskWeight[b.risk] - riskWeight[a.risk])[0];

  return {
    hits,
    overallRisk: highest.risk,
    primaryDomain: highest.domain,
    humanReviewRequired: true,
    confidence: 0.9,
    explanation:
      "One or more transparent demo rules matched. Rule hits are safety signals only and require authorised human interpretation.",
  };
}
