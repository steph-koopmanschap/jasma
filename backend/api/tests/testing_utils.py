import os
import json
from datetime import datetime
from typing import Union

from django.http import QueryDict
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.files.storage import default_storage

from rest_framework.test import APITestCase

from api.models import User, UserProfile

class JasmaTestCase(APITestCase):
    SESSION_KEY_REGEX = r"^[a-z0-9]{32}$"
    
    def pprint(self, data ) -> str:
        if isinstance(data, (dict, list)):
            return json.dumps(data, indent=4)
        elif hasattr(data, "items"):
            return json.dumps(dict(data.items()), indent=4)
        else:
            return data

    def datetime_iso(self, datetime_obj: datetime) -> str:
        return datetime_obj.isoformat().replace("+00:00", "Z")

    @classmethod
    def upload(cls, *, file_path, name, content_type) -> SimpleUploadedFile:
        if not hasattr(cls, "uploaded"):
            cls.uploaded = []
        current_directory = os.path.dirname(os.path.abspath(__file__))
        full_path = os.path.join(current_directory, file_path)
        with open(full_path, "rb") as f:
            uploaded_file = f.read()
        upload_object = SimpleUploadedFile(
            name=name,
            content=uploaded_file,
            content_type=content_type
        )
        cls.uploaded.append(upload_object)
        return upload_object

    @classmethod
    def setUpClass(cls):
        print(f"======SETTING UP {cls.__name__} ENVIRONMENT=======")
        super().setUpClass()
        cls.user = User.objects.create_user(
            username="user",
            password="password1",
            email="user@test1.test",
            phone="9999999999",
        )
        cls.mod_user = User.objects.create_user(
            username="mod_user",
            password="mod_password1",
            email="mod_user@test1.test",
            user_role="mod"
        )
        cls.admin_user = User.objects.create_user(
            username="admin_user",
            password="admin_password1",
            email="admin_user@test1.test",
            user_role="admin"
        )

    def setUp(self):
        print(f"======SETTING UP {self._testMethodName}========")
        super().setUp()
        # Add a custom header
        self.client.defaults["HTTP_USER_AGENT"] = "JasmaTestingSuite/1.0.0"
        # Add query_params to self
        self.query_params = QueryDict(mutable=True)
        # Add payload to self
        self.payload = None
        # Configure different types of test users

        # Log basic user by default
        self.client.force_authenticate(user=self.user)

    def tearDown(self):
        if hasattr(self, "response"):
            request = [
                f"Request {self.response.request.get('REQUEST_METHOD', '')}",
                f"{self.response.request.get('PATH_INFO', '')}"
                f"?{self.response.request.get('QUERY_STRING', '')}",
                f"Payload: {self.response.request.get('wsgi.input')}"
            ]
            response = [
                "Response",
                f"status: {self.response.status_code}",
                f"headers: {self.pprint(self.response.headers)}",
                f"data: {self.pprint(self.response.data)}"
            ]
            client = [
                "Client",
                f"username: {self.pprint(self.response.wsgi_request.user)}",
                f"cookies: {self.client.cookies}",
                f"session: {self.client.session.keys()}",
            ]
            
            messages = request + response + client
            if hasattr(self.response, "redirect_chain"):
                messages.append(f"redirects: {self.response.redirect_chain}")

            print("\n".join(messages))
        else:
            msg = "*** NO RESPONSE ***"
            print("\n".join(["*" * len(msg), msg,"*" * len(msg)]))
        print(f"======TEARING DOWN {self._testMethodName}======")
        super().tearDown()

    @classmethod
    def tearDownClass(cls) -> None:
        super().tearDownClass()
        print(f"======TEARING DOWN {cls.__name__} ENVIRONMENT======")
        # TODO: Fid a better way to cleanup uploaded files.
        default_storage.delete(cls.user.profile.profile_pic.path)
