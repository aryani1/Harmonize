from flask import Flask, request, redirect, jsonify, make_response, session, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
from functools import wraps

import os
import time
import uuid
import json
import spotipy
import spotipy.util as util
from spotipy.oauth2 import SpotifyOAuth

'''
Create the flask app
'''
build_path = os.path.abspath(
    os.path.join(os.getcwd(), '..', 'harmonize', 'build')
    )
app = Flask(__name__, static_folder=build_path+'/static')
CORS(app, supports_credentials=True)

'''
Spotify instances
'''
spotify = spotipy.Spotify()

# username = 'bullenbygg1337'
process_env = os.environ.get('ENVIRONMENT')
if process_env is not None and process_env == 'production':
    mongodb_uri = os.environ['MONGODB_URI']
    client = MongoClient(mongodb_uri)
    redirect_uri='http://harmonize-app.herokuapp.com/authorize_success'
else:
    client = MongoClient('localhost', 27017)
    redirect_uri='http://127.0.0.1:5000/authorize_success'
    test_client = 'aurorabrun'

client_id = os.environ['CLIENT_ID']
client_secret = os.environ['CLIENT_SECRET']

scope='user-library-read user-modify-playback-state user-modify-playback-state'

'''
Database
'''

db = client['harmonize']

'''
Decorator functions for authenticating and getting
the access token before calling the function.
'''
# Return a spotify authorization token if it
# exists in the cache. Otherwise create a new
# one.
#
# Returns auth_token
def check_cache(func):
    @wraps(func)
    def save_and_cache_wrapper(**kwargs):
        if process_env:
            username    = request.cookies.get('username')
            session_id  = request.cookies.get('session_id')

            print(username)
            print(session_id)

            if not username and not session_id:
                print('check_cache: Username or session did not match')
                return func(None)

            stored_user = db.users.find({'_id':username})
            if stored_user.count() < 1 or not is_matching_sessions(stored_user[0], request.cookies):
                return func(None)
            print(stored_user[0]['_id'])
            print('session matches!')
            cache_path = '.cache-' + username
            sp_oauth = SpotifyOAuth(client_id, client_secret, redirect_uri,
                                    scope=scope, cache_path=cache_path)
            return func(sp_oauth, **kwargs)
        else:
            # Development vars
            cache_path = '.cache-' + test_client
            sp_oauth = SpotifyOAuth(client_id, client_secret, redirect_uri,
                                    scope=scope, cache_path=cache_path)
            return func(sp_oauth, **kwargs)
    return save_and_cache_wrapper

# Returns a spotify authorization token and the
# username for a specific user. This decorator
# assumes that the @check_cache decorator is used
# before this one.
#
# Returns auth_token, username
def get_username(func):
    @wraps(func)
    def username_wrapper(sp_oauth, **kwargs):
        access_token = sp_oauth.get_cached_token()
        access_token = access_token['access_token']

        # Get the username of the user.
        spotify = spotipy.Spotify(auth=access_token)
        results = spotify.current_user()
        user = results['id']

        return func(sp_oauth, user, **kwargs)
    return username_wrapper



def search(name):
    return spotify.search(q='artist:' + name, type='artist')

# Authorize a user
@app.route('/authorize/')
@check_cache
def authorize(sp_oauth):
    # if sp_oauth:
    #     token_info = sp_oauth.get_cached_token()
    #     access_token = token_info['access_token']
    #     return 'Authorized!'
    if not sp_oauth:
        print('authorize: trying to authorize user')
        sp_oauth = SpotifyOAuth(client_id, client_secret, redirect_uri,
                                scope=scope, cache_path=None)

        auth_url = sp_oauth.get_authorize_url(show_dialog=True)
        resp = redirect(auth_url)
        resp.headers['Access-Control-Allow-Origin'] = "https://accounts.spotify.com"
        print(resp.headers)
        return redirect(auth_url, code=302)

    print('authorize: user is already cached!')
    return redirect('/', code=302)

# Get and cache access token
@app.route('/authorize_success')
def authorize_success():
    print('SUCCCCCEEEESSSSSSSSSS')
    cache_string = '.cache-'
    temp_filename = uuid.uuid4().hex
    access_code = request.args.get('code', '')

    cache_path = cache_string + temp_filename
    sp_oauth = SpotifyOAuth(client_id, client_secret, redirect_uri,
                        scope=scope, cache_path=cache_path)

    # Cache the access_token and refresh_token
    # on the server.
    access_token = sp_oauth.get_access_token(access_code)

    # Retrieve the access_token
    access_token = access_token['access_token']

    # Get the username of the user.
    spotify = spotipy.Spotify(auth=access_token)
    results = spotify.current_user()
    user = results['id']

    # Update the cache path after getting the username
    filename = cache_string + user
    os.rename(cache_path, filename)
    sp_oauth.cache_path = filename

    # Create a random unique session identifier
    # for the current user.
    session_id = str(uuid.uuid4())

    # Update the database so the user has the correct
    # access_token. If no user exists, insert a new
    # entry.
    db.users.update({'_id':user}, {'_id':user, 'session_id':session_id,
     'access_token':access_token}, upsert=True)

    # Create a Response object and set
    # a cookie that saves the username
    # at the client.
    resp = redirect('/', code=302)
    resp.set_cookie('username', user)
    resp.set_cookie('session_id', session_id)
    print('cookie saved!')

    return resp

# Get playlists
@app.route('/playlists')
@check_cache
@get_username
def get_playlists(sp_oauth, username):
    token_info = sp_oauth.get_cached_token()
    access_token = token_info['access_token']

    spotify = spotipy.Spotify(auth=access_token)
    results = spotify.user_playlists(username)

    return jsonify(results)

# Start playing
@app.route('/play')
def play():
    get_spotify_lib().start_playback() #pylint: disable=E1120
    return "done!"

@app.route('/play/<track_id>', methods=['GET', 'POST'])
def play_track(track_id):
    #get_spotify_lib().start_playback(uris=[track_id]) #pylint: disable=E1120
    decoded_tracks = request.data.decode("utf-8")
    decoded_tracks = json.loads(decoded_tracks)
    set_users_track(get_user_list(None), track_id, decoded_tracks)
    return "done!"

# Get tracks from a playlist
@app.route('/playlists/<playlist_id>')
@check_cache
@get_username
def get_playlist(sp_oauth, username, playlist_id):
    token_info = sp_oauth.get_cached_token()
    access_token = token_info['access_token']

    spotify = spotipy.Spotify(auth=access_token)
    results = spotify.user_playlist_tracks(username, playlist_id, limit=10)

    return jsonify(results)

@app.route('/user/current_user')
def get_current_user(sp_oauth):
    token_info = sp_oauth.get_cached_token()
    access_token = token_info['access_token']

    spotify = spotipy.Spotify(auth=access_token)
    results = spotify.current_user()

    return str(results)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
#@auth_process
def hello_world(path):
    print(build_path)
    return send_from_directory(build_path, 'index.html')
'''
Helper functions
'''
@check_cache
def get_spotify_lib(sp_oauth):
    token_info   = sp_oauth.get_cached_token()
    access_token = token_info['access_token']

    return spotipy.Spotify(auth=access_token)

# Check if the session_id in the db and in the cookie
# are the same.
def is_matching_sessions(db_user, cookie):
    db_session     = db_user['session_id']
    cookie_session = cookie.get('session_id')

    return db_session == cookie_session

# Temporary file to get all the users
# Fix this later!!!!
def get_user_list(current_user):
    user_list = []
    for file in os.listdir():
        if '.cache-' in file:
            user_list.append(file[7:])
    return user_list

def set_users_track(user_list, track_id, track_list):
    cache_path = '.cache-'
    user_reqs  = []
    for user in user_list:
        path = cache_path + user
        sp_oauth = SpotifyOAuth(client_id, client_secret, redirect_uri,
                                scope=scope, cache_path=path)

        token_info   = sp_oauth.get_cached_token()
        access_token = token_info['access_token']

        spotify = spotipy.Spotify(auth=access_token)
        user_reqs.append(spotify)

    prev_time = 0
    for u in user_reqs:
        start_time = time.time()
        u.start_playback(uris=track_list, offset={'uri': track_id})
        u.seek_track(prev_time)
        prev_time = (time.time() - start_time) * 1000

    return "woho!"

# @app.route('/test')
# def test():
#     user_list = get_user_list('aurorabrun')
#     set_users_track(user_list, None)
#     return str(user_list)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)