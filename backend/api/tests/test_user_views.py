from django.urls import reverse

from rest_framework import status

from api.tests.testing_utils import JasmaTestCase
from api.models import BookmarkedPost, Comment, Following


class UserViewsTestCase(JasmaTestCase):
    def test_A_get_user_self_basic_info_plus_phone_success(self):
        # Request
        url = reverse("user-detail", args=[self.user.pk])
        self.query_params.update({"fields": "phone"})
        with self.assertNumQueries(1):
            self.response = self.client.get(url, data=self.query_params)
        # Response
        self.assertEqual(self.response.status_code, status.HTTP_200_OK)
        # Data
        data = self.response.data
        self.assertTrue(data.get("success"))
        self.assertFalse(data.get("message"))
        expected_data = {
            "user_id": self.user.id,
            "username": self.user.username,
            "email": self.user.email,
            "user_role": self.user.user_role,
            "phone": self.user.phone
        }
        self.assertCountEqual(data.get("data"), expected_data)
        self.assertFalse(data.get("errors"))

    def test_B_get_user_basic_info_not_logged(self):
        self.client.logout()
        # Request
        url = reverse("user-detail", args=[self.user.pk])
        with self.assertNumQueries(0):
            self.response = self.client.get(url)
        # Response
        self.assertEqual(self.response.status_code, status.HTTP_403_FORBIDDEN)
        # Data
        data = self.response.data
        self.assertFalse(data.get("success"))
        self.assertFalse(data.get("message"))
        self.assertFalse(data.get("data"))
        expected_errors = [
            {
                "attr": None,
                "code": "not_authenticated",
                "message": "Authentication credentials were not provided."
            }
        ]
        self.assertCountEqual(data.get("errors"), expected_errors)

    def test_C_get_user_basic_info_user_does_not_exist(self):
        # Request
        wrong_pk = "6b90f04a-44d1-4d0b-ba4f-2260e889f93f"
        url = reverse("user-detail", args=[wrong_pk])
        with self.assertNumQueries(1):
            self.response = self.client.get(url)
        # Response
        self.assertEqual(self.response.status_code, status.HTTP_404_NOT_FOUND)
        # Data
        data = self.response.data
        self.assertFalse(data.get("success"))
        self.assertFalse(data.get("message"))
        self.assertFalse(data.get("data"))
        expected_errors = [
            {
                "attr": None,
                "code": "not_found",
                "message": "User not found."
            }
        ]
        self.assertCountEqual(data.get("errors"), expected_errors)

    def test_D_get_user_self_basic_info_plus_field_not_found_warning(self):
        # Request
        url = reverse("user-detail", args=[self.user.pk])
        self.query_params.update({
            "fields": "some_unknown_field, neither_this_one"})
        with self.assertNumQueries(1):
            self.response = self.client.get(url, data=self.query_params)
        # Response
        self.assertEqual(self.response.status_code, status.HTTP_200_OK)
        # Data
        data = self.response.data
        self.assertTrue(data.get("success"))
        warning = "Warning could not find some_unknown_field, neither_this_one."
        self.assertEqual(data.get("message"), warning)
        expected_data = {
            "user_id": self.user.id,
            "username": self.user.username,
            "email": self.user.email,
            "user_role": self.user.user_role
        }
        self.assertCountEqual(data.get("data"), expected_data)
        self.assertFalse(data.get("errors"))

    def test_E_get_user_self_basic_info_plus_profile_success(self):
        # Set up profile
        profile = self.user.profile
        profile_pic = self.upload(
            file_path="./test_data/dummy_test_pic_post.jpg",
            name="dummy_test_pic_post.jpg",
            content="image",
            content_type="image/jpeg"
        )

        profile.profile_pic.save(
            profile_pic.name, profile_pic, save=True)
        profile.given_name = "The"
        profile.last_name = "Dude"
        profile.display_name = "The Dude"
        profile.bio = "I'm an awesome being"
        profile.date_of_birth = "1980-01-01"
        profile.gender = "man"
        profile.relationship = "open"
        profile.relationship_with = self.mod_user
        profile.language = "English"
        profile.job_company = "The world"
        profile.job_industry = "Entertainement"
        profile.job_role = "Bowler"
        profile.education = "no education"
        profile.country = "US"
        profile.city = "Somewhere"
        profile.website = "www.awesome.com"
        profile.save()

        # Request
        url = reverse("user-detail", args=[self.user.pk])
        self.query_params.update({"fields": "profile"})
        with self.assertNumQueries(3):
            self.response = self.client.get(url, data=self.query_params)
        # Response
        self.assertEqual(self.response.status_code, status.HTTP_200_OK)
        # Data
        data = self.response.data
        self.assertTrue(data.get("success"))
        self.assertFalse(data.get("message"))
        expected_data = {
            "user_id": self.user.id,
            "username": self.user.username,
            "email": self.user.email,
            "user_role": self.user.user_role,
            "profile": self.user.profile
        }
        self.assertCountEqual(data.get("data"), expected_data)
        self.assertFalse(data.get("errors"))

    def test_F_get_user_self_basic_info_plus_notification_preferences_success(self):
        # Request
        url = reverse("user-detail", args=[self.user.pk])
        self.query_params.update({"fields": "notification_preferences"})

        with self.assertNumQueries(2):
            self.response = self.client.get(url, data=self.query_params)
        # Response
        self.assertEqual(self.response.status_code, status.HTTP_200_OK)
        # Data
        data = self.response.data
        self.assertTrue(data.get("success"))
        self.assertFalse(data.get("message"))
        expected_data = {
            "user_id": self.user.id,
            "username": self.user.username,
            "email": self.user.email,
            "user_role": self.user.user_role,
            "notification_preferences": self.user.notification_preferences
        }
        self.assertCountEqual(data.get("data"), expected_data)
        self.assertFalse(data.get("errors"))

    def test_G_get_user_self_basic_info_plus_posts_success(self):
        self.user.posts.create(
            text_content="Some post content",
            hashtags=['python', 'django', 'webdevelopment']
        )
        # Request
        url = reverse("user-detail", args=[self.user.pk])
        self.query_params.update({"fields": "posts"})
        with self.assertNumQueries(3):
            self.response = self.client.get(url, data=self.query_params)
        # Response
        self.assertEqual(self.response.status_code, status.HTTP_200_OK)
        # Data
        data = self.response.data
        self.assertTrue(data.get("success"))
        self.assertFalse(data.get("message"))
        expected_data = {
            "user_id": self.user.id,
            "username": self.user.username,
            "email": self.user.email,
            "user_role": self.user.user_role,
            "posts": self.user.posts
        }
        self.assertCountEqual(data.get("data"), expected_data)
        self.assertFalse(data.get("errors"))

    def test_H_get_user_self_basic_info_plus_comments_success(self):
        # Configure client
        post = self.mod_user.posts.create(
            text_content="Some post content",
            hashtags=['python', 'django', 'webdevelopment']
        )
        Comment.objects.create(
            post=post,
            user=self.user,
            text_content="Some comment"
        )
        # Request
        url = reverse("user-detail", args=[self.user.pk])
        self.query_params.update({"fields": "comments"})

        with self.assertNumQueries(3):
            self.response = self.client.get(url, data=self.query_params)
        # Response
        self.assertEqual(self.response.status_code, status.HTTP_200_OK)
        # Data
        data = self.response.data
        self.assertTrue(data.get("success"))
        self.assertFalse(data.get("message"))
        expected_data = {
            "user_id": self.user.id,
            "username": self.user.username,
            "email": self.user.email,
            "user_role": self.user.user_role,
            "comments": self.user.comments
        }
        self.assertCountEqual(data.get("data"), expected_data)
        self.assertFalse(data.get("errors"))

    def test_I_get_user_self_basic_info_plus_bookmarked_posts_success(self):
        # Configure client
        post = self.mod_user.posts.create(
            text_content="Some post content",
            hashtags=['python', 'django', 'webdevelopment']
        )
        bookmark = BookmarkedPost.objects.create(
            post=post,
            user=self.user
        )
        self.user.bookmarked_posts.add(bookmark)

        # Request
        url = reverse("user-detail", args=[self.user.pk])
        self.query_params.update({"fields": "bookmarked_posts"})

        with self.assertNumQueries(3):
            self.response = self.client.get(url, data=self.query_params)
        # Response
        self.assertEqual(self.response.status_code, status.HTTP_200_OK)
        # Data
        data = self.response.data
        self.assertTrue(data.get("success"))
        self.assertFalse(data.get("message"))
        expected_data = {
            "user_id": self.user.id,
            "username": self.user.username,
            "email": self.user.email,
            "user_role": self.user.user_role,
            "bookmarked_posts": self.user.bookmarked_posts
        }
        self.assertCountEqual(data.get("data"), expected_data)
        self.assertFalse(data.get("errors"))

    def test_J_get_user_self_basic_info_plus_following_success(self):
        # Configure client
        Following.objects.create(
            follower=self.user,
            followee=self.mod_user
        )
        Following.objects.create(
            follower=self.user,
            followee=self.admin_user
        )

        # Request
        url = reverse("user-detail", args=[self.user.pk])
        self.query_params.update({"fields": "following"})

        # TODO: Review viewset / serializer. This seems suboptimal.
        with self.assertNumQueries(4):
            self.response = self.client.get(url, data=self.query_params)
        # Response
        self.assertEqual(self.response.status_code, status.HTTP_200_OK)
        # Data
        data = self.response.data
        self.assertTrue(data.get("success"))
        self.assertFalse(data.get("message"))
        expected_data = {
            "user_id": self.user.id,
            "username": self.user.username,
            "email": self.user.email,
            "user_role": self.user.user_role,
            "following": self.user.following
        }
        self.assertCountEqual(data.get("data"), expected_data)
        self.assertFalse(data.get("errors"))

    def test_K_For_fun(self):
        url = reverse("user-list")
        self.response = self.client.get(url)
        self.assertEqual(self.response.status_code, status.HTTP_200_OK)
