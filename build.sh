#!/bin/bash
set -e

echo "=== Installing Server Dependencies ==="
cd server
npm install --production=false
cd ..

echo "=== Installing Client Dependencies ==="
cd client
npm install
npm run build
cd ..

echo "=== Build Complete ==="
