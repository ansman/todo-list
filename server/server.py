from sudo import config, app, setup_api

if __name__ == '__main__':
    setup_api(app)
    app.run(debug=app.config['DEBUG'])
