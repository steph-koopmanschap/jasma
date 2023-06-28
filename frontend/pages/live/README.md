# Configuraton

To make it work for now, please change these lines within /rtmp/nginx.conf file to match current API server. These endpoints should return status 200. Description of these endpoints is given on a picture below.

```
   on_publish http://{api_server}/publish;
   on_publish_done http://{api_server}/done;
```

# CPU Usage

Current configuration allows several incoming streams independently, for every stream there's transcoding by ffmpeg which takes the most CPU. I couldn't stress test it enough, but on my machine, one stream was taking up to 600MB RAM and 30% of CPU.

# Possible architecture for live streaming service

![alt text](https://img001.prntscr.com/file/img001/tzeQM47yQRWd8yzDFrk_sg.png)

# Current state

Currently you can start streaming from your streaming software (ex OBS) to rtmp://..../live, also you need a streaming key. For now streaming key is not checked and can be anything. You can go to http://localhost:3000/live/settings page and generate that key but it would not be associated with your profile it's just Math.random(). Then to view your stream you can go to http://localhost:3000/live/stream/[streaming_key]. If your streaming software shows that it's connected and stream is going through you should see your stream with around 10-30s delay. You can check full video player by providing src to video file.

# Possible issues

If you want to check result from a different device (ex IPhone) you might encounter loading error. It's most likely problem with this line of code:

```
 <Player
    stream_src={`http://localhost:5050/hls/${stream_key}.m3u8`}
/>
```

Change localhost part to your machine IP where server is running.

# TODO

-   VoD server architecture
-   Design layout for stream page
-   Backend handling for live-streams and recordings
-   Design layout for stream-list page where all current live streams are shown
-   Stream categories, viewers count, follow, share actions.
