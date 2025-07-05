// test-resend.js
const { Resend } = require('resend');

const resend = new Resend('re_UCL2VHuU_PUz7uPSD3cuaguuCb8TBuaAt');

async function test() {
  const result = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'ing.honza.pokorny@gmail.com',
    subject: 'Test',
    html: '<b>Hello from Resend!</b>',
  });
  console.log(result);
}

test();