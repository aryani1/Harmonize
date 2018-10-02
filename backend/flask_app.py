from flask import Flask, request, redirect, jsonify, make_response
from flask_cors import CORS
from pymongo import MongoClient
from functools import wraps

import os
import uuid
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

# username = 'bullenbygg1337'
client_id = os.environ['CLIENT_ID']
client_secret = os.environ['CLIENT_SECRET']
redirect_uri='http://127.0.0.1:5000/authorize_success'
scope='user-library-read user-modify-playback-state'
#cache_path = ".cache-" + username

# sp_oauth = SpotifyOAuth(client_id, client_secret, redirect_uri, 
#         scope=scope, cache_path=cache_path)


'''
Database
'''
client = MongoClient('localhost', 27017)
db = client['harmonize']

'''
Decorator function for authenticating and getting
the access token before calling the function.
'''
def auth_process(func):
    def authorization_wrapper():
        username = request.cookies.get('username')
        if username:
            print('Username exists!')
        
        print(username)
        cache_path = 'cache-' + username

        sp_oauth = SpotifyOAuth(client_id, client_secret, redirect_uri, 
        scope=scope, cache_path=cache_path)
        func()
        print('Authorization wrapper ran successfully!')
    return authorization_wrapper

# Return a spotify authorization token if it 
# exists in the cache. Otherwise create a new
# one.
def check_cache(func):
    @wraps(func)
    def save_and_cache_wrapper():
        user = request.cookies.get('user_id')

        if not user:
            return func(None)

        cache_path = '.cache-' + str(user)
        sp_oauth = SpotifyOAuth(client_id, client_secret, redirect_uri, 
                                scope=scope, cache_path=cache_path)
        return func(sp_oauth)
    return save_and_cache_wrapper

@app.route('/')
def hello_world():
    return 'Hello, World!'

def search(name):
    return spotify.search(q='artist:' + name, type='artist')

# Authorize a user 
@app.route('/authorize')
@check_cache
def authorize(sp_oauth):
    # if sp_oauth:
    #     token_info = sp_oauth.get_cached_token()
    #     access_token = token_info['access_token']
    #     return 'Authorized!'
    if not sp_oauth:
        #user = uuid.uuid4()
        #cache_path = '.cache-' + str(user)

        sp_oauth = SpotifyOAuth(client_id, client_secret, redirect_uri, 
                                scope=scope, cache_path=None)

        auth_url = sp_oauth.get_authorize_url()
        return redirect(auth_url, code=200)
    print('authorize: user is already cached!')
    return "authorized"

# Get and cache access token
@app.route('/authorize_success')
def authorize_success():
    access_code = request.args.get('code', '')

    cache_path = '.cache-' + 'lol' # Fix this path !!
    sp_oauth = SpotifyOAuth(client_id, client_secret, redirect_uri, 
                        scope=scope, cache_path=cache_path)
    # TODO:
    # Insert username into mongodb along with access_token
    #########

    # Cache the access_token and refresh_token
    # on the server.
    access_token = sp_oauth.get_access_token(access_code)

    # Retrieve the access_token
    access_token = access_token['access_token']

    # Get the username of the user.
    spotify = spotipy.Spotify(auth=access_token)
    results = spotify.current_user()
    user = results['id']

    # Create a random unique session identifier
    # for the current user.
    session_id = str(uuid.uuid4())

    # Update the database so the user has the correct
    # access_token. If no user exists, insert a new 
    # entry.

    # TODO: Learn how to insert/update entries in the 
    # database. Checkout Mongodb shell and experiment first
    db.users.update({'_id':user}, {'_id':user, 'session_id':session_id,
     'access_token':access_token}, upsert=True)

    # Create a Response object and set 
    # a cookie that saves the username 
    # at the client.
    resp = make_response()
    resp.set_cookie('username', user)
    resp.set_cookie('session_id', session_id)
    print('cookie saved!')

    return resp

# Get playlists
@app.route('/playlists')
def get_playlists(sp_oauth):
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
def play():
    get_spotify_lib().start_playback()
    return "done!"

@app.route('/play/<track_id>')
def play_track(track_id):
    get_spotify_lib().start_playback(uris=[track_id])
    return "done!"

# Get tracks from a playlist
@app.route('/playlists/<playlist_id>')
def get_playlist(playlist_id):
    token_info = sp_oauth.get_cached_token()
    access_token = token_info['access_token']

    spotify = spotipy.Spotify(auth=access_token)
    results = spotify.user_playlist_tracks(username, playlist_id)

    return jsonify(results)

@app.route('/user/current_user')
def get_current_user():
    token_info = sp_oauth.get_cached_token()
    access_token = token_info['access_token']

    spotify = spotipy.Spotify(auth=access_token)
    results = spotify.current_user()

    return str(results)

# TODO
@app.route('/session')
@auth_process
def session():
    print(request.cookies.get('lol'))
    return 'done'
    
'''
Helper functions
'''

def get_spotify_lib():
    token_info   = sp_oauth.get_cached_token()
    access_token = token_info['access_token']

    return spotipy.Spotify(auth=access_token)