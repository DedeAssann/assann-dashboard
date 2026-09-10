import json
import os
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def main():
    page = (ROOT / "index.html").read_text(encoding="utf-8")
    for asset in ("assets/styles.css", "assets/overrides.css", "assets/cloud-v2.js", "assets/app-v2.js"):
        if asset not in page or not (ROOT / asset).is_file():
            raise RuntimeError(f"Missing referenced asset: {asset}")

    payload = json.loads((ROOT / "data/calendar.json").read_text(encoding="utf-8"))
    generated_at = payload.get("generatedAt")
    if os.getenv("REQUIRE_FRESH_CALENDAR") == "1" and not generated_at:
        raise RuntimeError("Calendar export has no generation timestamp")
    if generated_at:
        generated = datetime.fromisoformat(generated_at.replace("Z", "+00:00"))
        age_hours = (datetime.now(timezone.utc) - generated).total_seconds() / 3600
        if age_hours > 6:
            raise RuntimeError(f"Calendar export is stale ({age_hours:.1f} hours)")
    if payload.get("source") != "ENSMA Mirror" or not isinstance(payload.get("events"), list):
        raise RuntimeError("Unexpected calendar payload")
    required = {"id", "title", "start", "end", "allDay"}
    for index, event in enumerate(payload["events"]):
        if not required.issubset(event) or not event["start"]:
            raise RuntimeError(f"Invalid calendar event at index {index}")
    print(f"Validated dashboard and {len(payload['events'])} public ENSMA events")


if __name__ == "__main__":
    main()
