/*
 * jQuery File Upload Plugin JS Example 8.9.0
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*jslint nomen: true, regexp: true */
/*global $, window, blueimp */
function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
jQuery(function($) {
  'use strict';

  var opts = multiuploader.multiuploader_form_options;
  // Making new RegExp from django string
  opts.url = multiuploader.url;
  opts.acceptFileTypes = new RegExp(opts['acceptFileTypes'], 'i');
  opts.disableImageResize = /Android(?!.*Chrome)|Opera/.test(window.navigator.userAgent);
  opts.getFilesFromResponse = function(data) {
    if (data.result && $.isArray(data.result)) {
      return data.result;
    }
    return [];
  };

  // Initialize the jQuery File Upload widget:
  $('#fileupload').fileupload(opts);
  $('#fileupload').bind('fileuploaddestroy', function(e, data) {
    if (confirm("Are you sure you want to delete this file?")) {
      if (data.url) {
        data.beforeSend = function(xhr, settings) {
          if (!csrfSafeMethod(settings.type)) {
            xhr.setRequestHeader("X-CSRFToken", multiuploader.csrftoken);
          }
        };
      }
    }
  });

  $('#fileupload').bind('fileuploaddestroyed', function(e, data) {
    var id = data.context.find('input.id').val();
    if( id )
    {
      $('#multiuploader-fields input[value="' + id + '"]').remove();
    }
  });

  $('#fileupload').bind('fileuploaddone', function(e, data) {
    if (data.result && $.isArray(data.result)) {
      $.each(data.result, function(index, elt) {
        $('<input type="hidden" id="id_' + multiuploader.target_form_fieldname + '_' + index + '" name="' + multiuploader.target_form_fieldname + '" value="' + elt.id + '" />').appendTo('#multiuploader-fields');
      });
    }
  });

  if ($.support.cors) {
    $.ajax({
      url: multiuploader.url,
      type: 'HEAD'
    }).fail(function() {
      $('<div class="alert alert-danger"/>').text('Upload server currently unavailable - ' + new Date()).appendTo('#fileupload');
    });
  }

  // Load existing files:
  $('#fileupload').addClass('fileupload-processing');
  $.ajax({
    // Uncomment the following to send cross-domain cookies:
    //xhrFields: {withCredentials: true},
    url: multiuploader.url_get,
    dataType: 'json',
    data: $('#multiuploader-fields [name="' + multiuploader.target_form_fieldname + '"], #fileupload [name="form_type"]').serialize(),
    context: $('#fileupload')[0]
  }).always(function() {
    $(this).removeClass('fileupload-processing');
  }).done(function(result) {
    $(this).fileupload('option', 'done')
      .call(this, $.Event('done'), {
        result: result
      });
  });
});