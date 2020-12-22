import tornado.ioloop
import tornado.web
import json

states = {"game": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"}

class MainHandler(tornado.web.RequestHandler):
  def set_default_headers(self):
    self.set_header("Access-Control-Allow-Origin", "*")
    self.set_header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
    self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')

  def options(self):
    pass

  def post(self):
    body = self.request.body.decode()
    states["game"] = body
    print(states["game"])

  def get(self):
    self.write(states["game"])

def make_app():
  return tornado.web.Application([
    (r"/", MainHandler),
  ])

if __name__ == "__main__":
  app = make_app()
  app.listen(9334)
  tornado.ioloop.IOLoop.current().start()
