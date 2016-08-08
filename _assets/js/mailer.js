
// form.submit(function(e) {
// 	e.preventDefault(),
// 	$.ajax({
// 		url: form_action,
// 		method: "POST",
// 		data: $(this).serialize(),
// 		dataType: "json",
// 		beforeSend: function() {
// 			NProgress.start(),
// 			form.append('<div class="alert alert--loading">Sending message…</div>')
// 		},
// 		success: function(e) {
// 			NProgress.done(),
// 			form.find(".alert--loading").hide(),
// 			form.append('<div class="alert alert--success">Message sent!</div>')
// 		},
// 		error: function(e) {
// 			NProgress.done(),
// 			form.find(".alert--loading").hide(),
// 			form.append('<div class="alert alert--error">Ops, there was an error.</div>')
// 		}
// 	})
// });

$(function() {
	var form   = $( '#contact-form' );
	var action = form.attr('action');
	var alert  = $('.site-alert');
	console.log('começo');

	form.submit(function(e) {
 		e.preventDefault();
		console.log('submit');
	
		NProgress.start();
		var values = $(this).serialize();
		form.append('<div class="alert alert--loading">Sending message…</div>');

		$.post(action, values, function(data) {
			form.clearForm();
		}, 'json').fail(function() {
			NProgress.done();
			form.append('<div class="alert alert--success">Message sent!</div>')
		}).done(function() {
			NProgress.done();
			form.append('<div class="alert alert--success">Message sent!</div>')
		});
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
