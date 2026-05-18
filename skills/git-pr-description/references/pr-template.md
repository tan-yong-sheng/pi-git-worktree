# PR Description Template

Below is the standard template for PR Descriptions. Fill in the content following this structure.

---

## 🎯 Why this change

<!-- Briefly describe the background and motivation -->

## ⚠️ What changed

<!-- Group by feature or requirement. For each group list: direction of change, specific content
Rules:
- No Markdown link format: [text](...)
- No URI / scheme: e.g. file://, cci:
- No file paths (including relative paths) — always use pure functional descriptions instead -->

### [Feature name / Requirement item]

- **Direction of change**: Briefly describe the purpose of the adjustment (e.g. optimize performance, fix logic error, adjust styles)
- **Content**:
  - Specific change 1 (pure functional description)
  - Specific change 2 (pure functional description)

### [Another feature name]

- **Direction of change**: ...
- **Content**:
  - ...

## 🧪 Test Steps

<!-- Rules:
- Each module / component listed in "What changed" must have at least one corresponding test case
- Ensure all changes are covered, no omissions allowed
Each test case must include:
1. A clear test scenario name (annotated with the corresponding module / component)
2. Operation steps (step by step)
3. Expected result
For frontend projects, include screenshot illustrations -->

### Test Case 1: [Test scenario for Module A]

1. Step one
2. Step two
3. **Expected result**: Describe the expected behavior or visual result

### Test Case 2: [Test scenario for Module B]

1. Step one
2. Step two
3. **Expected result**: Describe the expected behavior or visual result

### Test Case N: [Continue until all changed modules have corresponding tests]
