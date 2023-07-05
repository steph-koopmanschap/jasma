from rest_framework.renderers import JSONRenderer
from rest_framework.exceptions import APIException
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG,
                    format="%(asctime)s - %(levelname)s - %(message)s")

class JasmaJSONRenderer(JSONRenderer):
    """ Renderer that defines the standard json response within jasma """
    recognized_keys = {
        "success",
        "message",
        "data",
        "errors"
    }

    @staticmethod
    def jasma_json(data):
        # TODO: Create an Exception if data contains key that are not included in the following.
        unrecognized_keys = set(data.keys()) - JasmaJSONRenderer.recognized_keys
        if unrecognized_keys:
            logging.critical(
                f"The following unrecognized keys have been detected by the renderer: {unrecognized_keys}")
            raise KeyError(f"The following unrecognized keys have been detected by the renderer: {unrecognized_keys}")
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
        response = renderer_context["response"] if renderer_context else None

        # Detail / Exception reponse
        if isinstance(data_obj, dict):
            data_obj = self.jasma_json(data_obj)
            if response and hasattr(response, "data"):
                response.data = data_obj
        # List response
        elif isinstance(data_obj, list):
            new_data = {"data": data_obj}
            data_obj = self.jasma_json(new_data)
            response.data = data_obj
        else:
            print(f"*** Something wrong in the renderer: {type(data_obj)} and contains {data_obj}")
            logging.debug(
                f"data_object is {type(data_obj)} and contains {data_obj}")

        content = super().render(data_obj, accepted_media_type, renderer_context)

        return content
