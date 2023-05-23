FROM python:3.11-slim-bullseye AS backend

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

RUN apt-get update && apt-get install --no-install-recommends -y \
  # dependencies for building Python packages
  build-essential \
  # psycopg2 dependencies
  libpq-dev \
  # cleaning up unused files
  && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=fals

WORKDIR /backend

COPY ./compose/local/django/requirements.txt .
RUN pip install -r requirements.txt

COPY ./compose/local/django/entrypoint /entrypoint
RUN sed -i 's/\r$//g' /entrypoint
RUN chmod +x /entrypoint

ENTRYPOINT ["/entrypoint"]
CMD [ "python", "manage.py", "runserver" ]

# We will need to revisit this file as this doess't really allow to get rid of dev dependencies
# Look into poetry / pipenv for this
# We'll need to manage migration carefully
