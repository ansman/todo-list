from datetime import datetime, timedelta

_now = None

def now():
    return _now or datetime.now()

def set_now(now):
    global _now
    _now = now

def reset():
    set_now(None)

def add_minutes(minutes):
    set_now(now() + timedelta(minutes=minutes))
