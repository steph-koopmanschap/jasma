from django.urls import reverse

from rest_framework import status

from api.tests.testing_utils import JasmaTestCase
from api.models import BookmarkedPost

# NOTE: Not sure if this is too much implementation testing
class UserViewsTestCase(JasmaTestCase):
    
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        # NOTE: Not sure where this belongs
        # Add a profile to user
        profile = cls.user.profile
        profile_pic = cls.upload(
            file_path="./test_data/dummy_test_pic_post.jpg",
            name="dummy_test_pic_post.jpg",
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
        profile.relationship_with = cls.mod_user
        profile.language = "English"
        profile.job_company = "The world"
        profile.job_industry = "Entertainement"
        profile.job_role = "Bowler"
        profile.education = "no education"
        profile.country = "US"
        profile.city = "Somewhere"
        profile.website = "www.awesome.com"
        profile.save()
        # Add post to user
        posts = cls.user.posts
        post = posts.create(
            text_content="My first post",
            hashtags=['python', 'django', 'webdevelopment']
        )
        post2 = posts.create(
            text_content="My second post",
            hashtags=['python', 'sql', 'webdevelopment']
        )
        # Add comments
        post.comments.create(
            post=post,
            user=cls.user,
            text_content="Some comment on first post"
        )
        post.comments.create(
            post=post,
            user=cls.user,
            text_content="Another comment on first post"
        )
        # Add bookmarks
        bookmark = BookmarkedPost.objects.create(
            post=post,
            user=cls.user
        )
        cls.user.bookmarked_posts.add(bookmark)
        bookmark2 = BookmarkedPost.objects.create(
            post=post2,
            user=cls.user
        )
        cls.user.bookmarked_posts.add(bookmark2)
        # Add following
        cls.user.following.create(
            follower=cls.user,
            followee=cls.mod_user
        )
        cls.user.following.create(
            follower=cls.user,
            followee=cls.admin_user
        )
        # Add followers
        cls.user.followers.create(
            follower=cls.mod_user,
            followee=cls.user
        )
        cls.user.followers.create(
            follower=cls.admin_user,
            followee=cls.user
        )
        # Add Hashtag suscribe
        cls.user.sucribed_hashtags.create(
            user=cls.user,
            hashtag=cls.user.posts.first().hashtags.all()[0]
        )
        cls.user.sucribed_hashtags.create(
            user=cls.user,
            hashtag=cls.user.posts.first().hashtags.all()[1]
        )
        
     
    def setUp(self):
        """ Fields that are expected to always be returned for get request """
        super().setUp()
        self.expected_get_data = {
            "id": self.user.id,
            "username": self.user.username,
            "user_role": self.user.user_role,
        }
        
    def test_A_get_user_self_basic_info_plus_phone_success(self):
        # Request
        url = reverse("user-detail", args=[self.user.pk])
        self.query_params.update({"fields": "phone"})
        with self.assertNumQueries(1):
            self.response = self.client.get(url, data=self.query_params)
        # Response
        self.assertEqual(self.response.status_code, status.HTTP_200_OK)
        # Data
        body = self.response.data
        self.assertTrue(body.get("success"))
        self.assertFalse(body.get("message"))
        self.expected_get_data.update({
           "phone": self.user.phone})
        self.assertCountEqual(body.get("data"), self.expected_get_data)
        self.assertEqual(body.get("data")["phone"], self.user.phone)
        self.assertFalse(body.get("errors"))

    def test_B_get_user_basic_info_not_logged(self):
        self.client.logout()
        # Request
        url = reverse("user-detail", args=[self.user.pk])
        with self.assertNumQueries(0):
            self.response = self.client.get(url)
        # Response
        self.assertEqual(self.response.status_code, status.HTTP_403_FORBIDDEN)
        # Data
        body = self.response.data
        self.assertFalse(body.get("success"))
        self.assertFalse(body.get("message"))
        self.assertFalse(body.get("data"))
        expected_errors = [
            {
                "attr": None,
                "code": "not_authenticated",
                "message": "Authentication credentials were not provided."
            }
        ]
        self.assertCountEqual(body.get("errors"), expected_errors)

    def test_C_get_user_basic_info_user_does_not_exist(self):
        # Request
        wrong_pk = "6b90f04a-44d1-4d0b-ba4f-2260e889f93f"
        url = reverse("user-detail", args=[wrong_pk])
        with self.assertNumQueries(1):
            self.response = self.client.get(url)
        # Response
        self.assertEqual(self.response.status_code, status.HTTP_404_NOT_FOUND)
        # Data
        body = self.response.data
        self.assertFalse(body.get("success"))
        self.assertFalse(body.get("message"))
        self.assertFalse(body.get("data"))
        expected_errors = [
            {
                "attr": None,
                "code": "not_found",
                "message": "User not found."
            }
        ]
        self.assertCountEqual(body.get("errors"), expected_errors)

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
        body = self.response.data
        self.assertTrue(body.get("success"))
        warning = "Warning could not find some_unknown_field, neither_this_one."
        self.assertEqual(body.get(
            "message"), warning)
        self.assertCountEqual(body.get("data"), self.expected_get_data)
        self.assertFalse(body.get("errors"))

    def test_E_get_user_self_basic_info_plus_profile_success(self):
        # Request
        url = reverse("user-detail", args=[self.user.pk])
        self.query_params.update({"fields": "profile"})
        # NOTE: 3 seems to be minimun: User -> profile -> relationship_with
        with self.assertNumQueries(3):
            self.response = self.client.get(url, data=self.query_params)
        # Response
        self.assertEqual(self.response.status_code, status.HTTP_200_OK)
        # Data
        body = self.response.data
        self.assertTrue(body.get("success"))
        self.assertFalse(body.get("message"))
        
        self.expected_get_data.update({
            "profile": self.user.profile})
        self.assertCountEqual(body.get("data"), self.expected_get_data)
        profile = body.get("data")["profile"]
        self.assertEqual(profile["profile_pic"], self.user.profile.profile_pic.url)
        self.assertEqual(profile["given_name"], self.user.profile.given_name)
        self.assertEqual(profile["last_name"], self.user.profile.last_name)
        self.assertEqual(profile["display_name"], self.user.profile.display_name)
        self.assertEqual(profile["bio"], self.user.profile.bio)
        self.assertEqual(profile["date_of_birth"], self.user.profile.date_of_birth)
        self.assertEqual(profile["gender"], self.user.profile.gender)
        self.assertEqual(profile["relationship"], self.user.profile.relationship)
        self.assertEqual(profile["relationship_with"], str(self.user.profile.relationship_with.pk))
        self.assertEqual(profile["language"], self.user.profile.language)
        self.assertEqual(profile["job_company"], self.user.profile.job_company)
        self.assertEqual(profile["job_industry"], self.user.profile.job_industry)
        self.assertEqual(profile["job_role"], self.user.profile.job_role)
        self.assertEqual(profile["education"], self.user.profile.education)
        self.assertEqual(profile["country"], self.user.profile.country)
        self.assertEqual(profile["city"], self.user.profile.city)
        self.assertEqual(profile["website"], self.user.profile.website)
        
        self.assertFalse(body.get("errors"))

    def test_F_get_user_self_basic_info_plus_notification_preferences_success(self):
        # Request
        url = reverse("user-detail", args=[self.user.pk])
        self.query_params.update({"fields": "notification_preferences"})
        with self.assertNumQueries(2):
            self.response = self.client.get(url, data=self.query_params)
        # Response
        self.assertEqual(self.response.status_code, status.HTTP_200_OK)
        # Data
        body = self.response.data
        self.assertTrue(body.get("success"))
        self.assertFalse(body.get("message"))
        
        self.expected_get_data.update({
            "notification_preferences": self.user.notification_preferences})
        self.assertCountEqual(body.get("data"), self.expected_get_data)
        notification_preferences = body.get("data")["notification_preferences"]
        self.assertEqual(notification_preferences["user"], str(self.user.notification_preferences.user.pk))
        self.assertEqual(notification_preferences["is_all_email"], self.user.notification_preferences.is_all_email)
        self.assertEqual(notification_preferences["is_all_push"], self.user.notification_preferences.is_all_push)
        self.assertEqual(notification_preferences["is_all_inapp"], self.user.notification_preferences.is_all_inapp)
        self.assertEqual(notification_preferences["is_comment_on_post_email"], self.user.notification_preferences.is_comment_on_post_email)
        self.assertEqual(notification_preferences["is_comment_on_post_inapp"], self.user.notification_preferences.is_comment_on_post_inapp)
        self.assertEqual(notification_preferences["is_comment_on_post_push"], self.user.notification_preferences.is_comment_on_post_push)
        self.assertEqual(notification_preferences["is_new_follower_email"], self.user.notification_preferences.is_new_follower_email)
        self.assertEqual(notification_preferences["is_new_follower_inapp"], self.user.notification_preferences.is_new_follower_inapp)
        self.assertEqual(notification_preferences["is_new_follower_push"], self.user.notification_preferences.is_new_follower_push)
        self.assertEqual(notification_preferences["is_following_new_post_email"], self.user.notification_preferences.is_following_new_post_email)
        self.assertEqual(notification_preferences["is_following_new_post_inapp"], self.user.notification_preferences.is_following_new_post_inapp)
        self.assertEqual(notification_preferences["is_following_new_post_push"], self.user.notification_preferences.is_following_new_post_push)
        
        self.assertFalse(body.get("errors"))

    def test_G_get_user_self_basic_info_plus_posts_success(self):
        # Request
        url = reverse("user-detail", args=[self.user.pk])
        self.query_params.update({"fields": "posts"})
        # NOTE: 3 seems to be minimun: User -> posts -> hashtags
        with self.assertNumQueries(3):
            self.response = self.client.get(url, data=self.query_params)
        # Response
        self.assertEqual(self.response.status_code, status.HTTP_200_OK)
        # Data
        body = self.response.data
        self.assertTrue(body.get("success"))
        self.assertFalse(body.get("message"))
        
        user_posts = self.user.posts.all()
        self.expected_get_data.update({
            "posts": user_posts})
        self.assertCountEqual(body.get("data"), self.expected_get_data)
        posts = body.get("data")["posts"]
        
        self.assertEqual(posts[0]["id"], str(user_posts[0].id))
        self.assertEqual(posts[0]["user"], str(user_posts[0].user.pk))
        self.assertEqual(posts[0]["text_content"], user_posts[0].text_content)
        self.assertEqual(posts[0]["file_url"], user_posts[0].file_url)
        self.assertEqual(posts[0]["post_type"], user_posts[0].post_type)
        self.assertCountEqual(posts[0]["hashtags"], [hashtag.pk for hashtag in user_posts[0].hashtags.all()])
        self.assertEqual(posts[0]["created_at"], self.datetime_iso(user_posts[0].created_at))
        self.assertEqual(posts[0]["updated_at"], self.datetime_iso(user_posts[0].updated_at))
        
        self.assertEqual(posts[1]["id"], str(user_posts[1].id))
        self.assertEqual(posts[1]["user"], str(user_posts[1].user.pk))
        self.assertEqual(posts[1]["text_content"], user_posts[1].text_content)
        self.assertEqual(posts[1]["file_url"], user_posts[1].file_url)
        self.assertEqual(posts[1]["post_type"], user_posts[1].post_type)
        self.assertCountEqual(posts[1]["hashtags"], [hashtag.pk for hashtag in user_posts[1].hashtags.all()])
        self.assertEqual(posts[1]["created_at"], self.datetime_iso(user_posts[1].created_at))
        self.assertEqual(posts[1]["updated_at"], self.datetime_iso(user_posts[1].updated_at))
        
        self.assertFalse(body.get("errors"))

    def test_H_get_user_self_basic_info_plus_comments_success(self):
        # Request
        url = reverse("user-detail", args=[self.user.pk])
        self.query_params.update({"fields": "comments"})
        # NOTE: 3 seems to be minimun: User -> comments -> post
        with self.assertNumQueries(3):
            self.response = self.client.get(url, data=self.query_params)
        # Response
        self.assertEqual(self.response.status_code, status.HTTP_200_OK)
        # Data
        body = self.response.data
        self.assertTrue(body.get("success"))
        self.assertFalse(body.get("message"))
        
        user_comments = self.user.comments.all()
        self.expected_get_data.update({
            "comments": user_comments})
        self.assertCountEqual(body.get("data"), self.expected_get_data)
        comments = body.get("data")["comments"]
        
        self.assertEqual(comments[0]["id"], str(user_comments[0].id))
        self.assertEqual(comments[0]["post"], str(user_comments[0].post.pk))
        self.assertEqual(comments[0]["user"], str(user_comments[0].user.pk))
        self.assertEqual(comments[0]["text_content"], user_comments[0].text_content)
        self.assertEqual(comments[0]["file_url"], user_comments[0].file_url)
        self.assertEqual(comments[0]["created_at"], self.datetime_iso(user_comments[0].created_at))
        self.assertEqual(comments[0]["updated_at"], self.datetime_iso(user_comments[0].updated_at))

        self.assertEqual(comments[1]["id"], str(user_comments[1].id))
        self.assertEqual(comments[1]["post"], str(user_comments[1].post.pk))
        self.assertEqual(comments[1]["user"], str(user_comments[1].user.pk))
        self.assertEqual(comments[1]["text_content"], user_comments[1].text_content)
        self.assertEqual(comments[1]["file_url"], user_comments[1].file_url)
        self.assertEqual(comments[1]["created_at"], self.datetime_iso(user_comments[1].created_at))
        self.assertEqual(comments[1]["updated_at"], self.datetime_iso(user_comments[1].updated_at))
        
        self.assertFalse(body.get("errors"))

    def test_I_get_user_self_basic_info_plus_bookmarked_posts_success(self):
        # Request
        url = reverse("user-detail", args=[self.user.pk])
        self.query_params.update({"fields": "bookmarked_posts"})
        # NOTE: 3 seems to be minimun: User -> bookmarked_posts -> post
        with self.assertNumQueries(3):
            self.response = self.client.get(url, data=self.query_params)
        # Response
        self.assertEqual(self.response.status_code, status.HTTP_200_OK)
        # Data
        body = self.response.data
        self.assertTrue(body.get("success"))
        self.assertFalse(body.get("message"))
        
        user_bookmarked_posts = self.user.bookmarked_posts.all()
        self.expected_get_data.update({
            "bookmarked_posts": user_bookmarked_posts})
        self.assertCountEqual(body.get("data"), self.expected_get_data)
        bookmarked_posts = body.get("data")["bookmarked_posts"]
        
        self.assertEqual(bookmarked_posts[0]["id"], str(user_bookmarked_posts[0].id))
        self.assertEqual(bookmarked_posts[0]["user"], str(user_bookmarked_posts[0].user.pk))
        self.assertEqual(bookmarked_posts[0]["post"], str(user_bookmarked_posts[0].post.pk))
        self.assertEqual(bookmarked_posts[0]["bookmarked_at"], 
                         self.datetime_iso(user_bookmarked_posts[0].bookmarked_at))
        
        self.assertEqual(bookmarked_posts[1]["id"], str(user_bookmarked_posts[1].id))
        self.assertEqual(bookmarked_posts[1]["user"], str(user_bookmarked_posts[1].user.pk))
        self.assertEqual(bookmarked_posts[1]["post"], str(user_bookmarked_posts[1].post.pk))
        self.assertEqual(bookmarked_posts[1]["bookmarked_at"], 
                         self.datetime_iso(user_bookmarked_posts[1].bookmarked_at))  
        
        self.assertFalse(body.get("errors"))

    def test_J_get_user_self_basic_info_plus_following_success(self):

        # Request
        url = reverse("user-detail", args=[self.user.pk])
        self.query_params.update({"fields": "following"})
        # NOTE: 3 seems to be minimun: User -> following -> followee
        with self.assertNumQueries(3):
            self.response = self.client.get(url, data=self.query_params)
        # Response
        self.assertEqual(self.response.status_code, status.HTTP_200_OK)
        # Data
        body = self.response.data
        self.assertTrue(body.get("success"))
        self.assertFalse(body.get("message"))
        
        user_following = self.user.following.all()
        self.expected_get_data.update({
            "following": user_following})
        self.assertCountEqual(body.get("data"), self.expected_get_data)
        
        following = body.get("data")["following"]
        self.assertEqual(following[0]["followee"], str(user_following[0].followee.pk))
        self.assertEqual(following[1]["followee"], str(user_following[1].followee.pk))
        
        self.assertFalse(body.get("errors"))

    def test_K_get_user_self_basic_info_plus_followers_success(self):

        # Request
        url = reverse("user-detail", args=[self.user.pk])
        self.query_params.update({"fields": "followers"})
        # NOTE: 3 seems to be minimun: User -> following -> followers
        with self.assertNumQueries(3):
            self.response = self.client.get(url, data=self.query_params)
        # Response
        self.assertEqual(self.response.status_code, status.HTTP_200_OK)
        # Data
        body = self.response.data
        self.assertTrue(body.get("success"))
        self.assertFalse(body.get("message"))
        
        user_followers = self.user.followers.all()
        self.expected_get_data.update({
            "followers": user_followers})
        self.assertCountEqual(body.get("data"), self.expected_get_data)
        
        followers = body.get("data")["followers"]
        self.assertEqual(followers[0]["follower"], str(user_followers[0].follower.pk))
        self.assertEqual(followers[1]["follower"], str(user_followers[1].follower.pk))
        
        self.assertFalse(body.get("errors"))

    def test_L_get_user_self_basic_info_plus_sucribed_hashtags_success(self):
        # Request
        url = reverse("user-detail", args=[self.user.pk])
        self.query_params.update({"fields": "sucribed_hashtags"})
        # NOTE: 3 seems to be minimun: User -> sucribed_hashtags -> hashtags
        with self.assertNumQueries(3):
            self.response = self.client.get(url, data=self.query_params)
        # Response
        self.assertEqual(self.response.status_code, status.HTTP_200_OK)
        # Data
        body = self.response.data
        self.assertTrue(body.get("success"))
        self.assertFalse(body.get("message"))
        
        user_sucribed_hashtags = self.user.sucribed_hashtags.all()
        self.expected_get_data.update({
            "sucribed_hashtags": user_sucribed_hashtags})
        self.assertCountEqual(body.get("data"), self.expected_get_data)
        sucribed_hashtags = body.get("data")["sucribed_hashtags"]
        
        self.assertEqual(sucribed_hashtags[0]["id"], user_sucribed_hashtags[0].id)
        self.assertEqual(sucribed_hashtags[0]["user"], str(user_sucribed_hashtags[0].user.pk))
        self.assertEqual(sucribed_hashtags[0]["hashtag"], str(user_sucribed_hashtags[0].hashtag.pk))

        self.assertEqual(sucribed_hashtags[1]["id"], user_sucribed_hashtags[1].id)
        self.assertEqual(sucribed_hashtags[1]["user"], str(user_sucribed_hashtags[1].user.pk))
        self.assertEqual(sucribed_hashtags[1]["hashtag"], str(user_sucribed_hashtags[1].hashtag.pk))
           
        self.assertFalse(body.get("errors"))





    def test_X_Fun_get_user_self_all_info_success(self):
        self.skipTest("Skip for now, installing coverage")
        url = reverse("user-list")
        self.query_params.update({"fields": "all"})
        self.response = self.client.get(url, data=self.query_params)
        self.assertEqual(self.response.status_code, status.HTTP_200_OK)

    def test_X2_Fun_get_user_self_all_info_not_logged_in(self):
        self.client.logout()
        url = reverse("user-list")
        self.query_params.update({"fields": "all"})
        self.response = self.client.get(url, data=self.query_params)
        self.assertEqual(self.response.status_code, status.HTTP_403_FORBIDDEN)
