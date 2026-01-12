import { NextRequest, NextResponse } from 'next/server';
import { createInquiry } from '@/lib/supabase';

async function sendDiscordNotification(name: string, phone: string, message: string): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  console.log('[Discord] 알림 전송 시작...');
  console.log('[Discord] 웹훅 URL 설정 여부:', !!webhookUrl);

  if (!webhookUrl) {
    console.error('[Discord] 웹훅 URL이 설정되지 않았습니다. 환경변수 DISCORD_WEBHOOK_URL을 확인하세요.');
    return false;
  }

  const now = new Date();
  const koreaTime = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now);

  const payload = {
    content: '📢 **새로운 상담 신청이 접수되었습니다!**',
    embeds: [
      {
        title: '🔔 무료 상담 신청 알림',
        color: 0xff5733,
        fields: [
          {
            name: '👤 이름',
            value: name || '미입력',
            inline: true,
          },
          {
            name: '📞 전화번호',
            value: phone || '미입력',
            inline: true,
          },
          {
            name: '📝 요청사항',
            value: message || '없음',
            inline: false,
          },
        ],
        footer: {
          text: `1도플러스 | 접수 시간: ${koreaTime}`,
        },
        timestamp: now.toISOString(),
      },
    ],
  };

  try {
    console.log('[Discord] 웹훅 요청 전송 중...');

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    console.log('[Discord] 응답 상태:', response.status);
    console.log('[Discord] 응답 내용:', responseText);

    if (!response.ok) {
      console.error('[Discord] 알림 전송 실패:', response.status, response.statusText, responseText);
      return false;
    }

    console.log('[Discord] 알림 전송 성공!');
    return true;
  } catch (error) {
    console.error('[Discord] 알림 전송 오류:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, message } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: '이름과 전화번호는 필수입니다.' },
        { status: 400 }
      );
    }

    const phoneRegex = /^[0-9-]+$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: '올바른 전화번호 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    const inquiry = await createInquiry(name, phone, message || '');

    // Discord로 알림 전송 (await로 완료까지 대기)
    try {
      const discordSuccess = await sendDiscordNotification(name, phone, message || '');
      console.log('[API] Discord 알림 전송 결과:', discordSuccess);
    } catch (discordError) {
      console.error('[API] Discord 알림 전송 중 오류:', discordError);
    }

    return NextResponse.json(
      { message: '문의가 성공적으로 접수되었습니다.', inquiry },
      { status: 201 }
    );
  } catch (error) {
    console.error('문의 접수 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
