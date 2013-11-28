from django.conf.urls.defaults import patterns, url

urlpatterns = patterns(
    '',
   url(r'^delete-multiple/$', 'multiuploader.views.multiuploader_delete_multiple', name='multiuploader_delete_multiple'),
   url(r'^delete/(?P<pk>\w+)/$', 'multiuploader.views.multiuploader_delete', name='multiuploader_delete'),
   url(r'^multiuploader/$', 'multiuploader.views.multiuploader', name='multiuploader'),
   url(r'^noajax/$', 'multiuploader.views.multiuploader', kwargs={"noajax": True}, name='multiploader_noajax'),
   url(r'^file/(?P<pk>\w*)/$', 'multiuploader.views.multi_show_uploaded', name='multiuploader_file_link'),
   url(r'^get-files-noajax/$', 'multiuploader.views.multi_get_files', kwargs={"noajax": True}, name='multiuploader_get_files_noajax'),
   url(r'^get-files/(?P<fieldname>\w*)/$', 'multiuploader.views.multi_get_files', name='multi_get_files'),
)
