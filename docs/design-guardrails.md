# Design Guardrails

Purpose: validate UI output quickly and consistently. This file is a review gate, not a second design strategy document.

## 1\. Pre-Work Check

Before substantial design work, confirm:

* \[ ] The working mode is clear: explore, prototype, implement, or review
* \[ ] Any placeholders or unvalidated facts are explicitly labeled

## 2\. Anti-Slop Check

Reject or revise if the output contains:

* \[ ] Generic hero-metric dashboard composition
* \[ ] Dark-neon enterprise dashboard styling
* \[ ] Card-grid repetition with no information-hierarchy reason
* \[ ] Default SaaS copy such as "Welcome back" or "Get started"
* \[ ] Visual choices that ignore human-centered brand

## 3\. Token and Implementation Check

For implementation-ready output, reject or revise if it contains:

* \[ ] Hardcoded hex or RGB values where theme tokens should be used
* \[ ] Raw pixel spacing or radius values without justification
* \[ ] Typography values that bypass the design system without a stated reason
* \[ ] Styling guidance that conflicts with the repo's active component system

## 4\. Accessibility Check

* \[ ] WCAG AA contrast is maintained or called out for follow-up
* \[ ] Interactive targets are large enough for touch usage
* \[ ] Focus, disabled, loading, error, and empty states are considered where relevant
* \[ ] Motion has a reduced-motion fallback when motion is part of the design

## 5\. Brand Fit Check

* \[ ] Feels human and optimistic rather than corporate or hostile
* \[ ] Preserves curved, active, learner-centered brand qualities
* \[ ] Uses Story -> Proof -> System framing when the content needs narrative structure
* \[ ] Does not present placeholders as validated facts

## 6\. Review Output

When reviewing design output, report:

1. Findings first
2. The guardrails passed or failed
3. Any exceptions and whether they are justified

If multiple checks fail, regenerate or revise before approval.

