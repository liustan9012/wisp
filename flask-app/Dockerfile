# Use the official Python image
FROM python:3.10-bookworm

# Set the working directory
WORKDIR /app/flask-app

# Copy  requirements files
COPY  requirements.txt /app/flask-app/requirements.txt

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

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
