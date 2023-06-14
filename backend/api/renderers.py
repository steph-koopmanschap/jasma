import json
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(levelname)s - %(message)s')


class JasmaJSONRenderer(JSONRenderer):
    """ Renderer that defines the standard json response within jasma """

    @staticmethod
    def jasma_json(data):
        return {
            # TODO: Success seems like it could let error pass. 
            # Check and test that errors is always populated when relelvant.
            "success": data.get("success", not bool(data.get("errors"))),
            "message": data.get("message", ""),
            "data": data.get("data", {}),
            "errors": data.get("errors", []),
        }

    def render(self, data_obj, accepted_media_type=None, renderer_context=None):
        """ When rendering the response, this will reformat the response in a
        consistent format.

        Inspired by: https://www.velotio.com/engineering-blog/using-drf-for-faster-apis
        With the help of ChatGTP 3.5
        """
        response = renderer_context['response'] if renderer_context else None

        if isinstance(data_obj, dict):
            data_obj = self.jasma_json(data_obj)
            if response and hasattr(response, "data"):
                response.data = data_obj
        else:
            logging.debug(
                f"data_object is {type(data_obj)} and contains {data_obj}")

        content = super().render(data_obj, accepted_media_type, renderer_context)

        return content
