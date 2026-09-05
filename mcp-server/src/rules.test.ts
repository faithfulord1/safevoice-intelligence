import assert from "node:assert/strict";
import test from "node:test";
import { evaluateSafetyRules } from "./rules.js";

test("Yoruba expired-medicine signal maps to MED-EXP-001", () => {
  const result = evaluateSafetyRules("Oogun ti won fun mi yii dabi eni pe ojo re ti koja.");
  assert.equal(result.primaryDomain, "medicine_safety");
  assert.equal(result.overallRisk, "high");
  assert.ok(result.hits.some((hit) => hit.ruleId === "MED-EXP-001"));
  assert.equal(result.humanReviewRequired, true);
});

test("English expired-medicine signal maps to MED-EXP-001", () => {
  const result = evaluateSafetyRules("This medicine appears to be past its expiry date.");
  assert.equal(result.primaryDomain, "medicine_safety");
  assert.ok(result.hits.some((hit) => hit.ruleId === "MED-EXP-001"));
});

test("allergen concern maps to critical FOOD-ALG-001", () => {
  const result = evaluateSafetyRules("Customer has a peanut allergy and is unsure whether this sauce contains nuts.");
  assert.equal(result.primaryDomain, "food_safety");
  assert.equal(result.overallRisk, "critical");
  assert.ok(result.hits.some((hit) => hit.ruleId === "FOOD-ALG-001"));
});

test("temperature control concern maps to FOOD-TEMP-002", () => {
  const result = evaluateSafetyRules("Raw chicken has been left out of the fridge and feels warm.");
  assert.equal(result.primaryDomain, "food_safety");
  assert.equal(result.overallRisk, "high");
  assert.ok(result.hits.some((hit) => hit.ruleId === "FOOD-TEMP-002"));
});

test("unmatched reports remain under human review", () => {
  const result = evaluateSafetyRules("I noticed something unusual and want somebody to check it.");
  assert.equal(result.primaryDomain, "unclassified");
  assert.equal(result.overallRisk, "medium");
  assert.equal(result.humanReviewRequired, true);
  assert.equal(result.hits.length, 0);
});
