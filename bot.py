import random
import time
import socketio
import math

sio = socketio.Client()

sio.connect("http://10.0.0.130:3002")
sio.emit("join_room", "123")

x, y = (0, 0)

objective = (400, 400)

delta = 4

players = []
player_target = None

@sio.event
def players(data):
    global players
    players = [x for x in data if x['id'] != sio.get_sid()]

while True:
    try:
        time.sleep(1/30)
        if not (x - delta < objective[0] < x + delta) or not (y - delta < objective[1] < y + delta):
            if x > objective[0] and not (x - delta < objective[0] < x + delta):
                x -= delta + random.randint(-1, 1)
            elif x < objective[0] and not (x - delta < objective[0] < x + delta):
                x += delta + random.randint(-1, 1)
            
            if y > objective[1] and not (y - delta < objective[1] < y + delta):
                y -= delta + random.randint(-1, 1)
            elif y < objective[1] and not (y - delta < objective[1] < y + delta):
                y += delta + random.randint(-1, 1)
        else:
            objective = (random.randint(-100, 500), random.randint(-100, 500))
            delta = random.randint(6, 10)
            player_target = random.choice(players)['id']
            print(sio.sid, player_target)
        
        angle = random.randint(0, 360)
        if not player_target and players:
            player_target = random.choice(players)['id']
        
        if player_target:
            target_data = [x for x in players if x['id'] == player_target]
            if not target_data:  # target does not exist anymore!!
                if players:
                    target_data = random.choice(players)
                    player_target = target_data['id']
                else:
                    player_target = None
            
            try:
                myradians = math.atan2(target_data[0]['coordinates']['y']-y, target_data[0]['coordinates']['x']-x)
                angle = math.degrees(myradians)
            except KeyError:
                pass
        
        #print(x, y, objective, angle)
        sio.emit("send_coordinates", {"roomId":"123","coordinates":{"x": x,"y": y,"itemRotation":angle}})
    except (socketio.exceptions.DisconnectedError, socketio.exceptions.BadNamespaceError):
        sio.connect("http://10.0.0.130:3002")
        sio.emit("join_room", "123")