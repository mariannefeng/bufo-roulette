#!/bin/bash

echo "sending good code"
curl -X POST http://127.0.0.1:5000/fuck-me-up \
  -H "Content-Type: application/json" \
  -d "{\"code\": $(jq -Rs . <solutions/two_sum_good.js)}"

echo "sending bad code"
curl -X POST http://127.0.0.1:5000/fuck-me-up \
  -H "Content-Type: application/json" \
  -d "{\"code\": $(jq -Rs . <solutions/two_sum_bad.js)}"
