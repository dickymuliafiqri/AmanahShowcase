from flask import Flask, render_template
from threading import Thread
import asyncio
import websockets
import json

app = Flask(__name__, template_folder="./")


clients = set()
chat = []


@app.route("/")
def index():
    return render_template("index.html")


# WebSocket server logic
async def websocket_handler(websocket, path):
    while True:
        try:
            if path == "/question":
                with open("ws/data.json", "r") as file:
                    data = json.load(file)
                    question = data["quiz"]["question"]
                    await websocket.send(question)
            elif path == "/answer":
                with open("ws/data.json", "r+") as file:
                    data = json.load(file)
                    message = "Salah"
                    recv_data = json.loads(await websocket.recv())
                    answer = recv_data["answer"]
                    name = recv_data["name"].replace("Nama: ", "")
                    if data["quiz"]["isValid"]:
                        if answer == data["quiz"]["answer"]:
                            message = "Benar"
                            data["quiz"]["isValid"] = False
                            data["quiz"]["winnerList"].append(name)
                            with open("ws/data.json", "w") as new_file:
                                json.dump(data, new_file, indent=2)
                    else:
                        message = "Pertanyaan sudah terjawab."
                    await websocket.send(message)
            elif path == "/score":
                with open("ws/data.json", "r+") as file:
                    data = json.load(file)
                    recv_data = json.loads(await websocket.recv())
                    score = recv_data["score"]
                    name = recv_data["name"].replace("Nama: ", "")
                    data["game"][name] = score
                    with open("ws/data.json", "w") as new_file:
                        json.dump(data, new_file, indent=2)
            if path == "/chat":
                clients.add(websocket)
                recv_data = json.loads(await websocket.recv())
                recv_data["name"] = recv_data["name"].replace("Nama: ", "")
                chat.append(recv_data)
                message = json.dumps(recv_data)

                # Broadcast the message to all connected WebSocket clients
                for client in clients:
                    await client.send(message)
            elif path == "/ws":
                with open("ws/data.json", "r") as file:
                    data = json.load(file)
                    data["chat"] = chat
                    await websocket.send(json.dumps(data))
        except websockets.exceptions.ConnectionClosed:
            break
        finally:
            try:
                clients.remove(websocket)
            except KeyError:
                pass
        await asyncio.sleep(0.1)


def start_websocket_server():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        start_server = websockets.serve(websocket_handler, "0.0.0.0", 8181)
        loop.run_until_complete(start_server)
        loop.run_forever()
    except OSError:
        pass


if __name__ == "__main__":
    websocket_thread = Thread(target=start_websocket_server)
    websocket_thread.daemon = True
    websocket_thread.start()
    app.run(host="0.0.0.0", port=8081, debug=True)
