'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '문의 접수에 실패했습니다.');
      }

      setIsSubmitted(true);
      setFormData({ name: '', phone: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section id="contact-form" className="py-20 md:py-28 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              상담 신청이 완료되었습니다!
            </h3>
            <p className="text-gray-600 mb-6">
              빠른 시일 내에 전문 상담사가 연락드리겠습니다.<br />
              감사합니다.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-red-600 font-semibold hover:underline"
            >
              추가 문의하기
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact-form" className="py-20 md:py-28 bg-gradient-to-br from-red-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Info */}
          <div>
            <p className="text-red-600 font-semibold mb-2">CONTACT US</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              지금 바로<br />
              <span className="gradient-text">무료 상담</span>을 신청하세요
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              전문 상담사가 고객님의 건강 상태와 생활 환경에 맞는 최적의 제품을 추천해드립니다. 부담 없이 문의해주세요.
            </p>

            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">전화 문의</p>
                  <p className="font-bold text-lg">032-555-6344</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">상담 시간</p>
                  <p className="font-bold text-lg">평일 09:00 - 18:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
            <h3 className="text-2xl font-bold mb-6">상담 신청서</h3>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="홍길동"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  전화번호 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  required
                  placeholder="010-1234-5678"
                  maxLength={13}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  요청사항
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="궁금하신 내용이나 요청사항을 자유롭게 작성해주세요."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full gradient-bg text-white font-bold py-4 rounded-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '접수 중...' : '무료 상담 신청하기'}
              </button>

              <a
                href="http://pf.kakao.com/_NCBad/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#FEE500] text-[#3C1E1E] font-bold py-4 rounded-lg hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 3C6.48 3 2 6.58 2 11c0 2.84 1.86 5.33 4.65 6.76-.2.74-.73 2.7-.84 3.12-.13.52.19.51.4.37.16-.11 2.6-1.77 3.65-2.49.7.1 1.41.16 2.14.16 5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
                </svg>
                카카오톡으로 상담하기
              </a>

              <p className="text-xs text-gray-500 text-center">
                입력하신 정보는 상담 목적으로만 사용됩니다.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
