# Security Policy

## Supported Versions

We actively support the following versions of HackPot with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

The HackPot team takes security seriously. We appreciate your efforts to responsibly disclose your findings, and will make every effort to acknowledge your contributions.

### How to Report a Security Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: **info@hackpot.xyz**

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

### What to Include in Your Report

Please include the following information in your security report:

- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

This information will help us triage your report more quickly.

### Preferred Languages

We prefer all communications to be in English.

## Security Measures

### Smart Contract Security

- All smart contracts undergo thorough testing before deployment
- We use established patterns and libraries where possible
- Regular security audits are conducted by third-party firms
- Multi-signature wallets are used for critical operations

### Frontend Security

- All user inputs are validated and sanitized
- HTTPS is enforced for all communications
- Content Security Policy (CSP) headers are implemented
- Regular dependency updates and vulnerability scanning

### Infrastructure Security

- Database access is restricted and monitored
- API endpoints are rate-limited and authenticated
- Regular security patches and updates
- Encrypted data storage and transmission

### Wallet Integration Security

- We only integrate with audited and reputable wallet providers
- Private keys never leave the user's wallet
- All transactions are signed locally by the user
- Clear transaction details are always displayed before signing

## Responsible Disclosure Policy

We kindly ask that you:

- Give us reasonable time to investigate and mitigate an issue before public exposure
- Make a good faith effort to avoid privacy violations, destruction of data, and interruption or degradation of our services
- Only interact with accounts you own or with explicit permission of the account holder
- Do not access or modify data that does not belong to you
- Do not perform actions that could negatively affect our users or our services

### What We Promise

- We will respond to your report within 48 hours with our evaluation of the report and an expected resolution date
- If you have followed the instructions above, we will not take any legal action against you regarding the report
- We will handle your report with strict confidentiality, and not pass on your personal details to third parties without your permission
- We will keep you informed of the progress towards resolving the problem
- In the public information concerning the problem reported, we will give your name as the discoverer of the problem (unless you desire otherwise)

## Security Best Practices for Users

### Wallet Security

- Always verify transaction details before signing
- Never share your seed phrase or private keys
- Use hardware wallets for large amounts
- Keep your wallet software updated
- Be cautious of phishing attempts

### Account Security

- Use strong, unique passwords
- Enable two-factor authentication when available
- Regularly review your account activity
- Log out from shared or public computers
- Be cautious of suspicious links or emails

### Smart Contract Interactions

- Always verify contract addresses
- Understand what you're signing before confirming transactions
- Start with small amounts when trying new features
- Be aware of gas fees and slippage
- Double-check recipient addresses

## Bug Bounty Program

We are considering implementing a bug bounty program to reward security researchers who help us maintain the security of HackPot. Details will be announced on our official channels when available.

## Security Updates

Security updates will be communicated through:

- GitHub Security Advisories
- Our official Discord server
- Email notifications to registered users
- Social media announcements

## Contact

For any security-related questions or concerns, please contact us at:

- **Email**: info@hackpot.xyz

---

Thank you for helping keep HackPot and our users safe! 🔒
