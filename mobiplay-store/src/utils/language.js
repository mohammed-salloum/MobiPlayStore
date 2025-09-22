export function detectLanguageFromDomain() {
  try {
    const hostname = window.location.hostname.toLowerCase();
    console.log('Hostname:', hostname); // 🔹 هنا ستظهر في الـ console
    const domainLangMap = {
      'syr.web.app': 'ar',
      'us.web.app': 'en',
    };

    for (const key in domainLangMap) {
      if (hostname.includes(key)) return domainLangMap[key];
    }

    return 'en';
  } catch (err) {
    console.error('Error detecting language from domain:', err);
    return 'en';
  }
}
