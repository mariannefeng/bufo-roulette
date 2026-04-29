import re
import time
from pathlib import Path
from tqdm import tqdm
from zulip import Client

PAUSE_SECS = 0.001


async def kill_zulip(client: Client, dry_run: bool = True):
    # Pass the path to your zuliprc file here.
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
    print(f"\t{errors}")
