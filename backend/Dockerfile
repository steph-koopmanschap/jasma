FROM python:3.11-bullseye AS backend
ENV PYTHONUNBUFFERED=1
WORKDIR /backend
COPY requirements.txt ./
RUN apt update && apt upgrade -y
RUN pip install -r requirements.txt
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh
ENTRYPOINT ["bash", "/backend/docker-entrypoint.sh"]
CMD [ "python", "manage.py", "runserver" ]

# We will need to revisit this file as this doess't really allow to get rid of dev dependencies
# Look into poetry / pipenv for this
# We'll need to manage migration carefully

