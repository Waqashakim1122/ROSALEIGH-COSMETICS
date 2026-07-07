// CONTACT FORM component behaviour
function handleContactSubmit(e){
  e.preventDefault();
  document.getElementById('contact-success').style.display = 'block';
  document.getElementById('contact-form').querySelectorAll('input, textarea').forEach(el => el.value = '');
}
