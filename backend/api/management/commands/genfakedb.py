from typing import Any, Optional
from django.core.management.base import BaseCommand
from api.generate_fake_db import generate_fake_db


class Command(BaseCommand):
    help = 'Generates fake data for the database.'

    def add_arguments(self, parser):
        parser.add_argument(
            'num', type=int, help='The number of users to create.')

    def handle(self, *args, **kwargs):
        num = kwargs['num']
        generate_fake_db(num)
