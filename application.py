import os
import requests


from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.secret_key = 'project2retry'
socketio = SocketIO(app)

firstmessage = 0
messagecount = 0

channels = ["General"]
currentchannel = channels[0]
messages = [{"channel" : "abc", "name" : "xyz", "message" : "hi", "time" : "123"}]

@app.route("/")
def index():
    return render_template("index.html",  currentchannel=currentchannel)

@socketio.on("make channel")
def channel(data):
    channelname = data["channel"]
    channelIsPresent = False
    for channel in channels:
        if channelname == channel:
            channelIsPresent = True
        if channelIsPresent == True:
            channelname = ""
            break  
    if channelname != "": 
        channels.append(channelname)         
    emit("channel made", {"channelname": channelname}, broadcast=True)

@socketio.on("send message")
def msg(data):
    channel = data["channel"]
    name = data["name"]
    message = data["message"]
    time = data["time"]

    # To delete messages if they exceed 100
    count = 0
    for msg in messages:
        if msg["channel"] == channel:
            count += 1
    if count == 100:
        for msg in messages:
            if msg["channel"] == channel:
                del messages[messages.index(msg)]
                break

    messages.append({"channel" : channel, "name" : name, "message" : message, "time" : time })
    emit("message sent", {"channel" : channel, "name":name, "message": message, 'time': time}, broadcast=True)


  


@app.route("/retrievemessages", methods=["POST"])
def retrievemessages():
    channel = request.form.get("channel")
    channelmessages = []
    for message in messages:
        if message["channel"] == channel:
            channelmessages.append(message)
    return jsonify(channelmessages)

@app.route("/getchannels", methods=["POST"])
def getchannels():
    return jsonify(channels)

@app.route("/deletemessages", methods=["POST"])
def deletemessages():
    channel = request.form.get("channel")
    name = request.form.get("name")
    message = request.form.get("message")
    time = request.form.get("time")
    deletemessage = 0


    for msg in messages:
        if msg["channel"] == channel and msg["name"] == name and msg["message"] == message and msg["time"] == time:
            del messages[messages.index(msg)]
            deletemessage = 1
            break

    return jsonify(deletemessage)


@app.route("/test")
def test():
    return render_template("test.html", messages=messages, length=len(messages))

