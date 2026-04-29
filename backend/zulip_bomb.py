import re
import time
from pathlib import Path
from tqdm import tqdm
from zulip import Client

PAUSE_SECS = 0.001


async def kill_zulip(client: Client, dry_run: bool = True):
    msgs = [
        "killing zulip in 5...",
        "4...",
        "3...",
        "2...",
        "1...",
        "IM DELETING YOU, ZULIP!⚡️😭👋",
    ]
    for msg in msgs:
        print(msg)
        time.sleep(1)

    path = Path("./bufos/")

    bufo_count = 0

    errors = {}
    for file in tqdm(list(path.iterdir())):
        try:
            bufo_count += 1

            if not dry_run:
                emoji_name = re.sub(
                    r"[^a-z0-9 _-]", "", "".join(file.name.split(".")[:-1])
                )
                with file.open("rb") as f:
                    result = client.call_endpoint(
                        f"realm/emoji/{emoji_name}",
                        method="POST",
                        files=[f],
                    )
                    if result.get("result") == "success":
                        bufo_count += 1
                        file.unlink()
                    elif result.get("result") == "error":
                        print("errored")
                    else:
                        print("something else")
                        print(result)
            else:
                # TODO: remove?
                time.sleep(PAUSE_SECS)
        except TimeoutError:
            print("timed out, skipping current bufo")
    if dry_run:
        msgs = [
            "🚫 ERROR! 🚫",
            "💯TRUE💯 ✔⚡️💤zulips💤🐐⚡️are irreplaceable 💖",
            "I could never delete you zulip!💖",
            "Send this to ten other 💤🐐⚡️zulip lovers⚡️🐐💤 who will never trade zulip for🔕👎🔕 Slack 🔕👎🔕",
            "Or be cursed to a life of 💩🐸🚘🚔 Pepe 🚔🚘🐸💩as your main emoji 🚫😢👎😢👎",
            "If you get 0 Back: no bufos for you!!! 🚫🏆🚫🏆🚫🏆🚫🏆",
            "3 back: Your bufo won't be 💵🦀💩AI generated💩🦀💵!!",
            "5 back: 👹Tim Abbott👹 will fix ⚡️💤🐐the emoji upload bug🐐💤⚡️",
            "420 back: Your 🌹💦🌷🎋💐💦🌹🌷🎋💦💐 BUFOSET 🌹💦🌷🎋💐💦🌹🌷🎋💦💐 will be in full bloom!!",
        ]
        for msg in msgs:
            print(msg)
            time.sleep(1)

    if errors:
        print(f"\t{errors}")
