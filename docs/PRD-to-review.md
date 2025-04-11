# PRD Review Task

## 📝 Instructions

Review the following PRD and identify **3 critical issues**.

## Example PRD

### Feature: User Profile Management

1. Users should be able to update their name and email.
2. There is no authentication mechanism specified.
3. No mention of error handling.

## ✏️ Your Review

- Issue 1: There is no mention of format, length, or validation.
  Format, is it one field for name, or multiple fields like first name and last name? Also we should be check there is an @ symbol in the email.
  Length: We should be setting a minimum length for name so people don't leave it blank.
  Validation: We should check that the email belongs to them by sending an OTP code."
- Issue 2: What authenication do we have around updating their name and email? Are we assuming that need to pass a authenciation screen before getting here. Or do we need to put a authenication screen in front of this.
- Issue 3: No error handling. We need have handling for people trying to change to a email address that is already in the db and attached to another user.
