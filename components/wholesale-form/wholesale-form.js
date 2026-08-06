(function() {
  const form = document.getElementById('wholesaleForm');
  if (!form) return;

  const mandatoryFields = [
    { id: 'firstName', errorId: 'firstNameError' },
    { id: 'lastName', errorId: 'lastNameError' },
    { id: 'companyName', errorId: 'companyNameError' },
    { id: 'phone', errorId: 'phoneError' },
    { id: 'email', errorId: 'emailError' },
    { id: 'address', errorId: 'addressError' },
    { id: 'city', errorId: 'cityError' },
    { id: 'postCode', errorId: 'postCodeError' },
    { id: 'country', errorId: 'countryError' }
  ];

  function setFieldError(input, errorEl, show) {
    input.classList.toggle('field-error', show);
    errorEl.classList.toggle('show', show);
  }

  function validateField(fieldId, errorId) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(errorId);
    if (!input || !errorEl) return true;
    let isValid;
    if (input.tagName === 'SELECT') {
      isValid = input.value !== '';
    } else if (input.type === 'email') {
      isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
    } else {
      isValid = input.value.trim() !== '';
    }
    setFieldError(input, errorEl, !isValid);
    return isValid;
  }

  mandatoryFields.forEach(({ id, errorId }) => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener('blur', () => validateField(id, errorId));
    input.addEventListener('input', () => {
      if (input.classList.contains('field-error')) validateField(id, errorId);
    });
    if (input.tagName === 'SELECT') {
      input.addEventListener('change', () => validateField(id, errorId));
    }
  });

  form.addEventListener('submit', function(e) {
    let allValid = true;
    mandatoryFields.forEach(({ id, errorId }) => {
      if (!validateField(id, errorId)) allValid = false;
    });
    if (!allValid) {
      e.preventDefault();
      const firstError = document.querySelector('.field-error');
      if (firstError) {
        firstError.focus({ preventScroll: true });
        setTimeout(() => firstError.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
      }
    }
  });
})();