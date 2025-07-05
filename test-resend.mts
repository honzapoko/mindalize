import { Resend } from 'resend';

const resend = new Resend('YOUR_RESEND_API_KEY');

async function test() {
  const result = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'your@email.com',
    subject: 'Test',
    html: '<b>Hello from Resend!</b>',
  });
  console.log(result);
}

test();