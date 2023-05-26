import os
import requests
import json
import unittest
from utils.http_status import HTTP_STATUS

BASE_URL = "http://localhost:8000"

filepath_dummydata = './test_data/dummy_test_data.json'
with open(filepath_dummydata, 'r') as f:
    dummy_data = json.load(f)

test_user_one = dummy_data["test_user_one"]
test_user_two = dummy_data["test_user_two"]
test_hashtags = dummy_data["test_hashtags"]
test_post_text = dummy_data["test_post_text"]
test_post_image = dummy_data["test_post_image"]
test_post_video = dummy_data["test_post_video"]
test_post_audio = dummy_data["test_post_audio"]
test_comment = dummy_data["test_comment"]

script_dir = os.path.dirname(os.path.abspath(__file__))
test_file_post_image = os.path.join(script_dir, './test_data/dummy_test_pic_post.jpg')
test_file_post_image_two = os.path.join(
    script_dir, 'dummy_test_pic_post_two.jpg')
test_file_post_video = os.path.join(script_dir, './test_data/dummy_test_video_post.mp4')
test_file_post_audio = os.path.join(script_dir, './test_data/dummy_test_audio_post.mp3')
# test_file_comment = os.path.join(script_dir, './test_data/dummy_test_file_comment.jpg')
# test_file_profile = os.path.join(script_dir, './test_data/dummy_test_file_profile_pic.jpg')

class ApiTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Create a session object
        cls.session = requests.Session()
        print("BASE_URL: ", BASE_URL)

        headers = {
            'User-Agent': 'JasmaTestingSuite/1.0.0',
            'Accept-Encoding': 'gzip, deflate, br',
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Connection': 'keep-alive',
            # 'DNT': '1',
        }
        cls.session.headers.update(headers)

        print("======SETTING UP TEST ENVIRONMENT=======")

    @classmethod
    def tearDownClass(cls):
        cls.session.close()

    def setUp(self):
        print(f"======SETTING UP {self._testMethodName}========")
        self.response = None

    def tearDown(self):
        if self.response is not None:
            print("response status: ", self.response.status_code)
            print("response headers: ", self.response.headers)
            print("response_body: ", self.response.json())
        print(f"======TEARING DOWN {self._testMethodName}======")

    def test_A_auth_register_correct(self):  
        # TODO: After running once, it always fails as the record never get cleaned up.
        self.response = self.session.post(f"{BASE_URL}/api/auth/register",
                                        data=json.dumps({
                                            "username": test_user_one["username"],
                                            "email": test_user_one["email"],
                                            "password": test_user_one["password"]
                                        }))
        if self.response.status_code != 201:
            self.assertEqual(self.response.status_code, HTTP_STATUS["Created"])
        response_body = self.response.json()

        self.assertEqual(self.response.status_code, HTTP_STATUS["Created"])
        self.assertTrue(response_body['success'])
        self.assertEqual(
            response_body['message'], f"User {test_user_one['username']} registered successfully.")

    def test_B_auth_register_email_taken(self):
        self.response = self.session.post(f"{BASE_URL}/api/auth/register",
                                        data=json.dumps({
                                            "username": "helloworld",
                                            "email": test_user_one["email"],
                                            "password": test_user_one["password"]
                                        }))
        response_body = self.response.json()

        self.assertEqual(self.response.status_code, HTTP_STATUS["Bad Request"])
        self.assertFalse(response_body['success'])
        self.assertEqual(response_body['message'], "Email already exists.")

    def test_C_auth_register_username_taken(self):
        self.response = self.session.post(f"{BASE_URL}/api/auth/register",
                                        data=json.dumps({
                                            "username": test_user_one["username"],
                                            "email": "helloworld@gmail.com",
                                            "password": test_user_one["password"]
                                        }))
        response_body = self.response.json()

        self.assertEqual(self.response.status_code, HTTP_STATUS["Bad Request"])
        self.assertFalse(response_body['success'])
        self.assertEqual(response_body['message'], "Username already exists.")

    def test_D_auth_login_wrong_email(self):
        self.response = self.session.post(f"{BASE_URL}/api/auth/login",
                                        data=json.dumps({
                                            "email": "helloworld@gmail.com",
                                            "password": test_user_one["password"]
                                        }))
        response_body = self.response.json()

        self.assertEqual(self.response.status_code, HTTP_STATUS["Forbidden"])
        self.assertFalse(response_body['success'])
        self.assertEqual(response_body['message'],
                        "Invalid email or password.")

    def test_E_auth_login_wrong_passwd(self):
        self.response = self.session.post(f"{BASE_URL}/api/auth/login",
                                        data=json.dumps({
                                            "email": test_user_one["email"],
                                            "password": "helloworld"
                                        }))
        response_body = self.response.json()

        self.assertEqual(self.response.status_code, HTTP_STATUS["Forbidden"])
        self.assertFalse(response_body['success'])
        self.assertEqual(response_body['message'],
                        "Invalid email or password.")

    def test_F_auth_check_auth_false(self):
        self.response = self.session.get(f"{BASE_URL}/api/auth/checkAuth")
        response_body = self.response.json()
        self.assertEqual(self.response.status_code, HTTP_STATUS["Unauthorized"])
        self.assertFalse(response_body['success'])
        self.assertFalse(response_body['isAuth'])

    def test_G_auth_login_correct(self):
        self.response = self.session.post(f"{BASE_URL}/api/auth/login",
                                        data=json.dumps({
                                            "email": test_user_one["email"],
                                            "password": test_user_one["password"]
                                        }))
        if self.response.status_code != 201:
            self.assertEqual(self.response.status_code, HTTP_STATUS["Created"])
        response_body = self.response.json()
        test_user_one['user_id'] = response_body['user']['id']

        self.assertEqual(self.response.status_code, HTTP_STATUS["Created"])
        self.assertTrue(response_body['success'])
        self.assertEqual(response_body['user']
                        ['username'], test_user_one['username'])
        self.assertEqual(response_body['user']
                        ['email'], test_user_one['email'])
        self.assertEqual(response_body['message'], "User logged in.")

    def test_H_auth_check_auth_true(self):
        self.response = self.session.get(f"{BASE_URL}/api/auth/checkAuth")
        response_body = self.response.json()
        self.assertEqual(self.response.status_code, HTTP_STATUS["OK"])
        self.assertTrue(response_body['success'])
        self.assertTrue(response_body['isAuth'])

    def test_I_posts_create_post_text(self):
        self.response = self.session.post(f"{BASE_URL}/api/posts/createPost",
                                        data=json.dumps({
                                            "text_content": test_post_text["text_content"],
                                            "hashtags": test_hashtags,
                                            # "file":  test_file_post
                                        }))
        response_body = self.response.json()
        self.assertEqual(self.response.status_code, HTTP_STATUS["Created"])
        self.assertTrue(response_body['success'])
        self.assertEqual(response_body['message'],
                        "Post created successfully.")

    def test_J_posts_create_post_image(self):
        self.response = self.session.post(f"{BASE_URL}/api/posts/createPost",
                                        data=json.dumps({
                                            "text_content": test_post_image["text_content"],
                                            "hashtags": test_hashtags,
                                            "file":  test_file_post_image
                                        }))
        response_body = self.response.json()
        self.assertEqual(self.response.status_code, HTTP_STATUS["Created"])
        self.assertTrue(response_body['success'])
        self.assertEqual(response_body['message'],
                        "Post created successfully.")

    def test_K_posts_create_post_video(self):
        self.response = self.session.post(f"{BASE_URL}/api/posts/createPost",
                                        data=json.dumps({
                                            "text_content": test_post_video["text_content"],
                                            "hashtags": test_hashtags,
                                            "file":  test_file_post_video
                                        }))
        response_body = self.response.json()
        self.assertEqual(self.response.status_code, HTTP_STATUS["Created"])
        self.assertTrue(response_body['success'])
        self.assertEqual(response_body['message'],
                        "Post created successfully.")

    def test_L_posts_create_post_audio(self):
        self.response = self.session.post(f"{BASE_URL}/api/posts/createPost",
                                        data=json.dumps({
                                            "text_content": test_post_audio["text_content"],
                                            "hashtags": test_hashtags,
                                            "file":  test_file_post_audio
                                        }))
        response_body = self.response.json()
        self.assertEqual(self.response.status_code, HTTP_STATUS["Created"])
        self.assertTrue(response_body['success'])
        self.assertEqual(response_body['message'],
                        "Post created successfully.")

    def test_M_posts_get_user_posts(self):
        self.response = self.session.get(
            f"{BASE_URL}/api/posts/getUserPosts/?user_id={test_user_one['user_id']}&limit=5")
        response_body = self.response.json()
        self.assertEqual(self.response.status_code, HTTP_STATUS["OK"])
        test_post_audio["post_id"] = response_body['posts'][0]['post_id']
        test_post_video["post_id"] = response_body['posts'][1]['post_id']
        test_post_image["post_id"] = response_body['posts'][2]['post_id']
        test_post_text["post_id"] = response_body['posts'][3]['post_id']
        test_post_audio["file_url"] = response_body['posts'][0]['file_url']
        test_post_video["file_url"] = response_body['posts'][1]['file_url']
        test_post_image["file_url"] = response_body['posts'][2]['file_url']
        test_post_text["file_url"] = response_body['posts'][3]['file_url']
        self.assertTrue(response_body['success'])
        # Check audio post
        self.assertEqual(
            response_body['posts'][0]['text_content'], test_post_audio["text_content"])
        self.assertEqual(response_body['posts'][0]['hashtags'], test_hashtags)
        # self.assertEqual(response_body['posts'][0]['file_url'], )
        self.assertEqual(response_body['posts'][0]['post_type'], "audio")
        # check video post
        self.assertEqual(
            response_body['posts'][1]['text_content'], test_post_video["text_content"])
        self.assertEqual(response_body['posts'][1]['hashtags'], test_hashtags)
        # self.assertEqual(response_body['posts'][1]['file_url'], )
        self.assertEqual(response_body['posts'][1]['post_type'], "video")
        # check image post
        self.assertEqual(
            response_body['posts'][2]['text_content'], test_post_image["text_content"])
        self.assertEqual(response_body['posts'][2]['hashtags'], test_hashtags)
        # self.assertEqual(response_body['posts'][2]['file_url'], )
        self.assertEqual(response_body['posts'][2]['post_type'], "image")
        # check text post
        self.assertEqual(
            response_body['posts'][3]['text_content'], test_post_text["text_content"])
        self.assertEqual(response_body['posts'][3]['hashtags'], test_hashtags)
        self.assertEqual(response_body['posts'][3]['file_url'], "")
        self.assertEqual(response_body['posts'][3]['post_type'], "text")

    def test_N_posts_get_single_post(self):
        self.response = self.session.get(
            f"{BASE_URL}/api/posts/getSinglePost/{test_post_video['post_id']}")
        response_body = self.response.json()
        self.assertEqual(self.response.status_code, HTTP_STATUS["OK"])
        self.assertTrue(response_body['success'])
        self.assertEqual(
            response_body['post']['text_content'], test_post_video["text_content"])
        self.assertEqual(response_body['post']['hashtags'], test_hashtags)
        self.assertEqual(response_body['post']['post_type'], "video")
        self.assertEqual(response_body['post']
                        ['file_url'], test_post_video["file_url"])

    def test_O_get_multiple_posts(self):
        self.response = self.session.post(f"{BASE_URL}/api/posts/getMultiplePosts",
                                        data=json.dumps({
                                            "post_ids": [test_post_audio['post_id'],
                                                        test_post_video['post_id'],
                                                        test_post_image['post_id'],
                                                        test_post_text['post_id']
                                                        ]
                                        }))
        response_body = self.response.json()
        self.assertEqual(self.response.status_code, HTTP_STATUS["OK"])
        self.assertTrue(response_body['success'])
        # Check audio post
        self.assertEqual(
            response_body['posts'][0]['text_content'], test_post_audio["text_content"])
        self.assertEqual(response_body['posts'][0]['hashtags'], test_hashtags)
        # self.assertEqual(response_body['posts'][0]['file_url'], )
        self.assertEqual(response_body['posts'][0]['post_type'], "audio")
        # check video post
        self.assertEqual(
            response_body['posts'][1]['text_content'], test_post_video["text_content"])
        self.assertEqual(response_body['posts'][1]['hashtags'], test_hashtags)
        # self.assertEqual(response_body['posts'][1]['file_url'], )
        self.assertEqual(response_body['posts'][1]['post_type'], "video")
        # check image post
        self.assertEqual(
            response_body['posts'][2]['text_content'], test_post_image["text_content"])
        self.assertEqual(response_body['posts'][2]['hashtags'], test_hashtags)
        # self.assertEqual(response_body['posts'][2]['file_url'], )
        self.assertEqual(response_body['posts'][2]['post_type'], "image")
        # check text post
        self.assertEqual(
            response_body['posts'][3]['text_content'], test_post_text["text_content"])
        self.assertEqual(response_body['posts'][3]['hashtags'], test_hashtags)
        self.assertEqual(response_body['posts'][3]['file_url'], "")
        self.assertEqual(response_body['posts'][3]['post_type'], "text")

    def test_P_edit_post(self):
        new_text_content = "This is an edited image post."
        new_hashtags = ["edited", "change"]
        self.response_edit = self.session.put(f"{BASE_URL}/api/posts/editPost",
                                            data=json.dumps({
                                                "post_id": test_post_image['post_id'],
                                                "text_content": new_text_content,
                                                "hashtags": new_hashtags,
                                                "file":  test_file_post_image_two
                                            }))
        response_body_edit = self.response_edit.json()
        self.assertEqual(self.response_edit.status_code,
                        HTTP_STATUS["Created"])
        self.assertTrue(response_body_edit['success'])
        self.assertEqual(
            response_body_edit['message'], "Post edited successfully.")
        # Retrieve the post and check if its edited.
        self.response_get = self.session.get(
            f"{BASE_URL}/api/posts/getUserPosts/?user_id={test_user_one['user_id']}&limit=5")
        response_body_get = self.response_get.json()
        self.assertEqual(self.response.status_code, HTTP_STATUS["OK"])
        self.assertEqual(
            response_body_get['posts'][2]['text_content'], new_text_content)
        self.assertEqual(
            response_body_get['posts'][2]['hashtags'], new_hashtags)
        # self.assertEqual(response_body['posts'][2]['file_url'], )
        self.assertEqual(response_body_get['posts'][2]['post_type'], "image")

    def test_Q_delete_post(self):
        self.response = self.session.delete(
            f"{BASE_URL}/api/posts/deletePost/{test_post_image['post_id']}")
        response_body = self.response.json()
        self.assertEqual(self.response.status_code, HTTP_STATUS["OK"])
        self.assertTrue(response_body['success'])
        self.assertEqual(response_body['message'],
                        "Post deleted successfully.")

    def test_R_delete_post_already_deleted(self):
        self.response = self.session.delete(
            f"{BASE_URL}/api/posts/deletePost/{test_post_image['post_id']}")
        response_body = self.response.json()
        self.assertEqual(self.response.status_code, HTTP_STATUS["Gone"])
        self.assertTrue(response_body['success'])
        self.assertEqual(response_body['message'],
                        "Post does not exist or already deleted.")

    def test_S_posts_get_single_post_not_exist(self):
        self.response = self.session.get(
            f"{BASE_URL}/api/posts/getSinglePost/{test_post_image['post_id']}")
        response_body = self.response.json()
        self.assertEqual(self.response.status_code, HTTP_STATUS["Not Found"])
        self.assertFalse(response_body['success'])
        self.assertEqual(response_body['message'], "Post does not exist.")

    def test_T_posts_add_bookmark(self):
        self.response = self.session.post(f"{BASE_URL}/api/posts/addPostBookmark",
                                        data=json.dumps({
                                            "post_id": test_post_text['post_id']
                                        }))
        response_body = self.response.json()
        self.assertEqual(self.response.status_code, HTTP_STATUS["Created"])
        self.assertTrue(response_body['success'])
        self.assertEqual(response_body['message'],
                        "Post bookmarked successfully.")

    def test_U_posts_add_bookmark_already_added(self):
        self.response = self.session.post(f"{BASE_URL}/api/posts/addPostBookmark",
                                        data=json.dumps({
                                            "post_id": test_post_text['post_id']
                                        }))
        response_body = self.response.json()
        self.assertEqual(self.response.status_code, HTTP_STATUS["OK"])
        self.assertTrue(response_body['success'])
        self.assertEqual(response_body['message'], "Post already bookmarked.")

    def test_V_posts_get_bookmarks(self):
        self.response = self.session.get(
            f"{BASE_URL}/api/posts/getBookmarkedPosts")
        response_body = self.response.json()
        self.assertEqual(self.response.status_code, HTTP_STATUS["OK"])
        self.assertTrue(response_body['success'])
        self.assertEqual(response_body['posts'][0]
                        ['post_id'], test_post_text["post_id"])
        self.assertEqual(
            response_body['posts'][0]['text_content'], test_post_text["text_content"])
        self.assertEqual(response_body['posts'][0]['hashtags'], test_hashtags)
        self.assertEqual(response_body['posts'][0]['post_type'], "text")

    def test_W_posts_delete_bookmark(self):
        self.response = self.session.delete(
            f"{BASE_URL}/api/posts/deletePostBookmark/{test_post_text['post_id']}")
        response_body = self.response.json()
        self.assertEqual(self.response.status_code, HTTP_STATUS["OK"])
        self.assertTrue(response_body['success'])
        self.assertEqual(response_body['message'],
                        "Post bookmark deleted successfully.")

    def test_Z_auth_logout(self):
        self.response = self.session.post(f"{BASE_URL}/api/auth/logout")
        response_body = self.response.json()
        self.assertEqual(self.response.status_code, HTTP_STATUS["OK"])
        self.assertTrue(response_body['success'])
        self.assertEqual(response_body['message'], "Logged out.")
