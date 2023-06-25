#!/bin/bash


on_die (){
# kill all children
pkill -KILL -P $$
}
trap "on_die" TERM

echo "Starts script"

filepath="rtmp://jasma_live:1935/$1/$2"

echo "Filepath: $filepath"


h=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=s=x:p=0 "${filepath}")
echo "Height: $h"
height=$h

if [ "${height}" -lt 1441 ] && [ "${height}" -gt 1080 ]
then
    ffmpeg -i rtmp://jasma_live:1935/$1/$2  -async 1 -vsync -1 -c:v libx264 -acodec copy -b:v 400k -vf "scale=360:trunc(ow/a/2)*2" -tune zerolatency -preset veryfast -crf 23 -g 60 -hls_list_size 0 -f flv rtmp://jasma_live:1935/show/$2_360 -c:v libx264 -acodec copy -b:v 500K -vf "scale=480:trunc(ow/a/2)*2" -tune zerolatency -preset veryfast -crf 23 -g 60 -hls_list_size 0 -f flv rtmp://jasma_live:1935/show/$2_480 -c:v libx264 -acodec copy -b:v 1500K -vf "scale=720:trunc(ow/a/2)*2" -tune zerolatency -preset veryfast -crf 23 -g 60 -hls_list_size 0 -f flv rtmp://jasma_live:1935/show/$2_720 -c:v libx264 -acodec copy -b:v 3000K -vf "scale=1080:trunc(ow/a/2)*2" -tune zerolatency -preset veryfast -crf 23 -g 60 -hls_list_size 0 -f flv rtmp://jasma_live:1935/show/$2_1080 -c copy -f flv rtmp://jasma_live:1935/show/$2_src &
elif [ "${height}" -lt 1081 ] && [ "${height}" -gt 720 ]
then
    ffmpeg -i rtmp://jasma_live:1935/$1/$2  -async 1 -vsync -1 -c:v libx264 -acodec copy -b:v 400k -vf "scale=360:trunc(ow/a/2)*2" -tune zerolatency -preset veryfast -crf 23 -g 60 -hls_list_size 0 -f flv rtmp://jasma_live:1935/show/$2_360 -c:v libx264 -acodec copy -b:v 500K -vf "scale=480:trunc(ow/a/2)*2" -tune zerolatency -preset veryfast -crf 23 -g 60 -hls_list_size 0 -f flv rtmp://jasma_live:1935/show/$2_480 -c:v libx264 -acodec copy -b:v 1500K -vf "scale=720:trunc(ow/a/2)*2" -tune zerolatency -preset veryfast -crf 23 -g 60 -hls_list_size 0 -f flv rtmp://jasma_live:1935/show/$2_720 -c copy -f flv rtmp://jasma_live:1935/show/$2_src &
elif [ "${height}" -lt 721 ] && [ "${height}" -gt 480 ]
then
    ffmpeg -i rtmp://jasma_live:1935/$1/$2 -map_metadata 0 -async 1 -vsync -1 -c:v libx264 -acodec copy -b:v 400k -vf "scale=360:trunc(ow/a/2)*2" -tune zerolatency -preset veryfast -crf 23 -g 60 -hls_list_size 0 -f flv rtmp://jasma_live:1935/show/$2_360 -c:v libx264 -acodec copy -b:v 500K -vf "scale=480:trunc(ow/a/2)*2" -tune zerolatency -preset veryfast -crf 23 -g 60 -hls_list_size 0 -f flv rtmp://jasma_live:1935/show/$2_480 -c copy -f flv rtmp://jasma_live:1935/show/$2_src &
elif [ "${height}" -lt 481 ] && [ "${height}" -gt 300 ]
then
    ffmpeg -i rtmp://jasma_live:1935/$1/$2  -async 1 -vsync -1 -c:v libx264 -acodec copy -b:v 400k -vf "scale=360:trunc(ow/a/2)*2" -tune zerolatency -preset veryfast -crf 23 -g 60 -hls_list_size 0 -f flv rtmp://jasma_live:1935/show/$2_360 -c copy -f flv rtmp://jasma_live:1935/show/$2_src &
else
    echo "not working"
fi 
    wait