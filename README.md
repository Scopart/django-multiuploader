# Django Multiuploader Plugin

Readme for plugin of Django Multiuploader using jQuery Plugin by Sebastian Tschan(https://blueimp.net/).

This is a plugin, made using multiupload form from Sebastian Tschan.
It uses jQuey UI and jQuery instead of Flash uploader.
On Django side it uses PIL. You can use it in your applications with a simple inclusion tag.

## WARNING

This is a heavily modified fork of https://github.com/garmoncheg/django_multiuploader and is currently in a beta state.

## Requirements:

    - PIL(Python Imaging Library)
    - Django 1.5+

## Example usage:

Adding this AJAX form to your web site is almost as simple as adding this 2 tags to your template:

    {% load multiuploader %}
    {% multiupform %}

Just need to adjust some parameters.
If you need any help, found any bugs, feel free to get in contact here in github.
Soon there'll be a blog in which I'll provide some examples and help about this package.


## Installation:

1.Download the package.

This version is a branch, so the easiest way is:

git clone git@github.com:scopart/django-multiuploader.git

And add the application to your project.

2.Install the app. Do it by adding:

    'multiuploader',

string to your settings.py -> INSTALLED_APPS = () dictionary.

3.Register urls in your root urlconf urls.py adding string to your urlpatterns like so :

    url(r'upload', include('multiuploader.urls')),

4.Copy or symlink files from plugins "media/" directory to your MEDIA_ROOT.

5.Edit templates and styles to meet your needs. (Optional)
    (for e.g. changing the form design and/or behavior)

6. Include the following js/css.
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>

## Settings:

You can override plugin behavior by adding those settings to your root settings.py:

*File delete url to use in your app. default value is 'multi_delete'

     MULTI_FILE_DELETE_URL = 'multi_delete'

*Url to show uploaded image, default is 'multi_image' + key to identify image (about 80 characters long):

     MULTI_IMAGE_URL = 'multi_image'

*Folder to store uploaded pictures inside your MEDIA_ROOT folder

     MULTI_IMAGES_FOLDER = 'multiuploader_images'


## Model Usage

Plugin stores Uploaded images to a simple model. It has some those fields:

* "MultiuploaderImage.filename" CharField to store original (uploaded) file filename
* "MultiuploaderImage.file" FileField to store file link to uploaded file in file system
* "MultiuploaderImage.key_data" CharField with randomly generated key to use in your model
* "MultiuploaderImage.upload_date" DateTimeField to store file upload data with auto now adding

You can use it directly in your code like so:

    #views.py
    def multi_show_uploaded(request, key):
        image = get_object_or_404(MultiuploaderImage, key_data=key)
        url = settings.MEDIA_URL+image.image.name
        return render_to_response('multiuploader/one_image.html', {"multi_single_url":url,})

## Changes

See CHANGELOG.md file for additional changes upon versions.

## Authors

- Iurii Garmash
- Scopart