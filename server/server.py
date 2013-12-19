import sys
import time
import signal
import logging
from tornado.wsgi import WSGIContainer
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop
from tornado.options import parse_command_line, options, define

from sudo import config, app, setup_api

MAX_WAIT_SECONDS_BEFORE_SHUTDOWN = 3

def main():
    setup_api(app)
    define("port", default=4000, help="Set the listening port of the server", type=int)
    parse_command_line()
    start_server()

def start_server():
    global server
    server = HTTPServer(WSGIContainer(app))
    server.listen(options.port)
    signal.signal(signal.SIGTERM, sig_handler)
    signal.signal(signal.SIGINT, sig_handler)
    logging.info("Server started on port {}".format(options.port))
    IOLoop.instance().start()

def sig_handler(sig, frame):
    logging.warning("Caught signal: {}".format(sig))
    IOLoop.instance().add_callback(shutdown)

def shutdown():
    global server

    logging.info("Stopping http server")
    server.stop()

    logging.info("Will shutdown in {} seconds ...".format(MAX_WAIT_SECONDS_BEFORE_SHUTDOWN))
    io_loop = IOLoop.instance()

    deadline = time.time() + MAX_WAIT_SECONDS_BEFORE_SHUTDOWN

    def stop_loop():
        now = time.time()
        if now < deadline and (io_loop._callbacks or io_loop._timeouts):
            io_loop.add_timeout(now + 1, stop_loop)
        else:
            io_loop.stop()
            logging.info("Shutdown")
    stop_loop()

if __name__ == "__main__":
    main()
