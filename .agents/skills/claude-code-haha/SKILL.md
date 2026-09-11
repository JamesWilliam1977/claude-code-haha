```markdown
# claude-code-haha Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill introduces the core development patterns and workflows used in the `claude-code-haha` Rust repository. It covers coding conventions, commit message standards, file organization, and documentation update workflows. By following these patterns, contributors can ensure consistency, maintainability, and clarity throughout the codebase.

## Coding Conventions

### File Naming
- **Style:** PascalCase  
  *Example:*  
  ```
  MyModule.rs
  AnotherComponent.rs
  ```

### Import Style
- **Relative Imports**  
  *Example:*  
  ```rust
  mod utils;
  use crate::utils::parse_input;
  ```

### Export Style
- **Named Exports**  
  *Example:*  
  ```rust
  pub fn calculate_sum(a: i32, b: i32) -> i32 {
      a + b
  }
  ```

### Commit Messages
- **Conventional Commits**  
  - Prefixes: `docs`, `fix`
  - Example:  
    ```
    docs: update README with usage instructions
    fix: correct typo in error message
    ```
  - Average length: ~47 characters

## Workflows

### Update Documentation Files
**Trigger:** When someone wants to improve documentation or issue reporting templates.  
**Command:** `/update-docs`

1. Edit one or more markdown files in the `docs` or `.github/ISSUE_TEMPLATE` directories.
2. Add or modify sections, fields, or callouts as needed.
3. Verify formatting and content alignment (e.g., bilingual consistency, actionable fields).
4. Optionally check rendering or output if applicable.

**Files Involved:**
- `.github/ISSUE_TEMPLATE/bug_report.md`
- `.github/ISSUE_TEMPLATE/question.md`
- `README.en.md`
- `README.md`

**Frequency:** ~2x/month

#### Example: Editing a Documentation File
```markdown
## New Section

Describe your proposed change here.
```

#### Example: Updating an Issue Template
```markdown
### Steps to Reproduce

1. ...
2. ...
```

## Testing Patterns

- **Framework:** Unknown (no specific framework detected)
- **File Pattern:** `*.test.*`  
  *Example:*  
  ```
  MathUtils.test.rs
  ```

- **General Structure:**  
  Tests are placed in files matching the `*.test.*` pattern and follow standard Rust test conventions.

  ```rust
  #[cfg(test)]
  mod tests {
      use super::*;

      #[test]
      fn test_addition() {
          assert_eq!(calculate_sum(2, 3), 5);
      }
  }
  ```

## Commands

| Command       | Purpose                                                        |
|---------------|----------------------------------------------------------------|
| /update-docs  | Start the documentation update workflow for docs and templates |
```
