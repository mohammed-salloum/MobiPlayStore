export function detectLanguageFromDomain() {
  try {
    // Get the current hostname and convert it to lowercase for consistency
    const hostname = window.location.hostname.toLowerCase();
    console.log('Hostname:', hostname); // 🔹 Log the hostname for debugging purposes

    // Map of specific hostnames (or parts of hostnames) to language codes
    const domainLangMap = {
      'ae.web.app': 'ar', // Arabic for Syrian subdomain
      'us.web.app': 'en',  // English for US subdomain
    };

    // Iterate through the mapping to find a match
    for (const key in domainLangMap) {
      if (hostname.includes(key)) {
        // Return the corresponding language code if a match is found
        return domainLangMap[key];
      }
    }

    // Default language if no match is found
    return 'en';
  } catch (err) {
    // Log any errors and fallback to default language
    console.error('Error detecting language from domain:', err);
    return 'en';
  }
}
