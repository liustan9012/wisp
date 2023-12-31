# Use the official Python image
FROM python:3.10

SHELL ["/bin/bash", "-c"]

# Set the working directory
WORKDIR /app/flask-app

# Copy  requirements files
COPY  requirements.txt /app/flask-app/requirements.txt
RUN python -m venv venv

# Install dependencies
RUN venv/bin/pip install --no-cache-dir -r requirements.txt
RUN venv/bin/pip install gunicorn

# Copy the rest of the application
COPY app app
COPY migrations migrations
COPY wispblog.py config.py boot.sh  ./
RUN chmod +x boot.sh


# Expose the port
EXPOSE 5100

# Command to run the application
ENTRYPOINT ["/bin/bash", "./boot.sh"]
# CMD ["gunicorn",  "-w", "4","wispblog:app"]
