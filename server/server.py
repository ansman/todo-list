from sudo import config, app, setup

if __name__ == '__main__':
    setup.setup(app)
    app.run(debug=app.config['DEBUG'])
