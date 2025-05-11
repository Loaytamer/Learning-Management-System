import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useAuth } from '../../contexts/AuthContext';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  onComplete?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, title, onComplete }) => {
  // In a real implementation, this would use an actual video player with VideoCipher
  // Here, we're simulating with a WebView showing an embedded video player or YouTube
  
  const { user } = useAuth();
  
  // This is a mock HTML for a video player
  // In a real implementation, this would be using VideoCipher's player
  const videoHtml = `
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
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
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
      </style>
    </head>
    <body>
      <div class="video-container">
        <div class="video-title">${title}</div>
        <div class="video-placeholder">
          <!-- This would be replaced with an actual video player -->
          Video Player Simulation
        </div>
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
        <Text style={styles.errorText}>You must be logged in to view this video.</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <WebView
        source={{ html: videoHtml }}
        style={styles.webview}
        javaScriptEnabled={true}
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
    textAlign: 'center',
  },
});

export default VideoPlayer;