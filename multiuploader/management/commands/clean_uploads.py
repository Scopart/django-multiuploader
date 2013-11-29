from datetime import timedelta
import datetime

from django.conf import settings
from django.core.management.base import BaseCommand
import multiuploader.default_settings as DEFAULTS
from multiuploader.models import get_model


MultiuploaderFile = get_model()


class Command(BaseCommand):
    help = 'Clean all temporary attachments loaded to MultiuploaderFile model'

    def handle(self, *args, **options):
        expiration_time = getattr(settings, "MULTIUPLOADER_FILE_EXPIRATION_TIME", DEFAULTS.MULTIUPLOADER_FILE_EXPIRATION_TIME)
        time_threshold = datetime.datetime.now() - timedelta(seconds=expiration_time)

        MultiuploaderFile.objects.filter(upload_date__lt=time_threshold).delete()

        print "Cleaning temporary upload files complete"
