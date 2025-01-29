export const emailVerificationTemplate = (callbackLink: string) => `
Hi,
\n\n
Verify your email by following the link below:
\n\n
<a href="${callbackLink}">Verify Email</a>
\n\n
This link will expire in 1 hour. It is important that you verify your email address, as 
you will not be able to reset your password or change your email unless your curent email 
is verified.
${callbackLink}
`;
