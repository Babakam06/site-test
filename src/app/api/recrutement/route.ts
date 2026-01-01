import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, phone, jobId, jobTitle, coverLetter } = body;

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl || webhookUrl.includes('dummy')) {
      console.warn('Discord Webhook URL is not configured or is a dummy.');
      return NextResponse.json({ message: 'Application received (Discord notification skipped)' }, { status: 200 });
    }

    const discordMessage = {
      embeds: [
        {
          title: "📄 New Job Application Received",
          color: 0x3b82f6, // Blue
          fields: [
            { name: "Full Name", value: fullName, inline: true },
            { name: "Email", value: email, inline: true },
            { name: "Phone", value: phone || "N/A", inline: true },
            { name: "Position", value: jobTitle || "General Application", inline: false },
            { name: "Cover Letter", value: coverLetter || "No cover letter provided.", inline: false },
          ],
          footer: { text: "Blaine County Recruitment Portal" },
          timestamp: new Date().toISOString(),
        }
      ]
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordMessage),
    });

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.statusText}`);
    }

    return NextResponse.json({ message: 'Application sent successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Recruitment API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
