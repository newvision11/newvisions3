// Hiring Form Submission Script
// Google Apps Script Web App URL for form submission
// 
// ⚠️ IMPORTANT: SETUP REQUIRED BEFORE FORM WORKS
// 
// Quick Setup (5 minutes):
// 1. Open: GOOGLE_SHEETS_SETUP.md (detailed instructions)
// 2. Or use: google-apps-script-code.txt (copy-paste ready code)
// 
// Quick Steps:
// - Create Google Sheet with headers
// - Create Apps Script (Extensions > Apps Script)
// - Paste code from google-apps-script-code.txt
// - Deploy as Web App (set "Who has access" to "Anyone")
// - Copy the Web App URL below
// - Replace YOUR_SCRIPT_ID with your actual URL

const HIRING_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz2wyDnP_aw_7gZRNtXcDez29p1R-W84erizfD2U8FRMKK50qigXhEA8Raca1iIrWea/exec';

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('hiring-form');
  const submitBtn = document.getElementById('submit-btn');
  const loadingSpinner = document.getElementById('loading-spinner');
  const successMessage = document.getElementById('success-message');

  if (!form) return;

  // Smooth scroll for CTA button
  document.querySelectorAll('a[href="#application-form"]').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.getElementById('application-form');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  form.addEventListener('submit', async function (e) {
    // Add validation class for CSS feedback
    form.classList.add('was-validated');

    // Check built-in validation
    if (!form.reportValidity()) {
      e.preventDefault();
      console.log('--- VALIDATION BLOCKED SUBMISSION ---');
      return;
    }

    e.preventDefault();
    console.log('按钮已点击 - SUBMIT CLICKED');

    // Validate checkboxes
    const videoTypes = form.querySelectorAll('input[name="videoTypes"]:checked');
    if (videoTypes.length === 0) {
      alert('Please select at least one video type you excel at.');
      return;
    }

    // Disable submit button and show loading
    submitBtn.disabled = true;
    submitBtn.style.display = 'none';
    loadingSpinner.style.display = 'block';

    // Collect form data using FormData for better reliability
    const fd = new FormData(form);
    const formData = {
      timestamp: new Date().toISOString(),
      fullName: (fd.get('fullName') || '').trim(),
      whatsapp: (fd.get('whatsapp') || '').trim(),
      age: (fd.get('age') || '').trim(),
      socialMedia: (fd.get('socialMedia') || '').trim(),
      portfolio: (fd.get('portfolio') || '').trim(),
      pricing: (fd.get('pricing') || '').trim(),
      videoTypes: Array.from(videoTypes).map(cb => cb.value).join(', '),
      availableHours: fd.get('availableHours') || '',
      additionalInfo: (fd.get('additionalInfo') || '').trim() || 'N/A'
    };

    // Create URLSearchParams
    const params = new URLSearchParams();
    for (const key in formData) {
      params.append(key, formData[key]);
    }

    try {
      // Check internet connectivity
      if (!navigator.onLine) {
        throw new Error('offline');
      }

      // For now, we'll use a placeholder URL
      // You need to create a Google Apps Script and update HIRING_SCRIPT_URL
      // Alternatively, you can use Formspree or similar service

      console.log('--- STARTING SUBMISSION ---');
      console.log('Submission URL:', HIRING_SCRIPT_URL);
      console.log('Form Parameters:', params.toString());

      // Use GET instead of POST for local/CORS reliability
      const finalUrl = `${HIRING_SCRIPT_URL}?${params.toString()}`;

      const response = await fetch(finalUrl, {
        method: 'GET',
        mode: 'no-cors',
        redirect: 'follow'
      });

      console.log('Submission Response Type:', response.type);
      console.log('Submission Response Status:', response.status);

      // In no-cors mode, we get an opaque response with status 0.
      // This is expected and usually means the data was sent successfully.
      if (response.type === 'opaque' || response.status === 0 || response.ok) {
        console.log('✅ SUBMISSION TREATED AS SUCCESSFUL');
        // Redirect immediately
        window.location.href = '../thank-you/';
        return;
      }

      throw new Error(`Server returned status: ${response.status}`);
    } catch (error) {
      console.error('❌ SUBMISSION FAILED:', error);
      // Handle errors
      let errorMessage;

      if (error.message === 'offline') {
        errorMessage = 'You are currently offline. Please check your internet connection and try again.';
      } else if (error.message.includes('Failed to fetch') || !navigator.onLine) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
      } else {
        errorMessage = `Submission Error: ${error.message}`;
      }

      alert(errorMessage);

      // Re-enable button
      submitBtn.disabled = false;
      submitBtn.style.display = 'block';
      loadingSpinner.style.display = 'none';
    }
  });

  // --- Footer Contact Form Handler ---
  const contactForm = document.getElementById('hiring-contact-form');
  const contactSuccess = document.getElementById('hiring-contact-success');
  const contactLoading = document.getElementById('contact-loading');
  const contactSubmitBtn = document.getElementById('aximo-submit-btn');

  if (contactForm && contactSuccess && contactLoading && contactSubmitBtn) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Show loading
      contactSubmitBtn.disabled = true;
      contactSubmitBtn.style.display = 'none';
      contactLoading.style.display = 'block';

      const formData = new FormData(contactForm);
      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: json
        });

        const result = await response.json();

        if (response.status === 200) {
          console.log('✅ CONTACT FORM SUCCESS');
          contactForm.style.display = 'none';
          contactLoading.style.display = 'none';
          contactSuccess.style.display = 'block';
          contactSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          console.error('❌ CONTACT FORM ERROR:', result);
          alert(result.message || 'Something went wrong. Please try again.');
          // Re-enable
          contactSubmitBtn.disabled = false;
          contactSubmitBtn.style.display = 'block';
          contactLoading.style.display = 'none';
        }
      } catch (error) {
        console.error('❌ CONTACT FORM FAILED:', error);
        alert('Unable to connect to the server. Please check your internet connection.');
        // Re-enable
        contactSubmitBtn.disabled = false;
        contactSubmitBtn.style.display = 'block';
        contactLoading.style.display = 'none';
      }
    });
  }

  // Add scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe requirement cards
  document.querySelectorAll('.requirement-card, .aximo-form-wrap').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });
});

