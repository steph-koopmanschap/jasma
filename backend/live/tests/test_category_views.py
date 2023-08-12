from rest_framework.test import APITestCase, APIRequestFactory
from api.models.models import User
from live.models.models import StreamerProfile, StreamerSettings, StreamLive, StreamReport, StreamCategory
from live.management.commands.createlivedata import create_live_data
from live.views import category_views
from live.constants import ban_reasons
from uuid import uuid4

class TestCategoryViews(APITestCase):

    def create_admin_user(self):
        self.admin_user = User.objects.create(
                username='test_username',
                email='test@test.com',
                password='X',
                recovery_email='test@test.com',
                is_staff=True
                )
        self.non_admin_user = User.objects.create(
                username='test_username2',
                email='test2@test.com',
                password='X',
                recovery_email='test2@test.com',
                is_staff=False,

                )
        
        self.factory = APIRequestFactory()
    
    def create_stream_profiles(self, user1, user2):
        profile1 = StreamerProfile.objects.create(user=user1, stream_key='jasma_live_' + uuid4().hex)
        StreamerSettings.objects.create(profile=profile1)
        profile2 = StreamerProfile.objects.create(user=user2, stream_key='jasma_live_' + uuid4().hex)
        StreamerSettings.objects.create(profile=profile2)

    def setUp(self):
         create_live_data()
         self.create_admin_user()     
    

    
    
    def test_get_categories(self):
        request = self.factory.get("/categories")
        request.user = self.non_admin_user
        
        view = category_views.CategoriesListView.as_view()

        res = view(request)
        
        data = res.data['data']['categories']
        self.assertEqual(res.status_code, 200)
        self.assertIsNotNone(data)

        request.user = None

        no_auth_res = view(request)

        self.assertEqual(no_auth_res.status_code, 200)
    
    def test_create_category(self):
        request = self.factory.post("/create-category", format="multipart")
        request.user = self.admin_user
        

        no_data_res = category_views.create_category(request)

        self.assertEqual(no_data_res.status_code, 400, msg="Should return 400 when no data passed")

        # new_request = self.factory.post("/create-category",data={'title': "Test", 'color_hex': '#fff'}, 
        #                                 format="multipart")
        # new_request.user = self.admin_user
        
        # valid_res = category_views.create_category(new_request, format="multipart")
        # self.assertEqual(valid_res.status_code, 201, msg="Should return 201 when created")

        # created_category = StreamCategory.objects.filter(title="Test").first()
        # self.assertEqual(created_category.title, "Test")

        request.user = self.non_admin_user
    
        no_admin_res = category_views.create_category(request)

        self.assertEqual(no_admin_res.status_code, 403)
        
        request.user = None

        no_auth = category_views.create_category(request)

        self.assertEqual(no_auth.status_code, 403)

    def test_update_category_by_id(self):
        request = self.factory.put("/update-category",{'title': 'Updated test', 'color_hex': "#fff"})
        request.user = self.admin_user

        new_category = StreamCategory.objects.create(title='New Category')

        res = category_views.update_category(request, id=new_category.id)

        updated_category = StreamCategory.objects.filter(id=new_category.id).first()

        self.assertEqual(res.status_code, 200)
        self.assertEqual(updated_category.title, "Updated test")
        self.assertEqual(updated_category.color_hex, "#fff")

        request.user = self.non_admin_user
    
        no_admin_res = category_views.update_category(request, id=new_category.id)

        self.assertEqual(no_admin_res.status_code, 403)
        
        request.user = None

        no_auth = category_views.update_category(request, id=new_category.id)

        self.assertEqual(no_auth.status_code, 403)
    
    def test_delete_category_by_id(self):
        request = self.factory.delete("/delete-category")
        request.user = self.admin_user

        new_category = StreamCategory.objects.create(title='New Category')

        res = category_views.delete_category(request, id=new_category.id)

        deleted_category = StreamCategory.objects.filter(id=new_category.id).first()

        self.assertEqual(res.status_code, 204)
        self.assertIsNone(deleted_category)

        request.user = self.non_admin_user
    
        no_admin_res = category_views.delete_category(request, id=new_category.id)

        self.assertEqual(no_admin_res.status_code, 403)
        
        request.user = None

        no_auth = category_views.delete_category(request,id=new_category.id)

        self.assertEqual(no_auth.status_code, 403)
    