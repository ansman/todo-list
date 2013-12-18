from flask import Response as FlaskResponse

class Response(FlaskResponse):
    def __init__(self, *args, **kwargs):
        super(Response, self).__init__(*args, **kwargs)
        self.headers['Access-Control-Allow-Methods'] = 'GET, PUT, POST, DELETE, HEAD'
        self.headers['Access-Control-Allow-Origin'] = '*'
        self.headers['Access-Control-Allow-Headers'] = 'Content-Type'
