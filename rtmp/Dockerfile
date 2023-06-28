FROM tiangolo/nginx-rtmp AS development
RUN apt-get -y update && apt-get -y upgrade && apt-get install -y ffmpeg
RUN mkdir -p /mnt/flv && mkdir /mnt/hls && mkdir /mnt/mp4s && mkdir /mnt/recordings
COPY transcode_script.sh /opt/live_app/transcode_script.sh
COPY nginx.conf /etc/nginx/nginx.conf