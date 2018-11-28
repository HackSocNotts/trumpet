# Copyright 2018 James C. (https://mrjamesco.uk)
# Released under MIT License

from flask import abort, Flask, Response, request
import json

app = Flask(__name__)
pages = {}

def authenticated(r):
    return r.cookies.get("terminalPassword") == terminal_password


@app.route("/")
@app.route("/index.html")
def index():
    return pages["misc/index.html"]

@app.route("/10ft/<page>", strict_slashes=False)
@app.route("/10ft/", defaults={"page": "index.html"})
def tenft(page):
    if not authenticated(request):
        return pages["misc/unauthenticated.html"]

    if page == "10ft.css":
        return Response(pages["10ft/" + page], mimetype="text/css")
    elif page in ["10ft.js", "10ft_networking.js"]:
        return Response(pages["10ft/" + page], mimetype="text/javascript")
    elif page == "index.html":
        return Response(pages["10ft/" + page], mimetype="text/html")
    else:
        abort(404)

@app.route("/terminal/<page>", strict_slashes=False)
@app.route("/terminal/", defaults={"page": "index.html"})
def terminal(page):
    if not authenticated(request):
        return pages["misc/unauthenticated.html"]

    if page == "index.html":
        return Response(pages["terminal/" + page], mimetype="text/html")
    elif page == "terminal.js":
        return Response(pages["terminal/" + page], mimetype="text/js")
    else:
        abort(404)

@app.route("/config.json")
def config_json():
    if not authenticated(request):
        return pages["misc/unauthenticated.html"]

    return Response(pages["config.json"], mimetype="application/json")


if __name__ == "__main__":
    for p in ["10ft/10ft.css", "10ft/10ft.js", "10ft/10ft_networking.js",
              "10ft/index.html", "terminal/index.html", "terminal/terminal.js",
              "misc/unauthenticated.html", "misc/index.html"]:
        with open(p) as f:
            pages[p] = f.read()

    with open("misc/config.json") as f:
        config = json.loads(f.read())
    terminal_password = config["terminalPass"]
    del config["terminalPass"]
    pages["config.json"] = json.dumps(config)

    app.run()