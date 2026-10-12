# Behavior Documentation for GuardCMD Signup Demo

## Overview
This document outlines the expected behavior of the GuardCMD signup demo application, focusing on the integration of the GuardCMD library for abuse protection.

## Abuse Protection Integration
The application integrates GuardCMD in **shadow mode** by default, which means that abuse detection decisions are logged but not enforced. The following behaviors are expected:

1. **Default Shadow Mode**: When no specific guard is provided, the application uses a default GuardCMD instance configured with velocity and disposable email signals. In shadow mode, the application logs abuse detection decisions but allows all signups to proceed with a `201 Created` status.

2. **Custom Guard in Shadow Mode**: If a custom GuardCMD instance is provided in shadow mode, the application logs abuse detection decisions but allows all signups to proceed with a `201 Created` status, even if the guard detects abuse.

3. **Custom Guard in Enforce Mode**: If a custom GuardCMD instance is provided in enforce mode, the application enforces abuse detection decisions. If abuse is detected, the signup request is blocked with a `403 Forbidden` status.

4. **Malformed Email Handling**: If the email provided in the signup request is not a valid string containing an '@' symbol, the application returns a `400 Bad Request` status.

## Memory-Only Storage
The application uses in-memory storage for demonstration purposes only. This means that all user data is lost when the application is restarted. This setup is intended for testing and does not provide any persistence or durability guarantees.

## Important Notes
- **Shadow Mode Observability**: The shadow mode is used for observability purposes, allowing developers to monitor abuse detection decisions without enforcing them. This is useful for tuning and configuring the guard settings before enabling enforcement.
- **No Real Network Services or Secrets**: The application does not interact with any real network services or use any secrets. All operations are performed in-memory and are intended for local testing only.
- **Loopback Server**: Each test uses a loopback server that listens on a random available port and is closed after each test run to ensure isolation and resource cleanup.

## Testing
The application includes a set of tests that verify the expected behavior of the signup endpoint under different configurations of the GuardCMD guard. These tests cover scenarios such as default shadow mode, custom guards in both shadow and enforce modes, and handling of malformed email addresses.
