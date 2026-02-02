import nodemailer from 'nodemailer';

export async function POST(req) {
  const { name, email, comment } = await req.json();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mishrasatyam2810@gmail.com',
      pass: process.env.APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: email,
    to: 'mishrasatyam2810@gmail.com',
    subject: `Interest registered via Personal Assistant: ${name}`,
    text: `User Details:\n\nName: ${name}\nEmail: ${email}\nComment: ${comment}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}