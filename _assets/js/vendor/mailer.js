$(function() {
  var form   = $( '#contact-form' );
  var action = form.attr('action');
  var alert  = $('.site-alert');
  var invocation = new XMLHttpRequest();
  var url = action;

  function callOtherDomain() {
    if(invocation) {    
      invocation.open('GET', url, true);
      invocation.onreadystatechange = handler;
      invocation.send(); 
    }
  }

  form.submit(function(e) {
    e.preventDefault();
    if (form.valid()) {
      var values = $(this).serialize();
      $.post(action, values, function(data) {
        NProgress.start();
        form.clearForm();
      }, 'json').fail(function() {
        form.clearForm();
        NProgress.done();
        Notify("Erro ao enviar sua mensagem", null, null, 'danger');
      }).done(function() {
        form.clearForm();
        NProgress.done();
        Notify("Sua mensagem foi enviada!", null, null, 'success');
      });
    }
    return false
  });
});

$.fn.clearForm = function() {
  return this.each(function() {
    var type = this.type, tag = this.tagName.toLowerCase();
    if (tag == 'form')
      return $(':input',this).clearForm();
    if (type == 'text' || type == 'password' || tag == 'textarea')
      this.value = '';
    else if (type == 'checkbox' || type == 'radio')
      this.checked = false;
    else if (tag == 'select')
      this.selectedIndex = -1;
  });
};