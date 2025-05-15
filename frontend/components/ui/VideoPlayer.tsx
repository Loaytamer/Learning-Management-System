import React, { useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useAuth } from '../../contexts/AuthContext';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  onComplete?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  title,
  onComplete,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // In a real implementation, this would use an actual video player with VideoCipher
  // Here, we're simulating with a WebView showing an embedded video player or YouTube

  const { user } = useAuth();

  // Function to generate appropriate HTML based on video URL
  const getVideoHtml = () => {
    // Check if URL is a YouTube URL
    const youtubeRegex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
    const youtubeMatch = videoUrl.match(youtubeRegex);

    if (youtubeMatch && youtubeMatch[1]) {
      // YouTube video
      const videoId = youtubeMatch[1];
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { margin: 0; padding: 0; background-color: #000; overflow: hidden; }
            .video-container { position: relative; width: 100%; height: 100vh; }
            iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
            .video-title {
              position: absolute;
              top: 10px;
              left: 10px;
              font-size: 16px;
              font-weight: bold;
              color: white;
              background-color: rgba(0,0,0,0.5);
              padding: 5px 10px;
              border-radius: 4px;
              z-index: 10;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
          </style>
        </head>
        <body>
          <div class="video-container">
            <div class="video-title">${title}</div>
            <iframe 
              src="https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen
            ></iframe>
          </div>
          <script>
            // Listen for video completion (this is a simplified version)
            // In a real app, you would use YouTube API to detect actual completion
            setTimeout(() => {
              window.ReactNativeWebView.postMessage('completed');
            }, 10000); // Simulate completion after 10 seconds
          </script>
        </body>
        </html>
      `;
    } else {
      // Default video player for other URLs
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { margin: 0; padding: 0; background-color: #000; }
            .video-container {
              position: relative;
              width: 100%;
              height: 100vh;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              color: white;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            .controls {
              position: absolute;
              bottom: 20px;
              left: 0;
              right: 0;
              display: flex;
              justify-content: center;
            }
            .play-button {
              background-color: #6200EE;
              color: white;
              border: none;
              border-radius: 4px;
              padding: 12px 24px;
              font-size: 16px;
              cursor: pointer;
            }
            .video-title {
              position: absolute;
              top: 20px;
              left: 20px;
              font-size: 18px;
              font-weight: bold;
            }
            .video-placeholder {
              width: 100%;
              height: 80%;
              background-color: #111;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 24px;
            }
            .video-url {
              position: absolute;
              bottom: 60px;
              font-size: 12px;
              color: #9CA3AF;
              max-width: 80%;
              text-align: center;
              word-break: break-all;
            }
          </style>
        </head>
        <body>
          <div class="video-container">
            <div class="video-title">${title}</div>
            <div class="video-placeholder">
              Video Player Simulation
            </div>
            <div class="video-url">${videoUrl}</div>
            <div class="controls">
              <button class="play-button" id="playBtn">Play Video</button>
            </div>
          </div>
          <script>
            // Simulate video playing behavior
            document.getElementById('playBtn').addEventListener('click', function() {
              this.textContent = 'Playing...';
              setTimeout(() => {
                // After 3 seconds, simulate video completion
                this.textContent = 'Video Completed';
                this.style.backgroundColor = '#10B981';
                
                // Notify React Native that the video is complete
                window.ReactNativeWebView.postMessage('completed');
              }, 3000);
            });
          </script>
        </body>
        </html>
      `;
    }
  };

  const videoHtml = getVideoHtml();

  const handleMessage = (event: any) => {
    if (event.nativeEvent.data === 'completed') {
      if (onComplete) {
        onComplete();
      }
    }
  };

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          You must be logged in to view this video.
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorSubtext}>Unable to load video content</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200EE" />
          <Text style={styles.loadingText}>Loading video...</Text>
        </View>
      )}
      <WebView
        source={{ html: videoHtml }}
        style={styles.webview}
        javaScriptEnabled={true}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setError('Failed to load video');
          setLoading(false);
        }}
        onMessage={handleMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 10,
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 10,
    fontFamily: 'Inter-Regular',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
  },
  errorSubtext: {
    color: '#9CA3AF',
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
});

export default VideoPlayer;
