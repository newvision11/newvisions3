// nvp-script-v3.js
console.log('✅ VERSION 3.0 ACTIVE - IF YOU DO NOT SEE THIS, REFRESH YOUR CACHE');

// Google Apps Script Web App URL for form submission
const NVP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwZSPD3GYcLCM5YZeAzrvCSExtf0-Yxl3uUUlj4y9CWUYIYME86pyiBAkg-OZh-aWTFbA/exec';

// Translations dictionary
const nvpTranslations = {
  en: {
    preQualificationTitle: "New VIisons Agency | Digital marketing agency",
    selectLanguage: "Select Your Language",
    english: "English",
    french: "Français",
    step: "Step",
    of: "of", // Used with current step and total steps
    whatsYourName: "What's your name?",
    fullName: "Full Name",
    onlinePresence: "Your Online Presence",
    urlLabel: "Instagram or Website URL",
    servicesNeeded: "Services Needed",
    metaAds: "Meta Ads",
    contentCreation: "Content Creation",
    branding: "Branding",
    websiteCreation: "Website Creation",
    socialMedia: "Social Media Management",
    ugc: "UGC Collaboration",
    other: "Other",
    businessStatus: "Business Status",
    existingBusiness: "I already have a business",
    startingBusiness: "I'm just starting",
    thinkingBusiness: "I'm still thinking about it",
    monthlyBudget: "Monthly Budget",
    lessThan2000: "Less than 2000 MAD",
    between2000And5000: "2000–5000 MAD",
    between5000And10000: "5000–10 000 MAD",
    moreThan10000: "More than 10 000 MAD",
    successMessage: "Thank you! We will contact you via WhatsApp at the earliest convenient time.",
    previous: "Previous",
    next: "Next",
    submit: "Submit",
    phoneNumber: "Phone Number",
    phoneLabel: "Phone Number",
    sendMessage: "Send Message"
  },
  fr: {
    preQualificationTitle: "New VIisons Agency | Digital marketing agency",
    selectLanguage: "Sélectionnez votre langue",
    english: "Anglais",
    french: "Français",
    step: "Étape",
    of: "de",
    whatsYourName: "Quel est votre nom ?",
    fullName: "Nom complet",
    onlinePresence: "Votre présence en ligne",
    urlLabel: "Instagram ou URL du site web",
    servicesNeeded: "Services nécessaires",
    metaAds: "Publicités Meta",
    contentCreation: "Création de contenu",
    branding: "Branding",
    websiteCreation: "Création de site web",
    socialMedia: "Gestion des réseaux sociaux",
    ugc: "Collaboration UGC",
    other: "Autre",
    businessStatus: "Statut de l'entreprise",
    existingBusiness: "J'ai déjà une entreprise",
    startingBusiness: "Je commence juste",
    thinkingBusiness: "J'y réfléchis encore",
    monthlyBudget: "Budget mensuel",
    lessThan2000: "Moins de 2000 MAD",
    between2000And5000: "2000–5000 MAD",
    between5000And10000: "5000–10 000 MAD",
    moreThan10000: "Plus de 10 000 MAD",
    successMessage: "Merci ! Nous vous contacterons via WhatsApp dans les plus brefs délais.",
    previous: "Précédent",
    next: "Suivant",
    submit: "Soumettre",
    phoneNumber: "Numéro de téléphone",
    phoneLabel: "Téléphone",
    sendMessage: "Envoyer Message"
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements for popup and main page
  const nvpHomePage = document.getElementById('nvp-homePage'); // Main content area to hide
  const nvpModalOverlay = document.getElementById('nvp-modalOverlay'); // The popup overlay
  const nvpStartBtn = document.getElementById('nvp-startBtn'); // Button to open popup
  const nvpCloseModalBtn = document.getElementById('nvp-closeModal'); // Button to close popup

  // Form specific DOM Elements
  const nvpForm = document.getElementById('nvp-qualificationForm');
  const nvpContainer = document.querySelector('.nvp-container'); // Form container for language attribute
  const nvpSteps = Array.from(nvpForm ? nvpForm.getElementsByClassName('nvp-step') : []);
  const nvpPrevBtn = document.getElementById('nvp-prevBtn');
  const nvpNextBtn = document.getElementById('nvp-nextBtn');
  const nvpProgress = document.getElementById('nvp-progress');
  const nvpCurrentStepElement = document.getElementById('nvp-currentStep');
  const nvpTotalStepsElement = document.getElementById('nvp-totalSteps'); // Span for total steps number
  const nvpSuccessMessageContainer = document.getElementById('nvp-successMessage');


  let nvpCurrentStep = 0;
  let nvpCurrentLang = 'en'; // Default language
  const POPUP_DELAY = 1000; // Show popup after 7 seconds
  let nvpIsSubmitting = false;

  // --- Popup Display Logic (Disabled - Quiz is now embedded) ---
  // Popup functionality removed - quiz is embedded in the page below FAQ section

  // Note: Modal overlay elements may not exist if embedded version is used
  // The quiz form will work directly in the embedded section


  // --- Form Logic (Only if form elements exist) ---
  if (nvpForm && nvpSteps.length > 0 && nvpContainer && nvpPrevBtn && nvpNextBtn && nvpProgress && nvpCurrentStepElement && nvpSuccessMessageContainer) {

    // Initialize the form (language, steps, etc.)
    initializeForm();
    window.__nvpFormEnhanced = true; // Signal that advanced quiz logic is active

    function initializeForm() {
      updateStepVisuals();
      setupLanguageButtons();
      setupInputLabelAnimations();
      setupRealTimeValidation(); // Add real-time validation
      updateLanguageContent();
      if (nvpTotalStepsElement && nvpSteps.length > 1) {
        nvpTotalStepsElement.textContent = nvpSteps.length - 1; // Assuming step 0 is language
      }
    }

    function setupLanguageButtons() {
      document.querySelectorAll('.nvp-lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          nvpCurrentLang = btn.dataset.lang;
          nvpContainer.setAttribute('data-lang', nvpCurrentLang);
          updateLanguageContent();
          // Automatically go to the next step after language selection
          if (nvpCurrentStep === 0) {
            proceedToNextStep();
          }
        });
      });

      // Listen for global language changes
      window.addEventListener('languageChanged', (e) => {
        nvpCurrentLang = e.detail.language;
        if (nvpContainer) {
          nvpContainer.setAttribute('data-lang', nvpCurrentLang);
        }
        updateLanguageContent();
      });

      // Sync with current global language on load
      if (window.languageManager) {
        nvpCurrentLang = window.languageManager.getCurrentLanguage();
        if (nvpContainer) {
          nvpContainer.setAttribute('data-lang', nvpCurrentLang);
        }
        updateLanguageContent();
      }
    }

    function updateLanguageContent() {
      document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (nvpTranslations[nvpCurrentLang] && nvpTranslations[nvpCurrentLang][key]) {
          el.textContent = nvpTranslations[nvpCurrentLang][key];
        }
      });
      // Update page title if translation exists
      if (nvpTranslations[nvpCurrentLang] && nvpTranslations[nvpCurrentLang].preQualificationTitle) {
        document.title = nvpTranslations[nvpCurrentLang].preQualificationTitle;
      }
    }

    function setupInputLabelAnimations() {
      // This function handles the floating label effect for text and URL inputs.
      // It adds a 'focused' class when the input is focused or has content.
      document.querySelectorAll('.nvp-input-group input[type="text"], .nvp-input-group input[type="url"]').forEach(input => {
        const parentGroup = input.parentElement;
        // Check on load if input has value (e.g. browser autofill)
        if (input.value.trim() !== '') {
          parentGroup.classList.add('focused');
        }
        input.addEventListener('focus', () => {
          parentGroup.classList.add('focused');
        });
        input.addEventListener('blur', () => {
          if (!input.value.trim()) { // Only remove if empty
            parentGroup.classList.remove('focused');
          }
        });
        // Also check on input change
        input.addEventListener('input', () => {
          if (input.value.trim() !== '') {
            parentGroup.classList.add('focused');
          } else {
            // If user clears the input, remove focused class unless it's currently focused
            if (document.activeElement !== input) {
              parentGroup.classList.remove('focused');
            }
          }
        });
      });
    }


    function updateStepVisuals() {
      nvpSteps.forEach((step, idx) => {
        step.classList.toggle('active', idx === nvpCurrentStep);
      });

      // Calculate progress percentage (excluding language step 0 from main progress)
      let progressPercent = 0;
      if (nvpSteps.length > 1) { // Avoid division by zero if only one step (language)
        if (nvpCurrentStep > 0) {
          progressPercent = ((nvpCurrentStep - 1) / (nvpSteps.length - 2)) * 100;
        } else if (nvpCurrentStep === 0 && nvpSteps.length > 1) {
          progressPercent = 0; // No progress for language selection step itself
        } else if (nvpCurrentStep === nvpSteps.length - 1) {
          progressPercent = 100;
        }
      }

      nvpProgress.style.setProperty('--progress', `${Math.max(0, Math.min(100, progressPercent))}%`);

      // Update current step number display (show 1 for first actual form step)
      nvpCurrentStepElement.textContent = nvpCurrentStep > 0 ? nvpCurrentStep : '1'; // Or handle step 0 differently
      if (nvpCurrentStep === 0) nvpCurrentStepElement.textContent = '1'; // Start visual count at 1 for language step
      if (nvpTotalStepsElement && nvpSteps.length > 1) {
        nvpTotalStepsElement.textContent = nvpSteps.length - 1;
      }


      nvpPrevBtn.disabled = nvpCurrentStep === 0; // Disable prev on first step
      nvpPrevBtn.style.display = nvpCurrentStep === 0 ? 'none' : 'inline-block'; // Hide prev on language step

      // Configure Next/Submit button
      const isLastStep = nvpCurrentStep === nvpSteps.length - 1;
      nvpNextBtn.setAttribute('data-is-submit', isLastStep);
      updateLanguageContent(); // Re-apply translations for Next/Submit text

      // Update Next button state based on current step validation
      updateNextButtonState();
    }

    // Function to check if current step is valid (for button state, without showing errors)
    function isCurrentStepValid() {
      const currentStepElement = nvpSteps[nvpCurrentStep];
      if (!currentStepElement) return false;

      // Step 0 is language selection - always valid (handled by button click)
      if (nvpCurrentStep === 0) return true;

      // Step 1: Full Name (REQUIRED)
      if (nvpCurrentStep === 1) {
        const nameInput = currentStepElement.querySelector('#nvp-fullName');
        return nameInput && nameInput.value.trim().length >= 2 && /^[a-zA-ZÀ-ÿ'\-\s]{2,50}$/.test(nameInput.value.trim());
      }

      // Step 2: Website (OPTIONAL - always valid)
      if (nvpCurrentStep === 2) {
        return true; // Website is optional
      }

      // Step 3: Instagram (REQUIRED)
      if (nvpCurrentStep === 3) {
        const instagramInput = currentStepElement.querySelector('#nvp-instagram');
        return instagramInput && instagramInput.value.trim().length >= 2;
      }

      // Step 4: Services (REQUIRED - at least one checkbox)
      if (nvpCurrentStep === 4) {
        const checkedServices = currentStepElement.querySelectorAll('input[name="services"]:checked');
        return checkedServices.length > 0;
      }

      // Step 5: Business Status (REQUIRED - one radio)
      if (nvpCurrentStep === 5) {
        const checkedRadio = currentStepElement.querySelector('input[name="businessStatus"]:checked');
        return !!checkedRadio;
      }

      // Step 6: Budget (REQUIRED - one radio)
      if (nvpCurrentStep === 6) {
        const checkedRadio = currentStepElement.querySelector('input[name="budget"]:checked');
        return !!checkedRadio;
      }

      // Step 7: Phone Number (REQUIRED)
      if (nvpCurrentStep === 7) {
        const phoneInput = currentStepElement.querySelector('#nvp-phoneNumber');
        return phoneInput && phoneInput.value.trim().length >= 6 && /^[0-9+\-\s]{6,}$/.test(phoneInput.value.trim());
      }

      return false;
    }

    // Update Next button enabled/disabled state
    function updateNextButtonState() {
      const isValid = isCurrentStepValid();
      nvpNextBtn.disabled = !isValid;

      // Add/remove blocked class for styling
      if (!isValid) {
        nvpNextBtn.classList.add('nvp-btn-blocked');
      } else {
        nvpNextBtn.classList.remove('nvp-btn-blocked');
      }
    }

    // Setup real-time validation listeners for all inputs
    function setupRealTimeValidation() {
      // Step 1: Full Name
      const nameInput = nvpForm.querySelector('#nvp-fullName');
      if (nameInput) {
        nameInput.addEventListener('input', () => {
          if (nvpCurrentStep === 1) {
            updateNextButtonState();
          }
        });
        nameInput.addEventListener('blur', () => {
          if (nvpCurrentStep === 1) {
            validateCurrentStep(); // Show errors if invalid
            updateNextButtonState();
          }
        });
      }

      // Step 2: Website (no validation needed - optional)

      // Step 3: Instagram
      const instagramInput = nvpForm.querySelector('#nvp-instagram');
      if (instagramInput) {
        instagramInput.addEventListener('input', () => {
          if (nvpCurrentStep === 3) {
            updateNextButtonState();
          }
        });
        instagramInput.addEventListener('blur', () => {
          if (nvpCurrentStep === 3) {
            validateCurrentStep(); // Show errors if invalid
            updateNextButtonState();
          }
        });
      }

      // Step 4: Services (checkboxes)
      const serviceCheckboxes = nvpForm.querySelectorAll('input[name="services"]');
      serviceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          if (nvpCurrentStep === 4) {
            updateNextButtonState();
            validateCurrentStep(); // Update visual feedback
          }
        });
      });

      // Step 5: Business Status (radios)
      const businessStatusRadios = nvpForm.querySelectorAll('input[name="businessStatus"]');
      businessStatusRadios.forEach(radio => {
        radio.addEventListener('change', () => {
          if (nvpCurrentStep === 5) {
            updateNextButtonState();
            validateCurrentStep(); // Update visual feedback
          }
        });
      });

      // Step 6: Budget (radios)
      const budgetRadios = nvpForm.querySelectorAll('input[name="budget"]');
      budgetRadios.forEach(radio => {
        radio.addEventListener('change', () => {
          if (nvpCurrentStep === 6) {
            updateNextButtonState();
            validateCurrentStep(); // Update visual feedback
          }
        });
      });

      // Step 7: Phone Number
      const phoneInput = nvpForm.querySelector('#nvp-phoneNumber');
      if (phoneInput) {
        phoneInput.addEventListener('input', () => {
          if (nvpCurrentStep === 7) {
            updateNextButtonState();
          }
        });
        phoneInput.addEventListener('blur', () => {
          if (nvpCurrentStep === 7) {
            validateCurrentStep(); // Show errors if invalid
            updateNextButtonState();
          }
        });
      }
    }

    function sanitizeInputValue(str) {
      if (typeof str !== 'string') return '';
      // Basic sanitization: remove script tags and encode HTML special characters.
      const tempDiv = document.createElement('div');
      tempDiv.textContent = str;
      return tempDiv.innerHTML.replace(/<\/?script[^>]*>/gi, "");
    }

    // Validate ALL required fields before submission
    function validateAllSteps() {
      let allValid = true;

      // Step 1: Full Name (REQUIRED)
      const nameInput = nvpForm.querySelector('#nvp-fullName');
      if (!nameInput || nameInput.value.trim().length < 2 || !/^[a-zA-ZÀ-ÿ'\-\s]{2,50}$/.test(nameInput.value.trim())) {
        allValid = false;
        if (nameInput) nameInput.style.borderColor = '#ff0000';
      } else {
        if (nameInput) nameInput.style.borderColor = '';
      }

      // Step 2: Website (OPTIONAL - skip validation)

      // Step 3: Instagram (REQUIRED)
      const instagramInput = nvpForm.querySelector('#nvp-instagram');
      if (!instagramInput || !instagramInput.value.trim() || instagramInput.value.trim().length < 2) {
        allValid = false;
        if (instagramInput) instagramInput.style.borderColor = '#ff0000';
      } else {
        if (instagramInput) instagramInput.style.borderColor = '';
      }

      // Step 4: Services (REQUIRED - at least one)
      const checkedServices = nvpForm.querySelectorAll('input[name="services"]:checked');
      if (checkedServices.length === 0) {
        allValid = false;
        const checkboxGroup = nvpForm.querySelector('.nvp-step[data-step="4"] .nvp-checkbox-group');
        if (checkboxGroup) {
          checkboxGroup.style.border = '2px solid #ff0000';
          checkboxGroup.style.borderRadius = '8px';
          checkboxGroup.style.padding = '10px';
        }
      } else {
        const checkboxGroup = nvpForm.querySelector('.nvp-step[data-step="4"] .nvp-checkbox-group');
        if (checkboxGroup) {
          checkboxGroup.style.border = '';
          checkboxGroup.style.padding = '';
        }
      }

      // Step 5: Business Status (REQUIRED)
      const businessStatus = nvpForm.querySelector('input[name="businessStatus"]:checked');
      if (!businessStatus) {
        allValid = false;
        const radioGroup = nvpForm.querySelector('.nvp-step[data-step="5"] .nvp-radio-group');
        if (radioGroup) {
          radioGroup.style.border = '2px solid #ff0000';
          radioGroup.style.borderRadius = '8px';
          radioGroup.style.padding = '10px';
        }
      } else {
        const radioGroup = nvpForm.querySelector('.nvp-step[data-step="5"] .nvp-radio-group');
        if (radioGroup) {
          radioGroup.style.border = '';
          radioGroup.style.padding = '';
        }
      }

      // Step 6: Budget (REQUIRED)
      const budget = nvpForm.querySelector('input[name="budget"]:checked');
      if (!budget) {
        allValid = false;
        const radioGroup = nvpForm.querySelector('.nvp-step[data-step="6"] .nvp-radio-group');
        if (radioGroup) {
          radioGroup.style.border = '2px solid #ff0000';
          radioGroup.style.borderRadius = '8px';
          radioGroup.style.padding = '10px';
        }
      } else {
        const radioGroup = nvpForm.querySelector('.nvp-step[data-step="6"] .nvp-radio-group');
        if (radioGroup) {
          radioGroup.style.border = '';
          radioGroup.style.padding = '';
        }
      }

      // Step 7: Phone Number (REQUIRED)
      const phoneInput = nvpForm.querySelector('#nvp-phoneNumber');
      if (!phoneInput || !phoneInput.value.trim() || !/^[0-9+\-\s]{6,}$/.test(phoneInput.value.trim())) {
        allValid = false;
        if (phoneInput) phoneInput.style.borderColor = '#ff0000';
      } else {
        if (phoneInput) phoneInput.style.borderColor = '';
      }

      if (!allValid) {
        // Show error message or shake animation
        const currentStep = nvpForm.querySelector('.nvp-step.active');
        if (currentStep) {
          applyShakeAnimation(currentStep);
        }
      }

      return allValid;
    }

    function validateCurrentStep() {
      const currentStepElement = nvpSteps[nvpCurrentStep];
      if (!currentStepElement) return false;
      let isValid = true;

      // Step 0 is language selection, no specific validation needed here as choice advances
      if (nvpCurrentStep === 0) {
        // Language selection is handled by button click, so validation always passes
        return true;
      }

      // Step 1: Full Name (REQUIRED)
      if (nvpCurrentStep === 1) {
        const nameInput = currentStepElement.querySelector('#nvp-fullName');
        if (!nameInput || nameInput.value.trim().length < 2 || !/^[a-zA-ZÀ-ÿ'\-\s]{2,50}$/.test(nameInput.value.trim())) {
          isValid = false;
          if (nameInput) {
            nameInput.style.borderColor = '#ff0000'; // Show error
            nameInput.style.borderWidth = '2px';
            // Trigger HTML5 validation
            nameInput.setCustomValidity('Please enter your full name (2-50 characters)');
            nameInput.reportValidity();
          }
        } else {
          if (nameInput) {
            nameInput.style.borderColor = ''; // Clear error
            nameInput.style.borderWidth = '';
            nameInput.setCustomValidity(''); // Clear custom validation message
          }
        }
      }
      // Step 2: Website (OPTIONAL - skip validation, always allow to proceed)
      else if (nvpCurrentStep === 2) {
        // Website is optional - always allow to proceed (empty or filled)
        // No validation needed - user can skip this step entirely
        isValid = true; // Explicitly set to true
      }
      // Step 3: Instagram (REQUIRED - must have input)
      else if (nvpCurrentStep === 3) {
        const instagramInput = currentStepElement.querySelector('#nvp-instagram');
        // Instagram is REQUIRED - must have at least 2 characters
        if (!instagramInput || !instagramInput.value.trim() || instagramInput.value.trim().length < 2) {
          isValid = false;
          if (instagramInput) {
            instagramInput.style.borderColor = '#ff0000'; // Show error
            instagramInput.style.borderWidth = '2px';
            // Trigger HTML5 validation
            instagramInput.setCustomValidity('Please enter your Instagram handle or profile link');
            instagramInput.reportValidity();
          }
        } else {
          if (instagramInput) {
            instagramInput.style.borderColor = ''; // Clear error
            instagramInput.style.borderWidth = '';
            instagramInput.setCustomValidity(''); // Clear custom validation message
          }
        }
      }
      // Step 4: Services Needed (at least one checkbox - REQUIRED)
      else if (nvpCurrentStep === 4) {
        const checkedServices = currentStepElement.querySelectorAll('input[name="services"]:checked');
        if (checkedServices.length === 0) {
          isValid = false;
          // Add visual feedback - highlight the checkbox group
          const checkboxGroup = currentStepElement.querySelector('.nvp-checkbox-group');
          if (checkboxGroup) {
            checkboxGroup.style.border = '2px solid #ff0000';
            checkboxGroup.style.borderRadius = '8px';
            checkboxGroup.style.padding = '10px';
            checkboxGroup.style.backgroundColor = 'rgba(255, 0, 0, 0.05)';
            // Keep error visible until user selects something
            // Remove error styling when a checkbox is selected
            const checkboxes = checkboxGroup.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => {
              cb.addEventListener('change', function clearError() {
                if (checkboxGroup.querySelectorAll('input[type="checkbox"]:checked').length > 0) {
                  checkboxGroup.style.border = '';
                  checkboxGroup.style.padding = '';
                  checkboxGroup.style.backgroundColor = '';
                  checkboxes.forEach(c => c.removeEventListener('change', clearError));
                }
              }, { once: true });
            });
          }
        } else {
          // Clear any error styling if services are selected
          const checkboxGroup = currentStepElement.querySelector('.nvp-checkbox-group');
          if (checkboxGroup) {
            checkboxGroup.style.border = '';
            checkboxGroup.style.padding = '';
            checkboxGroup.style.backgroundColor = '';
          }
        }
      }
      // Step 5: Business Status (one radio button must be selected - REQUIRED)
      else if (nvpCurrentStep === 5) {
        const checkedRadio = currentStepElement.querySelector('input[name="businessStatus"]:checked');
        if (!checkedRadio) {
          isValid = false;
          // Add visual feedback - highlight the radio group
          const radioGroup = currentStepElement.querySelector('.nvp-radio-group');
          if (radioGroup) {
            radioGroup.style.border = '2px solid #ff0000';
            radioGroup.style.borderRadius = '8px';
            radioGroup.style.padding = '10px';
            radioGroup.style.backgroundColor = 'rgba(255, 0, 0, 0.05)';
            // Keep error visible until user selects something
            // Remove error styling when a radio is selected
            const radios = radioGroup.querySelectorAll('input[type="radio"]');
            radios.forEach(radio => {
              radio.addEventListener('change', function clearError() {
                if (radioGroup.querySelector('input[type="radio"]:checked')) {
                  radioGroup.style.border = '';
                  radioGroup.style.padding = '';
                  radioGroup.style.backgroundColor = '';
                  radios.forEach(r => r.removeEventListener('change', clearError));
                }
              }, { once: true });
            });
          }
        } else {
          // Clear any error styling if radio is selected
          const radioGroup = currentStepElement.querySelector('.nvp-radio-group');
          if (radioGroup) {
            radioGroup.style.border = '';
            radioGroup.style.padding = '';
            radioGroup.style.backgroundColor = '';
          }
        }
      }
      // Step 6: Budget (one radio button must be selected - REQUIRED)
      else if (nvpCurrentStep === 6) {
        const checkedRadio = currentStepElement.querySelector('input[name="budget"]:checked');
        if (!checkedRadio) {
          isValid = false;
          // Add visual feedback - highlight the radio group
          const radioGroup = currentStepElement.querySelector('.nvp-radio-group');
          if (radioGroup) {
            radioGroup.style.border = '2px solid #ff0000';
            radioGroup.style.borderRadius = '8px';
            radioGroup.style.padding = '10px';
            radioGroup.style.backgroundColor = 'rgba(255, 0, 0, 0.05)';
            // Keep error visible until user selects something
            // Remove error styling when a radio is selected
            const radios = radioGroup.querySelectorAll('input[type="radio"]');
            radios.forEach(radio => {
              radio.addEventListener('change', function clearError() {
                if (radioGroup.querySelector('input[type="radio"]:checked')) {
                  radioGroup.style.border = '';
                  radioGroup.style.padding = '';
                  radioGroup.style.backgroundColor = '';
                  radios.forEach(r => r.removeEventListener('change', clearError));
                }
              }, { once: true });
            });
          }
        } else {
          // Clear any error styling if radio is selected
          const radioGroup = currentStepElement.querySelector('.nvp-radio-group');
          if (radioGroup) {
            radioGroup.style.border = '';
            radioGroup.style.padding = '';
            radioGroup.style.backgroundColor = '';
          }
        }
      }
      // Step 7: WhatsApp Number validation (REQUIRED)
      else if (nvpCurrentStep === 7) {
        const phoneInput = currentStepElement.querySelector('#nvp-phoneNumber');
        if (!phoneInput || !phoneInput.value.trim() || !/^[0-9+\-\s]{6,}$/.test(phoneInput.value.trim())) {
          isValid = false;
          if (phoneInput) {
            phoneInput.style.borderColor = '#ff0000'; // Show error
            phoneInput.style.borderWidth = '2px';
            // Trigger HTML5 validation
            phoneInput.setCustomValidity('Please enter a valid phone number (minimum 6 digits)');
            phoneInput.reportValidity();
          }
        } else {
          if (phoneInput) {
            phoneInput.style.borderColor = ''; // Clear error
            phoneInput.style.borderWidth = '';
            phoneInput.setCustomValidity(''); // Clear custom validation message
          }
        }
      }

      if (!isValid) {
        applyShakeAnimation(currentStepElement);
      }
      return isValid;
    }

    function proceedToNextStep() {
      // Check if button should be disabled (double check)
      if (nvpNextBtn.disabled) {
        applyBlockedAnimation(nvpNextBtn);
        validateCurrentStep(); // Show validation errors
        return;
      }

      if (nvpCurrentStep < nvpSteps.length - 1) { // If not the last step
        if (validateCurrentStep()) {
          nvpCurrentStep++;
          updateStepVisuals();
        } else {
          // If validation fails, show blocked animation
          applyBlockedAnimation(nvpNextBtn);
        }
      } else { // On the last step, try to submit
        // Validate current step first
        if (validateCurrentStep()) {
          // Then validate ALL steps before submitting
          if (validateAllSteps()) {
            handleFormSubmission();
          } else {
            // Scroll to first invalid field
            const firstInvalid = nvpForm.querySelector('input[style*="border-color: rgb(255, 0, 0)"], .nvp-checkbox-group[style*="border"], .nvp-radio-group[style*="border"]');
            if (firstInvalid) {
              firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            applyBlockedAnimation(nvpNextBtn);
          }
        } else {
          applyBlockedAnimation(nvpNextBtn);
        }
      }
    }

    // Apply blocked animation to button
    function applyBlockedAnimation(button) {
      button.classList.add('nvp-btn-blocked-animation');
      // Shake the button
      button.style.animation = 'shake 0.5s ease-in-out';
      setTimeout(() => {
        button.classList.remove('nvp-btn-blocked-animation');
        button.style.animation = '';
      }, 500);
    }

    function moveToPreviousStep() {
      if (nvpCurrentStep > 0) {
        nvpCurrentStep--;
        updateStepVisuals();
        // Re-validate and update button state when going back
        updateNextButtonState();
      }
    }

    function markSubmitting(state) {
      nvpIsSubmitting = state;
      nvpNextBtn.disabled = state;
      const submitText = nvpNextBtn.querySelector('.nvp-submit-text');
      if (submitText) {
        submitText.dataset.originalText = submitText.dataset.originalText || submitText.textContent;
        submitText.textContent = state ? 'Submitting...' : submitText.dataset.originalText;
      }
    }

    function showSuccessUI() {
      const successMsg = document.getElementById('nvp-successMessage');
      if (successMsg) {
        successMsg.style.display = 'block';
      }
      nvpSteps.forEach(step => step.style.display = 'none');
      const nav = nvpForm.querySelector('.nvp-navigation-buttons');
      if (nav) nav.style.display = 'none';
      const progressBar = nvpForm.querySelector('.nvp-progress-bar');
      if (progressBar) progressBar.style.display = 'none';
    }

    function isResultSuccess(result, responseOk) {
      // Handle null/undefined result - fallback to HTTP status
      if (!result) return responseOk;

      // Handle string responses (including JSON strings that weren't parsed)
      if (typeof result === 'string') {
        // Check if it's a JSON string that needs parsing
        if (result.trim().startsWith('{') || result.trim().startsWith('[')) {
          try {
            const parsed = JSON.parse(result);
            return parsed.status === 'success' ||
              parsed.result === 'success' ||
              parsed.success === true;
          } catch (e) {
            // Not valid JSON, fall through to string check
          }
        }
        // Check for plain text success indicators
        const lowerResult = result.toLowerCase();
        return lowerResult.includes('success') ||
          lowerResult.includes('"status":"success"') ||
          lowerResult === 'ok';
      }

      // Handle object responses
      if (typeof result === 'object') {
        return result.status === 'success' ||
          result.result === 'success' ||
          result.success === true ||
          (result.ok === true && responseOk);
      }

      // Fallback to HTTP status if result format is unexpected
      return responseOk === true;
    }

    async function handleFormSubmission() {
      if (nvpIsSubmitting) {
        return;
      }
      // Final validation check before submission
      if (!validateAllSteps()) {
        markSubmitting(false);
        return; // Don't submit if validation fails
      }

      markSubmitting(true); // Disable submit button during processing
      // Update button text to show a loading state if desired, or rely on disabled style
      // For example: nvpNextBtn.querySelector('.nvp-submit-text').textContent = "Submitting...";

      const formData = {
        timestamp: new Date().toISOString(),
        language: nvpCurrentLang,
        fullName: sanitizeInputValue(nvpForm.querySelector('#nvp-fullName')?.value.trim() || ''),
        website: sanitizeInputValue(nvpForm.querySelector('#nvp-website')?.value.trim() || ''),
        instagram: sanitizeInputValue(nvpForm.querySelector('#nvp-instagram')?.value.trim() || ''),
        services: Array.from(nvpForm.querySelectorAll('input[name="services"]:checked')).map(cb => sanitizeInputValue(cb.value)),
        businessStatus: sanitizeInputValue(nvpForm.querySelector('input[name="businessStatus"]:checked')?.value || ''),
        budget: sanitizeInputValue(nvpForm.querySelector('input[name="budget"]:checked')?.value || ''),
        phoneNumber: sanitizeInputValue(nvpForm.querySelector('#nvp-phoneNumber')?.value.trim() || '')
      };

      const params = new URLSearchParams();
      for (const key in formData) {
        if (Array.isArray(formData[key])) {
          params.append(key, formData[key].join(', ')); // Join array values
        } else {
          params.append(key, formData[key]);
        }
      }

      try {
        // Check internet connectivity first
        if (!navigator.onLine) {
          throw new Error('offline');
        }

        // Use GET instead of POST for better results in local/CORS environments
        const finalUrl = `${NVP_SCRIPT_URL}?${params.toString()}`;
        console.log('--- NVP STARTING SUBMISSION ---');
        console.log('Submission URL:', NVP_SCRIPT_URL);
        console.log('Parameters:', params.toString());

        const response = await fetch(finalUrl, {
          method: 'GET',
          mode: 'no-cors',
          redirect: 'follow'
        });

        console.log('NVP Response Type:', response.type);
        console.log('NVP Response Status:', response.status);

        // In local environments with no-cors, we often get an opaque response (type: opaque) 
        // with status 0. If we reach this point without an exception, the request was sent.
        if (response.ok || response.type === 'opaque' || response.status === 0) {
          console.log('✅ NVP SUBMISSION SUCCESSFUL');
          // Redirect immediately
          window.location.href = 'thank-you/';
          return;
        }

        throw new Error('Submission returned status: ' + response.status);
      } catch (error) {
        console.error('❌ NVP SUBMISSION FAILED:', error);
        // Handle submission error
        let errorMessage;

        if (error.message === 'offline') {
          errorMessage = 'You are currently offline. Please check your internet connection and try again.';
        } else if (error.message.includes('Failed to fetch') || !navigator.onLine) {
          errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
        } else {
          errorMessage = `Submission Error: ${error.message}`;
        }

        alert(errorMessage);
        markSubmitting(false); // Re-enable button on error
        updateLanguageContent(); // Restore button text 
      }
      // Note: No 'finally' block to re-enable button if successful, as form disappears.
      // If an error occurs, it's re-enabled in the catch.
    }

    function applyShakeAnimation(element) {
      element.classList.add('shake');
      setTimeout(() => element.classList.remove('shake'), 500); // Duration of shake animation
    }

    // Prevent default form submission - we handle it via JavaScript
    nvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Only allow submission if we're on the last step and validation passes
      if (nvpCurrentStep === nvpSteps.length - 1) {
        proceedToNextStep(); // This will call handleFormSubmission if validation passes
      }
    });

    // Event listeners for navigation
    nvpNextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      proceedToNextStep();
    });
    nvpPrevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      moveToPreviousStep();
    });
  } else {
    // Fallback or error message if essential form elements are not found
    // NVP Funnel: Form elements check completed
  }
});
