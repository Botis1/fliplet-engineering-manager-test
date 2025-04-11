# Security Strategy: JWT Expiry Fix

## Problem

Tokens never expire.

## Solution

1. Secure Authentication Flow Using Access & Refresh Tokens
   Objective: Implement a secure JWT-based authentication system where access tokens have short lifespans and refresh tokens enable seamless session continuity while minimizing vulnerabilities.

Components:
Access Token: A short-lived JWT containing user identity and permissions (e.g., user_id, role).
Refresh Token: A long-lived, opaque token used to obtain new access tokens without re-authentication.
Token Storage: Secure storage for refresh tokens (server-side database) and access tokens (client-side, preferably in memory or secure storage).
Token Validation: Mechanisms to verify token integrity and prevent misuse.

Authentication Flow:

1. User submits credentials via their login (e.g., username/password) to /auth/login endpoint.
2. Server verifies credentials against a secure user database
   On success, the server:
3. Generates an access token (JWT) (e.g Payload: { user_id, role, exp: now + 15 minutes, iat: now })
4. Server Signed with a private key
5. Generates a refresh token:
   Random, cryptographically secure string (e.g., 64 bytes).
6. Stored refresh_token, user_id, expires_at, created_at, revoked (boolean).
7. Returns both tokens to the client:
