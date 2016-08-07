var form = $("#contact-form");
var form_action = form.attr('action');
form.submit(function(e) {
    e.preventDefault(),
    $.ajax({
        url: form_action,
        method: "POST",
        data: $(this).serialize(),
        dataType: "json",
        beforeSend: function() {
            NProgress.start(),
            form.append('<div class="alert alert--loading">Sending message…</div>')
        },
        success: function(e) {
            NProgress.done(),
            form.find(".alert--loading").hide(),
            form.append('<div class="alert alert--success">Message sent!</div>')
        },
        error: function(e) {
            NProgress.done(),
            form.find(".alert--loading").hide(),
            form.append('<div class="alert alert--error">Ops, there was an error.</div>')
        }
    })
});