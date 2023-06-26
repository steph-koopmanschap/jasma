#!/bin/bash


on_die (){
# kill all children
pkill -KILL -P $$
}
trap "on_die" TERM

echo "Starts script"


ffmpeg -i rtmp://jasma_live/$1/$2 -async 1 -vsync -1 -c:v libx264 -x264opts keyint=60:no-scenecut -b:v 3000K -c:a aac -shortest -s 1920x1080 -r 30 -b:v 3000K -sws_flags bilinear -tune zerolatency -preset veryfast -f flv rtmp://jasma_live:1935/show/$2_ultra -c:v libx264 -x264opts keyint=60:no-scenecut -b:v 1500K -c:a aac -shortest -s 1280x720 -r 30 -sws_flags bilinear -tune zerolatency -preset veryfast -f flv rtmp://jasma_live:1935/show/$2_hd -c:v libx264 -x264opts keyint=60:no-scenecut -b:v 450k -c:a aac -shortest -s 852x480 -r 30 -sws_flags bilinear -tune zerolatency -preset veryfast -f flv rtmp://jasma_live:1935/show/$2_sd -c:v libx264 -x264opts keyint=60:no-scenecut -b:v 125k -c:a aac -shortest -s 426x240 -r 30 -sws_flags bilinear -tune zerolatency -preset veryfast -f flv rtmp://jasma_live:1935/show/$2_subsd

# filepath="rtmp://jasma_live:1935/$1/$2"

# echo "Filepath: $filepath"


# h=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=s=x:p=0 "${filepath}")
# echo "Height: $h"
# height=$h

# if [ "${height}" -lt 1441 ] && [ "${height}" -gt 1080 ]
# then
#     ffmpeg -i rtmp://jasma_live:1935/$1/$2  -async 1 -vsync -1 -c:v libx264 -acodec copy -b:v 400k -vf "scale=360:trunc(ow/a/2)*2" -tune zerolatency -preset veryfast -crf 23 -g 60 -hls_list_size 0 -f flv rtmp://jasma_live:1935/show/$2_360 -c:v libx264 -acodec copy -b:v 500K -vf "scale=480:trunc(ow/a/2)*2" -tune zerolatency -preset veryfast -crf 23 -g 60 -hls_list_size 0 -f flv rtmp://jasma_live:1935/show/$2_480 -c:v libx264 -acodec copy -b:v 1500K -vf "scale=720:trunc(ow/a/2)*2" -tune zerolatency -preset veryfast -crf 23 -g 60 -hls_list_size 0 -f flv rtmp://jasma_live:1935/show/$2_720 -c:v libx264 -acodec copy -b:v 3000K -vf "scale=1080:trunc(ow/a/2)*2" -tune zerolatency -preset veryfast -crf 23 -g 60 -hls_list_size 0 -f flv rtmp://jasma_live:1935/show/$2_1080 -c copy -f flv rtmp://jasma_live:1935/show/$2_src &
# elif [ "${height}" -lt 1081 ] && [ "${height}" -gt 720 ]
# then
#     ffmpeg -i rtmp://jasma_live:1935/$1/$2  -async 1 -vsync -1 -c:v libx264 -acodec copy -b:v 400k -vf "scale=360:trunc(ow/a/2)*2" -tune zerolatency -preset veryfast -crf 23 -g 60 -hls_list_size 0 -f flv rtmp://jasma_live:1935/show/$2_360 -c:v libx264 -acodec copy -b:v 500K -vf "scale=480:trunc(ow/a/2)*2" -tune zerolatency -preset veryfast -crf 23 -g 60 -hls_list_size 0 -f flv rtmp://jasma_live:1935/show/$2_480 -c:v libx264 -acodec copy -b:v 1500K -vf "scale=720:trunc(ow/a/2)*2" -tune zerolatency -preset veryfast -crf 23 -g 60 -hls_list_size 0 -f flv rtmp://jasma_live:1935/show/$2_720 -c copy -f flv rtmp://jasma_live:1935/show/$2_src &
# elif [ "${height}" -lt 721 ] && [ "${height}" -gt 480 ]
# then
#     ffmpeg -i rtmp://jasma_live:1935/$1/$2 -map_metadata 0 -c:v libx264 -acodec copy -b:v 400k -vf "scale=360:trunc(ow/a/2)*2" -tune zerolatency -preset veryfast -crf 23 -g 60 -hls_list_size 0 -f flv rtmp://jasma_live:1935/show/$2_360 -c:v libx264 -acodec copy -b:v 500K -vf "scale=480:trunc(ow/a/2)*2" -tune zerolatency -preset veryfast -crf 23 -g 60 -hls_list_size 0 -f flv rtmp://jasma_live:1935/show/$2_480 -c copy -f flv rtmp://jasma_live:1935/show/$2_src &
# elif [ "${height}" -lt 481 ] && [ "${height}" -gt 300 ]
# then
#     ffmpeg -i rtmp://jasma_live:1935/$1/$2  -async 1 -vsync -1 -c:v libx264 -acodec copy -b:v 400k -vf "scale=360:trunc(ow/a/2)*2" -tune zerolatency -preset veryfast -crf 23 -g 60 -hls_list_size 0 -f flv rtmp://jasma_live:1935/show/$2_360 -c copy -f flv rtmp://jasma_live:1935/show/$2_src &
# else
#     echo "not working"
# fi 
#     wait


# KEY="$1"
# URL="$2"
# NAME=$(curl $URL -d "key=$KEY")
# mkdir -p "/tmp/hls/$2"
# /usr/local/bin/ffmpeg/ffmpeg -i "${filepath}" \
#   -map 0:v:0 -map 0:a:0 -map 0:v:0 -map 0:a:0 -map 0:v:0 -map 0:a:0 -map 0:a:0 -map 0:v:0 \
#   -c:v libx264 -crf 22 -c:a aac -ar 48000 \
#   -filter:v:0 scale=w=480:h=360  -maxrate:v:0 600k -b:a:0 500k \
#   -filter:v:1 scale=w=640:h=480  -maxrate:v:1 1500k -b:a:1 1000k \
#   -filter:v:2 scale=w=1280:h=720 -maxrate:v:2 3000k -b:a:2 2000k \
#   -filter:v:3 scale=w=1920:h=1080 -maxrate:v:3 6000k -b:a:3 4000k \
#   -var_stream_map "v:0,a:0,name:360p v:1,a:1,name:480p v:2,a:2,name:720p v:3,a:3,name:1080p" \
#   -preset fast -hls_list_size 10 -threads 0 -f hls \
#   -hls_time 3 -hls_flags independent_segments \
#   -master_pl_name "$NAME.m3u8" \
#   -y "/tmp/hls/$NAME/$NAME-%v.m3u8"