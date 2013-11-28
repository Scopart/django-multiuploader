import datetime
from hashlib import sha1
import os
import time

from django.conf import settings
from django.db import models
from django.utils.text import get_valid_filename
from django.utils.translation import ugettext_lazy as _
import multiuploader.default_settings as DEFAULTS
from multiuploader.utils import generate_safe_pk


class BaseAttachment(models.Model):
    id = models.CharField(primary_key=True, max_length=255)
    filename = models.CharField(max_length=255, blank=False, null=False)
    upload_date = models.DateTimeField()

    @generate_safe_pk
    def generate_pk(self):
        return self

    def save(self, *args, **kwargs):
        if not self.upload_date:
            self.upload_date = datetime.datetime.now()

        if not self.pk:
            self.pk = self.generate_pk()

        super(BaseAttachment, self).save(*args, **kwargs)

    class Meta:
        abstract = True

    def __unicode__(self):
        return u'%s' % self.filename


class MultiuploaderFile(BaseAttachment):
    def _upload_to(instance, filename):
        upload_path = getattr(settings, 'MULTIUPLOADER_FILES_FOLDER', DEFAULTS.MULTIUPLOADER_FILES_FOLDER)

        if upload_path[-1] != '/':
            upload_path += '/'

        filename = get_valid_filename(os.path.basename(filename))
        filename, ext = os.path.splitext(filename)
        hash = sha1(str(time.time())).hexdigest()
        fullname = os.path.join(upload_path, "%s.%s%s" % (filename, hash, ext))

        return fullname

    file = models.FileField(upload_to=_upload_to, max_length=255)

    def save(self, *args, **kwargs):
        self.filename = os.path.basename(self.file.path)
        return super(MultiuploaderFile, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        """delete -- Remove to leave file."""
        self.file.delete(False)
        super(MultiuploaderFile, self).delete(*args, **kwargs)

    class Meta:
        verbose_name = _('multiuploader file')
        verbose_name_plural = _('multiuploader files')