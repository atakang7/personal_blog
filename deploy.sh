#!/bin/bash

# Build the image
sudo docker build -t newblog -f Dockerfile . --no-cache
if [ $? -ne 0 ]; then
    echo "Error: Docker build failed."
    exit 1
fi

# Tag the image
sudo docker tag newblog atakan1927/newblog:latest
if [ $? -ne 0 ]; then
    echo "Error: Docker tag failed."
    exit 1
fi

# Send the image to Docker Hub
sudo docker push atakan1927/newblog:latest
if [ $? -ne 0 ]; then
    echo "Error: Docker push failed."
    exit 1
fi

# Trigger deployment on Render
wget -qO- https://api.render.com/deploy/srv-ct9h6vl2ng1s739h1pe0?key=FDFAWbBxfxg
if [ $? -ne 0 ]; then
    echo "Error: Render deployment trigger failed."
    exit 1
fi

echo "Deployment triggered successfully on Render."