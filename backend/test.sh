#!/bin/bash

HOST=http://127.0.0.1:5000
# HOST=http://192.168.215.2:5000

echo "validating"
SESSION_TOKEN=$(curl -X POST $HOST/validate \
  -H "Content-Type: application/json" \
  -H "Session-Token: abcdef" \
  -d "{\"email\": \"chrisbrenton@gmail.com\", \"key\": \"GdDJlqFd4MTrxDR8oiz895ahUuILwLZf\", \"url\": \"https://recurse.zulipchat.com\"}" |
  jq -r '.session_token')
echo $SESSION_TOKEN

echo "sending good code"
curl -X POST $HOST/fuck-me-up \
  -H "Content-Type: application/json" \
  -d "{\"code\": $(jq -Rs . <solutions/two_sum_good.js), \"session_token\": \"$SESSION_TOKEN\"}"
exit

echo "sending bad code"
curl -X POST $HOST/fuck-me-up \
  -H "Content-Type: application/json" \
  -d "{\"code\": $(jq -Rs . <solutions/two_sum_bad.js), \"session_token\": \"$SESSION_TOKEN\"}"
