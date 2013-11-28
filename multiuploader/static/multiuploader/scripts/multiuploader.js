setup_widget(jQuery);
setup_ui(jQuery);

(function($) {
  'use strict';

  var multiuploaderFormSelector = multiuploader.form_selector;
  var multiuploaderLoadFiles = '[name="' + multiuploader.target_form_fieldname + '"]';
  var multiuploaderSelector = '#' + multiuploader.target_form_fieldname;

  var opts = multiuploader.multiuploader_form_options;

  // Making new RegExp from django string
  opts['url'] = multiuploader.url;
  opts['acceptFileTypes'] = new RegExp(opts['acceptFileTypes'], 'i');
  opts['maxNumberOfFiles'] = opts['maxNumberOfFiles'] - multiuploader.number_files_attached;
  opts['destroy'] = function(e, data) {
    var that = $(this).data('fileupload');
    if (confirm("Delete this file?")) {
      if (data.url) {
        $.ajax(data)
          .success(function() {
            that._adjustMaxNumberOfFiles(1);
            $(this).fadeOut(function() {
              $(this).remove();
            });
          });
      } else {
        data.context.fadeOut(function() {
          $(this).remove();
        });
      }
    }
  };

  $(multiuploaderSelector).fileupload(opts);

  // Load existing files:
  $.getJSON("{% url 'multi_get_files' target_form_fieldname %}",
    $(multiuploaderLoadFiles + ',' + multiuploaderFormSelector + ' [name="form_type"]').serialize(),
    function(files) {
      var fu = $(multiuploaderSelector).data('fileupload');
      fu._adjustMaxNumberOfFiles(-files.length);
      fu._renderDownload(files)
        .appendTo($(multiuploaderSelector + ' .files'))
        .fadeIn(function() {
          // Fix for IE7 and lower:
          $(this).show();
        });
    });

  // Open download dialogs via iframes,
  // to prevent aborting current uploads:
  $(multiuploaderSelector + ' .files a:not([target^=_blank])').live('click', function(e) {
    e.preventDefault();
    $('<iframe style="display:none;"></iframe>')
      .prop('src', this.href)
      .appendTo('body');
  });

  // Making multiuploader visible
  $(multiuploaderSelector).removeAttr("style");
})(jQuery);

setup_filecollector(jQuery, "{{wrapper_element_id}}", "{{ target_form_fieldname }}", "{{ send_button_selector }}", multiuploader.lock_while_uploading);