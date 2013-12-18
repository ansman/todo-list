import sys

from sudo import config, app, setup_api

if __name__ == '__main__':
    setup_api(app)
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    else:
        port = 4000
    app.run(debug=app.config['DEBUG'], port=port)
