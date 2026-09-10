import json
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

from google.oauth2 import service_account
from googleapiclient.discovery import build

PARIS = ZoneInfo("Europe/Paris")
OUT = Path("data/calendar.json")


def require_env(name):
    value = os.getenv(name, "").strip()
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


def main():
    raw_credentials = require_env("GOOGLE_SERVICE_ACCOUNT_JSON")
    calendar_id = os.getenv("GOOGLE_ENSMA_CALENDAR_ID", "").strip() or require_env("GOOGLE_CALENDAR_ID")

    info = json.loads(raw_credentials)
    credentials = service_account.Credentials.from_service_account_info(
        info,
        scopes=["https://www.googleapis.com/auth/calendar.readonly"],
    )
    service = build("calendar", "v3", credentials=credentials, cache_discovery=False)

    now = datetime.now(PARIS)
    time_min = (now - timedelta(days=1)).astimezone(timezone.utc).isoformat().replace("+00:00", "Z")
    time_max = (now + timedelta(days=180)).astimezone(timezone.utc).isoformat().replace("+00:00", "Z")

    events = []
    seen = set()
    page_token = None
    while True:
        response = service.events().list(
            calendarId=calendar_id,
            timeMin=time_min,
            timeMax=time_max,
            singleEvents=True,
            orderBy="startTime",
            maxResults=2500,
            pageToken=page_token,
        ).execute()

        for item in response.get("items", []):
            start = item.get("start", {})
            end = item.get("end", {})
            event_id = item.get("id")
            event_start = start.get("dateTime") or start.get("date")
            if not event_id or not event_start or event_id in seen:
                continue
            seen.add(event_id)
            events.append({
                "id": event_id,
                "title": item.get("summary", "ENSMA"),
                "location": item.get("location", ""),
                "start": event_start,
                "end": end.get("dateTime") or end.get("date"),
                "allDay": "date" in start,
            })

        page_token = response.get("nextPageToken")
        if not page_token:
            break

    OUT.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "schemaVersion": 2,
        "generatedAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "source": "ENSMA Mirror",
        "visibility": "public-school-calendar",
        "timezone": "Europe/Paris",
        "events": events,
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Exported {len(events)} ENSMA events to {OUT}")


if __name__ == "__main__":
    main()
