// Прототип: форма не отправляется, только показывает подтверждение
document.querySelectorAll('form.form').forEach(function (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    form.classList.add('sent');
    var done = form.querySelector('.form-done');
    if (done) { done.setAttribute('tabindex', '-1'); done.focus(); }
  });
});

// Превью для сравнительной страницы: ?clean убирает плашку концепта
if (/[?&]clean\b/.test(location.search)) {
  var note = document.querySelector('.concept-note');
  if (note) note.remove();
}
