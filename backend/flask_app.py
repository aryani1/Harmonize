from flask import Flask, request, redirect, jsonify
from flask_cors import CORS
from pymongo import MongoClient

import os
import spotipy
import spotipy.util as util
from spotipy.oauth2 import SpotifyOAuth

'''
Create the flask app
'''
app = Flask(__name__)
CORS(app)

'''
Spotify instances
'''
spotify = spotipy.Spotify()

username = 'bullenbygg1337'
client_id = os.environ['CLIENT_ID']
client_secret = os.environ['CLIENT_SECRET']
redirect_uri='http://127.0.0.1:5000/authorize_success'
scope='user-library-read user-modify-playback-state'
cache_path = ".cache-" + username

sp_oauth = SpotifyOAuth(client_id, client_secret, redirect_uri, 
        scope=scope, cache_path=cache_path)

'''
Database
'''
client = MongoClient('localhost', 27017)
db = client['harmonize']

@app.route('/')
def hello_world():
    return 'Hello, World!'

def search(name):
    return spotify.search(q='artist:' + name, type='artist')

# Authorize a user 
@app.route('/authorize')
def authorize():

    token_info = sp_oauth.get_cached_token()

    if not token_info:
        auth_url = sp_oauth.get_authorize_url()
        return redirect(auth_url, code=200)

    access_token = token_info['access_token']
    spotify = spotipy.Spotify(auth=access_token)
    result = spotify.search(q='artist: Rebelion', type='artist')
    print('Authorize')

    return str(result)

# Get and cache access token
@app.route('/authorize_success')
def authorize_success():
    access_code = request.args.get('code', '')

    # Get the token and cache it
    token_info = sp_oauth.get_access_token(access_code)

    return "Authorization: Successful!"

# Get playlists
@app.route('/playlists')
def get_playlists():
    token_info = sp_oauth.get_cached_token()
    access_token = token_info['access_token']

    spotify = spotipy.Spotify(auth=access_token)
    results = spotify.user_playlists(username)
    
    return jsonify(results)

@app.route('/insert_test')
def insert_test():
    db.users.insert_one({'username':'bullenbygg1337'})
    return 'done!'

# Start playing
@app.route('/play')
def play_song():
    get_spotify_lib().start_playback()
    return "xd"

# Get tracks from a playlist
@app.route('/playlists/<playlist_id>')
def get_playlist(playlist_id):
    token_info = sp_oauth.get_cached_token()
    access_token = token_info['access_token']

    spotify = spotipy.Spotify(auth=access_token)
    results = spotify.user_playlist_tracks(username, playlist_id)

    return jsonify(results)
    
'''
Helper functions
'''

def get_spotify_lib():
    token_info   = sp_oauth.get_cached_token()
    access_token = token_info['access_token']

    return spotipy.Spotify(auth=access_token)