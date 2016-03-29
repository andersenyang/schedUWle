from django.test import TestCase
from scheduler.models import UserShortlistedCourse

# Create your tests here.

class SchedulerViewTestCase(TestCase):
    def test_index(self):
        resp = self.client.get('/scheduler/')
        self.assertNotEqual(resp.status_code, 404)
