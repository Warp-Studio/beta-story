import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendLeadNotification(lead) {
  await transporter.sendMail({
    from: `"MyShaadiStory" <${process.env.SMTP_USER}>`,
    to: process.env.NOTIFY_EMAIL,
    subject: `New lead: ${lead.names} — ${lead.plan}`,
    text: `
New wedding website enquiry!

Names:        ${lead.names}
Phone:        ${lead.phone}
Email:        ${lead.email}
Wedding date: ${lead.wedding_date ?? 'TBD'}
Plan:         ${lead.plan}
Submitted:    ${new Date(lead.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
    `.trim(),
    html: `
<h2>New wedding website enquiry</h2>
<table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
  <tr><td><b>Names</b></td><td>${lead.names}</td></tr>
  <tr><td><b>Phone</b></td><td>${lead.phone}</td></tr>
  <tr><td><b>Email</b></td><td>${lead.email}</td></tr>
  <tr><td><b>Wedding date</b></td><td>${lead.wedding_date ?? 'TBD'}</td></tr>
  <tr><td><b>Plan</b></td><td>${lead.plan}</td></tr>
</table>
    `.trim(),
  });
}

export async function sendPaymentConfirmation(lead, payment) {
  await transporter.sendMail({
    from: `"MyShaadiStory" <${process.env.SMTP_USER}>`,
    to: lead.email,
    subject: 'Payment confirmed — your wedding website is on its way! 🎉',
    html: `
<p>Hi ${lead.names},</p>
<p>We've received your payment of ₹${(payment.amount / 100).toLocaleString('en-IN')} for the <b>${payment.plan}</b> plan.</p>
<p>We'll WhatsApp you within 2 hours to get started on your wedding website.</p>
<p>— The MyShaadiStory team</p>
    `.trim(),
  });
}
