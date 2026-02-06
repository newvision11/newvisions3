// Language Manager - Comprehensive language switching system
// Integrates popup quiz language selection with website-wide translations

class LanguageManager {
  constructor() {
    this.currentLang = 'en'; // Default language
    this.supportedLanguages = ['en', 'fr'];
    this.storageKey = 'nvp_preferred_language';
    this.cookieName = 'nvp_language';

    // Initialize language on page load
    this.init();
  }

  init() {
    // Check for existing language preference
    this.currentLang = this.getStoredLanguage() || 'en';

    // Apply language to document
    this.applyLanguage(this.currentLang);

    // Set up event listeners
    this.setupEventListeners();
  }

  // Get stored language preference from localStorage or cookies
  getStoredLanguage() {
    // First check localStorage
    let storedLang = localStorage.getItem(this.storageKey);

    // If not in localStorage, check cookies
    if (!storedLang) {
      storedLang = this.getCookie(this.cookieName);
    }

    // Validate language is supported
    if (storedLang && this.supportedLanguages.includes(storedLang)) {
      return storedLang;
    }

    return null;
  }

  // Store language preference in both localStorage and cookies
  storeLanguage(lang) {
    if (!this.supportedLanguages.includes(lang)) {
      // Unsupported language - using fallback
      return;
    }

    // Store in localStorage
    localStorage.setItem(this.storageKey, lang);

    // Store in cookies (expires in 1 year)
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    document.cookie = `${this.cookieName}=${lang}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
  }

  // Get cookie value by name
  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(';').shift();
    }
    return null;
  }

  // Check if user has made a language choice before
  hasLanguagePreference() {
    return this.getStoredLanguage() !== null;
  }

  // Set current language and apply translations
  setLanguage(lang) {
    if (!this.supportedLanguages.includes(lang)) {
      // Unsupported language - using fallback
      return;
    }

    this.currentLang = lang;
    this.storeLanguage(lang);
    this.applyLanguage(lang);

    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { language: lang }
    }));
  }

  // Apply language translations to the page
  applyLanguage(lang) {
    // Update document language attribute
    document.documentElement.lang = lang;

    // Apply popup quiz translations
    this.applyPopupTranslations(lang);

    // Apply website translations
    this.applyWebsiteTranslations(lang);

    // Update language switcher UI
    this.updateLanguageSwitcherUI(lang);

    // Finalize translation state
    document.documentElement.classList.add('translated');
  }

  // Apply popup quiz translations
  applyPopupTranslations(lang) {
    if (typeof translations !== 'undefined' && translations[lang]) {
      document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[lang][key]) {
          el.textContent = translations[lang][key];
        }
      });
    }
  }

  // Apply website translations
  applyWebsiteTranslations(lang) {
    if (typeof websiteTranslations !== 'undefined' && websiteTranslations[lang]) {
      document.querySelectorAll('[data-website-translate]').forEach(el => {
        const key = el.getAttribute('data-website-translate');
        if (websiteTranslations[lang][key]) {
          const translation = websiteTranslations[lang][key];
          // Check if translation contains HTML tags
          if (/<[^>]+>/g.test(translation)) {
            el.innerHTML = translation;
          } else {
            el.textContent = translation;
          }
        }
      });
    }
  }

  // Update language switcher UI to reflect current language
  updateLanguageSwitcherUI(lang) {
    // Update popup language buttons
    document.querySelectorAll('.nvp-lang-btn, .lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Update main website language switcher
    document.querySelectorAll('.language-switcher-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  }

  // Setup event listeners for language switching
  setupEventListeners() {
    // Listen for popup quiz language selection
    document.addEventListener('click', (e) => {
      if (e.target.matches('.nvp-lang-btn, .lang-btn')) {
        const selectedLang = e.target.dataset.lang;
        if (selectedLang) {
          this.setLanguage(selectedLang);
        }
      }

      // Listen for main website language switcher
      if (e.target.matches('.language-switcher-btn')) {
        const selectedLang = e.target.dataset.lang;
        if (selectedLang) {
          this.setLanguage(selectedLang);
        }
      }
    });

    // Listen for custom language change events
    window.addEventListener('languageChanged', (e) => {
      // Language changed successfully
    });
  }

  // Get current language
  getCurrentLanguage() {
    return this.currentLang;
  }

  // Get supported languages
  getSupportedLanguages() {
    return [...this.supportedLanguages];
  }

  // Check if language selection should be shown (for first-time visitors)
  shouldShowLanguageSelection() {
    return !this.hasLanguagePreference();
  }
}

// Initialize language manager immediately (script is deferred, so DOM is partially ready or fully parsed)
const languageManager = new LanguageManager();
window.languageManager = languageManager;

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LanguageManager;
}